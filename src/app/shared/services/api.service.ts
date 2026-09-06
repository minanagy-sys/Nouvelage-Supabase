import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'customer' | 'doctor' | 'admin';
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  duration?: number;
  branch: 'forher' | 'forhim';
  imageUrl?: string;
}

export interface ServiceBundle {
  id: string;
  name: string;
  description: string;
  price: number;
  serviceIds: string[];
  branch: 'forher' | 'forhim';
  savings?: number;
}

export interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  type: 'service' | 'bundle';
  name: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  bio: string;
  imageUrl?: string;
  rating?: number;
  availableSlots?: string[];
}

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string = environment.apiUrl || 'http://localhost:3000/api';
  private tokenKey = 'nouvelage_auth_token';
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  // ========== Authentication ==========

  private loadUserFromStorage(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(this.tokenKey);
      if (token) {
        // TODO: Validate token and get user info
        // For now, just check if token exists
      }
    }
  }

  private saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  private removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.apiUrl}/auth/login`,
      credentials,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.saveToken(response.data.token);
          this.userSubject.next(response.data.user);
        }
      }),
      catchError(this.handleError)
    );
  }

  register(userData: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.apiUrl}/auth/register`,
      userData,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.saveToken(response.data.token);
          this.userSubject.next(response.data.user);
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.removeToken();
    this.userSubject.next(null);
  }

  getCurrentUser(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(
      `${this.apiUrl}/auth/me`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.userSubject.next(response.data);
        }
      }),
      catchError(this.handleError)
    );
  }

  // ========== Services ==========

  getServices(branch?: 'forher' | 'forhim'): Observable<ApiResponse<Service[]>> {
    const url = branch
      ? `${this.apiUrl}/services?branch=${branch}`
      : `${this.apiUrl}/services`;

    return this.http.get<ApiResponse<Service[]>>(url, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getServiceById(id: string): Observable<ApiResponse<Service>> {
    return this.http.get<ApiResponse<Service>>(
      `${this.apiUrl}/services/${id}`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  getServiceBundles(branch?: 'forher' | 'forhim'): Observable<ApiResponse<ServiceBundle[]>> {
    const url = branch
      ? `${this.apiUrl}/bundles?branch=${branch}`
      : `${this.apiUrl}/bundles`;

    return this.http.get<ApiResponse<ServiceBundle[]>>(url, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // ========== Doctors ==========

  getDoctors(): Observable<ApiResponse<Doctor[]>> {
    return this.http.get<ApiResponse<Doctor[]>>(
      `${this.apiUrl}/doctors`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  getDoctorById(id: string): Observable<ApiResponse<Doctor>> {
    return this.http.get<ApiResponse<Doctor>>(
      `${this.apiUrl}/doctors/${id}`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  getDoctorAvailability(doctorId: string, date: string): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(
      `${this.apiUrl}/doctors/${doctorId}/availability?date=${date}`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // ========== Appointments ==========

  createAppointment(appointment: Partial<Appointment>): Observable<ApiResponse<Appointment>> {
    return this.http.post<ApiResponse<Appointment>>(
      `${this.apiUrl}/appointments`,
      appointment,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  getAppointments(): Observable<ApiResponse<Appointment[]>> {
    return this.http.get<ApiResponse<Appointment[]>>(
      `${this.apiUrl}/appointments`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  getAppointmentById(id: string): Observable<ApiResponse<Appointment>> {
    return this.http.get<ApiResponse<Appointment>>(
      `${this.apiUrl}/appointments/${id}`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  updateAppointment(id: string, updates: Partial<Appointment>): Observable<ApiResponse<Appointment>> {
    return this.http.patch<ApiResponse<Appointment>>(
      `${this.apiUrl}/appointments/${id}`,
      updates,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  cancelAppointment(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/appointments/${id}`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // ========== Orders ==========

  createOrder(orderData: Partial<Order>): Observable<ApiResponse<Order>> {
    return this.http.post<ApiResponse<Order>>(
      `${this.apiUrl}/orders`,
      orderData,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  getOrders(): Observable<ApiResponse<Order[]>> {
    return this.http.get<ApiResponse<Order[]>>(
      `${this.apiUrl}/orders`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  getOrderById(id: string): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(
      `${this.apiUrl}/orders/${id}`,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // ========== Contact ==========

  sendContactMessage(message: ContactMessage): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.apiUrl}/contact`,
      message,
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // ========== Newsletter ==========

  subscribeToNewsletter(email: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.apiUrl}/newsletter/subscribe`,
      { email },
      { headers: this.getHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // ========== Error Handling ==========

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.error?.error || `Error Code: ${error.status}`;
    }

    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
