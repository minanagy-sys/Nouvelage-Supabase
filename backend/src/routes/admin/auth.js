import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import { query, queryOne } from '../../db.js';
import { requireAdmin, signAdminToken } from '../../middleware/auth.js';
import { logActivity } from '../../repositories/activity.js';

export const adminAuthRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts — try again later' },
});

const publicUser = (user) => ({ id: user.id, email: user.email, name: user.name, role: user.role });

adminAuthRouter.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const email = String(req.body?.email ?? '').trim().toLowerCase();
    const password = String(req.body?.password ?? '');
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await queryOne(
      `SELECT id, email, password_hash AS passwordHash, name, role, is_active AS isActive
         FROM admin_users WHERE email = :email`,
      { email },
    );

    // Compare against a constant dummy hash when the user is unknown so the
    // response time does not reveal which emails exist.
    const hash = user?.passwordHash
      ?? '$2a$12$C6UzMDM.H6dfI/f/IKcEeO7ZBlPzq0yn0F3Y1yGqmYQ3aP3EWm0P2';
    const valid = await bcrypt.compare(password, hash);

    if (!user || !valid || !user.isActive) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    await query('UPDATE admin_users SET last_login_at = NOW() WHERE id = :id', { id: user.id });
    await logActivity(user.id, 'login', 'admin_users', user.id);

    res.json({ token: signAdminToken(user), user: publicUser(user) });
  } catch (error) { next(error); }
});

adminAuthRouter.get('/me', requireAdmin, (req, res) => {
  res.json({ user: req.adminUser });
});

adminAuthRouter.post('/change-password', requireAdmin, async (req, res, next) => {
  try {
    const currentPassword = String(req.body?.currentPassword ?? '');
    const newPassword = String(req.body?.newPassword ?? '');
    if (newPassword.length < 10) {
      return res.status(400).json({ error: 'New password must be at least 10 characters' });
    }

    const user = await queryOne(
      'SELECT password_hash AS passwordHash FROM admin_users WHERE id = :id',
      { id: req.adminUser.id },
    );
    const valid = await bcrypt.compare(currentPassword, user?.passwordHash ?? '');
    if (!valid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await query(
      'UPDATE admin_users SET password_hash = :passwordHash WHERE id = :id',
      { passwordHash, id: req.adminUser.id },
    );
    await logActivity(req.adminUser.id, 'change-password', 'admin_users', req.adminUser.id);

    res.json({ success: true });
  } catch (error) { next(error); }
});
