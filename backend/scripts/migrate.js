/**
 * Apply pending migrations from backend/db/migrations/ in filename order
 * (NNN-name.sql). Applied names are recorded in schema_migrations so each
 * file runs exactly once. The configured database is selected explicitly —
 * migration files never name a database.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import { config } from '../src/config.js';

const migrationsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../db/migrations');

async function main() {
  const connection = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    multipleStatements: true,
  });

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name VARCHAR(200) NOT NULL PRIMARY KEY,
        applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    const [appliedRows] = await connection.query('SELECT name FROM schema_migrations');
    const applied = new Set(appliedRows.map((row) => row.name));

    let files = [];
    try {
      files = (await fs.readdir(migrationsDir)).filter((f) => f.endsWith('.sql')).sort();
    } catch {
      // no migrations directory yet — nothing to do
    }

    let count = 0;
    for (const file of files) {
      if (applied.has(file)) continue;
      const sql = await fs.readFile(path.join(migrationsDir, file), 'utf8');
      await connection.query(sql);
      await connection.query('INSERT INTO schema_migrations (name) VALUES (?)', [file]);
      console.log(`[migrate] applied ${file}`);
      count += 1;
    }

    console.log(count ? `[migrate] done — ${count} migration(s) applied` : '[migrate] nothing to apply');
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(`[migrate] failed: ${error.sqlMessage ?? error.message}`);
  process.exit(1);
});
