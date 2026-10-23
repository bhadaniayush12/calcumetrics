import { describe, expect, it } from 'vitest';
import { GOLD_BUDGET, GOLD_HORIZON_YEARS, GOLD_SIP_MONTHS, goldRows } from './dhanteras-2026-gold-vs-sip';

describe('Dhanteras equal-budget comparison', () => {
  it('invests the same total budget, with SIP contributions confined to the first year', () => {
    expect(GOLD_BUDGET).toBe(50000);
    expect(GOLD_SIP_MONTHS).toBe(12);
    expect(GOLD_HORIZON_YEARS).toBe(5);
    for (const row of goldRows) {
      expect(row.lump.principal).toBe(GOLD_BUDGET);
      expect(row.sipContributions.invested).toBeCloseTo(GOLD_BUDGET, 8);
      // Only the first-year corpus is carried forward; no further contributions.
      expect(row.sip.principal).toBe(row.sipContributions.maturity);
    }
  });

  it('preserves the common five-year endpoint and monthly compounding', () => {
    // Fixtures captured from the existing engines, including the four-year hold
    // after the twelve beginning-of-month SIP contributions.
    const expected = [
      { rate: 0, lump: 50000, sip: 50000, cagr: 0 },
      { rate: 5, lump: 64167.93392517559, sip: 62723.58732591801, cagr: 5.116189788173298 },
      { rate: 10, lump: 82265.44673892927, sip: 78627.22990309272, cagr: 10.471306744129683 },
    ];
    expect(goldRows).toHaveLength(expected.length);
    goldRows.forEach((row, i) => {
      expect(row.rate).toBe(expected[i].rate);
      expect(row.lump.maturity).toBeCloseTo(expected[i].lump, 8);
      expect(row.sip.maturity).toBeCloseTo(expected[i].sip, 8);
      expect(row.cagr.cagrPct).toBeCloseTo(expected[i].cagr, 8);
      expect(row.sip.maturity).toBeLessThanOrEqual(row.lump.maturity);
    });
  });
});
