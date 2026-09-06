#!/usr/bin/env bash
# ============================================================
# Nouvelage droplet setup — run ONCE on the droplet after the
# project files are in /var/www/nouvelage.
# Additive & idempotent: safe to re-run; removes nothing.
#   Usage:  bash /var/www/nouvelage/setup.sh
# ============================================================
set -e
APP=/var/www/nouvelage
DOMAIN=nouvelage.clinic

echo "==> [1/6] Installing packages (only what's missing)…"
export DEBIAN_FRONTEND=noninteractive
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
apt-get install -y nginx git rsync certbot python3-certbot-nginx >/dev/null 2>&1 || \
  apt-get install -y nginx git rsync certbot python3-certbot-nginx
command -v pm2 >/dev/null 2>&1 || npm install -g pm2

echo "==> [2/6] Ensuring swap (helps the build on small droplets)…"
if [ ! -f /swapfile ] && [ "$(free -m | awk '/Mem:/{print $2}')" -lt 2048 ]; then
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

echo "==> [3/6] Installing upload-server dependencies…"
cd "$APP"
npm install
# Build only if a prebuilt dist was NOT shipped from the dev machine
if [ -f "$APP/dist/nouvelage-angular/browser/index.html" ]; then
  echo "    Prebuilt dist found — skipping on-droplet build (protects the live site)."
else
  echo "    No prebuilt dist — building on the droplet…"
  npx ng build --configuration production
fi

echo "==> [4/6] Starting upload server with PM2…"
pm2 delete nouvelage-upload >/dev/null 2>&1 || true
pm2 start upload-server.js --name nouvelage-upload
pm2 save
pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true
pm2 save

echo "==> [5/6] Writing nginx site…"
cat > /etc/nginx/sites-available/${DOMAIN} <<NGINX
# Team page social preview: crawlers get the static OG snapshot, humans get the
# app. A map (no "if") picks the file, so try_files stays safe.
map \$http_user_agent \$nv_team_file {
    default /index.html;
    "~*(facebookexternalhit|Facebot|Twitterbot|WhatsApp|LinkedInBot|Slackbot|TelegramBot|Discordbot|Pinterest|redditbot|Applebot|Embedly|vkShare)" /og/team.html;
}

server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};
    client_max_body_size 50M;

    root ${APP}/dist/nouvelage-angular/browser;
    index index.html;

    # ---- Performance: compress text assets over the wire ----
    gzip on;
    gzip_comp_level 6;
    gzip_min_length 1024;
    gzip_vary on;
    gzip_proxied any;
    gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss image/svg+xml application/wasm font/woff font/woff2;

    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # ---- Clean URLs for the standalone pages (hide the .html) ----
    location = /company-profile { try_files /company-profile.html =404; }
    location = /our-story       { try_files /Nouvelage-Story.html =404; }

    # ---- Team page: crawler -> OG snapshot, human -> app (map, no "if") ----
    location = /team { try_files \$nv_team_file =404; }

    location /assets/ {
        root ${APP}/public;
        try_files \$uri @built_assets;
        expires 7d;
        access_log off;
    }
    location @built_assets {
        root ${APP}/dist/nouvelage-angular/browser;
    }

    # ---- Long cache for fingerprinted build assets (safe: filenames are hashed) ----
    location ~* \.(?:js|css|woff2?|ttf|eot)\$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "no-cache";
    }
}
NGINX
ln -sf /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/${DOMAIN}
nginx -t && systemctl reload nginx
ufw status 2>/dev/null | grep -q active && ufw allow 'Nginx Full' || true

echo "==> [6/6] Health check…"
sleep 1
curl -s http://127.0.0.1:3001/api/health || true
echo
echo "============================================================"
echo " DONE. Test now:  http://$(curl -s ifconfig.me 2>/dev/null)/"
echo
echo " Next:"
echo "  1) Point DNS  A @ and A www  ->  this droplet's IP"
echo "  2) After DNS resolves, enable HTTPS:"
echo "     certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --redirect \\"
echo "       --agree-tos -m mina.nagy@mwg.co.com --no-eff-email"
echo "============================================================"
