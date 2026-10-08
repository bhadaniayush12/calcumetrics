import { describe, it, expect } from 'vitest';
import {
  MARKET_DEFAULTS,
  getFieldDefaults,
  getCalculatorDefaults,
  type CalculatorDefaults,
  type FieldDefaults,
} from './market-defaults';

const MARKETS = ['INR', 'USD', 'EUR', 'GBP'] as const;
const all = MARKET_DEFAULTS as Record<string, CalculatorDefaults>;

describe('market-defaults', () => {
  it('falls back to INR when a market has no override', () => {
    const inr = getFieldDefaults('sip', 'sip-monthly', 'INR');
    expect(inr).toBeDefined();
    for (const code of MARKETS) {
      const field = all.sip['sip-monthly'];
      const expected = field[code] ?? field.INR;
      expect(getFieldDefaults('sip', 'sip-monthly', code)).toEqual(expected);
    }
  });

  it('returns undefined for unknown calculators or fields', () => {
    expect(getFieldDefaults('nope', 'x', 'USD')).toBeUndefined();
    expect(getFieldDefaults('sip', 'nope', 'USD')).toBeUndefined();
    expect(getCalculatorDefaults('nope', 'USD')).toEqual({});
  });

  it('getCalculatorDefaults returns every field of the calculator', () => {
    const d = getCalculatorDefaults('sip', 'USD');
    expect(Object.keys(d).sort()).toEqual(Object.keys(all.sip).sort());
  });

  // Data integrity: catches typos when filling in market values
  for (const [calc, fields] of Object.entries(all)) {
    for (const [id, field] of Object.entries(fields)) {
      for (const code of MARKETS) {
        const d = field[code] as FieldDefaults | undefined;
        if (!d) continue;
        it(`${calc} › ${id} › ${code} is internally consistent`, () => {
          expect(Number.isFinite(d.value)).toBe(true);
          expect(d.value).toBeGreaterThanOrEqual(0);
          // Overrides must define the same slider keys as INR
          expect(d.min === undefined).toBe(field.INR.min === undefined);
          if (d.min !== undefined && d.max !== undefined) {
            expect(d.min).toBeLessThan(d.max);
            expect(d.value).toBeGreaterThanOrEqual(d.min);
            expect(d.value).toBeLessThanOrEqual(d.max);
            expect(d.step!).toBeGreaterThan(0);
          }
        });
      }
    }
  }
});
