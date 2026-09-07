# Nouvelage

Luxury aesthetic clinic website and admin dashboard.

**Built with: Angular 18 (frontend) · Node.js / Express 5 (backend) · MySQL 8.4 (database).**

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
cd frontend && npm run build      # → frontend/dist/nouvelage-angular
```

The API serves uploaded media at `/assets/img/...` in development; in
production nginx serves the Angular build and the uploads tree directly and
proxies `/api` to the Node API (see `deploy/nginx.conf.example`).

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
