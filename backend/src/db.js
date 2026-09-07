import mysql from 'mysql2/promise';
import { config } from './config.js';

export const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
  decimalNumbers: true,
  charset: 'utf8mb4_unicode_ci',
  timezone: 'Z',
  enableKeepAlive: true,
});

// mysql2 emits 'error' on the pool when an idle connection dies outside any
// query. With no listener that is an uncaught exception and the process
// exits — a database blip must not take the whole API down.
pool.on('error', (error) => {
  console.error(`[api] pool connection error (${error.code ?? 'unknown'}) — pool will recover`);
});

export async function query(sql, params = {}) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

export async function queryOne(sql, params = {}) {
  const rows = await query(sql, params);
  return rows[0] ?? null;
}

export async function execute(sql, params = {}) {
  const [result] = await pool.execute(sql, params);
  return result;
}

/**
 * Never bind LIMIT/OFFSET as parameters: mysql2's binary protocol sends every
 * JS number as DOUBLE, which MySQL rejects for LIMIT with ER_WRONG_ARGUMENTS
 * (MariaDB coerces it silently, so the bug only appears in production).
 * Build the clause from parsed, clamped integers instead.
 */
export function limitClause(limit, offset = 0, max = 500) {
  const safeLimit = Math.min(Math.max(Number.parseInt(limit, 10) || 0, 0), max);
  const safeOffset = Math.max(Number.parseInt(offset, 10) || 0, 0);
  if (!safeLimit) return '';
  return safeOffset ? ` LIMIT ${safeLimit} OFFSET ${safeOffset}` : ` LIMIT ${safeLimit}`;
}

/**
 * Parse JSON columns that may come back as strings. MySQL returns native JSON,
 * but MariaDB aliases JSON to LONGTEXT and the driver returns a string —
 * Angular's @for then iterates the string one character at a time. Callers
 * name the fields explicitly so a text column that merely looks like JSON is
 * never converted by accident.
 */
export function hydrateJson(rows, fields) {
  for (const row of rows) {
    for (const field of fields) {
      const value = row[field];
      if (typeof value === 'string') {
        try {
          row[field] = JSON.parse(value);
        } catch {
          // leave the raw string — better visible than silently null
        }
      }
    }
  }
  return rows;
}
