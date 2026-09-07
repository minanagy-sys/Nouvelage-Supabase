import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AdminAuthService } from '../services/admin-auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class AdminAuthInterceptor implements HttpInterceptor {
  constructor(private adminAuthService: AdminAuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.adminAuthService.getToken();
    const isAdminCall = request.url.includes('/api/admin');

    if (token && isAdminCall) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Auto logout when the API rejects the admin session — public
        // endpoints never trigger this.
        if (isAdminCall && (error.status === 401 || error.status === 403)) {
          this.adminAuthService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}
