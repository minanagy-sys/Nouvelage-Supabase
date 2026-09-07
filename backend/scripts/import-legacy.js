/**
 * Import the live Supabase/Postgres data into MySQL.
 *
 * Input: a pg_dump produced on the droplet with --data-only --column-inserts
 * (one INSERT per row with explicit column names):
 *
 *   docker exec -t <supabase-db> pg_dump -U postgres --data-only --column-inserts \
 *     --exclude-schema=auth --exclude-schema=storage --exclude-schema=_realtime \
 *     postgres > nouvelage-data.sql
 *
 * Usage:
 *   node scripts/import-legacy.js /path/to/nouvelage-data.sql
 *
 * Rows are inserted through the same mysql2 pool the app uses, so NOT NULL
 * and FK constraints are enforced during import rather than discovered later.
 * Transforms handled here:
 *   - true/false            → 1/0
 *   - '{a,b}' array literal → JSON array
 *   - E'...' escaped string → literal text
 *   - timestamptz           → naive UTC DATETIME
 *   - media_library.data_url: base64 payloads are written to disk as WebP
 *     (paths only in the database); the column itself does not exist in MySQL.
 *
 * Ends with a reconciliation table: rows per table in the dump vs rows in
 * MySQL, printed side by side — a silent partial import is the failure mode
 * this is designed against.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { pool } from '../src/db.js';
import { config } from '../src/config.js';

const TABLES = new Set([
  'page_content', 'parent_bundles', 'bundles', 'doctors', 'blog_posts',
  'media_library', 'services', 'branches', 'contact_submissions', 'settings',
  'bookings',
]);

// Postgres text[] columns that become JSON arrays in MySQL.
const ARRAY_COLUMNS = {
  doctors: new Set(['sub_specialties', 'qualifications', 'certificates', 'languages', 'services', 'branches', 'available_days']),
  blog_posts: new Set(['tags', 'related_posts']),
  services: new Set(['benefits', 'procedure_steps', 'tags']),
};

// Columns that exist in the dump but not in MySQL.
const DROP_COLUMNS = {
  media_library: new Set(['data_url']),
};

// Import order respects the one FK (bundles → parent_bundles).
const IMPORT_ORDER = [
  'page_content', 'parent_bundles', 'bundles', 'doctors', 'blog_posts',
  'media_library', 'services', 'branches', 'contact_submissions', 'settings',
  'bookings',
];

/** Split dump into statements, respecting quotes and E'' escapes. */
function* statements(sql) {
  let current = '';
  let inString = false;
  let escapeString = false;
  for (let i = 0; i < sql.length; i += 1) {
    const char = sql[i];
    current += char;
    if (inString) {
      if (escapeString && char === '\\') { current += sql[++i] ?? ''; continue; }
      if (char === "'") {
        if (sql[i + 1] === "'") { current += "'"; i += 1; continue; }
        inString = false;
      }
      continue;
    }
    if (char === "'") {
      inString = true;
      escapeString = /[eE]$/.test(current.slice(-2, -1));
      continue;
    }
    if (char === ';') {
      const trimmed = current.trim();
      if (trimmed) yield trimmed;
      current = '';
    }
  }
}

/** Parse one INSERT INTO ... (cols) VALUES (values); statement. */
function parseInsert(statement) {
  const head = /^INSERT INTO\s+(?:"?public"?\.)?"?([a-z_]+)"?\s*\(([^)]+)\)\s*VALUES\s*\(/i.exec(statement);
  if (!head) return null;
  const table = head[1];
  if (!TABLES.has(table)) return null;

  const columns = head[2].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
  const valuesText = statement.slice(head[0].length, statement.lastIndexOf(')'));
  const values = splitValues(valuesText);
  if (values.length !== columns.length) {
    throw new Error(`column/value count mismatch for ${table}: ${columns.length} vs ${values.length}`);
  }
  return { table, columns, values };
}

/** Split a VALUES tuple body on top-level commas. */
function splitValues(text) {
  const parts = [];
  let current = '';
  let depth = 0;
  let inString = false;
  let escapeString = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (inString) {
      current += char;
      if (escapeString && char === '\\') { current += text[++i] ?? ''; continue; }
      if (char === "'") {
        if (text[i + 1] === "'") { current += "'"; i += 1; continue; }
        inString = false;
      }
      continue;
    }
    if (char === "'") {
      inString = true;
      escapeString = /[eE]$/.test(current.slice(-1));
      current += char;
      continue;
    }
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;
    if (char === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

/** Decode one SQL literal into a JS value. */
function decodeLiteral(raw) {
  if (/^NULL$/i.test(raw)) return null;
  if (/^true$/i.test(raw)) return 1;
  if (/^false$/i.test(raw)) return 0;
  const stringMatch = /^([eE])?'([\s\S]*)'(?:::[a-z_ []"]+)?$/.exec(raw);
  if (stringMatch) {
    let text = stringMatch[2].replace(/''/g, "'");
    if (stringMatch[1]) {
      text = text
        .replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t')
        .replace(/\\'/g, "'").replace(/\\\\/g, '\\');
    }
    return text;
  }
  const numeric = Number(raw);
  return Number.isNaN(numeric) ? raw : numeric;
}

/** '{a,"b c",d}' Postgres array literal → JS array. */
function parsePgArray(text) {
  if (text === null) return [];
  const body = String(text).replace(/^\{|\}$/g, '');
  if (!body.trim()) return [];
  const items = [];
  let current = '';
  let inQuote = false;
  for (let i = 0; i < body.length; i += 1) {
    const char = body[i];
    if (inQuote) {
      if (char === '\\') { current += body[++i] ?? ''; continue; }
      if (char === '"') { inQuote = false; continue; }
      current += char;
      continue;
    }
    if (char === '"') { inQuote = true; continue; }
    if (char === ',') { items.push(current.trim()); current = ''; continue; }
    current += char;
  }
  if (current.trim() || items.length) items.push(current.trim());
  return items.map((item) => (item === 'NULL' ? '' : item)).filter((item) => item !== '');
}

function toMysqlDatetime(value) {
  if (value === null || value === '') return null;
  const date = new Date(String(value).replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

const TIMESTAMP_COLUMNS = new Set([
  'created_at', 'updated_at', 'uploaded_at', 'submitted_at', 'publish_date', 'last_login_at',
]);

/** Base64 media_library payloads become real files; the DB keeps paths only. */
async function extractDataUrl(row) {
  const dataUrl = row.data_url;
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) return;
  if (row.full_path) return; // already has a real file

  const match = /^data:(image\/[a-z+]+);base64,(.+)$/s.exec(dataUrl);
  if (!match) return;

  const { default: sharp } = await import('sharp');
  const buffer = Buffer.from(match[2], 'base64');
  const name = String(row.filename ?? row.id).replace(/\.[^/.]+$/, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || row.id;

  const dir = path.join(config.uploadsDir, 'media-library', 'imported');
  await fs.mkdir(dir, { recursive: true });
  const file = path.join(dir, `${name}.webp`);
  const info = await sharp(buffer).rotate().webp({ quality: 82 }).toFile(file);

  row.path = '/assets/img/media-library/imported/';
  row.full_path = `/assets/img/media-library/imported/${name}.webp`;
  row.filename = `${name}.webp`;
  row.size = info.size;
  row.type = 'image/webp';
}

async function main() {
  const dumpFile = process.argv[2];
  if (!dumpFile) {
    console.error('usage: node scripts/import-legacy.js /path/to/nouvelage-data.sql');
    process.exit(1);
  }

  const sql = await fs.readFile(dumpFile, 'utf8');

  // Group parsed rows per table so import order can respect FKs.
  const rowsByTable = new Map();
  for (const statement of statements(sql)) {
    if (!/^INSERT INTO/i.test(statement)) continue;
    const parsed = parseInsert(statement);
    if (!parsed) continue;

    const row = {};
    parsed.columns.forEach((column, index) => {
      row[column] = decodeLiteral(parsed.values[index]);
    });
    if (!rowsByTable.has(parsed.table)) rowsByTable.set(parsed.table, []);
    rowsByTable.get(parsed.table).push(row);
  }

  const dumpCounts = {};
  for (const [table, rows] of rowsByTable) dumpCounts[table] = rows.length;

  for (const table of IMPORT_ORDER) {
    const rows = rowsByTable.get(table) ?? [];
    if (!rows.length) continue;

    const arrays = ARRAY_COLUMNS[table] ?? new Set();
    const drops = DROP_COLUMNS[table] ?? new Set();
    let imported = 0;

    for (const row of rows) {
      if (table === 'media_library') await extractDataUrl(row);

      const values = {};
      for (const [column, rawValue] of Object.entries(row)) {
        if (drops.has(column)) continue;
        let value = rawValue;
        if (arrays.has(column)) value = JSON.stringify(parsePgArray(value));
        else if (TIMESTAMP_COLUMNS.has(column)) value = toMysqlDatetime(value);
        values[column] = value;
      }

      const columns = Object.keys(values);
      try {
        await pool.query(
          `INSERT IGNORE INTO \`${table}\` (${columns.map((c) => `\`${c}\``).join(', ')})
           VALUES (${columns.map((c) => `:${c}`).join(', ')})`,
          values,
        );
        imported += 1;
      } catch (error) {
        console.error(`[import] ${table} row ${values.id ?? '?'} failed: ${error.sqlMessage ?? error.message}`);
      }
    }
    console.log(`[import] ${table}: ${imported}/${rows.length} rows`);
  }

  // Reconciliation — dump counts vs MySQL counts, side by side.
  console.log('\ntable                        dump    mysql');
  console.log('------------------------- ------- --------');
  for (const table of IMPORT_ORDER) {
    const [[{ count }]] = await pool.query(`SELECT COUNT(*) AS count FROM \`${table}\``);
    const dumped = dumpCounts[table] ?? 0;
    const flag = Number(count) < dumped ? '  ← MISSING ROWS' : '';
    console.log(`${table.padEnd(25)} ${String(dumped).padStart(7)} ${String(count).padStart(8)}${flag}`);
  }

  await pool.end();
}

main().catch((error) => {
  console.error(`[import] failed: ${error.message}`);
  process.exit(1);
});
