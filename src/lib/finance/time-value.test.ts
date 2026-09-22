import { describe, it, expect } from 'vitest';
import {
  calcPV,
  calcFV,
  calcDiscountedPayback,
  calcInflation,
  calcSavingsGoal,
} from '../../lib/finance/time-value';

describe('calcPV — Present Value', () => {
  it('discounts a future amount annually', () => {
    // PV = 100000 / (1.08)^10 = 46,319.35
    const res = calcPV(100000, 8, 10, 'annually');
    expect(res.pv).toBeCloseTo(46319.35, 0);
    expect(res.futureAmount).toBe(100000);
    expect(res.totalDiscount).toBeCloseTo(100000 - 46319.35, 0);
  });

  it('discounts with monthly compounding', () => {
    // PV = 100000 / (1 + 0.08/12)^120
    const res = calcPV(100000, 8, 10, 'monthly');
    expect(res.pv).toBeLessThan(46319.35); // monthly gives lower PV
    expect(res.pv).toBeGreaterThan(0);
  });

  it('continuous compounding returns e^(-rt)', () => {
    // PV = 100000 × e^(-0.08 × 10)
    const expected = 100000 * Math.exp(-0.8);
    const res = calcPV(100000, 8, 10, 'continuously');
    expect(res.pv).toBeCloseTo(expected, 4);
  });

  it('pvFraction + discountFraction = 1', () => {
    const res = calcPV(50000, 10, 5);
    expect(res.pvFraction + res.discountFraction).toBeCloseTo(1, 10);
  });

  it('zero years returns original amount', () => {
    const res = calcPV(100000, 8, 0, 'annually');
    expect(res.pv).toBeCloseTo(100000, 4);
  });

  it('zero rate returns original amount', () => {
    const res = calcPV(100000, 0, 10, 'annually');
    expect(res.pv).toBeCloseTo(100000, 4);
  });
});

describe('calcFV — Future Value', () => {
  it('computes FV annually — canonical fixture', () => {
    // FV = 100000 × (1.08)^10 = 215,892.50
    const res = calcFV(100000, 8, 10, 'annually');
    expect(res.fv).toBeCloseTo(215892.5, 0);
    expect(res.presentAmount).toBe(100000);
    expect(res.totalGrowth).toBeCloseTo(115892.5, 0);
  });

  it('principalFraction + growthFraction = 1', () => {
    const res = calcFV(50000, 12, 7);
    expect(res.principalFraction + res.growthFraction).toBeCloseTo(1, 10);
  });

  it('monthly compounding yields more than annual', () => {
    const annual = calcFV(100000, 8, 10, 'annually');
    const monthly = calcFV(100000, 8, 10, 'monthly');
    expect(monthly.fv).toBeGreaterThan(annual.fv);
  });

  it('continuous compounding', () => {
    const expected = 100000 * Math.exp(0.08 * 10);
    const res = calcFV(100000, 8, 10, 'continuously');
    expect(res.fv).toBeCloseTo(expected, 4);
  });
});

describe('calcDiscountedPayback', () => {
  it('finds payback within cash flows', () => {
    // Investment 100000, flows 30000, 40000, 50000, 60000 @ 10%
    const flows = [30000, 40000, 50000, 60000];
    const res = calcDiscountedPayback(100000, flows, 10);
    expect(res.recovered).toBe(true);
    expect(res.paybackYears).toBeGreaterThan(0);
    expect(res.paybackYears).toBeLessThan(4);
    expect(res.paybackMonths).toBeCloseTo(res.paybackYears * 12, 4);
  });

  it('returns Infinity when investment not recovered', () => {
    const flows = [5000, 5000]; // Too small to recover 100000
    const res = calcDiscountedPayback(100000, flows, 10);
    expect(res.recovered).toBe(false);
    expect(res.paybackYears).toBe(Infinity);
    expect(res.paybackMonths).toBe(Infinity);
  });

  it('generates cumulative schedule', () => {
    const flows = [30000, 40000, 50000];
    const res = calcDiscountedPayback(100000, flows, 10);
    expect(res.cumulativeDiscounted).toHaveLength(3);
    expect(res.cumulativeDiscounted[0].period).toBe(1);
    // Each cumulative should be non-decreasing
    expect(res.cumulativeDiscounted[1].cumulative).toBeGreaterThan(
      res.cumulativeDiscounted[0].cumulative
    );
  });
});

describe('calcInflation', () => {
  it('calculates future cost and purchasing power', () => {
    // 100 at 6% for 10 years
    const res = calcInflation(100, 6, 10);
    const expectedFutureCost = 100 * Math.pow(1.06, 10); // ~179.08
    expect(res.futureCost).toBeCloseTo(expectedFutureCost, 4);
    expect(res.futurePurchasingPower).toBeCloseTo(100 / Math.pow(1.06, 10), 4);
    expect(res.presentValue).toBe(100);
  });

  it('cumulative inflation pct matches FV growth', () => {
    const res = calcInflation(100, 5, 20);
    const expected = (Math.pow(1.05, 20) - 1) * 100;
    expect(res.cumulativeInflationPct).toBeCloseTo(expected, 4);
  });

  it('caps yearly breakdown at 30 years', () => {
    const res = calcInflation(100, 5, 40);
    expect(res.yearlyBreakdown).toHaveLength(30);
  });
});

describe('calcSavingsGoal', () => {
  it('returns positive monthly contribution for reachable goal', () => {
    const res = calcSavingsGoal(1000000, 0, 12, 10);
    expect(res.monthlyContribution).toBeGreaterThan(0);
    expect(res.targetAmount).toBe(1000000);
  });

  it('zero contribution if current savings exceeds target with growth', () => {
    // current savings large enough to grow past target
    const res = calcSavingsGoal(100000, 500000, 10, 10);
    expect(res.monthlyContribution).toBe(0);
  });

  it('handles zero return rate (linear saving)', () => {
    // 120,000 target, 0 current, 0% rate, 10 years = 1,000/month
    const res = calcSavingsGoal(120000, 0, 0, 10);
    expect(res.monthlyContribution).toBeCloseTo(1000, 2);
  });

  it('annualContribution = monthlyContribution × 12', () => {
    const res = calcSavingsGoal(500000, 50000, 8, 5);
    expect(res.annualContribution).toBeCloseTo(res.monthlyContribution * 12, 4);
  });
});
