import path from 'node:path';
import fs from 'node:fs/promises';
import sharp from 'sharp';
import { config } from '../config.js';

/**
 * Responsive image pipeline: WebP only, canonical file plus fixed-width
 * variants. Four files per upload at most — a variant is emitted only when
 * the source is at least that wide, so nothing is ever upscaled.
 *
 *   {department}/{entity}/{name}.webp        ← canonical, stored in the DB
 *   {department}/{entity}/{name}-480.webp
 *   {department}/{entity}/{name}-768.webp
 *   {department}/{entity}/{name}-1200.webp
 *
 * Accepted input stays broad (JPEG, PNG, WebP, AVIF); output is always WebP.
 * Image bytes are never stored in the database — paths only.
 */
export const VARIANT_WIDTHS = [480, 768, 1200];
const WEBP_OPTIONS = { quality: 82 };

const SEGMENT = /^[a-z0-9][a-z0-9-]{0,80}$/;

export function safeSegment(value, fallback) {
  const slug = String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  if (!slug || !SEGMENT.test(slug)) return fallback;
  return slug;
}

/**
 * Process one uploaded buffer into the WebP set.
 * Returns { path, width, height, size, variants: [paths] } where `path` is
 * the web path of the canonical file (relative to the site root).
 */
export async function processImage(buffer, { department, entity, name }) {
  const dir = path.join(config.uploadsDir, 'media-library', department, entity);
  await fs.mkdir(dir, { recursive: true });

  const image = sharp(buffer, { failOn: 'error' }).rotate();
  const meta = await image.metadata();

  const canonicalFile = path.join(dir, `${name}.webp`);
  const canonical = await image.clone().webp(WEBP_OPTIONS).toFile(canonicalFile);

  const variants = [];
  for (const width of VARIANT_WIDTHS) {
    if ((meta.width ?? 0) < width) continue;
    const variantFile = path.join(dir, `${name}-${width}.webp`);
    await image.clone().resize({ width }).webp(WEBP_OPTIONS).toFile(variantFile);
    variants.push(webPath(variantFile));
  }

  return {
    path: webPath(canonicalFile),
    width: canonical.width,
    height: canonical.height,
    size: canonical.size,
    variants,
  };
}

/** Delete a canonical file and its width variants; missing files are fine. */
export async function removeImageSet(canonicalWebPath) {
  const file = diskPath(canonicalWebPath);
  if (!file) return;
  const { dir, name, ext } = path.parse(file);
  const targets = [file, ...VARIANT_WIDTHS.map((w) => path.join(dir, `${name}-${w}${ext}`))];
  await Promise.all(targets.map((t) => fs.rm(t, { force: true })));
}

/** /assets/img/... web path for a file under the uploads dir. */
function webPath(file) {
  const relative = path.relative(config.uploadsDir, file).split(path.sep).join('/');
  return `/assets/img/${relative}`;
}

/** Resolve a stored web path back to disk, refusing anything that escapes. */
export function diskPath(storedWebPath) {
  if (typeof storedWebPath !== 'string' || !storedWebPath.startsWith('/assets/img/')) return null;
  const relative = storedWebPath.slice('/assets/img/'.length);
  const resolved = path.resolve(config.uploadsDir, relative);
  if (!resolved.startsWith(path.resolve(config.uploadsDir) + path.sep)) return null;
  return resolved;
}
