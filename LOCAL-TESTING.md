# Running Nouvelage locally (test deployment)

Every step below was verified end-to-end on this branch. You need three
terminals at most: MySQL (usually a service), the API, and the Angular app.

## Prerequisites

- **Node.js 20+** (22 recommended) — https://nodejs.org
- **MySQL 8** — any of:
  - Windows: MySQL Installer, or XAMPP (its MariaDB also works for testing)
  - macOS: `brew install mysql && brew services start mysql`
  - Linux: `sudo apt install mysql-server`
  - Or Docker: `docker run -d --name nouvelage-db -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 mysql:8.4`

## 1. Database

Create a database and a user (as root, e.g. `mysql -u root -p` or phpMyAdmin):

```sql
CREATE DATABASE nouvelage DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'nouvelage'@'localhost' IDENTIFIED BY 'devpass123';
GRANT ALL PRIVILEGES ON nouvelage.* TO 'nouvelage'@'localhost';
FLUSH PRIVILEGES;
```

Then either import the one-file bundle:

```bash
mysql -u nouvelage -pdevpass123 nouvelage < nouvelage-database.sql
```

…or let the setup script do it (step 2 below runs `npm run setup-db`, which
creates the tables and seed for you — pick one, both are idempotent).

## 2. Backend API (terminal 1)

```bash
cd backend
cp .env.example .env
```

Edit `.env` — for a local test these values are enough:

```
NODE_ENV=development
PORT=4000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=nouvelage
DB_PASSWORD=devpass123
DB_NAME=nouvelage
CORS_ORIGINS=http://localhost:4200
UPLOADS_DIR=../frontend/public/assets/img
```

(`ADMIN_JWT_SECRET` / `IP_HASH_SALT` may stay empty in development — dev-only
values are generated automatically; production refuses to start without them.)

```bash
npm install
npm run setup-db                  # creates tables + seed (safe to re-run)

# create your dashboard login — password comes from the environment, not argv
ADMIN_EMAIL=admin@nouvelage.clinic ADMIN_PASSWORD='choose-10+-chars' npm run create-admin
# Windows PowerShell:
#   $env:ADMIN_EMAIL='admin@nouvelage.clinic'; $env:ADMIN_PASSWORD='choose-10+-chars'; npm run create-admin

npm run dev                       # API on http://localhost:4000
```

Check: http://localhost:4000/api/health → `{"status":"ok","build":"dev"}`

## 3. Frontend (terminal 2)

```bash
cd frontend
npm install
npm start                         # Angular dev server on http://localhost:4200
```

Open **http://localhost:4200**.

## 4. What to test

| Area | URL / action |
|---|---|
| Landing | `/` — seeded content loads from MySQL |
| Public pages | `/forher`, `/forhim`, `/services`, `/team`, `/bundles`, `/blog`, `/contact` |
| Dashboard login | `/admin/login` — the account from create-admin |
| Content editing | edit a page, create a bundle/doctor/blog post — refresh the public page |
| Media upload | dashboard media library — file lands as WebP + variants under `frontend/public/assets/img/media-library/`, DB stores the path only |
| Bookings | submit the contact/booking form → appears under dashboard bookings |

A fresh database contains only the seed (landing content + 5 bundle
categories), so most pages start empty — that's expected. Real content
arrives either by editing in the dashboard or by importing the live data
(`MIGRATION.md`).

## Testing SSR locally (optional)

`npm start` runs the plain dev server (no SSR) — fastest for development.
To test the real server-rendered output:

```bash
cd frontend
npm run build
API_BASE_URL=http://127.0.0.1:4000/api npm run serve:ssr:nouvelage-angular
```

Then open http://localhost:4200 — View Source now shows the full page HTML
(doctors, bundles, blog content) instead of an empty app shell. The API must
be running.

## Troubleshooting

- **Port already in use** — change `PORT` in `backend/.env` and `apiUrl` in
  `frontend/src/environments/environment.ts` together.
- **`ER_ACCESS_DENIED_ERROR`** — the DB user/password in `.env` doesn't match
  what you created in step 1.
- **API up but pages empty + console CORS errors** — make sure
  `CORS_ORIGINS` includes `http://localhost:4200` exactly.
- **`401 Unauthorized` on the dashboard login** — the API is running fine
  (a dead API gives `status 0` instead); the email and password just don't
  match a row. The API deliberately won't say which of the two is wrong, so
  list the accounts that exist:

  ```bash
  cd backend && npm run list-admins
  ```

  Sign in with an address exactly as printed. If the one you're typing isn't
  there — `admin@nouvelage.com` and `admin@nouvelage.clinic` are easy to mix
  up — create it, or reset the password on an existing account, by running
  create-admin with that same email:

  ```bash
  ADMIN_EMAIL=the-address-you-type ADMIN_PASSWORD='min-10-chars' npm run create-admin
  ```

- **`Too many login attempts — try again later`** — the login endpoint allows
  10 tries per 15 minutes per IP. Wait it out, or restart the API to clear the
  counter (it is held in memory).
