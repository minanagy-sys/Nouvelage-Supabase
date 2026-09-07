# Nouvelage — architecture and scaling guide

The rule that keeps this stack fast, editable and scalable for years:

> **Content lives in MySQL. Files live on disk. Code lives in git.**
> The dashboard edits the database; nothing an editor changes ever requires
> a rebuild or redeploy.

## What lives where

### In MySQL (edited from the admin dashboard)

| Table | What it holds | Edited in dashboard |
|---|---|---|
| `page_content` | every page's copy — headlines, subtitles, CTAs, image *paths*, SEO meta — one JSON doc per page | Pages section |
| `parent_bundles` | bundle categories | Bundles section |
| `bundles` | all treatment packages: pricing, cards, sliders, galleries (paths) | Bundles section |
| `doctors` | profiles, qualifications, before/after galleries (paths), SEO | Doctors section |
| `services` | treatments: descriptions, benefits, FAQ, pricing | Services section |
| `blog_posts` | posts, drafts, categories, tags, SEO | Blog section |
| `branches` | clinic locations, hours, map coordinates | Branches |
| `media_library` | metadata of uploaded files — **paths only, never bytes** | Media library |
| `bookings` | appointment requests + checkout orders (cart snapshot at purchase time) | Bookings (read/status) |
| `contact_submissions` | contact form leads, IPs as salted hashes | Contact (triage) |
| `settings` | global key/value switches | — |
| `admin_users`, `activity_log` | dashboard accounts (bcrypt), audit trail | — |

**Why the database and not files:** one source of truth. The dashboard and the
public site read the same rows, so an edit is live in seconds, works from any
device, survives redeploys, and is backed up with one `mysqldump`.

### On disk (never in the database)

```
frontend/public/assets/img/media-library/   uploaded images — WebP + 480/768/1200 variants
frontend/src/assets/                        design assets that ship with the code
```

Every upload goes through the API pipeline (multer → sharp): converted to
WebP, responsive variants written, filed by department → entity → name, and
only the **path** stored in `media_library`. nginx serves these directly with
long cache headers — image traffic never touches Node or MySQL.

### In the project (git — changed by developers, not editors)

- Angular components, templates, styles — the *design* of every page
- `backend/` — API code, resource registry, schema, migrations
- `deploy/` — docker-compose, nginx config
- Small fallback data (`demo-mode` page defaults, `doctors-fallback.data.ts`)
  used only when the API/database has nothing — belt-and-suspenders, not the
  source of truth

**The test:** if a clinic staff member should be able to change it → database.
If changing it needs design/code judgement → git.

## The read path (why it's fast)

```
visitor → nginx (static Angular files, images: microseconds, no Node)
        → /api/content/* → Node in-memory cache (60s TTL) → MySQL (indexed)
admin save → writes MySQL → invalidates the cache key → next visitor sees it
```

Three layers, each absorbing load before the next:

1. **nginx static** — HTML/JS/CSS/images served from disk with cache headers.
   This is ~90% of the bytes and never reaches the application.
2. **API in-memory cache** — public content reads are cached 60s and
   invalidated instantly on admin writes. Editors see changes immediately;
   a traffic spike produces at most one DB query per table per minute.
3. **MySQL with covering indexes** — every list the site renders has a
   matching index (`is_active, order_index` etc.). At clinic-website scale
   MySQL is idle even without the cache; the cache exists so it stays idle
   at 100× the traffic.

## Scaling path (in order — don't skip ahead)

Each step is additive; none changes the architecture.

1. **Today (one VPS/droplet)** — nginx + Node + MySQL via
   `deploy/docker-compose.yml`. Handles far more traffic than a clinic site
   sees. Do nothing until metrics say otherwise.
2. **More traffic** — raise the cache TTL for anonymous reads, add nginx
   `proxy_cache` for `/api/content/*` (micro-caching, 10–60s). Zero code.
3. **Multiple API instances / bigger box** — swap the in-memory cache for
   Redis (same `cached()`/`invalidate()` interface in `backend/src/cache.js`),
   put the API behind nginx upstream with 2+ Node processes.
4. **Global audience** — CDN (Cloudflare) in front of nginx: images and
   static assets served from edge; `/api` passes through.
5. **SEO becomes a growth channel** — add Angular SSR (`@angular/ssr`).
   Purely additive; the API doesn't change.
6. **Database growth** — MySQL read replica only if reporting/analytics
   queries ever compete with the site. Content tables are small forever;
   only `bookings` grows, and it's indexed for the queries the dashboard runs.

## Rules that keep it healthy long-term

- **Never store image bytes or base64 in the database or in source.** Paths
  only. (The old stack shipped 44MB of base64 in its JS — that's what made
  it slow.)
- **New editable content = new table (or field) + one registry entry** in
  `backend/src/admin/resources.js` — the generic CRUD, validation and the
  dashboard wiring come for free. Never a bespoke route per field.
- **Public endpoints only under `/api/content` + the two lead POSTs.**
  Anything under `/api/admin` requires the JWT — and public pages must never
  call it (a 401 there is a bug, not a login prompt).
- **Snapshot money data.** `bookings.items` copies the cart at purchase
  time; historical orders must not change when prices do.
- **Migrations, not hand edits.** Schema changes go in
  `backend/db/migrations/NNN-name.sql`, applied by `npm run migrate`.
