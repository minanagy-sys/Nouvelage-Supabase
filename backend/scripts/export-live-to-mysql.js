/**
 * Export the LIVE Nouvelage content (the Supabase/PostgREST API the current
 * site runs on) into a MySQL data file for local testing.
 *
 *   cd backend
 *   node scripts/export-live-to-mysql.js
 *   → writes ../nouvelage-live-data.sql  (import with mysql < that file)
 *
 * Read-only: only GET requests against the same public API the website
 * itself uses, authenticated with the site's public anon key. Covers every
 * publicly readable table (page_content, parent_bundles, bundles, doctors,
 * blog_posts, media_library, services, branches). Private tables (bookings,
 * contact_submissions, settings) are not exposed to the anon role — for
 * those use the full pg_dump route in MIGRATION.md.
 *
 * Any base64 image found in the data (media data_url, doctor galleries,
 * page content) is written to disk as WebP under
 * frontend/public/assets/img/media-library/live-import/ and replaced with
 * its path — the SQL file never carries image bytes.
 *
 * Env overrides: SUPABASE_URL, SUPABASE_ANON_KEY, LIVE_EXPORT_FIXTURE
 * (a JSON file of {table: rows[]} used instead of fetching — for tests).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(backendDir, '..');
const OUTPUT_SQL = path.join(repoRoot, 'nouvelage-live-data.sql');
const IMAGES_DIR = path.join(repoRoot, 'frontend/public/assets/img/media-library/live-import');
const IMAGES_WEB = '/assets/img/media-library/live-import';

const SUPABASE_URL = (process.env.SUPABASE_URL ?? 'https://api.nouvelage.clinic').replace(/\/+$/, '');
const ANON_KEY = process.env.SUPABASE_ANON_KEY
  ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjIwMDAwMDAwMDB9.9HEnzqvt60ZjFENKXBRFZvol6UYVoXr0v_6OAY0yF8g';

// table → MySQL columns (order matters only for readability). Matches
// backend/db/schema.sql; anything the live API returns beyond these is dropped.
const TABLES = {
  page_content: {
    order: 'page_key',
    columns: ['id', 'page_key', 'content', 'created_at', 'updated_at'],
    json: ['content'],
  },
  parent_bundles: {
    order: 'order_index',
    columns: ['id', 'name', 'slug', 'description', 'icon', 'order_index', 'is_active', 'created_at', 'updated_at'],
    json: [],
  },
  bundles: {
    order: 'order_index',
    columns: [
      'id', 'parent_category_id', 'parent_category', 'card_number', 'card_title', 'card_image',
      'card_price', 'card_ribbon', 'is_active', 'show_in_grid', 'show_price', 'show_in_slider',
      'use_luxury_modal', 'modal_title', 'price_old', 'price_new', 'price_save', 'price_unit',
      'show_installment', 'installment_text', 'services_list', 'services_label', 'duration',
      'visits', 'channel', 'why_box_text', 'gallery', 'slider_tag', 'slider_title',
      'slider_bg_image', 'slider_bg_color', 'slider_cta_text', 'slider_order', 'order_index',
      'catalogue_theme', 'catalogue_badge', 'created_at', 'updated_at',
    ],
    json: ['services_list', 'gallery'],
  },
  doctors: {
    order: 'order_index',
    columns: [
      'id', 'slug', 'name', 'title', 'specialization', 'sub_specialties', 'qualifications',
      'certificates', 'experience', 'languages', 'services', 'rating', 'branches',
      'available_days', 'gender', 'profile_image', 'before_after_gallery', 'bio', 'long_bio',
      'philosophy', 'featured', 'order_index', 'is_active', 'meta_title', 'meta_description',
      'meta_keywords', 'instagram_url', 'facebook_url', 'linkedin_url', 'created_at', 'updated_at',
    ],
    json: ['sub_specialties', 'qualifications', 'certificates', 'languages', 'services', 'branches', 'available_days', 'before_after_gallery'],
  },
  blog_posts: {
    order: 'created_at',
    columns: [
      'id', 'slug', 'title', 'subtitle', 'excerpt', 'content', 'featured_image', 'author',
      'author_image', 'category', 'tags', 'status', 'publish_date', 'read_time', 'related_posts',
      'meta_title', 'meta_description', 'meta_keywords', 'created_at', 'updated_at',
    ],
    json: ['tags', 'related_posts'],
  },
  media_library: {
    order: 'uploaded_at',
    // data_url is fetched (to extract any base64 to disk) but never written to SQL.
    columns: ['id', 'filename', 'path', 'full_path', 'size', 'type', 'alt_text', 'uploaded_at'],
    json: [],
    fetchExtra: ['data_url'],
  },
  services: {
    order: 'order_index',
    columns: [
      'id', 'slug', 'name', 'subtitle', 'description', 'featured_image', 'gallery', 'duration',
      'price', 'price_unit', 'benefits', 'procedure_steps', 'faq', 'category', 'parent_service',
      'tags', 'featured', 'order_index', 'is_active', 'meta_title', 'meta_description',
      'meta_keywords', 'created_at', 'updated_at',
      // live-drifted columns the dashboard editor and public page use
      'card_title', 'card_number', 'card_ribbon', 'card_description', 'card_image', 'card_price', 'card_button_text', 'detail_title', 'detail_subtitle', 'detail_tagline', 'hero_background_image', 'modal_title', 'meta_duration', 'meta_downtime', 'meta_lasts', 'meta_sessions', 'price_details', 'offer_title', 'offer_subtitle', 'offer_eyebrow', 'offer_description', 'offer_cover_image', 'offer_cta_text', 'offer_cta_link', 'cta_button_text', 'whatsapp_button_text', 'whatsapp_number', 'show_price', 'show_in_grid', 'how_it_works_steps', 'timeline', 'what_you_achieve', 'products_used', 'specialist_doctor_ids',
    ],
    json: ['gallery', 'benefits', 'procedure_steps', 'faq', 'tags',
           'how_it_works_steps', 'timeline', 'what_you_achieve', 'products_used', 'specialist_doctor_ids'],
  },
  branches: {
    order: 'order_index',
    columns: [
      'id', 'slug', 'branch_name', 'city', 'address', 'phone', 'email', 'whatsapp',
      'hours_weekday', 'hours_weekend', 'latitude', 'longitude', 'show_in_map', 'image',
      'order_index', 'is_active', 'created_at', 'updated_at',
    ],
    json: [],
  },
};

const TIMESTAMP_COLUMNS = new Set(['created_at', 'updated_at', 'uploaded_at', 'publish_date']);
const PAGE_SIZE = 500;

// ---------------------------------------------------------------------------

async function fetchTable(table, config) {
  const rows = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=*&order=${config.order}`;
    const response = await fetch(url, {
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
        Range: `${from}-${from + PAGE_SIZE - 1}`,
        Prefer: 'count=exact',
      },
    });
    if (!response.ok) {
      throw new Error(`${table}: HTTP ${response.status} — ${(await response.text()).slice(0, 200)}`);
    }
    const page = await response.json();
    rows.push(...page);
    if (page.length < PAGE_SIZE) break;
  }
  return rows;
}

// --- base64 → file ----------------------------------------------------------

let sharp = null;
try {
  ({ default: sharp } = await import('sharp'));
} catch {
  console.warn('[export] sharp not installed — base64 images will be saved in their original format');
}

const hashToPath = new Map();
let imagesWritten = 0;

async function base64ToFile(dataUrl, hint) {
  const match = /^data:image\/([a-z+.-]+);base64,([\s\S]+)$/.exec(dataUrl.trim());
  if (!match) return dataUrl;
  const buffer = Buffer.from(match[2], 'base64');
  const hash = crypto.createHash('sha256').update(buffer).digest('hex');
  if (hashToPath.has(hash)) return hashToPath.get(hash);

  await fs.mkdir(IMAGES_DIR, { recursive: true });
  const name = `${hint}-${hash.slice(0, 10)}`;
  let webPath;
  if (sharp) {
    await sharp(buffer).rotate().webp({ quality: 82 }).toFile(path.join(IMAGES_DIR, `${name}.webp`));
    webPath = `${IMAGES_WEB}/${name}.webp`;
  } else {
    const ext = match[1].replace('jpeg', 'jpg').replace(/[^a-z0-9]/g, '') || 'bin';
    await fs.writeFile(path.join(IMAGES_DIR, `${name}.${ext}`), buffer);
    webPath = `${IMAGES_WEB}/${name}.${ext}`;
  }
  hashToPath.set(hash, webPath);
  imagesWritten += 1;
  return webPath;
}

/** Recursively replace any data:image base64 string inside a value with a file path. */
async function extractImages(value, hint) {
  if (typeof value === 'string') {
    return value.startsWith('data:image/') ? base64ToFile(value, hint) : value;
  }
  if (Array.isArray(value)) {
    const out = [];
    for (const item of value) out.push(await extractImages(item, hint));
    return out;
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const [key, inner] of Object.entries(value)) out[key] = await extractImages(inner, hint);
    return out;
  }
  return value;
}

// --- SQL rendering -----------------------------------------------------------

function sqlString(text) {
  return `'${String(text).replace(/\\/g, '\\\\').replace(/'/g, "''").replace(/\0/g, '')}'`;
}

function sqlLiteral(value, column, jsonColumns) {
  if (value === null || value === undefined) return 'NULL';
  if (jsonColumns.includes(column)) {
    return sqlString(typeof value === 'string' ? value : JSON.stringify(value));
  }
  if (typeof value === 'boolean') return value ? '1' : '0';
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'NULL';
  if (TIMESTAMP_COLUMNS.has(column)) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'NULL';
    return sqlString(date.toISOString().slice(0, 19).replace('T', ' '));
  }
  return sqlString(value);
}

// ---------------------------------------------------------------------------

async function main() {
  const fixtureFile = process.env.LIVE_EXPORT_FIXTURE;
  const fixture = fixtureFile ? JSON.parse(await fs.readFile(fixtureFile, 'utf8')) : null;

  const out = [
    '-- ============================================================================',
    '-- NOUVELAGE — live content exported from the production Supabase API',
    `-- Source: ${fixture ? `fixture ${fixtureFile}` : SUPABASE_URL} · ${new Date().toISOString()}`,
    '-- Import into a database that already has the schema:',
    '--   mysql -u nouvelage -p nouvelage < nouvelage-live-data.sql',
    '-- Idempotent: rows are INSERT IGNOREd, existing rows are kept.',
    '-- ============================================================================',
    '',
    'SET NAMES utf8mb4;',
    "SET time_zone = '+00:00';",
    '',
  ];

  const counts = {};
  for (const [table, config] of Object.entries(TABLES)) {
    process.stdout.write(`[export] ${table} ... `);
    let rows;
    try {
      rows = fixture ? (fixture[table] ?? []) : await fetchTable(table, config);
    } catch (error) {
      console.log(`FAILED (${error.message}) — skipped`);
      counts[table] = 'failed';
      continue;
    }

    out.push(`-- ${table}: ${rows.length} rows`);
    for (const row of rows) {
      const values = [];
      for (const column of config.columns) {
        let value = row[column];
        // media_library: pull any base64 payload out to disk first
        if (table === 'media_library' && column === 'full_path' && !value
            && typeof row.data_url === 'string' && row.data_url.startsWith('data:image/')) {
          value = await base64ToFile(row.data_url, String(row.filename ?? row.id).replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-]+/g, '-').toLowerCase() || 'media');
          row.path = value.slice(0, value.lastIndexOf('/') + 1);
          row.filename = value.slice(value.lastIndexOf('/') + 1);
          row.type = 'image/webp';
        } else {
          value = await extractImages(value, `${table}-${String(row.id ?? '').slice(0, 24) || 'row'}-${column}`);
        }
        values.push(sqlLiteral(value, column, config.json));
      }
      out.push(
        `INSERT IGNORE INTO \`${table}\` (${config.columns.map((c) => `\`${c}\``).join(', ')}) VALUES (${values.join(', ')});`,
      );
    }
    out.push('');
    counts[table] = rows.length;
    console.log(`${rows.length} rows`);
  }

  await fs.writeFile(OUTPUT_SQL, out.join('\n'));

  console.log('\ntable                        rows');
  console.log('------------------------- -------');
  for (const [table, count] of Object.entries(counts)) {
    console.log(`${table.padEnd(25)} ${String(count).padStart(7)}`);
  }
  if (imagesWritten) console.log(`\nbase64 images written to disk: ${imagesWritten} (under ${IMAGES_WEB}/)`);
  console.log(`\nwrote ${OUTPUT_SQL}`);
  console.log('import with:  mysql -u nouvelage -p nouvelage < nouvelage-live-data.sql');
}

main().catch((error) => {
  console.error(`[export] failed: ${error.message}`);
  process.exit(1);
});
