# Nouvelage

Luxury aesthetic clinic website and admin dashboard.

**Built with: Angular 18 + SSR (frontend) · Node.js / Express 5 (backend) · MySQL 8.4 (database).**

Public pages are **server-side rendered** per request — crawlers get full
HTML with fresh database content, visitors get instant first paint, and the
browser hydrates seamlessly. The admin dashboard stays client-side rendered
behind its login.

The site keeps its original structure, pages, dashboard and content; only the
data platform changed (previously self-hosted Supabase). Images are stored as
WebP files on disk with responsive variants — the database holds paths only,
never image bytes or base64.

```
nouvelage/
├── frontend/   Angular app (public site + admin dashboard)
├── backend/    Express 5 API + MySQL schema, migrations, ops scripts
│   ├── db/         schema.sql · admin-schema.sql · seed.sql · migrations/
│   ├── scripts/    setup-db · migrate · create-admin · import-legacy · import-media
│   └── src/        API source (routes, admin CRUD registry, media pipeline)
├── deploy/     docker-compose (MySQL + API) + nginx server block example
└── MIGRATION.md  Runbook: moving the live Supabase data into MySQL
```

## Development

Backend (API on http://localhost:4000):

```bash
cd backend
cp .env.example .env          # fill in DB credentials and secrets
npm install
npm run setup-db              # create database, apply schema + seed
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='min-10-chars' npm run create-admin
npm run dev
```

Frontend (Angular dev server on http://localhost:4200):

```bash
cd frontend
npm install
npm start
```

## Build

```bash
cd frontend && npm run build:prod   # → frontend/dist/nouvelage-angular/{browser,server}
npm run serve:ssr                   # SSR server on :4200 (SSR_PORT to change)
```

The SSR server needs the API running (`API_BASE_URL`, default
http://127.0.0.1:4000/api). In production nginx serves static assets from
`dist/nouvelage-angular/browser` directly, proxies pages to the SSR server
and `/api` to the API (see `deploy/nginx.conf.example`).

### Generated assets

Both of these are committed, so a normal build needs neither. Re-run them
only when you add images or change which font weights the CSS uses:

```bash
npm run assets:webp     # WebP twin beside each JPEG/PNG (~50% smaller)
npm run assets:fonts    # re-download the self-hosted webfonts
```

`assets:webp` needs `sharp`, which lives in `backend/node_modules` — run
`npm install` in `backend/` first. It is idempotent and skips anything
already up to date.

## Checking performance

Numbers beat guessing, and this stack has been tuned against measurements
rather than intuition. To re-measure after a change, run the production
build, start the API and the SSR server, then drive a real browser:

- Throttle the CPU (4× is a reasonable stand-in for a mid-range laptop);
  an unthrottled container hides every problem a visitor actually hits.
- Record **FCP/LCP** (has anything painted yet), **long tasks** (each one is
  a frozen page), **layout shift** (text jumping after paint) and **wire
  bytes** (`encodedDataLength` — not `content-length`, which reports the
  decompressed size and will tell you compression is not working when it is).
- Measure a **cold and a warm load**. Some costs — webfonts especially — are
  first-visit only, and treating them as permanent leads to over-engineering.
- Compare rendered `document.body.innerText` against the previous build. It
  is the cheapest proof that an optimisation changed no content.

What the current numbers look like, and the four rules that produced them,
are in `ARCHITECTURE.md` under *The critical path*. If a page's animations,
sliders or counters are dead, look for `NG0500` in the browser console
before anything else — see the hydration note in that section.

## Production

```bash
cd deploy
cp ../backend/.env.example .env   # real secrets: DB_PASSWORD, ADMIN_JWT_SECRET, IP_HASH_SALT
docker compose up -d --build
docker compose exec api node scripts/setup-db.js
docker compose exec api node scripts/migrate.js
```

Non-negotiables carried from the security review:

- `ADMIN_JWT_SECRET` is required in production — the API refuses to start without it
- `create-admin.js` reads the password from `ADMIN_PASSWORD` in the environment, never argv
- bcrypt cost 12; admin accounts re-checked against the database on every request
- form submitter IPs stored only as salted SHA-256 hashes
- image bytes never in the database — paths only

## Migrating the live data

See [MIGRATION.md](MIGRATION.md) for the full runbook (read-only dump from the
droplet, transform, import, reconcile, media rsync).
