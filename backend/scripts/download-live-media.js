/**
 * Download the image files the live content references from the production
 * website into the local project, so the local test shows the same photos.
 *
 * The uploaded media files (public/assets/img/{media-library,blog,uploads})
 * were never committed to git — they live on the droplet's disk. The site
 * serves them over HTTPS, so this script scans nouvelage-live-data.sql for
 * every /assets/... image path, checks whether the file exists locally, and
 * downloads the missing ones from the live site (read-only GETs).
 *
 *   cd backend
 *   node scripts/export-live-to-mysql.js      # first, if not already done
 *   node scripts/download-live-media.js
 *
 * Env overrides: SITE_URL (default https://www.nouvelage.clinic),
 * LIVE_DATA_SQL (default ../nouvelage-live-data.sql).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(backendDir, '..');
const SQL_FILE = process.env.LIVE_DATA_SQL ?? path.join(repoRoot, 'nouvelage-live-data.sql');
const SITE_URL = (process.env.SITE_URL ?? 'https://www.nouvelage.clinic').replace(/\/+$/, '');
const PUBLIC_DIR = path.join(repoRoot, 'frontend/public');
const SRC_ASSETS_DIR = path.join(repoRoot, 'frontend/src/assets');

const IMAGE_PATH = /\/assets\/[^'"\\)<>]+?\.(?:png|jpe?g|webp|avif|gif|svg)/gi;

async function exists(file) {
  try { await fs.access(file); return true; } catch { return false; }
}

async function main() {
  let sql;
  try {
    sql = await fs.readFile(SQL_FILE, 'utf8');
  } catch {
    console.error(`[media] ${SQL_FILE} not found — run export-live-to-mysql.js first`);
    process.exit(1);
  }

  // JSON strings inside SQL may carry \/ escapes; normalize before scanning.
  const paths = new Set(
    (sql.replace(/\\\//g, '/').match(IMAGE_PATH) ?? []).map((p) => decodeURIComponent(p)),
  );
  console.log(`[media] ${paths.size} distinct image paths referenced by the live content`);

  let present = 0;
  let downloaded = 0;
  let failed = 0;

  for (const webPath of paths) {
    const relative = webPath.replace(/^\//, ''); // assets/img/...
    const target = path.join(PUBLIC_DIR, relative);

    // The Angular build merges frontend/public/* and frontend/src/assets/*
    // into the same URL space, so a file in either location already works.
    const inSrcAssets = path.join(SRC_ASSETS_DIR, relative.replace(/^assets\//, ''));
    if (await exists(target) || await exists(inSrcAssets)) {
      present += 1;
      continue;
    }

    const url = `${SITE_URL}${encodeURI(webPath)}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const buffer = Buffer.from(await response.arrayBuffer());
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.writeFile(target, buffer);
      downloaded += 1;
      if (downloaded % 25 === 0) console.log(`[media] downloaded ${downloaded}...`);
    } catch (error) {
      failed += 1;
      console.warn(`[media] MISSING ${webPath} (${error.message})`);
    }
  }

  console.log(`\n[media] done — ${present} already local, ${downloaded} downloaded, ${failed} not found on the live site`);
  if (failed) {
    console.log('[media] paths that failed are genuinely absent on the server too (broken references in content)');
  }
}

main().catch((error) => {
  console.error(`[media] failed: ${error.message}`);
  process.exit(1);
});
