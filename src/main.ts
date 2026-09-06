import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// Security hardening: in production builds, silence all non-error console
// output so no internal app state or data is exposed in the browser devtools
// console. Real errors are preserved for diagnostics. In development
// (environment.production === false) all logging is left intact.
if (environment.production) {
  const noop = (): void => {};
  console.log = noop;
  console.info = noop;
  console.debug = noop;
  console.warn = noop;
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
