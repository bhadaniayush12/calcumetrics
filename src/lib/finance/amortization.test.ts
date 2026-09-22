import { describe, it, expect } from 'vitest';
import {
  calcAmortization,
  calcAffordability,
  calcDTI,
  calcCreditCardPayoff,
  calcImpliedRate,
} from '../../lib/finance/amortization';

describe('calcAmortization', () => {
  it('canonical EMI fixture — 40L @ 8.5% / 20yr', () => {
    // Same as EMI calculator phase 5 test for consistency
    const res = calcAmortization(4000000, 8.5, 20);
    const r = 8.5 / 100 / 12;
    const n = 240;
    const factor = Math.pow(1 + r, n);
    const expectedEMI = (4000000 * r * factor) / (factor - 1);
    expect(res.emi).toBeCloseTo(expectedEMI, 2);
    expect(res.totalPayment).toBeCloseTo(res.emi * 240, 2);
    expect(res.totalInterest).toBeCloseTo(res.totalPayment - 4000000, 2);
  });

  it('zero interest rate gives principal / months', () => {
    const res = calcAmortization(120000, 0, 10);
    expect(res.emi).toBeCloseTo(1000, 2); // 120000 / 120
  });

  it('principalFraction + interestFraction = 1', () => {
    const res = calcAmortization(1000000, 10, 15);
    expect(res.principalFraction + res.interestFraction).toBeCloseTo(1, 10);
  });

  it('generates schedule when requested', () => {
    const res = calcAmortization(100000, 12, 1, true);
    expect(res.schedule).toHaveLength(12);
    // First payment: interest = 100000 × (0.12/12)
    expect(res.schedule[0].interest).toBeCloseTo(1000, 2);
    // Last balance should be near 0
    expect(res.schedule[11].balance).toBeCloseTo(0, 0);
  });

  it('skips schedule generation by default', () => {
    const res = calcAmortization(100000, 8, 5);
    expect(res.schedule).toHaveLength(0);
  });
});

describe('calcAffordability', () => {
  it('inverts EMI formula correctly', () => {
    // If principal = 4M, rate = 8.5, years = 20 → EMI ≈ 34711
    // Then given EMI ≈ 34711, we should recover principal ≈ 4M
    const amort = calcAmortization(4000000, 8.5, 20);
    const aff = calcAffordability(amort.emi, 8.5, 20);
    expect(aff.maxLoanAmount).toBeCloseTo(4000000, 0);
  });

  it('handles zero rate', () => {
    const aff = calcAffordability(10000, 0, 10);
    expect(aff.maxLoanAmount).toBeCloseTo(1200000, 0); // 10000 × 120
  });

  it('totalRepayment = monthlyBudget × months', () => {
    const aff = calcAffordability(15000, 9, 20);
    expect(aff.totalRepayment).toBeCloseTo(15000 * 240, 2);
  });
});

describe('calcDTI', () => {
  it('calculates DTI correctly', () => {
    // 30000 debt / 100000 income = 30% → 'fair' (28 < 30 ≤ 36)
    const res = calcDTI(30000, 100000);
    expect(res.dtiPct).toBeCloseTo(30, 4);
    expect(res.assessment).toBe('fair');
  });

  it('excellent for ≤ 20%', () => {
    const res = calcDTI(15000, 100000);
    expect(res.assessment).toBe('excellent');
  });

  it('very-poor for > 43%', () => {
    const res = calcDTI(50000, 100000);
    expect(res.assessment).toBe('very-poor');
  });

  it('returns 0 DTI when income is 0', () => {
    const res = calcDTI(50000, 0);
    expect(res.dtiPct).toBe(0);
  });
});

describe('calcCreditCardPayoff', () => {
  it('calculates payoff months for a feasible payment', () => {
    // 50000 balance, 36% APR, 2000/month
    const res = calcCreditCardPayoff(50000, 36, 2000);
    expect(res.paymentSufficient).toBe(true);
    expect(res.payoffMonths).toBeGreaterThan(0);
    expect(res.payoffMonths).toBeLessThan(120);
    expect(res.totalInterest).toBeGreaterThan(0);
  });

  it('returns insufficient when payment ≤ monthly interest', () => {
    // 50000 × 3% = 1500 monthly interest, payment = 1500
    const res = calcCreditCardPayoff(50000, 36, 1500);
    expect(res.paymentSufficient).toBe(false);
    expect(res.payoffMonths).toBe(Infinity);
  });

  it('totalPaid = monthlyPayment × payoffMonths when sufficient', () => {
    const res = calcCreditCardPayoff(10000, 24, 500);
    if (res.paymentSufficient) {
      expect(res.totalPaid).toBeCloseTo(res.monthlyPayment * res.payoffMonths, 0);
    }
  });
});

describe('calcImpliedRate', () => {
  it('solves for rate given known EMI fixture', () => {
    // principal=1000000, emi from 8.5%/20yr, tenure=20yr → should recover ~8.5%
    const amort = calcAmortization(1000000, 8.5, 20);
    const res = calcImpliedRate(1000000, amort.emi, 20);
    expect(res.valid).toBe(true);
    expect(res.annualRatePct).toBeCloseTo(8.5, 1);
  });

  it('returns invalid when payment too low', () => {
    // EMI of 500 cannot repay 100000 over 5 years
    const res = calcImpliedRate(100000, 500, 5);
    expect(res.valid).toBe(false);
    expect(res.error).toBeDefined();
  });

  it('returns invalid for zero principal', () => {
    const res = calcImpliedRate(0, 5000, 5);
    expect(res.valid).toBe(false);
  });

  it('never returns NaN or Infinity in annualRatePct when invalid', () => {
    const res = calcImpliedRate(100000, 10, 5);
    expect(Number.isNaN(res.annualRatePct)).toBe(false);
    expect(Number.isFinite(res.annualRatePct) || res.annualRatePct === 0).toBe(true);
  });
});
