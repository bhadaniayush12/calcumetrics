import { describe, it, expect } from 'vitest';
import { calcLoanPrepayment } from './prepayment';

describe('calcLoanPrepayment', () => {
  it('saves no interest on a 0% loan', () => {
    const res = calcLoanPrepayment(100000, 0, 20, 30000);
    expect(res.interestSaved).toBe(0);
    expect(res.monthsSaved).toBe(6);
  });

  it('reduce-tenure interest matches a month-by-month simulation', () => {
    const P = 1000000, rate = 9, n = 120, prepay = 200000;
    const res = calcLoanPrepayment(P, rate, n, prepay);
    const r = rate / 1200;
    let bal = P - prepay, interest = 0, months = 0;
    while (bal > 1e-6) {
      const i = bal * r;
      interest += i;
      bal = bal + i - Math.min(res.originalEMI, bal + i);
      months++;
    }
    expect(res.newMonthsRemaining).toBe(months);
    expect(res.interestSaved).toBeCloseTo(res.originalTotalInterest - interest, 2);
  });

  it('clamps a prepayment that clears the loan', () => {
    const res = calcLoanPrepayment(100000, 10, 24, 150000);
    expect(res.newMonthsRemaining).toBe(0);
    expect(res.interestSaved).toBeCloseTo(res.originalTotalInterest, 6);
  });

  it('returns zeros for non-positive tenure', () => {
    expect(calcLoanPrepayment(100000, 10, 0, 1000).interestSaved).toBe(0);
  });
});
