import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { API_BASE } from './shared/api-base';

// During SSR the app runs inside Node: relative '/api' URLs cannot be
// fetched, so the API base becomes an absolute URL to the local API server.
const serverApiBase =
  (typeof process !== 'undefined' && process.env?.['API_BASE_URL']) ||
  'http://127.0.0.1:4000/api';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    { provide: API_BASE, useValue: serverApiBase },
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
