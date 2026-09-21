/** CAGR Calculator
 * Section 12: ₹1,00,000 → ₹2,50,000 in 5 yrs → 20.11%
 * Formula: CAGR = (FV/PV)^(1/n) - 1
 */
export interface CAGRResult {
  cagr: number;       // As decimal (e.g. 0.2011)
  cagrPct: number;    // As percentage (e.g. 20.11)
  absoluteReturn: number;
  absoluteReturnPct: number;
}

export function calcCAGR(presentValue: number, futureValue: number, years: number): CAGRResult {
  if (presentValue <= 0 || years <= 0) return { cagr: 0, cagrPct: 0, absoluteReturn: 0, absoluteReturnPct: 0 };
  const cagr = Math.pow(futureValue / presentValue, 1 / years) - 1;
  const absoluteReturn = futureValue - presentValue;
  return {
    cagr,
    cagrPct: cagr * 100,
    absoluteReturn,
    absoluteReturnPct: (absoluteReturn / presentValue) * 100,
  };
}
