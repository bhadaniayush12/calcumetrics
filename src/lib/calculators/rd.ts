/** RD (Recurring Deposit) Calculator
 * Quarterly compounding: M = Σ R × (1 + r/400)^(m/3)
 * where m = months remaining for each instalment (fractional quarters).
 */
export interface RDResult {
  maturity: number;
  invested: number;
  interest: number;
  investedFraction: number;
  interestFraction: number;
}

export function calcRD(monthly: number, ratePercent: number, years: number): RDResult {
  // Quarterly compounding (i = r/400); each instalment compounds for its
  // remaining tenure expressed in (fractional) quarters, as banks compute it.
  const i = ratePercent / 400;
  const totalMonths = Math.round(years * 12);
  let maturity = 0;

  for (let month = 1; month <= totalMonths; month++) {
    const monthsRemaining = totalMonths - month + 1;
    maturity += monthly * Math.pow(1 + i, monthsRemaining / 3);
  }

  const invested = monthly * totalMonths;
  const interest = maturity - invested;
  return {
    maturity,
    invested,
    interest,
    investedFraction: maturity > 0 ? invested / maturity : 0,
    interestFraction: maturity > 0 ? interest / maturity : 0,
  };
}
