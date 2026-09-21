/** FD (Fixed Deposit) Calculator
 * Section 12: ₹1,00,000, 7%, 5 yrs, quarterly → ₹1,41,477.82
 * Formula: A = P × (1 + r/n)^(n×t)
 */
export type FDCompoundFreq = 'monthly' | 'quarterly' | 'half-yearly' | 'annually';
const FD_FREQ: Record<FDCompoundFreq, number> = { monthly: 12, quarterly: 4, 'half-yearly': 2, annually: 1 };

export interface FDResult {
  maturity: number;
  principal: number;
  interest: number;
  interestFraction: number;
  principalFraction: number;
}

export function calcFD(principal: number, ratePercent: number, years: number, freq: FDCompoundFreq = 'quarterly'): FDResult {
  const n = FD_FREQ[freq];
  const maturity = principal * Math.pow(1 + (ratePercent / 100) / n, n * years);
  const interest = maturity - principal;
  return {
    maturity,
    principal,
    interest,
    principalFraction: maturity > 0 ? principal / maturity : 0,
    interestFraction: maturity > 0 ? interest / maturity : 0,
  };
}
