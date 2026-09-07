import 'dotenv/config';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const env = process.env;
const isProduction = env.NODE_ENV === 'production';

function required(name) {
  const value = env[name];
  if (!value || !value.trim()) {
    console.error(`[api] FATAL: ${name} must be set${isProduction ? ' in production' : ''} — refusing to start`);
    process.exit(1);
  }
  return value.trim();
}

// ADMIN_JWT_SECRET is non-negotiable in production. In development a random
// per-process secret keeps things working while making it impossible to ship
// a default secret by accident (every restart invalidates old tokens).
const jwtSecret = isProduction
  ? required('ADMIN_JWT_SECRET')
  : (env.ADMIN_JWT_SECRET?.trim() || crypto.randomBytes(48).toString('hex'));

const ipHashSalt = isProduction
  ? required('IP_HASH_SALT')
  : (env.IP_HASH_SALT?.trim() || 'dev-only-salt');

export const config = {
  isProduction,
  port: Number.parseInt(env.PORT ?? '4000', 10),
  buildId: env.BUILD_ID ?? 'dev',

  db: {
    host: env.DB_HOST ?? '127.0.0.1',
    port: Number.parseInt(env.DB_PORT ?? '3306', 10),
    user: env.DB_USER ?? 'nouvelage',
    password: isProduction ? required('DB_PASSWORD') : (env.DB_PASSWORD ?? ''),
    database: env.DB_NAME ?? 'nouvelage',
  },

  admin: {
    jwtSecret,
    jwtExpires: env.ADMIN_JWT_EXPIRES ?? '12h',
  },

  ipHashSalt,

  corsOrigins: (env.CORS_ORIGINS ?? 'http://localhost:4200')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),

  uploadsDir: path.resolve(rootDir, env.UPLOADS_DIR ?? '../frontend/public/assets/img'),
};
