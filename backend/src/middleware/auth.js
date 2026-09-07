import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { queryOne } from '../db.js';

/**
 * Admin JWT guard. The user is re-read from the database on every request
 * rather than trusted from the token payload, so deactivating an account
 * takes effect immediately instead of when the token expires.
 */
export async function requireAdmin(req, res, next) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  let payload;
  try {
    payload = jwt.verify(token, config.admin.jwtSecret);
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  try {
    const user = await queryOne(
      'SELECT id, email, name, role, is_active AS isActive FROM admin_users WHERE id = :id',
      { id: payload.sub },
    );
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Account is no longer active' });
    }
    req.adminUser = { id: user.id, email: user.email, name: user.name, role: user.role };
    return next();
  } catch (error) {
    return next(error);
  }
}

export function signAdminToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    config.admin.jwtSecret,
    { expiresIn: config.admin.jwtExpires },
  );
}
