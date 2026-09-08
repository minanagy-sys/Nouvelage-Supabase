import { NgZone } from '@angular/core';

/**
 * Runs a page's setup steps one at a time, yielding to the browser between
 * each, outside Angular's change detection.
 *
 * The pages used to do this instead:
 *
 *     setTimeout(() => { initHeroSlideshow(); initDoctors(); … 13 calls }, 1000);
 *
 * which had three problems. Everything ran in a single task, so the browser
 * froze for as long as the whole batch took (~700ms on a mid-range machine)
 * and could neither paint nor scroll. The blind 1s delay meant the page sat
 * inert first and then jumped to life. And because the calls shared one try
 * scope, the first one to throw silently cancelled every step after it.
 *
 * Here each step is its own task, so the browser stays responsive; each is
 * wrapped so one failure cannot cancel the rest; and the work starts as soon
 * as the DOM is ready instead of after a fixed wait.
 */
export interface InitStep {
  name: string;
  run: () => void;
}

function nextIdle(cb: () => void): void {
  const w = window as any;
  if (typeof w.requestIdleCallback === 'function') {
    w.requestIdleCallback(cb, { timeout: 200 });
  } else {
    setTimeout(cb, 0);
  }
}

/**
 * @param zone     the component's NgZone — steps run outside it, since they
 *                 only touch the DOM directly (sliders, reveals, counters).
 * @param steps    setup functions, run in order.
 * @param settleMs grace period for the SSR markup to hydrate before the
 *                 first step. Keep this small; it is not a substitute for
 *                 waiting on real state.
 */
export function runInitSteps(zone: NgZone, steps: InitStep[], settleMs = 0): void {
  if (typeof window === 'undefined') return;

  zone.runOutsideAngular(() => {
    const pump = (i: number) => {
      if (i >= steps.length) return;
      const step = steps[i];
      try {
        step.run();
      } catch (err) {
        // One broken widget must not take the rest of the page down with it.
        console.error(`[init] step "${step.name}" failed:`, err);
      }
      nextIdle(() => pump(i + 1));
    };

    const start = () => nextIdle(() => pump(0));
    if (settleMs > 0) setTimeout(start, settleMs);
    else start();
  });
}
