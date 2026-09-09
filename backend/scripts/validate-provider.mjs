#!/usr/bin/env node
/**
 * Checks an external provider's API against docs/openapi/nouvelage-doctors-api.yaml
 * before it is wired into the site.
 *
 *   node scripts/validate-provider.mjs --base https://provider.example.com/v1
 *   node scripts/validate-provider.mjs --fixtures ./samples     # offline JSON files
 *
 * Two layers of checking, because a response can be perfectly shaped and still
 * be wrong:
 *
 *   Shape   — each response validated against the schema. Catches arrays sent as
 *             JSON strings, a display name where an id belongs, timestamps with
 *             no UTC offset, base64 in an image field, unknown extra keys.
 *   Joins   — the ids are then resolved against each other. Catches the failure
 *             that shape alone cannot see: a case pointing at a doctor who does
 *             not exist, a doctor listing a treatment that is not in the
 *             catalogue, or the two sides of the doctor/treatment link
 *             disagreeing about who performs what.
 *
 * Exits non-zero when anything fails, so it can gate a deployment.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const Ajv = require('ajv/dist/2020');
const addFormats = require('ajv-formats');
const YAML = require('yaml');

const HERE = dirname(fileURLToPath(import.meta.url));
const SPEC = resolve(HERE, '../../docs/openapi/nouvelage-doctors-api.yaml');

// ── arguments ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? null : args[i + 1];
};
const base = flag('base');
const fixtures = flag('fixtures');
if (!base && !fixtures) {
  console.error('Usage: validate-provider.mjs --base <url> | --fixtures <dir>');
  process.exit(2);
}

// ── schema setup ────────────────────────────────────────────────────────────
const spec = YAML.parse(readFileSync(SPEC, 'utf8'));
const ajv = new Ajv({ strict: false, allErrors: true, allowUnionTypes: true });
addFormats(ajv);
// Register every component schema so $ref between them resolves.
for (const [name, schema] of Object.entries(spec.components.schemas)) {
  ajv.addSchema(schema, `#/components/schemas/${name}`);
}
const validators = {};
const validatorFor = (name) => (validators[name] ??= ajv.compile({ $ref: `#/components/schemas/${name}` }));

// ── reporting ───────────────────────────────────────────────────────────────
let failures = 0;
let checks = 0;
const pass = (what) => { checks++; console.log(`  ok    ${what}`); };
const fail = (what, detail) => {
  checks++; failures++;
  console.log(`  FAIL  ${what}`);
  const lines = [].concat(detail);
  for (const line of lines.slice(0, 12)) console.log(`          ${line}`);
  if (lines.length > 12) console.log(`          … and ${lines.length - 12} more`);
};

function checkItems(label, items, schemaName) {
  const validate = validatorFor(schemaName);
  const problems = [];
  items.forEach((item, i) => {
    if (validate(item)) return;
    const id = item?.id ?? item?.slug ?? `index ${i}`;
    for (const e of validate.errors.slice(0, 6)) {
      problems.push(`${schemaName} "${id}"${e.instancePath || ''}: ${e.message}`
        + (e.params?.allowedValues ? ` (${e.params.allowedValues.join(', ')})` : ''));
    }
  });
  if (problems.length) fail(`${label} — ${items.length} record(s)`, problems);
  else pass(`${label} — ${items.length} record(s) match ${schemaName}`);
}

// ── fetching ────────────────────────────────────────────────────────────────
async function get(path, fixtureName) {
  if (fixtures) {
    const file = join(resolve(fixtures), `${fixtureName}.json`);
    if (!existsSync(file)) return { skipped: `no fixture ${fixtureName}.json` };
    return { body: JSON.parse(readFileSync(file, 'utf8')), headers: new Map() };
  }
  const res = await fetch(base.replace(/\/$/, '') + path, { headers: { Accept: 'application/json' } });
  if (!res.ok) return { error: `HTTP ${res.status} for ${path}` };
  return { body: await res.json(), headers: res.headers };
}

// ── run ─────────────────────────────────────────────────────────────────────
console.log(`\nValidating ${base ?? fixtures} against ${SPEC.split('/').slice(-1)[0]}\n`);

console.log('Shape');
const doctorsRes = await get('/doctors', 'doctors');
const treatmentsRes = await get('/treatments', 'treatments');
const casesRes = await get('/cases', 'cases');

let doctors = [], treatments = [], cases = [];

for (const [label, res, key, schema, sink] of [
  ['GET /doctors', doctorsRes, 'doctors', 'Doctor', (v) => (doctors = v)],
  ['GET /treatments', treatmentsRes, 'treatments', 'Treatment', (v) => (treatments = v)],
  ['GET /cases', casesRes, 'cases', 'Case', (v) => (cases = v)],
]) {
  if (res.skipped) { console.log(`  skip  ${label} (${res.skipped})`); continue; }
  if (res.error) { fail(label, res.error); continue; }
  const list = res.body?.[key];
  if (!Array.isArray(list)) {
    fail(label, `response.${key} must be an array, got ${typeof list}`
      + (typeof list === 'string' ? ' — looks like a JSON-encoded string' : ''));
    continue;
  }
  sink(list);
  checkItems(label, list, schema);
}

// Availability needs real ids, so only run it once we have some.
if (base && doctors.length && treatments.length) {
  const doc = doctors[0];
  const tr = treatments.find((t) => (doc.treatment_ids ?? []).includes(t.id)) ?? treatments[0];
  const br = (doc.branches ?? [])[0];
  if (br) {
    const today = new Date().toISOString().slice(0, 10);
    const to = new Date(Date.now() + 6 * 864e5).toISOString().slice(0, 10);
    const q = `/doctors/${doc.id}/availability?treatment_id=${tr.id}&branch_id=${br.id}&from=${today}&to=${to}`;
    const av = await get(q, 'availability');
    if (av.error) fail('GET availability', av.error);
    else {
      const validate = validatorFor('Availability');
      if (!validate(av.body)) {
        fail('GET availability', validate.errors.slice(0, 5).map((e) => `${e.instancePath}: ${e.message}`));
      } else {
        pass(`GET availability — ${av.body.days.length} day(s), timezone ${av.body.timezone}`);
        const cc = av.headers.get?.('cache-control') ?? '';
        if (!/no-store/.test(cc)) fail('availability Cache-Control', `must be no-store, got "${cc || '(none)'}" — a cached slot list causes double bookings`);
        else pass('availability sent Cache-Control: no-store');
        const badRange = av.body.days.flatMap((d) =>
          d.slots.filter((s) => new Date(s.end) <= new Date(s.start)).map((s) => `${d.date} slot ${s.slot_id}: end is not after start`));
        if (badRange.length) fail('slot ranges', badRange); else pass('every slot ends after it starts');
      }
    }
  } else {
    console.log('  skip  GET availability (first doctor has no branches[])');
  }
}

console.log('\nJoins');
const doctorIds = new Set(doctors.map((d) => d.id));
const treatmentIds = new Set(treatments.map((t) => t.id));

if (doctors.length && treatments.length) {
  const dangling = doctors.flatMap((d) =>
    (d.treatment_ids ?? []).filter((id) => !treatmentIds.has(id))
      .map((id) => `doctor "${d.slug}" lists treatment_id "${id}" which /treatments does not return`));
  dangling.length ? fail('doctor.treatment_ids resolve', dangling) : pass('every doctor.treatment_ids entry exists in /treatments');

  const danglingDocs = treatments.flatMap((t) =>
    (t.doctor_ids ?? []).filter((id) => !doctorIds.has(id))
      .map((id) => `treatment "${t.slug}" lists doctor_id "${id}" which /doctors does not return`));
  danglingDocs.length ? fail('treatment.doctor_ids resolve', danglingDocs) : pass('every treatment.doctor_ids entry exists in /doctors');

  // The same edge from both sides must agree, or the profile and the booking
  // dropdown will show different treatments for the same doctor.
  const disagree = [];
  for (const d of doctors) {
    for (const tid of d.treatment_ids ?? []) {
      const t = treatments.find((x) => x.id === tid);
      if (t && !(t.doctor_ids ?? []).includes(d.id)) {
        disagree.push(`doctor "${d.slug}" claims "${t.slug}" but that treatment does not list this doctor`);
      }
    }
  }
  disagree.length ? fail('doctor ⇄ treatment link agrees both ways', disagree) : pass('doctor ⇄ treatment link agrees in both directions');

  const nameCount = doctors.filter((d) => (d.services ?? []).length !== (d.treatment_ids ?? []).length);
  nameCount.length
    ? fail('services is derived from treatment_ids',
        nameCount.slice(0, 5).map((d) => `doctor "${d.slug}": services has ${(d.services ?? []).length} entries, treatment_ids has ${(d.treatment_ids ?? []).length}`))
    : pass('services has one name per treatment_id');
}

if (cases.length) {
  const badDoctor = cases.filter((c) => !doctorIds.has(c.doctor_id))
    .map((c) => `case "${c.id}" points at doctor_id "${c.doctor_id}" which /doctors does not return`);
  badDoctor.length ? fail('case.doctor_id resolves', badDoctor) : pass('every case.doctor_id exists in /doctors');

  if (treatments.length) {
    const badTreatment = cases.filter((c) => c.treatment_id && !treatmentIds.has(c.treatment_id))
      .map((c) => `case "${c.id}" points at treatment_id "${c.treatment_id}" which /treatments does not return`);
    badTreatment.length ? fail('case.treatment_id resolves', badTreatment) : pass('every case.treatment_id exists in /treatments');
  }

  const halfPairs = cases.filter((c) => Boolean(c.before) !== Boolean(c.after))
    .map((c) => `case "${c.id}" has only one side of the pair — the gallery will skip it`);
  halfPairs.length ? fail('before / after pairs complete', halfPairs) : pass('every case has both sides or neither');
}

console.log(`\n${failures ? '❌' : '✅'} ${checks - failures}/${checks} checks passed`
  + (failures ? `, ${failures} failed\n` : '\n'));
process.exit(failures ? 1 : 0);
