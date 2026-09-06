# Deploy to DigitalOcean Droplet — Nouvelage

**Droplet IP:** `178.62.247.56`
**Domain (point later):** `https://www.nouvelage.clinic`
**Backend:** Supabase (unchanged — nothing to migrate)
**Runs on the droplet:** Angular site (static, via nginx) + upload server (Node/Express, via PM2)

> This runbook is **additive** — it creates a new folder `/var/www/nouvelage` and a new
> nginx site. It does **not** remove anything already on the droplet.

---

## Final architecture

```
Browser (https://www.nouvelage.clinic)
        │
        ▼
   nginx (:80 / :443)
   ├── /                → Angular static build (dist/.../browser)
   ├── /assets/...      → live uploads (public/assets) → fallback to built assets
   └── /api/...         → upload server on 127.0.0.1:3001 (PM2)
        │
        └── Supabase (data + auth + storage) over HTTPS — unchanged
```

---

## Step 1 — SSH into the droplet

```bash
ssh root@178.62.247.56
```
(If you use a non-root sudo user, prefix the install commands below with `sudo`.)

---

## Step 2 — Install what's missing (additive, idempotent)

```bash
# Check what's already there (skip installs you don't need)
node -v; nginx -v; pm2 -v; git --version; rsync --version | head -1

# Node.js 20 LTS (only if node missing or too old)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# nginx, git, rsync, certbot (only installs if absent)
apt-get install -y nginx git rsync
apt-get install -y certbot python3-certbot-nginx

# PM2 (process manager for the upload server)
npm install -g pm2
```

**Low-RAM droplets (< 2 GB): add swap so the Angular build doesn't get OOM-killed.**
```bash
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi
free -h
```

---

## Step 3 — Get the code onto the droplet

Create the app directory (additive):
```bash
mkdir -p /var/www/nouvelage
```

### Option A — rsync from your Mac (recommended, no git needed)
Run this **on your Mac** (in the project folder `/Users/mwg/Downloads/nouvelage-angular-july`):
```bash
rsync -avz --progress \
  --exclude node_modules --exclude dist --exclude .angular \
  --exclude _archive --exclude '*.bundle' \
  ./ root@178.62.247.56:/var/www/nouvelage/
```

### Option B — git clone (if you push the branch to a repo you own)
```bash
cd /var/www
git clone -b production-ready <your-repo-url> nouvelage
```

---

## Step 4 — Install dependencies & build the Angular app

On the droplet:
```bash
cd /var/www/nouvelage
npm install
npx ng build --configuration production
# Output: /var/www/nouvelage/dist/nouvelage-angular/browser
```
> If the build ever fails on "Inlining of fonts failed" (a transient network hiccup
> reaching Google Fonts), just run the build command again.

---

## Step 5 — Run the upload server with PM2

```bash
cd /var/www/nouvelage
pm2 start upload-server.js --name nouvelage-upload
pm2 save
pm2 startup systemd -u root --hp /root   # run the line it prints, then:
pm2 save

# sanity check (should print the health JSON)
curl -s http://127.0.0.1:3001/api/health
```

---

## Step 6 — Configure nginx

Create the site config:
```bash
cat > /etc/nginx/sites-available/nouvelage.clinic <<'NGINX'
server {
    listen 80;
    listen [::]:80;
    server_name nouvelage.clinic www.nouvelage.clinic;

    client_max_body_size 50M;   # allow large image uploads

    root /var/www/nouvelage/dist/nouvelage-angular/browser;
    index index.html;

    # Upload server (upload endpoint + health) — same origin
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Media & assets: serve LIVE uploads first, fall back to the built assets
    location /assets/ {
        root /var/www/nouvelage/public;   # live uploads land here
        try_files $uri @built_assets;
        expires 7d;
        access_log off;
    }
    location @built_assets {
        root /var/www/nouvelage/dist/nouvelage-angular/browser;
    }

    # Angular SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINX

# Enable the site (does NOT remove the existing default site)
ln -sf /etc/nginx/sites-available/nouvelage.clinic /etc/nginx/sites-enabled/nouvelage.clinic

# Test config and reload
nginx -t && systemctl reload nginx
```

Open the firewall (only if ufw is active):
```bash
ufw status | grep -q active && ufw allow 'Nginx Full'
```

---

## Step 7 — Test using the IP (before DNS)

From your Mac or browser:
```bash
curl -I http://178.62.247.56/            # expect HTTP 200
curl -s http://178.62.247.56/api/health  # expect {"status":"ok",...}
```
Open `http://178.62.247.56/` — the site should load with all content.
Log in at `http://178.62.247.56/admin/login` with your Supabase admin
(`admin@nouvelage.com`) and confirm the dashboard + a save works.

---

## Step 8 — Point the domain (the only registrar step)

At your domain DNS provider for **nouvelage.clinic**, add:

| Type | Name | Value |
|------|------|-------|
| A    | `@`  | `178.62.247.56` |
| A    | `www`| `178.62.247.56` |

Wait for it to propagate:
```bash
dig +short nouvelage.clinic
dig +short www.nouvelage.clinic     # both should return 178.62.247.56
```

---

## Step 9 — Enable HTTPS (after DNS resolves to the droplet)

```bash
certbot --nginx -d nouvelage.clinic -d www.nouvelage.clinic \
  --redirect --agree-tos -m mina.nagy@mwg.co.com --no-eff-email
```
Certbot edits the nginx config for SSL and sets up auto-renewal. Verify:
```bash
curl -I https://www.nouvelage.clinic/
```

Done — the site is live at **https://www.nouvelage.clinic** 🎉

---

## Updating the site later

```bash
# 1) push new code (rsync from Mac, or git pull on droplet)
cd /var/www/nouvelage
npm install                    # only if dependencies changed
npx ng build --configuration production
pm2 restart nouvelage-upload   # only if upload-server.js changed
systemctl reload nginx         # only if nginx config changed
```

---

## Notes / FAQ

- **Supabase is untouched.** The site talks to it over HTTPS from the browser exactly as
  it does now; the admin login, all content, and data are unchanged. No database migration.
- **Uploads persist** on the droplet disk under `/var/www/nouvelage/public/assets/...`
  and are served by nginx. (Consider `rsync`-ing that folder to a backup periodically, or
  moving to Supabase Storage later, since disk uploads aren't in git.)
- **Production console is silent** (log/info/warn/debug suppressed) — no data leaks in devtools.
- **Dead localhost:5000 calls** (a couple of legacy fallbacks) fail silently and fall back to
  Supabase, exactly as today — nothing to run for them.
- **Backups:** a full pre-deploy repo bundle is on your Mac at
  `../nouvelage-backup-2026-07-14/nouvelage-repo.bundle`.
