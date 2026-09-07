import crypto from 'node:crypto';
import { query, queryOne, limitClause, hydrateJson } from '../db.js';

const JSON_FIELDS = ['items'];

function generateBookingNumber() {
  // Same shape the site has always produced: NV + 8 digits of time + 3 random.
  const timestamp = Date.now().toString().slice(-8);
  const random = crypto.randomInt(0, 1000).toString().padStart(3, '0');
  return `NV${timestamp}${random}`;
}

export async function createBooking(input, ipHash) {
  const id = crypto.randomUUID();
  const bookingNumber = generateBookingNumber();

  const values = {
    id,
    booking_number: bookingNumber,
    name: String(input.name ?? '').trim() || 'Guest',
    email: String(input.email ?? '').trim() || 'no-email@nouvelage.com',
    phone: String(input.phone ?? '').trim(),
    birthday: input.birthday ?? null,
    branch: input.branch ?? null,
    doctor: input.doctor ?? null,
    treatment: input.treatment ?? null,
    message: input.message ?? null,
    source: input.source ?? 'checkout',
    items: input.items ? JSON.stringify(input.items) : null,
    total_amount: input.total_amount ?? null,
    status: 'pending',
    ip_hash: ipHash ?? null,
  };

  await query(
    `INSERT INTO bookings
       (id, booking_number, name, email, phone, birthday, branch, doctor,
        treatment, message, source, items, total_amount, status, ip_hash)
     VALUES
       (:id, :booking_number, :name, :email, :phone, :birthday, :branch, :doctor,
        :treatment, :message, :source, :items, :total_amount, :status, :ip_hash)`,
    values,
  );

  return getBooking(id);
}

export async function getBooking(id) {
  const row = await queryOne('SELECT * FROM bookings WHERE id = :id', { id });
  if (!row) return null;
  hydrateJson([row], JSON_FIELDS);
  return row;
}

export async function getBookingByNumber(bookingNumber) {
  const row = await queryOne(
    'SELECT * FROM bookings WHERE booking_number = :bookingNumber',
    { bookingNumber },
  );
  if (!row) return null;
  hydrateJson([row], JSON_FIELDS);
  return row;
}

export async function listBookings({ status, source, limit } = {}) {
  const where = [];
  const params = {};
  if (status) { where.push('status = :status'); params.status = status; }
  if (source) { where.push('source = :source'); params.source = source; }

  const sql =
    'SELECT * FROM bookings' +
    (where.length ? ` WHERE ${where.join(' AND ')}` : '') +
    ' ORDER BY created_at DESC' +
    limitClause(limit, 0, 1000);

  const rows = await query(sql, params);
  return hydrateJson(rows, JSON_FIELDS);
}

export async function updateBookingStatus(id, status) {
  const result = await query(
    'UPDATE bookings SET status = :status WHERE id = :id',
    { id, status },
  );
  if (!result.affectedRows) return null;
  return getBooking(id);
}

export async function deleteBooking(id) {
  const result = await query('DELETE FROM bookings WHERE id = :id', { id });
  return result.affectedRows > 0;
}

export async function bookingStats() {
  const rows = await query('SELECT status, total_amount FROM bookings');
  const stats = {
    total: rows.length,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
  };
  for (const row of rows) {
    if (Object.hasOwn(stats, row.status)) stats[row.status] += 1;
    if (row.status === 'completed') stats.totalRevenue += Number(row.total_amount) || 0;
  }
  return stats;
}
