/**
 * List the admin accounts that can sign in to the dashboard.
 *
 * A failed login returns a deliberately vague "Invalid email or password"
 * (the API must not confirm which addresses exist), so when a login is
 * rejected there is otherwise no way to tell a typo in the email from a
 * wrong password. This prints the accounts that actually exist:
 *
 *   npm run list-admins
 *
 * Passwords are hashed and cannot be recovered — to set a new one, re-run
 * create-admin.js with the same ADMIN_EMAIL and it updates that account.
 */
import mysql from 'mysql2/promise';
import { config } from '../src/config.js';

async function main() {
  const connection = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
  });

  try {
    const [rows] = await connection.query(
      `SELECT email, name, role, is_active AS active, last_login_at AS lastLogin
         FROM admin_users ORDER BY email`,
    );

    if (rows.length === 0) {
      console.log('[list-admins] no admin accounts exist yet. Create one with:');
      console.log("  ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='min-10-chars' npm run create-admin");
      return;
    }

    console.log(`[list-admins] ${rows.length} account(s) in ${config.db.database}:\n`);
    for (const r of rows) {
      const when = r.lastLogin ? new Date(r.lastLogin).toISOString().slice(0, 16).replace('T', ' ') : 'never';
      console.log(`  ${r.email}`);
      console.log(`      name: ${r.name}   role: ${r.role}`
        + `   ${r.active ? 'active' : 'DISABLED — cannot sign in'}   last login: ${when}`);
    }
    console.log('\n  Sign in with the address exactly as printed above.');
    console.log('  Forgotten the password? Re-run create-admin with that same');
    console.log('  ADMIN_EMAIL and it replaces the password on that account.');
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(`[list-admins] failed: ${error.sqlMessage ?? error.message}`);
  process.exit(1);
});
