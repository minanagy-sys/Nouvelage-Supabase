# Migrating Nouvelage from Supabase (Postgres) to MySQL

Runbook for moving the live data off the droplet's self-hosted Supabase stack
into the new MySQL-backed stack in this repository. **Every command against
the droplet is read-only** — the live site keeps running untouched until the
new stack is verified and traffic is switched.

## 0. Collect before starting

```bash
# The Supabase schema as actually deployed (may have drifted from the repo file)
ssh root@178.62.247.56 "docker exec -t \$(docker ps --filter name=supabase-db --format '{{.Names}}' | head -1) \
  pg_dump -U postgres --schema-only postgres" > nouvelage-schema-live.sql

# Row counts per table, to reconcile against after import
ssh root@178.62.247.56 "docker exec -t \$(docker ps --filter name=supabase-db --format '{{.Names}}' | head -1) \
  psql -U postgres -c \"SELECT schemaname, relname, n_live_tup FROM pg_stat_user_tables ORDER BY n_live_tup DESC;\""

# Size of the media that has to move
ssh root@178.62.247.56 'du -sh /var/www/nouvelage/public/assets/img/{media-library,blog,uploads}'
```

Compare `nouvelage-schema-live.sql` against `backend/db/supabase-schema-reference.sql`.
If the live schema carries columns the MySQL schema lacks, add them via a
migration in `backend/db/migrations/` before importing.

## 1. Dump the data (read-only, on the droplet)

```bash
ssh root@178.62.247.56
docker exec -t $(docker ps --filter name=supabase-db --format '{{.Names}}' | head -1) \
  pg_dump -U postgres --data-only --column-inserts \
  --exclude-schema=auth --exclude-schema=storage --exclude-schema=_realtime \
  postgres > /tmp/nouvelage-data.sql
ls -lh /tmp/nouvelage-data.sql
```

`--column-inserts` produces one `INSERT` per row with explicit column names.
`scp` the file down, then **delete it from the droplet**:

```bash
scp root@178.62.247.56:/tmp/nouvelage-data.sql ./
ssh root@178.62.247.56 'rm /tmp/nouvelage-data.sql'
```

## 2. Prepare the MySQL database

```bash
cd backend
cp .env.example .env      # point at the target MySQL, set secrets
npm install
npm run setup-db
ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run create-admin
```

## 3. Import

```bash
node scripts/import-legacy.js ./nouvelage-data.sql
```

The importer inserts through the same mysql2 pool the app uses (so NOT NULL
and FK constraints are enforced during import) and handles: `true/false → 1/0`,
`'{a,b}'` array literals → JSON arrays, `E'...'` escapes, timestamptz → UTC
DATETIME, and `media_library.data_url` base64 payloads → WebP files on disk
(paths only in the database).

It ends with a reconciliation table — **dump rows vs MySQL rows per table,
side by side**. Do not proceed while any table shows `← MISSING ROWS`.

## 4. Media

```bash
# From the machine that can reach the droplet — dry run first
rsync -av --dry-run root@178.62.247.56:/var/www/nouvelage/public/assets/img/media-library/ \
  frontend/public/assets/img/media-library/
rsync -av root@178.62.247.56:/var/www/nouvelage/public/assets/img/{media-library,blog,uploads} \
  frontend/public/assets/img/

# Then generate WebP variants + media rows for anything the DB doesn't know
node scripts/import-media.js --dry-run
node scripts/import-media.js
```

## 5. Verify, then switch

1. `npm run dev` (backend) + `npm start` (frontend) — click through landing,
   for-her, for-him, services, team, a doctor page, blog, a post, bundles,
   cart → checkout → thank-you, contact, and the whole admin dashboard.
2. Deploy to a **separate root and port** on the droplet
   (`deploy/nginx.conf.example`); nothing existing is touched.
3. Switch the nginx server block when satisfied; the old stack stays intact
   for rollback.

## 6. After the switch

- **Rotate Supabase's `JWT_SECRET`** — it was exposed during the export. The
  `anon` and `service_role` keys are signed with it, so anyone holding it can
  mint a `service_role` token and bypass every RLS policy. Do this whether or
  not Supabase is being retired, because it is live right now.
- Retire the Supabase stack only after a comfortable soak period.
- Never run `docker system prune` or `docker volume prune` on the droplet.
