/**
 * result-bus.ts — Single source-of-truth for calculator output state.
 *
 * Architecture contract (Phase 4.2):
 *
 *   ONE calculation  →  ONE dispatchResult() call  →  BOTH desktop panel and
 *   mobile hero read from the same cm:result CustomEvent.
 *
 * No duplicate DOM updates. No duplicate IDs. No race conditions.
 * CalculatorLayout.astro subscribes to `cm:result` automatically — the mobile
 * hero (#calc-mobile-hero) is updated without any per-calculator wiring.
 *
 * ─── Server-side safety ───────────────────────────────────────────────────────
 * This module is safe to import in Astro frontmatter (SSR/SSG context) because
 * it does NOT reference `window` or `document` at module load time. All browser
 * APIs are accessed only inside function bodies that are called client-side.
 *
 * ─── Usage in a calculator page <script> block ────────────────────────────────
 *
 *   // Option A — typed ES module import (for future module-aware pages):
 *   import { dispatchResult } from '../lib/result-bus';
 *   dispatchResult({ heroValue: '₹1,26,14,400', heroLabel: 'Maturity' });
 *
 *   // Option B — inline CustomEvent (for existing plain inline scripts,
 *   //            no import required — CalculatorLayout already listens):
 *   window.dispatchEvent(
 *     new CustomEvent('cm:result', {
 *       detail: { heroValue: '₹1,26,14,400', heroLabel: 'Maturity' },
 *       bubbles: false,
 *     })
 *   );
 *
 * Both options produce identical results; Option B requires zero migration of
 * existing pages. New pages should prefer Option A for type safety.
 */

/**
 * The canonical result state dispatched by every calculator after each
 * computation. Desktop output DOM nodes are updated by the calculator page
 * directly (unchanged from current pattern). The mobile hero is updated
 * automatically by CalculatorLayout via the `cm:result` event.
 */
export interface CalcResult {
  /**
   * Primary displayed value — a pre-formatted string ready for the DOM.
   * Examples: "₹1,26,14,400", "$12,345.67", "8.5%"
   */
  heroValue: string;

  /**
   * Label for the mobile bottom bar.
   * Examples: "Estimated Maturity", "Annual Depreciation", "EMI"
   * Defaults to the heroLabel prop supplied to CalculatorLayout when omitted.
   */
  heroLabel?: string;
}

/**
 * Dispatch a calculation result to the shared event bus.
 * Call this once at the end of every recalc() function.
 *
 * @param result - The CalcResult to broadcast.
 */
export function dispatchResult(result: CalcResult): void {
  window.dispatchEvent(
    new CustomEvent<CalcResult>('cm:result', {
      detail: result,
      bubbles: false,
    })
  );
}

/**
 * Subscribe to calculator result events.
 * Returns an unsubscribe function — call it to remove the listener.
 *
 * @param handler - Callback invoked whenever a CalcResult is dispatched.
 * @returns Cleanup function that removes the event listener.
 *
 * @example
 *   const unsub = subscribeResult(({ heroValue }) => {
 *     console.log('New result:', heroValue);
 *   });
 *   // Later:
 *   unsub();
 */
export function subscribeResult(handler: (result: CalcResult) => void): () => void {
  const listener = (e: Event) => handler((e as CustomEvent<CalcResult>).detail);
  window.addEventListener('cm:result', listener);
  return () => window.removeEventListener('cm:result', listener);
}
