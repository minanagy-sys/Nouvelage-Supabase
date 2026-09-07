import { InjectionToken } from '@angular/core';
import { environment } from '../../environments/environment';

/**
 * Base URL for the Nouvelage API.
 *
 * In the browser this is environment.apiUrl ('/api' in production — same
 * origin through nginx). During server-side rendering a relative URL cannot
 * be fetched, so app.config.server.ts overrides this token with an absolute
 * URL (API_BASE_URL env, defaulting to the API on localhost).
 */
export const API_BASE = new InjectionToken<string>('API_BASE', {
  providedIn: 'root',
  factory: () => environment.apiUrl,
});
