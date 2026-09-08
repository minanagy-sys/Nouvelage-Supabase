import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import compression from 'compression';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

/**
 * SSR server for the public site.
 *
 *   - Public routes are rendered server-side per request (fresh database
 *     content, full HTML for crawlers and instant first paint).
 *   - /admin/* is deliberately client-side rendered: the dashboard is behind
 *     a login, gains nothing from SSR, and its browser-heavy code stays out
 *     of the server render path.
 *   - Static assets are served with long cache headers; in production nginx
 *     sits in front and serves them directly, so this path is a fallback.
 *
 * Env: SSR_PORT (default 4200), API_BASE_URL (used by app.config.server.ts).
 */
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');
  const csrIndex = join(browserDistFolder, 'index.csr.html');

  const commonEngine = new CommonEngine({ enablePerformanceProfiler: false });

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);
  server.disable('x-powered-by');

  // Compress text responses. The rendered HTML, the JS bundles and the
  // stylesheet are several hundred KB of highly compressible text; gzip cuts
  // that by roughly 3-4x. Images, fonts (woff2) and video are already
  // compressed, so they are skipped.
  server.use(
    compression({
      threshold: 1024,
      filter: (req, res) => {
        const type = String(res.getHeader('Content-Type') || '');
        if (/^(image|video|audio)\//.test(type) || /font\/|\/zip|\/gzip/.test(type)) {
          return false;
        }
        return compression.filter(req, res);
      },
    }),
  );

  // WebP negotiation. scripts/generate-webp.mjs writes a "<original>.webp"
  // twin next to each JPEG/PNG (~50% smaller); when the browser advertises
  // WebP support and the twin exists, serve that instead. Doing it here rather
  // than in the markup means nothing has to change the paths it stores —
  // templates, seed data and dashboard-written rows all still say photo.jpg.
  //
  // Vary: Accept is mandatory: without it a shared cache could hand a WebP
  // body to a client that cannot decode it.
  const NEGOTIABLE = /\.(?:jpe?g|png)$/i;
  server.get('**', (req, res, next) => {
    if (!NEGOTIABLE.test(req.path)) return next();
    res.setHeader('Vary', 'Accept');
    if (!/\bimage\/webp\b/.test(req.headers.accept || '')) return next();
    const twin = join(browserDistFolder, req.path + '.webp');
    // Confine the lookup to the build output; never follow a path outside it.
    if (!twin.startsWith(browserDistFolder)) return next();
    res.sendFile(twin, { maxAge: '30d' }, (err) => {
      if (err) next();
    });
  });

  // Static files from /browser. Cache lifetime depends on whether the name
  // carries a content hash: a hashed bundle can never change under the same
  // name, so it is immutable, while a plain .html file must be revalidated or
  // content edits would stay invisible behind the cache.
  const HASHED = /-[A-Z0-9]{8,}\.(?:js|css)$/;
  server.get(
    '**',
    express.static(browserDistFolder, {
      index: false,
      fallthrough: true,
      setHeaders: (res, filePath) => {
        if (HASHED.test(filePath)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (/\.(?:woff2?|ttf|eot)$/.test(filePath)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (/\.(?:jpe?g|png|webp|gif|svg|avif|mp4|webm)$/.test(filePath)) {
          res.setHeader('Cache-Control', 'public, max-age=2592000');
        } else if (/\.html$/.test(filePath)) {
          res.setHeader('Cache-Control', 'no-cache');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=3600');
        }
      },
    }),
  );

  // Standalone (non-Angular) pages served at clean URLs without .html.
  const STANDALONE_PAGES: Record<string, string> = {
    '/our-story': 'Nouvelage-Story.html',
    '/company-profile': 'company-profile.html',
  };
  for (const [route, file] of Object.entries(STANDALONE_PAGES)) {
    server.get(route, (req, res) => {
      res.sendFile(join(browserDistFolder, file));
    });
  }

  // Admin area: plain client-side rendering behind the login.
  server.get(['/admin', '/admin/*'], (req, res) => {
    res.sendFile(csrIndex);
  });

  // Everything else renders on the server.
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => {
        // A render failure must never take the page down — fall back to
        // client-side rendering and log the cause.
        console.error(`[ssr] render failed for ${originalUrl}: ${err?.message ?? err}`);
        res.sendFile(csrIndex, (sendError) => {
          if (sendError) next(err);
        });
      });
  });

  return server;
}

function run(): void {
  const port = process.env['SSR_PORT'] || process.env['PORT'] || 4200;

  const server = app();
  server.listen(port, () => {
    console.log(`[ssr] Nouvelage SSR server listening on http://localhost:${port}`);
  });
}

run();
