import { describe, it, expect } from 'vitest';
import { calcRD } from './rd';

describe('calcRD', () => {
  it('compounds each instalment quarterly over fractional quarters (₹5,000 × 12 @ 7%)', () => {
    // Regression: rounding remaining quarters up overstated this as ₹62,671
    const res = calcRD(5000, 7, 1);
    expect(res.maturity).toBeCloseTo(62310.66, 1);
    expect(res.invested).toBe(60000);
  });

  it('returns principal only at 0% interest', () => {
    const res = calcRD(1000, 0, 2);
    expect(res.maturity).toBe(24000);
    expect(res.interest).toBe(0);
  });

  it('supports tenures that are not whole years', () => {
    expect(calcRD(1000, 6, 10 / 12).invested).toBe(10000);
  });
});
