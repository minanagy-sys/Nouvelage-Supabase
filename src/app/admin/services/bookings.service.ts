import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SupabaseService } from '../../shared/services/supabase.service';
import { Booking } from '../../shared/models/supabase.types';

// Re-export Booking for convenience
export type { Booking } from '../../shared/models/supabase.types';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private tableName = 'bookings';

  constructor(private supabase: SupabaseService) {}

  /**
   * Create a new booking
   */
  createBooking(bookingInput: any): Observable<Booking> {
    // Generate booking number
    const bookingNumber = this.generateConfirmationNumber();

    // Map frontend fields to database columns
    const bookingData: any = {
      booking_number: bookingNumber,
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
      total_amount: bookingInput.total_amount || null,
      status: bookingInput.booking_status || bookingInput.status || 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return from(
      (this.supabase.getClient()
        .from('bookings') as any)
        .insert([bookingData])
        .select()
        .single()
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        return response.data as Booking;
      }),
      catchError(error => {
        console.error('Error creating booking:', error);
        throw error;
      })
    );
  }

  /**
   * Update booking status
   */
  updateBookingStatus(bookingId: string, newStatus: string): Observable<Booking> {
    return from(
      (this.supabase.getClient()
        .from('bookings') as any)
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select()
        .single()
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        return response.data as Booking;
      }),
      catchError(error => {
        console.error('Error updating booking status:', error);
        throw error;
      })
    );
  }

  /**
   * Get all bookings with optional filters
   */
  getAllBookings(filters?: {
    status?: string;
    source?: string;
    limit?: number;
  }): Observable<Booking[]> {
    let query = (this.supabase.getClient()
      .from('bookings') as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.source) {
      query = query.eq('source', filters.source);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    return from(query).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        return (response.data || []) as Booking[];
      }),
      catchError(error => {
        console.error('Error fetching bookings:', error);
        return of([]);
      })
    );
  }

  /**
   * Get a single booking by ID
   */
  getBookingById(id: string): Observable<Booking | null> {
    return from(
      (this.supabase.getClient()
        .from('bookings') as any)
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        return response.data as Booking;
      }),
      catchError(error => {
        console.error('Error fetching booking:', error);
        return of(null);
      })
    );
  }

  /**
   * Get booking by booking number
   */
  getBookingByConfirmation(bookingNumber: string): Observable<Booking | null> {
    return from(
      (this.supabase.getClient()
        .from('bookings') as any)
        .select('*')
        .eq('booking_number', bookingNumber)
        .single()
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        return response.data as Booking;
      }),
      catchError(error => {
        console.error('Error fetching booking by booking number:', error);
        return of(null);
      })
    );
  }

  /**
   * Get booking statistics
   */
  getBookingStats(): Observable<{
    total: number;
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    totalRevenue: number;
  }> {
    return from(
      (this.supabase.getClient()
        .from('bookings') as any)
        .select('status, total_amount')
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;

        const bookings = response.data || [];
        const stats = {
          total: bookings.length,
          pending: bookings.filter((b: any) => b.status === 'pending').length,
          confirmed: bookings.filter((b: any) => b.status === 'confirmed').length,
          completed: bookings.filter((b: any) => b.status === 'completed').length,
          cancelled: bookings.filter((b: any) => b.status === 'cancelled').length,
          totalRevenue: bookings
            .filter((b: any) => b.status === 'completed')
            .reduce((sum: number, b: any) => sum + (b.total_amount || 0), 0)
        };

        return stats;
      }),
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

  /**
   * Delete a booking
   */
  deleteBooking(id: string): Observable<boolean> {
    return from(
      (this.supabase.getClient()
        .from('bookings') as any)
        .delete()
        .eq('id', id)
    ).pipe(
      map((response: any) => {
        if (response.error) throw response.error;
        return true;
      }),
      catchError(error => {
        console.error('Error deleting booking:', error);
        return of(false);
      })
    );
  }

  /**
   * Generate a unique confirmation number
   */
  private generateConfirmationNumber(): string {
    const prefix = 'NV';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }

}
