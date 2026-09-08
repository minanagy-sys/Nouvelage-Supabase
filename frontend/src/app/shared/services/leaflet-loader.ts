/**
 * Loads Leaflet on demand.
 *
 * Leaflet's CSS and JS used to sit in index.html <head>, which made a
 * ~150KB third-party script render-blocking on every page — including the
 * seven pages that have no map at all. Now the three pages with a map call
 * loadLeaflet() when they are ready to draw it, and everything else never
 * pays for it.
 *
 * The files are served from our own /assets/leaflet (the leaflet npm
 * package, copied at build time), so there is no third-party dependency at
 * runtime. Repeat calls share one in-flight promise.
 */
const LEAFLET_CSS = '/assets/leaflet/leaflet.css';
const LEAFLET_JS = '/assets/leaflet/leaflet.js';

let pending: Promise<any> | null = null;

export function loadLeaflet(): Promise<any> {
  // SSR: there is no map to draw on the server.
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.resolve(null);
  }
  const existing = (window as any).L;
  if (existing) return Promise.resolve(existing);
  if (pending) return pending;

  pending = new Promise((resolve, reject) => {
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }

    let script = document.querySelector(`script[src="${LEAFLET_JS}"]`) as HTMLScriptElement | null;
    if (script) {
      script.addEventListener('load', () => resolve((window as any).L));
      script.addEventListener('error', () => reject(new Error('Leaflet failed to load')));
      return;
    }

    script = document.createElement('script');
    script.src = LEAFLET_JS;
    script.async = true;
    script.onload = () => resolve((window as any).L);
    script.onerror = () => {
      pending = null;
      reject(new Error('Leaflet failed to load'));
    };
    document.head.appendChild(script);
  });

  return pending;
}
