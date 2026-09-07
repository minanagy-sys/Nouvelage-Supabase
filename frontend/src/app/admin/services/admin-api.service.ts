import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DemoModeService } from './demo-mode.service';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient,
    private demoModeService: DemoModeService
  ) {}

  // Pages
  getPageContent(page: string): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      const content = this.demoModeService.getDemoPageContent(page);
      return of({ page: content });
    }
    return this.http.get(`${this.apiUrl}/pages/${page}`);
  }

  updatePageContent(page: string, content: any): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      this.demoModeService.updateDemoPageContent(page, content);
      return of({ success: true, message: 'Content updated successfully (demo mode)' });
    }
    return this.http.put(`${this.apiUrl}/pages/${page}`, content);
  }

  // Services
  getServices(cat?: string): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ services: [] });
    }
    if (cat) {
      return this.http.get(`${this.apiUrl}/services`, { params: { cat } });
    }
    return this.http.get(`${this.apiUrl}/services`);
  }

  getService(id: string): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ service: {} });
    }
    return this.http.get(`${this.apiUrl}/services/${id}`);
  }

  createService(service: any): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true, service });
    }
    return this.http.post(`${this.apiUrl}/services`, service);
  }

  updateService(id: string, service: any): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true });
    }
    return this.http.put(`${this.apiUrl}/services/${id}`, service);
  }

  deleteService(id: string): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true });
    }
    return this.http.delete(`${this.apiUrl}/services/${id}`);
  }

  reorderServices(services: any[]): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true });
    }
    return this.http.post(`${this.apiUrl}/services/reorder`, { services });
  }

  // Doctors
  getDoctors(): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ doctors: [] });
    }
    return this.http.get(`${this.apiUrl}/doctors`);
  }

  getDoctor(id: string): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ doctor: {} });
    }
    return this.http.get(`${this.apiUrl}/doctors/${id}`);
  }

  createDoctor(doctor: any): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true, doctor });
    }
    return this.http.post(`${this.apiUrl}/doctors`, doctor);
  }

  updateDoctor(id: string, doctor: any): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true });
    }
    return this.http.put(`${this.apiUrl}/doctors/${id}`, doctor);
  }

  deleteDoctor(id: string): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true });
    }
    return this.http.delete(`${this.apiUrl}/doctors/${id}`);
  }

  reorderDoctors(doctors: any[]): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true });
    }
    return this.http.post(`${this.apiUrl}/doctors/reorder`, { doctors });
  }

  // Bookings
  getBookings(params?: any): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ bookings: [] });
    }
    return this.http.get(`${this.apiUrl}/bookings`, { params });
  }

  getBooking(id: string): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ booking: {} });
    }
    return this.http.get(`${this.apiUrl}/bookings/${id}`);
  }

  updateBookingStatus(id: string, status: string): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true });
    }
    return this.http.patch(`${this.apiUrl}/bookings/${id}/status`, { booking_status: status });
  }

  updatePaymentStatus(id: string, status: string, transactionId?: string): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true });
    }
    return this.http.patch(`${this.apiUrl}/bookings/${id}/payment`, {
      payment_status: status,
      payment_transaction_id: transactionId
    });
  }

  deleteBooking(id: string): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true });
    }
    return this.http.delete(`${this.apiUrl}/bookings/${id}`);
  }

  getBookingStats(): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({
        stats: {
          total: 0,
          pending: 0,
          confirmed: 0,
          completed: 0,
          totalRevenue: 0
        }
      });
    }
    return this.http.get(`${this.apiUrl}/bookings/stats/dashboard`);
  }

  // Media
  getMedia(params?: any): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ media: [] });
    }
    return this.http.get(`${this.apiUrl}/media`, { params });
  }

  uploadMedia(formData: FormData): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true, media: {} });
    }
    return this.http.post(`${this.apiUrl}/media/upload-supabase`, formData);
  }

  deleteMedia(id: string): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true });
    }
    return this.http.delete(`${this.apiUrl}/media/${id}`);
  }

  updateMedia(id: string, data: any): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true });
    }
    return this.http.patch(`${this.apiUrl}/media/${id}`, data);
  }
}
