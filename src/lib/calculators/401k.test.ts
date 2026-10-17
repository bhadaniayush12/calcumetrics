import { describe, it, expect } from 'vitest';
import { calc401K, K401_ELECTIVE_DEFERRAL_LIMIT, K401_LIMIT_YEAR } from './401k';

describe('calc401K — IRS elective deferral cap', () => {
  it('uses the 2026 limit of $24,500', () => {
    expect(K401_LIMIT_YEAR).toBe(2026);
    expect(K401_ELECTIVE_DEFERRAL_LIMIT).toBe(24500);
  });

  it('leaves contributions under the cap unchanged', () => {
    // $100,000 × 8% = $8,000; match 50% up to 6% = $3,000
    const res = calc401K(100000, 8, 50, 6, 0, 1);
    expect(res.employeeContributed).toBe(8000);
    expect(res.employerContributed).toBe(3000);
    expect(res.employeeContribCapped).toBe(false);
  });

  it('caps the employee deferral at $24,500', () => {
    // $400,000 × 10% = $40,000 requested → capped to $24,500 per year
    const res = calc401K(400000, 10, 50, 6, 0, 2);
    expect(res.employeeContribCapped).toBe(true);
    expect(res.yearlyBreakdown[0].employeeContrib).toBe(24500);
    expect(res.employeeContributed).toBe(49000);
    // Match is 50% of the lower of the actual deferral ($24,500) and 6% of salary ($24,000) = $12,000
    expect(res.yearlyBreakdown[0].employerContrib).toBe(12000);
  });

  it('matches on the capped deferral when the cap is below the match ceiling', () => {
    // $1,000,000 × 10% requested; cap $24,500 < 6% of salary ($60,000) → match 100% × 24,500
    const res = calc401K(1000000, 10, 100, 6, 0, 1);
    expect(res.employerContributed).toBe(24500);
  });

  it('accepts a higher limit (e.g. age 50+ catch-up: $24,500 + $8,000)', () => {
    const res = calc401K(400000, 10, 0, 0, 0, 1, 32500);
    expect(res.employeeContributed).toBe(32500);
  });
});
