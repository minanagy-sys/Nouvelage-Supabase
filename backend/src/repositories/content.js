import { query, queryOne, hydrateJson } from '../db.js';
import { cached } from '../cache.js';
import { RESOURCES } from '../admin/resources.js';

const TTL = 60_000;

// Public reads mirror exactly what the Angular app asked Supabase for:
// active/published rows in display order. Cache keys start with the table
// name so admin writes can invalidate precisely.

export function getPageContent(pageKey) {
  return cached(`page_content:${pageKey}`, TTL, async () => {
    const row = await queryOne(
      'SELECT content FROM page_content WHERE page_key = :pageKey',
      { pageKey },
    );
    if (!row) return null;
    hydrateJson([row], ['content']);
    return row.content;
  });
}

export function listBundles() {
  return cached('bundles:active', TTL, async () => {
    const rows = await query(
      'SELECT * FROM bundles WHERE is_active = 1 ORDER BY order_index ASC',
    );
    return hydrateJson(rows, RESOURCES['bundles'].jsonFields);
  });
}

export async function getBundle(id) {
  const row = await queryOne('SELECT * FROM bundles WHERE id = :id', { id });
  if (!row) return null;
  hydrateJson([row], RESOURCES['bundles'].jsonFields);
  return row;
}

export function listParentBundles() {
  return cached('parent_bundles:active', TTL, () =>
    query('SELECT * FROM parent_bundles WHERE is_active = 1 ORDER BY order_index ASC'));
}

export function listDoctors() {
  return cached('doctors:active', TTL, async () => {
    const rows = await query(
      'SELECT * FROM doctors WHERE is_active = 1 ORDER BY order_index ASC',
    );
    return hydrateJson(rows, RESOURCES['doctors'].jsonFields);
  });
}

export async function getDoctor(idOrSlug) {
  const row = await queryOne(
    'SELECT * FROM doctors WHERE id = :v OR slug = :v LIMIT 1',
    { v: idOrSlug },
  );
  if (!row) return null;
  hydrateJson([row], RESOURCES['doctors'].jsonFields);
  return row;
}

export function listServices() {
  return cached('services:active', TTL, async () => {
    const rows = await query(
      'SELECT * FROM services WHERE is_active = 1 ORDER BY order_index ASC',
    );
    return hydrateJson(rows, RESOURCES['services'].jsonFields);
  });
}

/** Category/parent pairs the services page uses to build its filter chips. */
export function listServiceCategories() {
  return cached('services:categories', TTL, () =>
    query('SELECT category, parent_service FROM services WHERE is_active = 1'));
}

export function listBlogPosts() {
  return cached('blog_posts:published', TTL, async () => {
    const rows = await query(
      "SELECT * FROM blog_posts WHERE status = 'published' ORDER BY publish_date DESC",
    );
    return hydrateJson(rows, RESOURCES['blog-posts'].jsonFields);
  });
}

export async function getBlogPost(slug) {
  const row = await queryOne(
    "SELECT * FROM blog_posts WHERE slug = :slug AND status = 'published'",
    { slug },
  );
  if (!row) return null;
  hydrateJson([row], RESOURCES['blog-posts'].jsonFields);
  return row;
}

export function listBranches() {
  return cached('branches:active', TTL, () =>
    query('SELECT * FROM branches WHERE is_active = 1 ORDER BY order_index ASC'));
}
