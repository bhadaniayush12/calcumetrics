import { describe, it, expect } from 'vitest';
import { calcLumpSum } from './lumpsum';
import { validate, type ValidationRules } from '../validate';
import { serializeHash, restoreFromHash, parseHash } from '../url-state';

/**
 * Compound Interest Validation Rules and Hash Schema
 * Matching src/pages/compound-interest-calculator.astro
 */
export const CI_RULES: Record<'principal' | 'rate' | 'years', ValidationRules> = {
  principal: { required: true, min: 100, max: 100_000_000, decimal: false, negativeAllowed: false, label: 'Principal' },
  rate: { required: true, min: 0.01, max: 100, decimal: true, negativeAllowed: false, label: 'Interest Rate' },
  years: { required: true, min: 1, max: 50, integerOnly: true, negativeAllowed: false, label: 'Tenure' },
};

export const HASH_SCHEMA: Record<'p' | 'r' | 'y', ValidationRules> = {
  p: CI_RULES.principal,
  r: CI_RULES.rate,
  y: CI_RULES.years,
};

// ══════════════════════════════════════════════════════════════════════════════
// 12. RESULT REGRESSION (calcLumpSum)
// ══════════════════════════════════════════════════════════════════════════════
describe('Compound Interest (calcLumpSum) — Result Regression', () => {
  // ── Section 12 Fixture ──────────────────────────────────────────────────────
  it('₹1,00,000 @ 8% annual for 10yr → ₹2,15,892.50', () => {
    const res = calcLumpSum(100000, 8, 10, 'annually');
    expect(res.maturity).toBeCloseTo(215892.50, 2);
    expect(res.principal).toBe(100000);
    expect(res.gain).toBeCloseTo(115892.50, 2);
    expect(res.gainPct).toBeCloseTo(115.89, 1);
  });

  // ── Different compounding frequencies ───────────────────────────────────────
  it('₹1,00,000 @ 8% semi-annually for 10yr', () => {
    const res = calcLumpSum(100000, 8, 10, 'semi-annually');
    expect(res.maturity).toBeCloseTo(219112.31, 0);
  });

  it('₹1,00,000 @ 8% quarterly for 10yr', () => {
    const res = calcLumpSum(100000, 8, 10, 'quarterly');
    expect(res.maturity).toBeCloseTo(220803.97, 0);
  });

  it('₹1,00,000 @ 8% monthly for 10yr', () => {
    const res = calcLumpSum(100000, 8, 10, 'monthly');
    expect(res.maturity).toBeCloseTo(221964.02, 0);
  });

  it('₹1,00,000 @ 8% daily for 10yr', () => {
    const res = calcLumpSum(100000, 8, 10, 'daily');
    expect(res.maturity).toBeCloseTo(222534.58, 0);
  });

  // ── Boundary inputs ─────────────────────────────────────────────────────────
  it('Minimum principal ₹100 @ 1% annual for 1yr', () => {
    const res = calcLumpSum(100, 1, 1, 'annually');
    expect(res.maturity).toBeCloseTo(101, 2);
    expect(res.gain).toBeCloseTo(1, 2);
  });

  it('Max rate 100% annual for 1yr', () => {
    const res = calcLumpSum(100000, 100, 1, 'annually');
    expect(res.maturity).toBe(200000);
    expect(res.gain).toBe(100000);
    expect(res.gainPct).toBe(100);
  });

  it('Long tenure: 50 years annual compounding', () => {
    const res = calcLumpSum(100000, 8, 50, 'annually');
    expect(res.maturity).toBeCloseTo(4690161.14, 0);
  });

  // ── Single year ─────────────────────────────────────────────────────────────
  it('Single year with monthly compounding', () => {
    const res = calcLumpSum(100000, 12, 1, 'monthly');
    expect(res.maturity).toBeCloseTo(112682.50, 0);
  });

  // ── Decimal rate ────────────────────────────────────────────────────────────
  it('Decimal rate 7.25% quarterly for 5yr', () => {
    const res = calcLumpSum(100000, 7.25, 5, 'quarterly');
    const expected = 100000 * Math.pow(1 + 0.0725 / 4, 20);
    expect(res.maturity).toBeCloseTo(expected, 2);
  });

  // ── High-value realistic input ──────────────────────────────────────────────
  it('₹50,00,000 @ 12% monthly for 20yr', () => {
    const res = calcLumpSum(5000000, 12, 20, 'monthly');
    const expected = 5000000 * Math.pow(1 + 0.12 / 12, 240);
    expect(res.maturity).toBeCloseTo(expected, 0);
    expect(res.gain).toBeCloseTo(expected - 5000000, 0);
  });

  // ── Result structure verification ───────────────────────────────────────────
  it('Result contains correct fraction fields', () => {
    const res = calcLumpSum(100000, 8, 10, 'annually');
    expect(res.principalFraction).toBeCloseTo(100000 / res.maturity, 6);
    expect(res.gainFraction).toBeCloseTo(res.gain / res.maturity, 6);
    expect(res.principalFraction + res.gainFraction).toBeCloseTo(1, 6);
  });

  // ── Edge cases ──────────────────────────────────────────────────────────────
  it('Zero principal returns zeros', () => {
    const res = calcLumpSum(0, 8, 10, 'annually');
    expect(res.maturity).toBe(0);
    expect(res.gain).toBe(0);
    expect(res.gainPct).toBe(0);
  });

  it('Zero rate returns principal unchanged', () => {
    const res = calcLumpSum(100000, 0, 10, 'annually');
    expect(res.maturity).toBe(100000);
    expect(res.gain).toBe(0);
    expect(res.gainPct).toBe(0);
  });

  it('Default frequency is annually', () => {
    const res = calcLumpSum(100000, 8, 10);
    expect(res.maturity).toBeCloseTo(215892.50, 2);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// PHASE 4.3 CENTRALIZED VALIDATION INTEGRATION
// ══════════════════════════════════════════════════════════════════════════════
describe('Compound Interest — Centralized Validation (Phase 4.3 validate.ts)', () => {
  // 1. valid principal/rate/years
  it('1. accepts valid principal, rate, and years', () => {
    const pRes = validate('1,00,000', CI_RULES.principal);
    expect(pRes.valid).toBe(true);
    if (pRes.valid) expect(pRes.value).toBe(100000);

    const rRes = validate('8', CI_RULES.rate);
    expect(rRes.valid).toBe(true);
    if (rRes.valid) expect(rRes.value).toBe(8);

    const yRes = validate('10', CI_RULES.years);
    expect(yRes.valid).toBe(true);
    if (yRes.valid) expect(yRes.value).toBe(10);
  });

  // 2. required/empty
  it('2. rejects empty/missing required inputs with REQUIRED code', () => {
    const pEmpty = validate('', CI_RULES.principal);
    expect(pEmpty.valid).toBe(false);
    if (!pEmpty.valid) expect(pEmpty.error.code).toBe('REQUIRED');

    const pWhitespace = validate('   ', CI_RULES.principal);
    expect(pWhitespace.valid).toBe(false);
    if (!pWhitespace.valid) expect(pWhitespace.error.code).toBe('REQUIRED');

    const rNull = validate(null, CI_RULES.rate);
    expect(rNull.valid).toBe(false);
    if (!rNull.valid) expect(rNull.error.code).toBe('REQUIRED');

    const yUndefined = validate(undefined, CI_RULES.years);
    expect(yUndefined.valid).toBe(false);
    if (!yUndefined.valid) expect(yUndefined.error.code).toBe('REQUIRED');
  });

  // 3. min/max
  it('3. enforces min and max boundaries strictly', () => {
    // Principal boundaries (min: 100, max: 100,000,000)
    const pBelow = validate('99', CI_RULES.principal);
    expect(pBelow.valid).toBe(false);
    if (!pBelow.valid) expect(pBelow.error.code).toBe('BELOW_MIN');

    const pAbove = validate('100000001', CI_RULES.principal);
    expect(pAbove.valid).toBe(false);
    if (!pAbove.valid) expect(pAbove.error.code).toBe('ABOVE_MAX');

    const pExactMin = validate('100', CI_RULES.principal);
    expect(pExactMin.valid).toBe(true);

    const pExactMax = validate('100000000', CI_RULES.principal);
    expect(pExactMax.valid).toBe(true);

    // Rate boundaries (min: 0.01, max: 100)
    const rBelow = validate('0.005', CI_RULES.rate);
    expect(rBelow.valid).toBe(false);
    if (!rBelow.valid) expect(rBelow.error.code).toBe('BELOW_MIN');

    const rAbove = validate('100.1', CI_RULES.rate);
    expect(rAbove.valid).toBe(false);
    if (!rAbove.valid) expect(rAbove.error.code).toBe('ABOVE_MAX');

    // Years boundaries (min: 1, max: 50)
    const yBelow = validate('0', CI_RULES.years);
    expect(yBelow.valid).toBe(false);
    if (!yBelow.valid) expect(yBelow.error.code).toBe('BELOW_MIN');

    const yAbove = validate('51', CI_RULES.years);
    expect(yAbove.valid).toBe(false);
    if (!yAbove.valid) expect(yAbove.error.code).toBe('ABOVE_MAX');
  });

  // 4. decimal rate
  it('4. permits fractional/decimal values for interest rate', () => {
    const r1 = validate('7.25', CI_RULES.rate);
    expect(r1.valid).toBe(true);
    if (r1.valid) expect(r1.value).toBe(7.25);

    const r2 = validate('8.5', CI_RULES.rate);
    expect(r2.valid).toBe(true);
    if (r2.valid) expect(r2.value).toBe(8.5);

    const r3 = validate('0.01', CI_RULES.rate);
    expect(r3.valid).toBe(true);
    if (r3.valid) expect(r3.value).toBe(0.01);
  });

  // 5. integer years
  it('5. enforces integerOnly on years and decimal:false on principal', () => {
    // Years must be integer
    const yValid = validate('10', CI_RULES.years);
    expect(yValid.valid).toBe(true);

    const yDecimal = validate('10.5', CI_RULES.years);
    expect(yDecimal.valid).toBe(false);
    if (!yDecimal.valid) expect(yDecimal.error.code).toBe('NOT_AN_INTEGER');

    // Principal cannot have decimals
    const pDecimal = validate('1000.5', CI_RULES.principal);
    expect(pDecimal.valid).toBe(false);
    if (!pDecimal.valid) expect(pDecimal.error.code).toBe('DECIMAL_NOT_ALLOWED');
  });

  // 6. invalid numeric input
  it('6. rejects non-numeric strings and negative numbers', () => {
    const nonNum1 = validate('abc', CI_RULES.principal);
    expect(nonNum1.valid).toBe(false);
    if (!nonNum1.valid) expect(nonNum1.error.code).toBe('NOT_A_NUMBER');

    const nonNum2 = validate('--10', CI_RULES.rate);
    expect(nonNum2.valid).toBe(false);
    if (!nonNum2.valid) expect(nonNum2.error.code).toBe('NOT_A_NUMBER');

    const nonNum3 = validate('1.2.3', CI_RULES.years);
    expect(nonNum3.valid).toBe(false);
    if (!nonNum3.valid) expect(nonNum3.error.code).toBe('NOT_A_NUMBER');

    // Negative numbers
    const negPrincipal = validate('-500', CI_RULES.principal);
    expect(negPrincipal.valid).toBe(false);
    if (!negPrincipal.valid) expect(negPrincipal.error.code).toBe('NEGATIVE_NOT_ALLOWED');

    const negRate = validate('-5', CI_RULES.rate);
    expect(negRate.valid).toBe(false);
    if (!negRate.valid) expect(negRate.error.code).toBe('NEGATIVE_NOT_ALLOWED');
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// PHASE 4.4 URL HASH STATE INTEGRATION
// ══════════════════════════════════════════════════════════════════════════════
describe('Compound Interest — URL Hash State (Phase 4.4 url-state.ts)', () => {
  // 7. URL serialization via shared utility
  it('7. serializes state to deterministic sorted hash using serializeHash', () => {
    const hash = serializeHash({ f: 'annually', p: 100000, r: 8, y: 10 });
    expect(hash).toBe('#f=annually&p=100000&r=8&y=10');

    // Deterministic key sorting regardless of input object key order
    const hashReordered = serializeHash({ y: 10, p: 100000, r: 8, f: 'monthly' });
    expect(hashReordered).toBe('#f=monthly&p=100000&r=8&y=10');

    // Empty, null, and undefined omitted
    const partial = serializeHash({ p: 100000, r: null, y: undefined, f: '' });
    expect(partial).toBe('#p=100000');
  });

  // 8. URL restoration via shared utility
  it('8. restores and validates valid values from hash using restoreFromHash', () => {
    const res = restoreFromHash('#f=annually&p=100000&r=8&y=10', HASH_SCHEMA);
    expect(res.valid).toBe(true);
    expect(res.values.p).toBe(100000);
    expect(res.values.r).toBe(8);
    expect(res.values.y).toBe(10);
    expect(res.raw.f).toBe('annually');
    expect(res.restoredKeys).toEqual(expect.arrayContaining(['p', 'r', 'y']));
    expect(res.invalidKeys).toHaveLength(0);
  });

  // 9. malformed hash
  it('9. safely handles malformed hash without throwing and preserves valid fields', () => {
    expect(() => {
      const res = restoreFromHash('#p=100000&&=&&r=8&broken%ZZ&y=10', HASH_SCHEMA);
      expect(res.values.p).toBe(100000);
      expect(res.values.r).toBe(8);
      expect(res.values.y).toBe(10);
    }).not.toThrow();

    // Completely garbage hash
    expect(() => {
      const res = restoreFromHash('###&&===', HASH_SCHEMA);
      expect(res.valid).toBe(false);
      expect(res.restoredKeys).toHaveLength(0);
    }).not.toThrow();
  });

  // 10. invalid hash value
  it('10. records invalid hash keys and avoids empty-string → 0 coercion', () => {
    const res = restoreFromHash('#p=invalid&r=9999&y=10', HASH_SCHEMA);
    expect(res.valid).toBe(false);
    expect(res.invalidKeys).toContain('p');
    expect(res.invalidKeys).toContain('r');
    expect(res.values.p).toBeUndefined(); // NO coercion to 0
    expect(res.values.r).toBeUndefined(); // NO coercion to 0
    expect(res.values.y).toBe(10); // Valid field preserved
    expect(res.restoredKeys).toContain('y');
  });

  // 11. round-trip state
  it('11. round-trip state serialization and restoration retains fidelity', () => {
    const originalState = {
      f: 'quarterly',
      p: 250000,
      r: 7.75,
      y: 15,
    };

    const hash = serializeHash(originalState);
    expect(hash).toBe('#f=quarterly&p=250000&r=7.75&y=15');

    const restored = restoreFromHash(hash, HASH_SCHEMA);
    expect(restored.valid).toBe(true);
    expect(restored.values.p).toBe(originalState.p);
    expect(restored.values.r).toBe(originalState.r);
    expect(restored.values.y).toBe(originalState.y);
    expect(restored.raw.f).toBe(originalState.f);
  });
});
