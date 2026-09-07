import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, map } from 'rxjs';
import { Router } from '@angular/router';
import type { User } from '@supabase/supabase-js';
import { SupabaseService } from '../../shared/services/supabase.service';

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

/**
 * Admin authentication backed by Supabase Auth.
 * Admin accounts live in Supabase's built-in `auth.users` (hashed passwords).
 * The logged-in session flows through the shared Supabase client, so every
 * admin DB write is performed as an authenticated user.
 */
@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private currentUserSubject = new BehaviorSubject<AdminUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private accessToken: string | null = null;

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {
    const client = this.supabase.getClient();

    // Hydrate from any persisted session on startup.
    client.auth.getSession().then(({ data }) => {
      if (data.session) {
        this.accessToken = data.session.access_token;
        this.currentUserSubject.next(this.mapUser(data.session.user));
      }
    });

    // Keep local state in sync with sign-in / sign-out / token refresh.
    client.auth.onAuthStateChange((_event, session) => {
      this.accessToken = session?.access_token ?? null;
      this.currentUserSubject.next(session ? this.mapUser(session.user) : null);
    });
  }

  private mapUser(user: User): AdminUser {
    const meta = (user.user_metadata ?? {}) as { name?: string; role?: string };
    return {
      id: user.id,
      email: user.email ?? '',
      name: meta.name || user.email || 'Admin',
      role: meta.role || 'admin'
    };
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return from(
      this.supabase.getClient().auth.signInWithPassword({ email, password })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        const user = this.mapUser(data.user);
        this.accessToken = data.session?.access_token ?? null;
        this.currentUserSubject.next(user);
        return { token: this.accessToken ?? '', user };
      })
    );
  }

  logout(): void {
    this.supabase.getClient().auth.signOut().finally(() => {
      this.accessToken = null;
      this.currentUserSubject.next(null);
      this.router.navigate(['/admin/login']);
    });
  }

  getToken(): string | null {
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  /**
   * Authoritative async session check for the route guard.
   */
  checkSession(): Observable<boolean> {
    return from(this.supabase.getClient().auth.getSession()).pipe(
      map(({ data }) => {
        const session = data.session;
        this.accessToken = session?.access_token ?? null;
        this.currentUserSubject.next(session ? this.mapUser(session.user) : null);
        return !!session;
      })
    );
  }

  getCurrentUser(): AdminUser | null {
    return this.currentUserSubject.value;
  }

  getMe(): Observable<{ user: AdminUser }> {
    return from(this.supabase.getClient().auth.getUser()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return { user: this.mapUser(data.user) };
      })
    );
  }

  changePassword(_currentPassword: string, newPassword: string): Observable<any> {
    return from(this.supabase.getClient().auth.updateUser({ password: newPassword }));
  }
}
