import crypto from 'node:crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { config } from '../config.js';
import { query } from '../db.js';
import { createBooking } from '../repositories/bookings.js';

// Public write endpoints: bookings (appointment requests + checkout orders)
// and the contact form. Submitter IPs are stored only as salted SHA-256
// hashes — enough to spot abuse, never the raw address.
export const leadsRouter = Router();

const submitLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

function hashIp(req) {
  const ip = req.ip ?? '';
  if (!ip) return null;
  return crypto.createHash('sha256').update(`${config.ipHashSalt}:${ip}`).digest('hex');
}

const MAX = { short: 300, long: 5000 };
const clip = (value, max) =>
  value === null || value === undefined ? null : String(value).slice(0, max);

leadsRouter.post('/bookings', submitLimiter, async (req, res, next) => {
  try {
    const body = req.body ?? {};
    if (!clip(body.phone, MAX.short) && !clip(body.email, MAX.short)) {
      return res.status(400).json({ error: 'A phone number or email is required' });
    }

    const booking = await createBooking(
      {
        name: clip(body.name, MAX.short),
        email: clip(body.email, MAX.short),
        phone: clip(body.phone, MAX.short),
        birthday: clip(body.birthday, MAX.short),
        branch: clip(body.branch, MAX.short),
        doctor: clip(body.doctor, MAX.short),
        treatment: clip(body.treatment, MAX.short),
        message: clip(body.message, MAX.long),
        source: clip(body.source, 50) ?? 'checkout',
        items: Array.isArray(body.items) ? body.items : null,
        total_amount: Number.isFinite(Number(body.total_amount)) ? Number(body.total_amount) : null,
      },
      hashIp(req),
    );

    res.status(201).json({ booking });
  } catch (error) { next(error); }
});

leadsRouter.post('/contact', submitLimiter, async (req, res, next) => {
  try {
    const body = req.body ?? {};
    const name = clip(body.name, MAX.short);
    const email = clip(body.email, MAX.short);
    const message = clip(body.message, MAX.long);
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email and message are required' });
    }

    await query(
      `INSERT INTO contact_submissions
         (id, name, email, phone, subject, message, preferred_branch, preferred_service, status, ip_hash)
       VALUES
         (:id, :name, :email, :phone, :subject, :message, :preferred_branch, :preferred_service, 'new', :ip_hash)`,
      {
        id: crypto.randomUUID(),
        name,
        email,
        phone: clip(body.phone, MAX.short),
        subject: clip(body.subject, MAX.short),
        message,
        preferred_branch: clip(body.preferred_branch, MAX.short),
        preferred_service: clip(body.preferred_service, MAX.short),
        ip_hash: hashIp(req),
      },
    );

    res.status(201).json({ success: true });
  } catch (error) { next(error); }
});
