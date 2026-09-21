/** Lump Sum / Compound Interest Calculator
 * Section 12: ₹1,00,000, 8% annual, 10 yrs → ₹2,15,892.50
 * Formula: A = P × (1 + r/n)^(n×t)
 */
export type CompoundFrequency = 'annually' | 'semi-annually' | 'quarterly' | 'monthly';

const FREQ_MAP: Record<CompoundFrequency, number> = {
  annually: 1,
  'semi-annually': 2,
  quarterly: 4,
  monthly: 12,
};

export interface LumpSumResult {
  maturity: number;
  principal: number;
  gain: number;
  gainPct: number;
  principalFraction: number;
  gainFraction: number;
}

export function calcLumpSum(
  principal: number,
  ratePercent: number,
  years: number,
  frequency: CompoundFrequency = 'annually'
): LumpSumResult {
  const n = FREQ_MAP[frequency];
  const r = ratePercent / 100;
  const maturity = principal * Math.pow(1 + r / n, n * years);
  const gain = maturity - principal;
  const gainPct = principal > 0 ? (gain / principal) * 100 : 0;
  return {
    maturity,
    principal,
    gain,
    gainPct,
    principalFraction: maturity > 0 ? principal / maturity : 0,
    gainFraction: maturity > 0 ? gain / maturity : 0,
  };
}
