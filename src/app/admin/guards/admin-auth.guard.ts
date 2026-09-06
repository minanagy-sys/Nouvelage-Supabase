import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AdminAuthService } from '../services/admin-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  constructor(
    private adminAuthService: AdminAuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.adminAuthService.checkSession().pipe(
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true;
        }
        // Redirect to login with return URL
        this.router.navigate(['/admin/login'], { queryParams: { returnUrl: state.url } });
        return false;
      })
    );
  }
}
