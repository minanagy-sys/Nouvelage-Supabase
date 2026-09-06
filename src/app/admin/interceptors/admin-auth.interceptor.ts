import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AdminAuthService } from '../services/admin-auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AdminAuthInterceptor implements HttpInterceptor {
  constructor(
    private adminAuthService: AdminAuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add auth token to requests
    const token = this.adminAuthService.getToken();

    if (token && request.url.includes('localhost:5000')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Auto logout on 401 or 403
        if (error.status === 401 || error.status === 403) {
          this.adminAuthService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}
