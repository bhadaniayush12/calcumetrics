import { describe, it, expect } from 'vitest';
import { calcLumpSum } from './lumpsum';

describe('Compound Interest (calcLumpSum)', () => {
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
    // A = 100000 × (1 + 0.04)^20 = 100000 × 2.19112... = 219112.31
    const res = calcLumpSum(100000, 8, 10, 'semi-annually');
    expect(res.maturity).toBeCloseTo(219112.31, 0);
  });

  it('₹1,00,000 @ 8% quarterly for 10yr', () => {
    // A = 100000 × (1 + 0.02)^40 = 100000 × 2.20804... = 220804.00
    const res = calcLumpSum(100000, 8, 10, 'quarterly');
    expect(res.maturity).toBeCloseTo(220803.97, 0);
  });

  it('₹1,00,000 @ 8% monthly for 10yr', () => {
    // A = 100000 × (1 + 0.08/12)^120 = 221964.02
    const res = calcLumpSum(100000, 8, 10, 'monthly');
    expect(res.maturity).toBeCloseTo(221964.02, 0);
  });

  it('₹1,00,000 @ 8% daily for 10yr', () => {
    // A = 100000 × (1 + 0.08/365)^3650 = 222534.58
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
    // A = 100000 × (1 + 1)^1 = 200000
    expect(res.maturity).toBe(200000);
    expect(res.gain).toBe(100000);
    expect(res.gainPct).toBe(100);
  });

  it('Long tenure: 50 years annual compounding', () => {
    const res = calcLumpSum(100000, 8, 50, 'annually');
    // A = 100000 × 1.08^50 = 100000 × 46.9016... = 4690161
    expect(res.maturity).toBeCloseTo(4690161.14, 0);
  });

  // ── Single year ─────────────────────────────────────────────────────────────
  it('Single year with monthly compounding', () => {
    const res = calcLumpSum(100000, 12, 1, 'monthly');
    // A = 100000 × (1 + 0.01)^12 = 100000 × 1.12683... = 112682.50
    expect(res.maturity).toBeCloseTo(112682.50, 0);
  });

  // ── Decimal rate ────────────────────────────────────────────────────────────
  it('Decimal rate 7.25% quarterly for 5yr', () => {
    const res = calcLumpSum(100000, 7.25, 5, 'quarterly');
    // A = 100000 × (1 + 0.0725/4)^20
    const expected = 100000 * Math.pow(1 + 0.0725 / 4, 20);
    expect(res.maturity).toBeCloseTo(expected, 2);
  });

  // ── High-value realistic input ──────────────────────────────────────────────
  it('₹50,00,000 @ 12% monthly for 20yr', () => {
    const res = calcLumpSum(5000000, 12, 20, 'monthly');
    // A = 5000000 × (1 + 0.01)^240
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
