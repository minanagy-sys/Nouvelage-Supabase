import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, map, tap, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AdminUser;
}

const TOKEN_KEY = 'nouvelage_admin_token';
const USER_KEY = 'nouvelage_admin_user';

/**
 * Admin authentication backed by the Nouvelage API (JWT).
 * Admin accounts live in the MySQL admin_users table (bcrypt hashes);
 * the API re-checks the account on every request, so deactivating an
 * account takes effect immediately.
 */
@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private currentUserSubject = new BehaviorSubject<AdminUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private accessToken: string | null = null;
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Hydrate from any persisted session on startup; checkSession() later
    // confirms the token is still valid against the API.
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      if (this.accessToken && storedUser) {
        try {
          this.currentUserSubject.next(JSON.parse(storedUser));
        } catch {
          this.clearSession();
        }
      }
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/admin/auth/login`, { email, password }).pipe(
      tap(response => this.storeSession(response.token, response.user))
    );
  }

  logout(): void {
    this.clearSession();
    // Only bounce to the login screen from inside the admin area — a public
    // visitor whose stale token gets rejected should stay on the page.
    if (this.router.url.startsWith('/admin')) {
      this.router.navigate(['/admin/login']);
    }
  }

  getToken(): string | null {
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  /**
   * Authoritative async session check for the route guard — the token is
   * validated against the API, not just checked for presence.
   */
  checkSession(): Observable<boolean> {
    if (!this.accessToken) return of(false);
    return this.http.get<{ user: AdminUser }>(`${this.apiUrl}/admin/auth/me`).pipe(
      map(response => {
        this.currentUserSubject.next(response.user);
        return true;
      }),
      catchError(() => {
        this.clearSession();
        return of(false);
      })
    );
  }

  getCurrentUser(): AdminUser | null {
    return this.currentUserSubject.value;
  }

  getMe(): Observable<{ user: AdminUser }> {
    return this.http.get<{ user: AdminUser }>(`${this.apiUrl}/admin/auth/me`).pipe(
      tap(response => this.currentUserSubject.next(response.user))
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/auth/change-password`, { currentPassword, newPassword });
  }

  private storeSession(token: string, user: AdminUser): void {
    this.accessToken = token;
    this.currentUserSubject.next(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  private clearSession(): void {
    this.accessToken = null;
    this.currentUserSubject.next(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }
}
