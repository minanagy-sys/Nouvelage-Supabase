import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import { contentRouter } from './routes/content.js';
import { leadsRouter } from './routes/leads.js';
import { adminAuthRouter } from './routes/admin/auth.js';
import { adminContentRouter } from './routes/admin/content.js';
import { adminBookingsRouter } from './routes/admin/bookings.js';
import { adminMediaRouter } from './routes/admin/media.js';
import { requireAdmin } from './middleware/auth.js';

export const app = express();

// Behind nginx: without this, rate limiting keys every request to the
// proxy's IP and req.ip is useless for the lead ip hashes.
app.set('trust proxy', 1);
app.disable('x-powered-by');

// Middleware stack, in order.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression());
app.use(cors({
  // A disallowed origin gets NO CORS headers rather than an exception —
  // the browser blocks it either way, and throwing turns a policy decision
  // into a 500 for everything behind a proxy.
  origin: (origin, callback) => {
    if (!origin || config.corsOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
}));
app.use(express.json({ limit: '64kb' }));
app.use(rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
}));

// Health on both paths: only /api/* is proxied by nginx, but direct checks
// hit /health. The build id identifies the running deployment.
const health = (req, res) => res.json({ status: 'ok', build: config.buildId });
app.get('/health', health);
app.get('/api/health', health);

// Serve uploaded media directly as a dev fallback; nginx handles this in
// production with proper cache headers.
app.use('/assets/img', express.static(config.uploadsDir, {
  fallthrough: true,
  immutable: false,
  maxAge: '7d',
}));

// Public API
app.use('/api/content', contentRouter);
app.use('/api', leadsRouter);

// Admin API — everything behind JWT except login itself (inside auth router).
app.use('/api/admin/auth', adminAuthRouter);
app.use('/api/admin/bookings', requireAdmin, adminBookingsRouter);
app.use('/api/admin/media', requireAdmin, adminMediaRouter);
app.use('/api/admin', requireAdmin, adminContentRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Central error translation: editor mistakes become 4xx with a usable
// message; everything else is a logged 500 with no internals leaked.
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);

  // Duplicate key — an editor mistake, not a server fault. Quote the
  // offending value verbatim; on a composite key it reads "1-hair-restoration"
  // and guessing which half was typed is worse than showing both.
  if (error.code === 'ER_DUP_ENTRY') {
    const match = /Duplicate entry '(.*)' for key/.exec(error.sqlMessage ?? '');
    const value = match ? match[1] : 'value';
    return res.status(409).json({ error: `'${value}' already exists — pick a different value` });
  }

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large — the limit is 15 MB' });
  }

  if (error.status && error.status < 500) {
    return res.status(error.status).json({ error: error.message });
  }

  if (error.type === 'entity.parse.failed' || error.type === 'entity.too.large') {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  // mysql2 errors as ONE line — code, errno, sqlMessage, truncated SQL —
  // not the whole object, which scrolls the message out of docker logs.
  if (error.sqlMessage) {
    console.error(`[api] ${error.code} (${error.errno}): ${error.sqlMessage} — ${String(error.sql ?? '').slice(0, 200)}`);
  } else {
    console.error(`[api] ${error.stack ?? error}`);
  }
  return res.status(500).json({ error: 'Internal server error' });
});
