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

export type StepUpType = 'percentage' | 'fixed';

/**
 * Calculate Step-Up (Top-Up) SIP maturity value (annuity-due).
 * Each year, the monthly contribution increases either by a percentage or a fixed amount.
 *
 * @param monthly - Initial monthly investment amount (P)
 * @param ratePercent - Annual nominal interest rate (e.g. 12 for 12%)
 * @param years - Investment duration in years
 * @param stepUpType - 'percentage' (e.g. 10%) or 'fixed' (e.g. 2500)
 * @param stepUpValue - Increase amount (if 0, falls back to regular SIP)
 */
export function calcStepUpSIP(
  monthly: number,
  ratePercent: number,
  years: number,
  stepUpType: StepUpType = 'percentage',
  stepUpValue: number = 0
): SIPResult {
  if (stepUpValue <= 0) {
    return calcSIP(monthly, ratePercent, years);
  }

  const i = ratePercent / (12 * 100);
  let corpus = 0;
  let totalInvested = 0;
  let currentMonthly = monthly;

  for (let y = 1; y <= years; y++) {
    if (y > 1) {
      if (stepUpType === 'percentage') {
        currentMonthly = currentMonthly * (1 + stepUpValue / 100);
      } else {
        currentMonthly = currentMonthly + stepUpValue;
      }
    }
    for (let m = 1; m <= 12; m++) {
      if (i === 0) {
        corpus += currentMonthly;
      } else {
        corpus = (corpus + currentMonthly) * (1 + i);
      }
      totalInvested += currentMonthly;
    }
  }

  const gain = corpus - totalInvested;
  const gainPct = totalInvested > 0 ? (gain / totalInvested) * 100 : 0;

  return {
    maturity: corpus,
    invested: totalInvested,
    gain,
    gainPct,
    principalFraction: corpus > 0 ? totalInvested / corpus : 0,
    gainFraction: corpus > 0 ? gain / corpus : 0,
  };
}

/**
 * Year-by-year Step-Up SIP breakdown with monthly contribution tracking.
 */
export function calcStepUpSIPYearly(
  monthly: number,
  ratePercent: number,
  totalYears: number,
  stepUpType: StepUpType = 'percentage',
  stepUpValue: number = 0
): Array<{ year: number; monthlyInvestment: number; invested: number; maturity: number; gain: number }> {
  if (stepUpValue <= 0) {
    return Array.from({ length: totalYears }, (_, idx) => {
      const year = idx + 1;
      const r = calcSIP(monthly, ratePercent, year);
      return { year, monthlyInvestment: monthly, invested: r.invested, maturity: r.maturity, gain: r.gain };
    });
  }

  const i = ratePercent / (12 * 100);
  let corpus = 0;
  let totalInvested = 0;
  let currentMonthly = monthly;
  const yearly: Array<{ year: number; monthlyInvestment: number; invested: number; maturity: number; gain: number }> = [];

  for (let y = 1; y <= totalYears; y++) {
    if (y > 1) {
      if (stepUpType === 'percentage') {
        currentMonthly = currentMonthly * (1 + stepUpValue / 100);
      } else {
        currentMonthly = currentMonthly + stepUpValue;
      }
    }
    for (let m = 1; m <= 12; m++) {
      if (i === 0) {
        corpus += currentMonthly;
      } else {
        corpus = (corpus + currentMonthly) * (1 + i);
      }
      totalInvested += currentMonthly;
    }
    yearly.push({
      year: y,
      monthlyInvestment: Math.round(currentMonthly),
      invested: totalInvested,
      maturity: corpus,
      gain: corpus - totalInvested,
    });
  }

  return yearly;
}

