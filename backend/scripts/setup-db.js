/**
 * Create the configured database (if missing) and apply the base schema,
 * admin schema and seed. Idempotent: everything is IF NOT EXISTS /
 * INSERT IGNORE, so re-running is safe.
 *
 * The schema files deliberately name no database — this script selects the
 * configured DB_NAME before applying anything, so pointing a deployment at
 * a staging database actually lands there.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import { config } from '../src/config.js';

const dbDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../db');

async function main() {
  const connection = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    multipleStatements: true,
  });

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.db.database}\`
       DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
    await connection.query(`USE \`${config.db.database}\``);

    for (const file of ['schema.sql', 'admin-schema.sql', 'seed.sql']) {
      const sql = await fs.readFile(path.join(dbDir, file), 'utf8');
      await connection.query(sql);
      console.log(`[setup-db] applied ${file}`);
    }

    console.log(`[setup-db] done — database '${config.db.database}' is ready`);
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(`[setup-db] failed: ${error.sqlMessage ?? error.message}`);
  process.exit(1);
});
