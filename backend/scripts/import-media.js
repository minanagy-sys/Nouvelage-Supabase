/**
 * Walk the uploads tree (rsync'd from the droplet's
 * public/assets/img/{media-library,blog,uploads}/) and:
 *   1. generate the missing WebP responsive variants for every canonical image
 *   2. upsert a media_library row (path only) for files the DB doesn't know
 *
 * Safe to re-run: existing variants are kept, existing rows untouched.
 *
 *   node scripts/import-media.js [--dry-run]
 */
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { pool } from '../src/db.js';
import { config } from '../src/config.js';

const VARIANT_WIDTHS = [480, 768, 1200];
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const dryRun = process.argv.includes('--dry-run');

async function* walk(dir) {
  let entries = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const isVariant = (name) => /-(?:480|768|1200)\.webp$/.test(name);

async function main() {
  const root = path.join(config.uploadsDir, 'media-library');
  let variantsMade = 0;
  let rowsAdded = 0;
  let scanned = 0;

  for await (const file of walk(root)) {
    const ext = path.extname(file).toLowerCase();
    if (!IMAGE_EXT.has(ext) || isVariant(path.basename(file))) continue;
    scanned += 1;

    const parsed = path.parse(file);
    let meta;
    try {
      meta = await sharp(file).metadata();
    } catch {
      console.warn(`[media] unreadable image skipped: ${file}`);
      continue;
    }

    for (const width of VARIANT_WIDTHS) {
      if ((meta.width ?? 0) < width) continue;
      const variantFile = path.join(parsed.dir, `${parsed.name}-${width}.webp`);
      try {
        await fs.access(variantFile);
        continue; // already exists
      } catch { /* missing — generate */ }
      if (!dryRun) {
        await sharp(file).rotate().resize({ width }).webp({ quality: 82 }).toFile(variantFile);
      }
      variantsMade += 1;
    }

    const webFull = `/assets/img/${path.relative(config.uploadsDir, file).split(path.sep).join('/')}`;
    const webDir = webFull.slice(0, webFull.lastIndexOf('/') + 1);
    const [[{ count }]] = await pool.query(
      'SELECT COUNT(*) AS count FROM media_library WHERE full_path = :webFull',
      { webFull },
    );
    if (Number(count) === 0) {
      if (!dryRun) {
        const stat = await fs.stat(file);
        await pool.query(
          `INSERT INTO media_library (id, filename, path, full_path, size, type)
           VALUES (:id, :filename, :path, :fullPath, :size, :type)`,
          {
            id: `media_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
            filename: parsed.base,
            path: webDir,
            fullPath: webFull,
            size: stat.size,
            type: ext === '.webp' ? 'image/webp' : `image/${ext.slice(1).replace('jpg', 'jpeg')}`,
          },
        );
      }
      rowsAdded += 1;
    }
  }

  console.log(`[media] scanned ${scanned} images — ${variantsMade} variants ${dryRun ? 'would be ' : ''}generated, ${rowsAdded} media rows ${dryRun ? 'would be ' : ''}added`);
  await pool.end();
}

main().catch((error) => {
  console.error(`[media] failed: ${error.message}`);
  process.exit(1);
});
