#!/usr/bin/env node
/**
 * Generates a WebP twin for every raster image in the static asset folders.
 *
 * The twin is named "<original>.webp" — photo.jpg becomes photo.jpg.webp —
 * which is what lets the server swap it in without any reference changing:
 * templates, seed data and the rows the dashboard writes all keep pointing at
 * photo.jpg. A browser that sends "Accept: image/webp" gets the smaller file,
 * anything else gets the original (see the image negotiation middleware in
 * server.ts and the matching try_files rule in deploy/nginx.conf.example).
 *
 * Idempotent: an existing twin newer than its source is left alone, and a
 * twin that came out larger than the original is discarded rather than
 * shipped. Uploaded media needs no pass here — the backend already writes
 * WebP as the canonical format for those.
 *
 *   node scripts/generate-webp.js            # generate
 *   node scripts/generate-webp.js --force    # rebuild every twin
 */
import { readdirSync, statSync, existsSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createRequire } from 'node:module';

// sharp lives in the backend workspace (the frontend has no runtime need for
// it), so resolve it from there rather than adding a second native install.
const require = createRequire(import.meta.url);
const sharp = (() => {
  for (const id of ['sharp', '../../backend/node_modules/sharp', '../node_modules/sharp']) {
    try { return require(id); } catch { /* try the next location */ }
  }
  console.error('sharp not found — run "npm install" in backend/ first.');
  process.exit(1);
})();

const ROOTS = ['src/assets', 'public'];
const SOURCE_EXT = new Set(['.jpg', '.jpeg', '.png']);
const QUALITY = 80;
const FORCE = process.argv.includes('--force');
// Below this, the request overhead outweighs the saving.
const MIN_BYTES = 8 * 1024;

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else if (SOURCE_EXT.has(extname(entry.name).toLowerCase())) out.push(path);
  }
  return out;
}

const stats = { made: 0, skipped: 0, rejected: 0, srcBytes: 0, webpBytes: 0, failed: 0 };

for (const root of ROOTS) {
  for (const src of walk(root)) {
    const twin = src + '.webp';
    const srcStat = statSync(src);
    if (srcStat.size < MIN_BYTES) { stats.skipped++; continue; }
    if (!FORCE && existsSync(twin) && statSync(twin).mtimeMs >= srcStat.mtimeMs) {
      stats.skipped++;
      stats.srcBytes += srcStat.size;
      stats.webpBytes += statSync(twin).size;
      continue;
    }
    try {
      const original = readFileSync(src);
      const webp = await sharp(original).webp({ quality: QUALITY, effort: 4 }).toBuffer();
      if (webp.length >= original.length) {
        // Already smaller as JPEG/PNG — do not ship a bigger "optimisation".
        if (existsSync(twin)) unlinkSync(twin);
        stats.rejected++;
        continue;
      }
      writeFileSync(twin, webp);
      stats.made++;
      stats.srcBytes += original.length;
      stats.webpBytes += webp.length;
    } catch (err) {
      stats.failed++;
      console.error(`  ! ${src}: ${err.message}`);
    }
  }
}

const mb = (n) => (n / 1024 / 1024).toFixed(2) + 'MB';
const saved = stats.srcBytes - stats.webpBytes;
console.log(`webp: ${stats.made} written, ${stats.skipped} up to date, ${stats.rejected} rejected (not smaller)`
  + (stats.failed ? `, ${stats.failed} failed` : ''));
console.log(`      ${mb(stats.srcBytes)} of originals -> ${mb(stats.webpBytes)} as webp`
  + (stats.srcBytes ? ` (${((saved / stats.srcBytes) * 100).toFixed(0)}% smaller)` : ''));
