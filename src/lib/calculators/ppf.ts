/** PPF (Public Provident Fund) Calculator — India specific
 * Sourced from versioned statutory data in src/data/tax/india/ppf/current.json.
 * Lock-in: 15 years. Interest calculated annually on lowest balance between 5th and end of month.
 * Simplified: annual compounding on yearly deposits.
 */

import ppfData from '../../data/tax/india/ppf/current.json';

export interface PPFResult {
  maturity: number;
  invested: number;
  interest: number;
  gain: number;
  investedFraction: number;
  interestFraction: number;
  principalFraction: number;
  gainFraction: number;
  yearlyBreakdown: Array<{ year: number; deposit: number; interestEarned: number; balance: number }>;
}

export const PPF_DEFAULT_RATE = ppfData.values.annualInterestRatePct;
export const PPF_LOCK_IN_YEARS = ppfData.values.lockInYears;

export function calcPPF(
  annualDeposit: number,
  ratePercent: number = PPF_DEFAULT_RATE,
  years: number = PPF_LOCK_IN_YEARS
): PPFResult {
  let balance = 0;
  const yearlyBreakdown = [];
  const rate = ratePercent / 100;

  for (let yr = 1; yr <= years; yr++) {
    balance += annualDeposit;
    const interestEarned = balance * rate;
    balance += interestEarned;
    yearlyBreakdown.push({ year: yr, deposit: annualDeposit, interestEarned, balance });
  }

  const invested = annualDeposit * years;
  const interest = balance - invested;
  const investedFraction = balance > 0 ? invested / balance : 0;
  const interestFraction = balance > 0 ? interest / balance : 0;

  return {
    maturity: balance,
    invested,
    interest,
    gain: interest,
    investedFraction,
    interestFraction,
    principalFraction: investedFraction,
    gainFraction: interestFraction,
    yearlyBreakdown,
  };
}
