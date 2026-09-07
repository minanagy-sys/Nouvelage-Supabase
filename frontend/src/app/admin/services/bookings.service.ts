import { Injectable, inject } from '@angular/core';
import { API_BASE } from '../../shared/api-base';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Booking } from '../../shared/models/content.types';

// Re-export Booking for convenience
export type { Booking } from '../../shared/models/content.types';

/**
 * Bookings — appointment requests and checkout orders.
 * Creation goes through the public API endpoint (the server generates the
 * NV booking number); everything else is admin-only.
 */
@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private apiUrl = inject(API_BASE);

  constructor(private http: HttpClient) {}

  /** Create a new booking (public — used by every lead form and checkout). */
  createBooking(bookingInput: any): Observable<Booking> {
    // Map frontend fields to API fields — same normalization as before.
    const bookingData = {
      name: `${bookingInput.first_name || ''} ${bookingInput.last_name || ''}`.trim() || bookingInput.name || 'Guest',
      email: bookingInput.email || 'no-email@nouvelage.com',
      phone: bookingInput.phone,
      birthday: bookingInput.birthdate || bookingInput.birthday || null,
      branch: bookingInput.preferred_branch || bookingInput.branch || null,
      doctor: bookingInput.preferred_doctor || bookingInput.doctor || null,
      treatment: bookingInput.service_requested || bookingInput.treatment_interested || bookingInput.treatment || null,
      message: bookingInput.message || bookingInput.notes || null,
      source: bookingInput.source || 'checkout',
      items: bookingInput.items || null,
      total_amount: bookingInput.total_amount || null
    };

    return this.http.post<{ booking: Booking }>(`${this.apiUrl}/bookings`, bookingData).pipe(
      map(response => response.booking),
      catchError(error => {
        console.error('Error creating booking:', error);
        throw error;
      })
    );
  }

  /** Update booking status (admin). */
  updateBookingStatus(bookingId: string, newStatus: string): Observable<Booking> {
    return this.http.patch<{ booking: Booking }>(
      `${this.apiUrl}/admin/bookings/${bookingId}/status`,
      { status: newStatus }
    ).pipe(
      map(response => response.booking),
      catchError(error => {
        console.error('Error updating booking status:', error);
        throw error;
      })
    );
  }

  /** Get all bookings with optional filters (admin). */
  getAllBookings(filters?: {
    status?: string;
    source?: string;
    limit?: number;
  }): Observable<Booking[]> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.source) params = params.set('source', filters.source);
    if (filters?.limit) params = params.set('limit', filters.limit);

    return this.http.get<{ bookings: Booking[] }>(`${this.apiUrl}/admin/bookings`, { params }).pipe(
      map(response => response.bookings || []),
      catchError(error => {
        console.error('Error fetching bookings:', error);
        return of([]);
      })
    );
  }

  /** Get a single booking by ID (admin). */
  getBookingById(id: string): Observable<Booking | null> {
    return this.http.get<{ booking: Booking }>(`${this.apiUrl}/admin/bookings/${id}`).pipe(
      map(response => response.booking ?? null),
      catchError(error => {
        console.error('Error fetching booking:', error);
        return of(null);
      })
    );
  }

  /** Get booking statistics (admin). */
  getBookingStats(): Observable<{
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    totalRevenue: number;
  }> {
    return this.http.get<{ stats: any }>(`${this.apiUrl}/admin/bookings/stats`).pipe(
      map(response => response.stats),
      catchError(error => {
        console.error('Error fetching booking stats:', error);
        return of({
          total: 0,
          pending: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0,
          totalRevenue: 0
        });
      })
    );
  }

  /** Delete a booking (admin). */
  deleteBooking(id: string): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/admin/bookings/${id}`).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error deleting booking:', error);
        return of(false);
      })
    );
  }
}
