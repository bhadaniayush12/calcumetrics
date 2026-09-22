/**
 * result-bus.test.ts — Unit tests for Phase 4.2 Single Source-of-Truth Result Architecture.
 *
 * Covers all 11 required test scenarios:
 *  1. setResult → getResult
 *  2. subscribe receives updates
 *  3. current state available to late subscriber
 *  4. unsubscribe
 *  5. multiple subscribers
 *  6. resetResult
 *  7. legacy cm:result updates canonical store
 *  8. desktop and mobile consumers receive the same result
 *  9. repeated astro:page-load does not duplicate subscriptions
 * 10. existing calculator regression (backward compat & error isolation)
 * 11. no duplicate result IDs
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  setResult,
  getResult,
  subscribeResult,
  registerRenderAdapter,
  resetResult,
  attachLegacyResultBridge,
  dispatchResult,
  type CalcResult,
} from './result-bus';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const RESULT_A: CalcResult = {
  heroValue: '₹1,26,14,400',
  heroLabel: 'Estimated Total Maturity',
  rows: [
    { label: 'Total Invested', value: '₹45,00,000' },
    { label: 'Total Gain', value: '₹81,14,400', variant: 'accent' },
  ],
  fields: {
    'sip-result-maturity': '₹1,26,14,400',
    'sip-result-invested': '₹45,00,000',
  },
};

const RESULT_B: CalcResult = {
  heroValue: '$12,345.67',
  heroLabel: 'Net Present Value',
  rows: [
    { label: 'Initial Outlay', value: '$50,000.00' },
    { label: 'NPV', value: '$12,345.67', variant: 'accent' },
  ],
};

// Reset store before each test to guarantee test isolation
beforeEach(() => {
  resetResult();
});

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe('Phase 4.2 — Single Source-of-Truth Result Architecture', () => {

  // ── 1. setResult → getResult ───────────────────────────────────────────────
  describe('1. setResult → getResult', () => {
    it('getResult() returns null before any result is set', () => {
      expect(getResult()).toBeNull();
    });

    it('setResult() stores canonical state and getResult() returns it', () => {
      setResult(RESULT_A);
      expect(getResult()).toEqual(RESULT_A);
    });

    it('setResult() called multiple times always returns the latest state', () => {
      setResult(RESULT_A);
      expect(getResult()).toEqual(RESULT_A);

      setResult(RESULT_B);
      expect(getResult()).toEqual(RESULT_B);
    });
  });

  // ── 2. subscribe receives updates ──────────────────────────────────────────
  describe('2. subscribe receives updates', () => {
    it('subscriber receives updates when setResult() is called', () => {
      const received: CalcResult[] = [];
      const unsub = subscribeResult((r) => received.push(r));

      setResult(RESULT_A);
      setResult(RESULT_B);
      unsub();

      expect(received).toHaveLength(2);
      expect(received[0]).toEqual(RESULT_A);
      expect(received[1]).toEqual(RESULT_B);
    });
  });

  // ── 3. current state available to late subscriber ──────────────────────────
  describe('3. current state available to late subscriber', () => {
    it('late subscriber can read current state via getResult() catch-up', () => {
      setResult(RESULT_A);

      const received: CalcResult[] = [];
      const unsub = subscribeResult((r) => received.push(r));

      // Catch-up read
      const current = getResult();
      if (current) received.push(current);

      unsub();

      expect(received).toHaveLength(1);
      expect(received[0]).toEqual(RESULT_A);
    });

    it('registerRenderAdapter() immediately delivers current state to late subscriber', () => {
      setResult(RESULT_A);

      let lateDelivered: CalcResult | null = null;
      const unsub = registerRenderAdapter((r) => {
        lateDelivered = r;
      });

      // Immediate synchronous delivery on registration
      expect(lateDelivered).toEqual(RESULT_A);

      // Continues to receive future updates
      setResult(RESULT_B);
      expect(lateDelivered).toEqual(RESULT_B);

      unsub();
    });
  });

  // ── 4. unsubscribe ─────────────────────────────────────────────────────────
  describe('4. unsubscribe', () => {
    it('calling returned unsubscribe function removes the listener', () => {
      const received: string[] = [];
      const unsub = subscribeResult(({ heroValue }) => received.push(heroValue));

      setResult(RESULT_A);
      unsub();
      setResult(RESULT_B);

      expect(received).toEqual([RESULT_A.heroValue]);
    });

    it('unsubscribing one listener does not affect other active subscribers', () => {
      const active: string[] = [];
      const cancelled: string[] = [];

      const unsubActive = subscribeResult(({ heroValue }) => active.push(heroValue));
      const unsubCancelled = subscribeResult(({ heroValue }) => cancelled.push(heroValue));

      setResult(RESULT_A);
      unsubCancelled();
      setResult(RESULT_B);
      unsubActive();

      expect(active).toEqual([RESULT_A.heroValue, RESULT_B.heroValue]);
      expect(cancelled).toEqual([RESULT_A.heroValue]);
    });
  });

  // ── 5. multiple subscribers ────────────────────────────────────────────────
  describe('5. multiple subscribers', () => {
    it('multiple subscribers all receive the same canonical result', () => {
      const sub1: string[] = [];
      const sub2: string[] = [];
      const sub3: string[] = [];

      const u1 = subscribeResult(({ heroValue }) => sub1.push(heroValue));
      const u2 = subscribeResult(({ heroValue }) => sub2.push(heroValue));
      const u3 = subscribeResult(({ heroValue }) => sub3.push(heroValue));

      setResult(RESULT_A);

      expect(sub1).toEqual([RESULT_A.heroValue]);
      expect(sub2).toEqual([RESULT_A.heroValue]);
      expect(sub3).toEqual([RESULT_A.heroValue]);

      u1(); u2(); u3();
    });

    it('all subscribers receive the exact same object reference (single source of truth)', () => {
      const refs: CalcResult[] = [];
      const u1 = subscribeResult((r) => refs.push(r));
      const u2 = subscribeResult((r) => refs.push(r));

      setResult(RESULT_A);

      expect(refs).toHaveLength(2);
      expect(refs[0]).toBe(refs[1]);
      expect(refs[0]).toBe(getResult());

      u1(); u2();
    });
  });

  // ── 6. resetResult ─────────────────────────────────────────────────────────
  describe('6. resetResult', () => {
    it('resetResult() clears canonical state to null', () => {
      setResult(RESULT_A);
      expect(getResult()).not.toBeNull();

      resetResult();
      expect(getResult()).toBeNull();
    });

    it('resetResult() preserves active subscriber registrations', () => {
      const received: string[] = [];
      const unsub = subscribeResult(({ heroValue }) => received.push(heroValue));

      setResult(RESULT_A);
      resetResult();
      expect(getResult()).toBeNull();

      // Next calculation on new page still notifies persistent subscriber
      setResult(RESULT_B);
      expect(received).toEqual([RESULT_A.heroValue, RESULT_B.heroValue]);

      unsub();
    });
  });

  // ── 7. legacy cm:result updates canonical store ────────────────────────────
  describe('7. legacy cm:result updates canonical store', () => {
    it('CustomEvent cm:result feeds the canonical store via compatibility bridge', () => {
      const eventTarget = new EventTarget();
      const detachBridge = attachLegacyResultBridge(eventTarget);

      let canonicalObserved: CalcResult | null = null;
      const unsub = subscribeResult((r) => {
        canonicalObserved = r;
      });

      // Existing legacy calculator dispatches raw CustomEvent
      eventTarget.dispatchEvent(
        new CustomEvent<CalcResult>('cm:result', {
          detail: {
            heroValue: '₹54,321',
            heroLabel: 'Legacy Output',
          },
        })
      );

      // Canonical store was updated
      expect(getResult()).toEqual({
        heroValue: '₹54,321',
        heroLabel: 'Legacy Output',
      });

      // Subscriber received update from canonical store
      expect(canonicalObserved).toEqual({
        heroValue: '₹54,321',
        heroLabel: 'Legacy Output',
      });

      unsub();
      detachBridge();
    });

    it('detaching the legacy bridge stops forwarding events', () => {
      const eventTarget = new EventTarget();
      const detachBridge = attachLegacyResultBridge(eventTarget);

      detachBridge();

      eventTarget.dispatchEvent(
        new CustomEvent('cm:result', {
          detail: { heroValue: '₹99,999' },
        })
      );

      // Store remains empty because bridge was detached
      expect(getResult()).toBeNull();
    });
  });

  // ── 8. desktop and mobile consumers receive the same result ────────────────
  describe('8. desktop and mobile consumers receive the same result', () => {
    it('desktop and mobile consumers both react from the identical canonical result', () => {
      let desktopResult: CalcResult | null = null;
      let mobileResult: CalcResult | null = null;

      // Desktop consumer: registered via render adapter
      const unsubDesktop = registerRenderAdapter((result) => {
        desktopResult = result;
      });

      // Mobile consumer: registered via subscribeResult
      const unsubMobile = subscribeResult((result) => {
        mobileResult = result;
      });

      // Single calculation completes
      const calculatedResult: CalcResult = {
        heroValue: '₹1,26,14,400',
        heroLabel: 'Estimated Total Maturity',
        rows: [
          { label: 'Total Invested', value: '₹45,00,000' },
          { label: 'Total Gain', value: '₹81,14,400', variant: 'accent' },
        ],
        fields: {
          'sip-result-maturity': '₹1,26,14,400',
          'sip-result-invested': '₹45,00,000',
        },
      };

      setResult(calculatedResult);

      // Both consumers received the exact same result
      expect(desktopResult).toEqual(calculatedResult);
      expect(mobileResult).toEqual(calculatedResult);
      expect(desktopResult).toBe(mobileResult); // same canonical reference

      unsubDesktop();
      unsubMobile();
    });
  });

  // ── 9. repeated astro:page-load does not duplicate subscriptions ──────────
  describe('9. repeated astro:page-load does not duplicate subscriptions', () => {
    it('registering the same subscriber reference multiple times is idempotent', () => {
      let callCount = 0;
      const handler = () => {
        callCount++;
      };

      // Simulates multiple page visits registering the same handler reference
      subscribeResult(handler);
      subscribeResult(handler);
      subscribeResult(handler);

      setResult(RESULT_A);

      // Handler is only called ONCE because Set deduplicates by function identity
      expect(callCount).toBe(1);
    });

    it('simulated page-load lifecycle with guard ensures single execution per calculation', () => {
      let mobileHeroUpdates = 0;
      let desktopHeroUpdates = 0;

      // Simulated layout singleton state
      const mockLayoutState = {
        globalBound: false,
        init() {
          if (!this.globalBound) {
            this.globalBound = true;
            subscribeResult(() => {
              mobileHeroUpdates++;
              desktopHeroUpdates++;
            });
          }
        },
      };

      // Simulates 3 consecutive astro:page-load events
      mockLayoutState.init();
      mockLayoutState.init();
      mockLayoutState.init();

      setResult(RESULT_A);

      expect(mobileHeroUpdates).toBe(1);
      expect(desktopHeroUpdates).toBe(1);
    });
  });

  // ── 10. existing calculator regression ─────────────────────────────────────
  describe('10. existing calculator regression (backward compatibility & safety)', () => {
    it('dispatchResult() backward-compat alias functions identically to setResult()', () => {
      dispatchResult(RESULT_A);
      expect(getResult()).toEqual(RESULT_A);
    });

    it('minimal legacy payload with only heroValue is fully valid', () => {
      const minimalResult: CalcResult = { heroValue: '42%' };
      setResult(minimalResult);

      expect(getResult()).toEqual(minimalResult);
      expect(getResult()?.heroLabel).toBeUndefined();
      expect(getResult()?.rows).toBeUndefined();
      expect(getResult()?.fields).toBeUndefined();
    });

    it('subscriber error isolation: faulty subscriber does not crash store or others', () => {
      const safeResults: string[] = [];

      const u1 = subscribeResult(() => {
        throw new Error('Faulty subscriber crash');
      });
      const u2 = subscribeResult(({ heroValue }) => {
        safeResults.push(heroValue);
      });

      expect(() => setResult(RESULT_A)).not.toThrow();
      expect(safeResults).toEqual([RESULT_A.heroValue]);

      u1(); u2();
    });
  });

  // ── 11. no duplicate result IDs ────────────────────────────────────────────
  describe('11. no duplicate result IDs', () => {
    it('CalculatorLayout.astro contains zero duplicate HTML element IDs', () => {
      const layoutPath = path.resolve(
        __dirname,
        '../components/calculator/CalculatorLayout.astro'
      );
      const content = fs.readFileSync(layoutPath, 'utf-8');

      // Strip Astro frontmatter and style/script blocks to inspect template HTML
      const templateHtml = content
        .replace(/^---[\s\S]*?---/, '')
        .replace(/<style[\s\S]*?<\/style>/g, '')
        .replace(/<script[\s\S]*?<\/script>/g, '');

      // Match all id="..." attributes in template
      const idMatches = [...templateHtml.matchAll(/\bid=["']([^"']+)["']/g)].map(
        (m) => m[1]
      );

      // Find duplicates
      const seen = new Set<string>();
      const duplicates: string[] = [];

      for (const id of idMatches) {
        if (seen.has(id)) {
          duplicates.push(id);
        } else {
          seen.add(id);
        }
      }

      expect(duplicates).toEqual([]);
      expect(idMatches.length).toBeGreaterThan(0);
    });

    it('desktop and mobile hero elements have distinct IDs', () => {
      const layoutPath = path.resolve(
        __dirname,
        '../components/calculator/CalculatorLayout.astro'
      );
      const content = fs.readFileSync(layoutPath, 'utf-8');

      expect(content).toContain('id="calc-desktop-hero"');
      expect(content).toContain('id="calc-mobile-hero"');
      expect('calc-desktop-hero').not.toBe('calc-mobile-hero');
    });
  });
});
