import { Router } from 'express';
import * as bookings from '../../repositories/bookings.js';
import { logActivity } from '../../repositories/activity.js';

const STATUSES = new Set(['pending', 'confirmed', 'completed', 'cancelled']);

export const adminBookingsRouter = Router();

adminBookingsRouter.get('/', async (req, res, next) => {
  try {
    const { status, source, limit } = req.query;
    res.json({ bookings: await bookings.listBookings({ status, source, limit }) });
  } catch (error) { next(error); }
});

adminBookingsRouter.get('/stats', async (req, res, next) => {
  try { res.json({ stats: await bookings.bookingStats() }); } catch (error) { next(error); }
});

adminBookingsRouter.get('/:id', async (req, res, next) => {
  try {
    const booking = await bookings.getBooking(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ booking });
  } catch (error) { next(error); }
});

adminBookingsRouter.patch('/:id/status', async (req, res, next) => {
  try {
    const status = String(req.body?.status ?? '');
    if (!STATUSES.has(status)) {
      return res.status(400).json({ error: `status must be one of: ${[...STATUSES].join(', ')}` });
    }
    const booking = await bookings.updateBookingStatus(req.params.id, status);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    await logActivity(req.adminUser.id, 'status-change', 'bookings', req.params.id, { status });
    res.json({ booking });
  } catch (error) { next(error); }
});

adminBookingsRouter.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await bookings.deleteBooking(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Booking not found' });
    await logActivity(req.adminUser.id, 'delete', 'bookings', req.params.id);
    res.json({ success: true });
  } catch (error) { next(error); }
});
