import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DemoModeService } from './demo-mode.service';

/**
 * Thin HTTP facade over the Nouvelage admin API for the dashboard's
 * endpoint-style calls. Demo mode short-circuits everything to local data.
 */
@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  private apiUrl = environment.apiUrl;

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
    return this.http.get<{ content: any }>(`${this.apiUrl}/admin/pages/${page}`)
      .pipe(map(response => ({ page: response.content })));
  }

  updatePageContent(page: string, content: any): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      this.demoModeService.updateDemoPageContent(page, content);
      return of({ success: true, message: 'Content updated successfully (demo mode)' });
    }
    return this.http.put(`${this.apiUrl}/admin/pages/${page}`, { content });
  }

  // Services
  getServices(cat?: string): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ services: [] });
    }
    return this.http.get<{ rows: any[] }>(`${this.apiUrl}/admin/services`).pipe(
      map(response => ({
        services: cat ? (response.rows || []).filter(s => s.category === cat) : (response.rows || [])
      }))
    );
  }

  getService(id: string): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ service: {} });
    }
    return this.http.get<{ row: any }>(`${this.apiUrl}/admin/services/${id}`)
      .pipe(map(response => ({ service: response.row })));
  }

  createService(service: any): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true, service });
    }
    return this.http.post(`${this.apiUrl}/admin/services`, service);
  }

  updateService(id: string, service: any): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true });
    }
    return this.http.put(`${this.apiUrl}/admin/services/${id}`, service);
  }

  deleteService(id: string): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true });
    }
    return this.http.delete(`${this.apiUrl}/admin/services/${id}`);
  }

  reorderServices(services: any[]): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true });
    }
    return this.http.post(`${this.apiUrl}/admin/services/reorder`, {
      ids: services.map(service => service.id)
    });
  }

  // Doctors
  getDoctors(): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ doctors: [] });
    }
    return this.http.get<{ rows: any[] }>(`${this.apiUrl}/admin/doctors`)
      .pipe(map(response => ({ doctors: response.rows || [] })));
  }

  getDoctor(id: string): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ doctor: {} });
    }
    return this.http.get<{ row: any }>(`${this.apiUrl}/admin/doctors/${id}`)
      .pipe(map(response => ({ doctor: response.row })));
  }

  createDoctor(doctor: any): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true, doctor });
    }
    return this.http.post(`${this.apiUrl}/admin/doctors`, doctor);
  }

  updateDoctor(id: string, doctor: any): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true });
    }
    return this.http.put(`${this.apiUrl}/admin/doctors/${id}`, doctor);
  }

  deleteDoctor(id: string): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true });
    }
    return this.http.delete(`${this.apiUrl}/admin/doctors/${id}`);
  }

  reorderDoctors(doctors: any[]): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true });
    }
    return this.http.post(`${this.apiUrl}/admin/doctors/reorder`, {
      ids: doctors.map(doctor => doctor.id)
    });
  }

  // Bookings
  getBookings(params?: any): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ bookings: [] });
    }
    return this.http.get(`${this.apiUrl}/admin/bookings`, { params });
  }

  getBooking(id: string): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ booking: {} });
    }
    return this.http.get(`${this.apiUrl}/admin/bookings/${id}`);
  }

  updateBookingStatus(id: string, status: string): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true });
    }
    return this.http.patch(`${this.apiUrl}/admin/bookings/${id}/status`, { status });
  }

  deleteBooking(id: string): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true });
    }
    return this.http.delete(`${this.apiUrl}/admin/bookings/${id}`);
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
    return this.http.get(`${this.apiUrl}/admin/bookings/stats`);
  }

  // Media
  getMedia(params?: any): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ media: [] });
    }
    return this.http.get<{ rows: any[] }>(`${this.apiUrl}/admin/media`, { params })
      .pipe(map(response => ({ media: response.rows || [] })));
  }

  uploadMedia(formData: FormData): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true, media: {} });
    }
    return this.http.post(`${this.apiUrl}/admin/media/upload`, formData);
  }

  deleteMedia(id: string): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true });
    }
    return this.http.delete(`${this.apiUrl}/admin/media/${id}`);
  }

  updateMedia(id: string, data: any): Observable<any> {
    if (this.demoModeService.isDemoModeEnabled()) {
      return of({ success: true });
    }
    return this.http.patch(`${this.apiUrl}/admin/media/${id}`, data);
  }
}
