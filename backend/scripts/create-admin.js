/**
 * Create (or update the password of) an admin account.
 *
 * Credentials come from the environment, NEVER from argv — argv lands in
 * shell history and `ps` output:
 *
 *   ADMIN_EMAIL=admin@nouvelage.clinic ADMIN_PASSWORD='...' ADMIN_NAME='Nouvelage Admin' \
 *     node scripts/create-admin.js
 */
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import { config } from '../src/config.js';

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? '';
  const name = (process.env.ADMIN_NAME ?? 'Nouvelage Admin').trim();

  if (!email || !email.includes('@')) {
    console.error('[create-admin] set ADMIN_EMAIL to a valid email address');
    process.exit(1);
  }
  if (password.length < 10) {
    console.error('[create-admin] set ADMIN_PASSWORD (min 10 characters) in the environment — not on the command line');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const connection = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
  });

  try {
    const [result] = await connection.execute(
      `INSERT INTO admin_users (id, email, password_hash, name, role, is_active)
       VALUES (?, ?, ?, ?, 'admin', 1)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), name = VALUES(name), is_active = 1`,
      [crypto.randomUUID(), email, passwordHash, name],
    );
    const action = result.affectedRows === 1 ? 'created' : 'updated';
    console.log(`[create-admin] ${action} admin account for ${email}`);
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(`[create-admin] failed: ${error.sqlMessage ?? error.message}`);
  process.exit(1);
});
