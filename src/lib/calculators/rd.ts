/** RD (Recurring Deposit) Calculator
 * Formula: M = R × [(1 + i)^n − 1] / (1 − (1 + i)^(-1/3))
 * Simplified: M = R × n × (1 + i) — RBI uses quarterly compounding
 * Standard Indian RD formula: M = R × [(1+i)^n - 1] / i × (1+i)
 * where i = r/400 (quarterly) and n = quarters
 */
export interface RDResult {
  maturity: number;
  invested: number;
  interest: number;
  investedFraction: number;
  interestFraction: number;
}

export function calcRD(monthly: number, ratePercent: number, years: number): RDResult {
  // Standard RD formula with quarterly compounding (n quarters)
  const n = years * 4; // quarters
  const i = ratePercent / 400; // quarterly rate
  const monthsPerQ = 3;
  let maturity = 0;

  // Each monthly instalment compounds for its remaining quarters
  for (let month = 1; month <= years * 12; month++) {
    const quartersRemaining = Math.ceil((years * 12 - month + 1) / monthsPerQ);
    maturity += monthly * Math.pow(1 + i, quartersRemaining);
  }

  const invested = monthly * years * 12;
  const interest = maturity - invested;
  return {
    maturity,
    invested,
    interest,
    investedFraction: maturity > 0 ? invested / maturity : 0,
    interestFraction: maturity > 0 ? interest / maturity : 0,
  };
}
