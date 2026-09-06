# Nouvelage — Production Readiness Plan

**Date:** 2026-07-14
**Author:** prepared for review before execution
**Repo:** `github.com/Jerkox/Nouvelage.git` (remote `origin`)
**Goal:** Ship the project to production **with all current data and content unchanged**, replace the fake "demo admin" login with **real admin credentials stored in Supabase**, secure the database, clean the project folder, and push to git — **without deleting any content or data**.

---

## 1. Current State (analysis)

### Stack
- **Angular 18** single-page app (standalone components). Dev server on `:4200`.
- **Supabase** is the backend/database: project `yqumxsddmhcsutcjrfaq.supabase.co`, accessed **client-side** with the anon key in `src/environments/environment.ts`.
- A small **Express upload server** (`upload-server.js`, port 3001) handles image uploads to `public/assets`.
- Tables (from `supabase-schema.sql`): `page_content`, `parent_bundles`, `bundles`, `doctors`, `blog_posts`, `media_library`, `services`, `branches`, `contact_submissions`, `settings`.

### The "demo mode" truth
- `DemoModeService.isDemoMode` is hardcoded `true`. Despite the name, **this is the live working mode** — page-content reads/writes route through `DemoModeService` → `AdminSupabaseService` → **Supabase**. Your content already persists to Supabase. ✅ **No data will be touched.**

### Auth is currently fake ⚠️
- `AdminAuthService.login()` POSTs to `http://localhost:5000/api/auth/login` — **no such backend exists/deployed**, so the real login form does nothing usable.
- The only working login is the **"View Demo Dashboard"** button (`loginDemo()`), which writes a fake token `demo-token-temporary-access` and fake user `demo@nouvelage.com` to `localStorage`.
- `AdminAuthGuard` only checks that *a* token exists → **admin is effectively unprotected today.**

### Security
- RLS policies in `supabase-schema.sql` are written for `auth.role() = 'authenticated'` — the project was **designed for Supabase Auth** — but RLS is currently disabled (there are `disable-rls.sql` / `disable-rls-via-api.js` scripts) and everything runs on the anon key. **Anyone with the anon key can currently write to the database.**

### Repo hygiene ⚠️
- **183 tracked files**, including ~150 root-level throwaway dev scripts (`*.js`, `*.html`), debugging docs (`*.md`), one-off SQL patches (`*.sql`), and large data dumps (`doctor-images-from-assets.json` = 81 MB, `doctor-galleries.json` = 19 MB, `extracted-doctors.json` = 18 MB, `doctors-raw.txt` = 18 MB).
- **12 `.backup` / `.bak` files** inside `src/`.
- A **stale duplicate `nouvelage-angular/` subfolder** is tracked.
- `.DS_Store`, `temp/` present.

---

## 2. Decisions (confirmed)

| Area | Decision |
|---|---|
| **Admin auth** | Use **Supabase Auth** (GoTrue). Admin users stored in Supabase's secure `auth.users` (hashed passwords). |
| **RLS** | **Enable secure RLS — safe-by-testing**: public can READ; admins WRITE via their Supabase Auth session (same client the app already uses, so saves keep working); public forms keep `anon` INSERT. Tested table-by-table before commit; any table whose save breaks is left permissive. Instantly revertible. No data deleted. |
| **Cleanup** | **Full clean** — archive dev scripts/docs/dumps/backups out of the repo (moved to a local `_archive/` folder, **not deleted from disk**). |
| **Git** | **New branch** `production-ready` + local backup archive first; `main` untouched until you merge. |

---

## 3. Execution Plan

### Phase 0 — Safety backup (no risk)
1. Create a full local backup: `git bundle` + a zipped copy of the working tree into `../nouvelage-backup-2026-07-14/` (outside the repo). Nothing on disk is lost at any step.

### Phase 1 — Replace demo auth with Supabase Auth
2. **Rewrite `AdminAuthService`** to authenticate against Supabase:
   - `login(email,password)` → `supabase.auth.signInWithPassword(...)`.
   - `logout()` → `supabase.auth.signOut()`.
   - `isAuthenticated()` / `getCurrentUser()` → read the Supabase session.
   - Keep the existing public method signatures so components/guard keep compiling.
3. **Update `AdminAuthGuard`** to check the Supabase session (async/`canActivate` returning a session check).
4. **Remove the "View Demo Dashboard" button** and `loginDemo()` from `admin-login.component.*`. The login form (email + password) becomes the only entry.
5. **Flip `DemoModeService.isDemoMode` handling**: because "demo mode" is actually the Supabase data path, I will **keep the Supabase read/write routing** (rename intent, not behavior) so **content/data keeps working exactly as now**. The only thing removed is the fake *auth* token — not the data layer. (I'll verify every `isDemoModeEnabled()` call site still points writes at Supabase.)
6. **Seed the admin user** in Supabase Auth (see §4 — needs your input).

### Phase 2 — Secure the database (RLS) — safe-by-testing
> **Why saving keeps working:** today admin saves succeed because RLS is off and the app writes with the anon key. After Phase 1, the admin logs in via Supabase Auth, and the **same shared Supabase client** the app already uses now carries an authenticated session — so every admin insert/update becomes an `authenticated` write automatically. Nothing in the save flow changes except that it's now logged-in.

7. Write `production-rls.sql` that, for every table:
   - `SELECT` → allowed to `anon` + `authenticated` (public site keeps loading).
   - `INSERT/UPDATE/DELETE` → `authenticated` only (admins).
   - `contact_submissions` / bookings → allow `INSERT` from `anon` (so public forms still submit), read/manage `authenticated` only.
8. **Enable it, then test every admin save table-by-table on the LIVE site before committing.** For any table where a save unexpectedly breaks, that table is left **permissive** (open insert) so your data flow is never faulty. RLS changes **access rules only — zero data deleted** — and is **instantly revertible** if anything looks off.
9. **This phase is optional and isolated** — if you'd rather ship auth + cleanup first and harden RLS later, we can skip Phase 2 entirely and your saving stays exactly as it is now.

### Phase 3 — Production configuration
9. Consolidate environments: keep `environment.ts` (dev) and `environment.prod.ts` (prod), delete the redundant/inconsistent `environment.production.ts`. Verify `angular.json` `fileReplacements` for the production build.
10. Point `AdminAuthService`/`AdminApiService` away from the dead `localhost:5000`/`localhost:3000` URLs (only the Supabase path remains for admin data; upload server URL made configurable).
11. `ng build --configuration production` — confirm a clean production build (fix any type errors surfaced by removing demo code).

### Phase 4 — Clean the project folder (Full clean)
12. Create `_archive/` (git-ignored, stays on disk) and **move** into it:
    - All root-level dev scripts: `*.js` (except real app config), `*.html` debug pages, `*.sql` one-off patches, throwaway `*.md` reports, big JSON/txt dumps.
    - The 12 `src/**/*.backup` / `*.bak` files.
    - The stale `nouvelage-angular/` subfolder.
    - `temp/`, `.DS_Store`.
13. **Keep** in the repo: `src/`, `public/`, `angular.json`, `package.json`, `package-lock.json`, `tsconfig*.json`, `README.md`, `supabase-schema.sql`, `production-rls.sql`, `upload-server.js`, `.gitignore`, `.editorconfig`, `.vscode/`.
14. Update `.gitignore` to exclude `_archive/`, `temp/`, `.DS_Store`, `*.backup`, `*.bak`.
15. `git rm --cached` the removed-from-repo files (they remain on disk in `_archive/`).

### Phase 5 — Ship to git
16. `git checkout -b production-ready`.
17. Stage the current already-modified source (the many `M`/`D` files in your working tree are your real current work — they get committed as the production baseline).
18. Commit with a clear message; **push `origin production-ready`**. `main` stays as-is for your review/merge.

### Phase 6 — Verify (before handing back)
19. Re-run `ng serve`, hard-refresh, and confirm:
    - Public site renders with all current content (landing, forher, forhim, services, doctors, blog, contact).
    - Admin login works with the **new real credentials**; demo button is gone.
    - Admin can edit content and it saves to Supabase.
    - Production build succeeds.

---

## 4. What I need from you to finish Phase 1

Creating the Supabase Auth admin user requires either the Supabase dashboard or the **service-role key** (I only see the anon key in the repo). Choose one:
- **(A)** You create the admin user in **Supabase Dashboard → Authentication → Users → Add user** (email + password), and just tell me the email. *(Simplest, most secure — key never leaves your hands.)*
- **(B)** You give me the **service-role key** and the desired **email + password**, and I'll create the user via a one-off script, then delete the script.

**Please provide:** desired admin **email** (e.g. `admin@nouvelage.com`) and, if option B, the password + service-role key.

---

## 5. Guarantees
- ✅ **Your insert/save-to-Supabase flow keeps working** — admin writes continue, now authenticated instead of anonymous; tested per-table before commit, permissive fallback if any table breaks.
- ✅ **The website looks and behaves exactly as it does now** — same data, same content, same shape/design. Nothing faulty.
- ✅ **No Supabase content or data is deleted or modified** — only access rules (RLS) and auth wiring change.
- ✅ **No files deleted from disk** — cleanup *moves* files to `_archive/` (git-ignored).
- ✅ **`main` branch untouched** until you merge; full local backup taken first.
- ✅ The public site and admin content behave **exactly as they do now**, minus the fake demo login.

---

## 6. Risks / notes
- Enabling RLS is the one step that could visually affect the site *if* a public-read policy is missed — mitigated by testing every page before commit, and RLS can be instantly reverted.
- The anon key is already public in the repo; that's normal for Supabase (it's meant to be public **when RLS is on**). Enabling RLS is what actually makes it safe.
- Removing demo code may surface TypeScript errors in components that referenced it — these will be fixed as part of Phase 1/3.
