/**
 * result-bus.ts — Canonical result state for Calcumetrics calculators.
 *
 * Phase 4.2 Architecture: Single Source of Truth
 *
 *   recalc()
 *       ↓
 *   ONE canonical result state (setResult / store._state)
 *       ↓
 *   desktop presentation (layout-owned hero / render adapter)
 *   mobile presentation (CalculatorLayout mobile hero subscriber)
 *
 * ─── Source-of-Truth Design ──────────────────────────────────────────────────
 *
 *   The canonical result is a module-level persistent variable (_state).
 *   It is NOT transient — any code that calls getResult() after setResult()
 *   receives the latest value, regardless of when it was set.
 *
 *   Both desktop and mobile presentations react from this single state:
 *   - Mobile: CalculatorLayout subscribes and updates #calc-mobile-hero.
 *   - Desktop:
 *     - Option A (Generic layout): CalculatorLayout subscribes and updates
 *       #calc-desktop-hero and #calc-generic-metrics when layout owns presentation.
 *     - Option B (Render adapter): Desktop output presentation registers a
 *       render adapter via registerRenderAdapter() or fields mapping to react
 *       directly from the canonical state.
 *
 * ─── Server-side / SSR Safety ────────────────────────────────────────────────
 *
 *   This module has ZERO references to `window`, `document`, or any browser
 *   API at module scope. It is safe to import in Astro frontmatter (SSR/SSG build).
 *   Browser-specific integration lives in CalculatorLayout.astro's <script>.
 *
 * ─── Backward Compatibility ──────────────────────────────────────────────────
 *
 *   Existing calculator pages that dispatch the raw CustomEvent:
 *     window.dispatchEvent(new CustomEvent('cm:result', { detail: { heroValue } }))
 *   are supported transparently via the compatibility bridge in CalculatorLayout.
 *   The bridge feeds the canonical store, and presentation reacts from it.
 *
 * ─── Usage (Phase 5+ new calculators) ────────────────────────────────────────
 *
 *   In a calculator page script:
 *     import { setResult } from '../lib/result-bus';
 *     // or window.__cmResultStore.setResult(...)
 *
 *     setResult({
 *       heroValue: '₹1,26,14,400',
 *       heroLabel: 'Estimated Total Maturity',
 *       rows: [
 *         { label: 'Total Invested', value: '₹45,00,000' },
 *         { label: 'Total Gain', value: '₹81,14,400', variant: 'accent' },
 *       ],
 *     });
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ResultRow {
  label: string;
  value: string;
  subValue?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'muted';
}

export interface CalcResult {
  /**
   * Primary displayed value — a pre-formatted string ready for the DOM.
   * Examples: "₹1,26,14,400", "$12,345.67", "8.5%", "2,500 units"
   */
  heroValue: string;

  /**
   * Label for the mobile bottom bar and desktop result header.
   * Examples: "Estimated Maturity", "Annual Depreciation", "EMI"
   * When omitted, CalculatorLayout retains the heroLabel prop it was given at SSR.
   */
  heroLabel?: string;

  /**
   * Optional secondary rows/metrics for generic layout-owned presentation.
   */
  rows?: ResultRow[];

  /**
   * Optional key-value map of target DOM element IDs to formatted display values.
   * Enables render adapters to update desktop DOM nodes directly from canonical state.
   */
  fields?: Record<string, string>;

  /**
   * Optional calculator-specific payload for custom visual components (e.g. charts).
   */
  meta?: Record<string, unknown>;
}

export type ResultSubscriber = (result: CalcResult) => void;
export type ResultRenderAdapter = (result: CalcResult) => void;

// ─── Canonical Store (module-level, persists for page lifetime) ───────────────

/**
 * The current canonical result. null until the first setResult() call.
 * Persists across astro:page-load re-initializations within the same document.
 */
let _state: CalcResult | null = null;

/**
 * Active result subscribers. Each receives the new CalcResult on every
 * setResult() call. Use a Set so duplicate registrations are harmless.
 */
const _subscribers = new Set<ResultSubscriber>();

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Set the canonical result state and notify all current subscribers.
 *
 * Call this once at the end of every recalc() function.
 * Both desktop and mobile presentations react through this single call.
 *
 * @param result - The new CalcResult to store and broadcast.
 */
export function setResult(result: CalcResult): void {
  _state = result;
  _subscribers.forEach((fn) => {
    try {
      fn(result);
    } catch {
      // Swallow subscriber errors to prevent one bad subscriber
      // from blocking the rest.
    }
  });

  if (typeof window !== 'undefined') {
    const win = window as any;
    if (win.__cmResultStore && typeof win.__cmResultStore.setResult === 'function') {
      try {
        win.__cmResultStore.setResult(result);
      } catch {}
    }
    try {
      win.dispatchEvent(new CustomEvent('cm:result', { detail: result }));
    } catch {}
  }
}

/**
 * Read the current canonical result without subscribing.
 * Returns null if no result has been set yet on this page.
 *
 * @returns The latest CalcResult, or null.
 */
export function getResult(): CalcResult | null {
  return _state;
}

/**
 * Subscribe to all future result updates.
 * Returns an unsubscribe function — call it to remove the listener.
 *
 * @param handler - Callback invoked with the new CalcResult on every setResult().
 * @returns Cleanup function that removes this subscriber.
 */
export function subscribeResult(handler: ResultSubscriber): () => void {
  _subscribers.add(handler);
  return () => _subscribers.delete(handler);
}

/**
 * Register a typed render adapter that connects presentation targets
 * (such as desktop output DOM elements or charts) directly to the
 * canonical result store.
 *
 * When registered, the adapter is immediately called with the current
 * canonical result (if one has already been set), and is then invoked
 * synchronously on every subsequent setResult() call.
 *
 * @param adapter - Function that consumes CalcResult to update presentation.
 * @returns Cleanup function that unregisters the adapter.
 */
export function registerRenderAdapter(adapter: ResultRenderAdapter): () => void {
  const unsub = subscribeResult(adapter);
  const current = getResult();
  if (current) {
    try {
      adapter(current);
    } catch {
      // Prevent adapter initial-render errors from bubbling
    }
  }
  return unsub;
}

/**
 * Reset the canonical store.
 *
 * Called by CalculatorLayout on `astro:before-preparation` (View Transitions)
 * to clear stale state before a new calculator page loads. Also used in tests.
 *
 * Does NOT unsubscribe existing listeners — CalculatorLayout's persistent
 * subscriber survives page transitions by design (it queries the DOM lazily).
 */
export function resetResult(): void {
  _state = null;
}

/**
 * Attach the legacy window event bridge if a target EventTarget is available.
 * Listens for CustomEvent 'cm:result' and forwards it into the canonical store
 * via setResult().
 *
 * @param target - EventTarget to listen on (defaults to global window if available).
 * @returns Cleanup function to detach the listener.
 */
export function attachLegacyResultBridge(target?: EventTarget): () => void {
  const win = target ?? (typeof window !== 'undefined' ? window : null);
  if (!win) return () => {};
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<CalcResult>).detail;
    if (detail && detail.heroValue) {
      setResult(detail);
    }
  };
  win.addEventListener('cm:result', handler);
  return () => win.removeEventListener('cm:result', handler);
}

// ─── Backward-compat alias ────────────────────────────────────────────────────

/**
 * @deprecated Use setResult() instead.
 * Kept as an alias so any code that imports dispatchResult() continues to work.
 */
export const dispatchResult: (result: CalcResult) => void = setResult;
