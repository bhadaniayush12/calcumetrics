/**
 * Pure calculation functions for SIP (Systematic Investment Plan).
 * Section 12 fixture: ₹25,000/month, 12% p.a., 15 years → ₹1,26,14,400
 *
 * Formula: Annuity-due (contribution at the START of each month)
 * i = r / (12 * 100)
 * M = P × [((1 + i)^n − 1) / i] × (1 + i)
 *
 * All computations use full float precision; round only at render time.
 */

export interface SIPResult {
  maturity: number;       // Total maturity value
  invested: number;       // Total amount invested (P × n)
  gain: number;           // Absolute gain (maturity − invested)
  gainPct: number;        // Gain as percentage of invested
  principalFraction: number; // 0-1 fraction for composition bar
  gainFraction: number;   //  0-1 fraction for composition bar
}

/**
 * Calculate SIP maturity value (annuity-due).
 * @param monthly - Monthly investment amount (P)
 * @param ratePercent - Annual nominal interest rate (e.g. 12 for 12%)
 * @param years - Investment duration in years
 */
export function calcSIP(monthly: number, ratePercent: number, years: number): SIPResult {
  const n = years * 12;
  const i = ratePercent / (12 * 100);
  const invested = monthly * n;

  let maturity: number;
  if (i === 0) {
    maturity = invested;
  } else {
    // Annuity-due: multiply ordinary annuity by (1 + i)
    maturity = monthly * (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  }

  const gain = maturity - invested;
  const gainPct = invested > 0 ? (gain / invested) * 100 : 0;

  return {
    maturity,
    invested,
    gain,
    gainPct,
    principalFraction: maturity > 0 ? invested / maturity : 0,
    gainFraction: maturity > 0 ? gain / maturity : 0,
  };
}

/**
 * Year-by-year SIP breakdown for the "Year-by-year breakdown" table.
 * Each row: { year, invested, maturity, gain }
 */
export function calcSIPYearly(
  monthly: number,
  ratePercent: number,
  totalYears: number
): Array<{ year: number; invested: number; maturity: number; gain: number }> {
  return Array.from({ length: totalYears }, (_, idx) => {
    const year = idx + 1;
    const r = calcSIP(monthly, ratePercent, year);
    return { year, invested: r.invested, maturity: r.maturity, gain: r.gain };
  });
}

// Section 12 test fixtures — verified against handoff doc
if (import.meta.vitest) {
  const { it, expect, describe } = import.meta.vitest;
  describe('SIP Calculator', () => {
    it('₹25,000 / 12% / 15yr → ₹1,26,14,400', () => {
      const r = calcSIP(25000, 12, 15);
      expect(Math.round(r.maturity)).toBe(12614400);
    });
    it('₹25,000 / 12% / 3yr → ₹10,87,691', () => {
      const r = calcSIP(25000, 12, 3);
      expect(Math.round(r.maturity)).toBe(1087691);
    });
    it('₹25,000 / 12% / 5yr → ₹20,62,159', () => {
      const r = calcSIP(25000, 12, 5);
      expect(Math.round(r.maturity)).toBe(2062159);
    });
    it('₹25,000 / 12% / 10yr → ₹58,08,477', () => {
      const r = calcSIP(25000, 12, 10);
      expect(Math.round(r.maturity)).toBe(5808477);
    });
    it('₹25,000 / 12% / 20yr → ₹2,49,78,698', () => {
      const r = calcSIP(25000, 12, 20);
      expect(Math.round(r.maturity)).toBe(24978698);
    });
  });
}
