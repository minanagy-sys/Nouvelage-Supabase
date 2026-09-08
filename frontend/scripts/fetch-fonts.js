// Download the three Google Font families the site actually uses and emit
// self-hosted @font-face CSS, so no render-blocking third-party request sits
// on the critical path.
const fs = require('fs');
const path = require('path');
const https = require('https');

const OUT_DIR = '/home/user/Nouvelage-Supabase/frontend/src/assets/fonts';
const CHROME_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
// Exactly the families/weights index.html requested — same rendering, self-hosted.
const CSS_URL = 'https://fonts.googleapis.com/css2'
  + '?family=Italiana'
  + '&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400'
  + '&family=Manrope:wght@300;400;500;600;700'
  + '&display=swap';
const KEEP_SUBSETS = ['latin', 'latin-ext'];

function get(url, opts = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': CHROME_UA, ...(opts.headers || {}) } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return get(res.headers.location, opts).then(resolve, reject);
      }
      if (res.statusCode !== 200) return reject(new Error(url + ' -> ' + res.statusCode));
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const css = (await get(CSS_URL)).toString();

  // Google's CSS is "/* subset */ @font-face{...}" repeated. Split keeping the label.
  const parts = css.split(/\/\*\s*([a-z0-9-\[\]]+)\s*\*\//i).slice(1);
  const out = ['/* Self-hosted webfonts (was fonts.googleapis.com — a render-blocking',
               '   third-party request on every page). Same families, weights and',
               '   font-display:swap as before; regenerate with scripts/fetch-fonts.js. */'];
  let kept = 0, skipped = 0, bytes = 0;

  for (let i = 0; i < parts.length; i += 2) {
    const subset = parts[i];
    let block = parts[i + 1];
    if (!block || !/@font-face/.test(block)) continue;
    if (!KEEP_SUBSETS.includes(subset)) { skipped++; continue; }

    const urlMatch = block.match(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/);
    if (!urlMatch) continue;
    const remote = urlMatch[1];
    const family = (block.match(/font-family:\s*'([^']+)'/) || [])[1].replace(/\s+/g, '');
    const weight = (block.match(/font-weight:\s*(\d+)/) || [])[1] || '400';
    const style = /font-style:\s*italic/.test(block) ? 'italic' : 'normal';
    const name = `${family}-${weight}${style === 'italic' ? 'i' : ''}-${subset}.woff2`;

    const buf = await get(remote);
    fs.writeFileSync(path.join(OUT_DIR, name), buf);
    bytes += buf.length;
    kept++;

    block = block.replace(/url\(https:\/\/fonts\.gstatic\.com\/[^)]+\)/, `url('/assets/fonts/${name}')`);
    out.push(`/* ${subset} */` + block.trim());
  }

  fs.writeFileSync('/tmp/claude-0/fonts.css', out.join('\n') + '\n');
  console.log(`kept ${kept} faces (${(bytes / 1024).toFixed(0)}KB), skipped ${skipped} non-latin subsets`);
  console.log('files:', fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.woff2')).length);
})();
