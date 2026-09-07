import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
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

  // Static files from /browser (hashed bundles are immutable).
  server.get(
    '**',
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: false,
      fallthrough: true,
    }),
  );

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
