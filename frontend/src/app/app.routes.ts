import { Routes } from '@angular/router';
import { AdminAuthGuard } from './admin/guards/admin-auth.guard';

// Routes are lazy-loaded so each page ships its own JS chunk. The home page no
// longer pulls in heavy pages (team/services/doctor data) or the admin bundle.
export const routes: Routes = [
  // Public routes
  { path: '', loadComponent: () => import('./components/landing/landing.component').then(m => m.LandingComponent) },
  { path: 'forher', loadComponent: () => import('./components/forher/forher.component').then(m => m.ForherComponent) },
  { path: 'forhim', loadComponent: () => import('./components/forhim/forhim.component').then(m => m.ForhimComponent) },
  { path: 'services', loadComponent: () => import('./components/services/services.component').then(m => m.ServicesComponent) },
  { path: 'bundles', loadComponent: () => import('./components/bundles/bundles.component').then(m => m.BundlesComponent) },
  { path: 'doctor/:slug', loadComponent: () => import('./components/doctor-detail/doctor-detail.component').then(m => m.DoctorDetailComponent) },
  { path: 'contact', loadComponent: () => import('./components/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'blog', loadComponent: () => import('./components/blog/blog.component').then(m => m.BlogComponent) },
  { path: 'blog/:slug', loadComponent: () => import('./components/post/post.component').then(m => m.PostComponent) },
  { path: 'team', loadComponent: () => import('./components/team/team.component').then(m => m.TeamComponent) },
  { path: 'checkout', loadComponent: () => import('./components/checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: 'thank-you', loadComponent: () => import('./components/thank-you/thank-you.component').then(m => m.ThankYouComponent) },

  // Admin routes
  { path: 'admin/login', loadComponent: () => import('./admin/components/admin-login/admin-login.component').then(m => m.AdminLoginComponent) },
  { path: 'admin/dashboard', loadComponent: () => import('./admin/components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent), canActivate: [AdminAuthGuard] },
  { path: 'admin', redirectTo: 'admin/dashboard', pathMatch: 'full' },

  { path: '**', redirectTo: '' }
];
