/** PPF (Public Provident Fund) Calculator — India specific
 * Rate sourced from rates.json (verified periodically).
 * Lock-in: 15 years. Interest calculated annually on lowest balance between 5th and end of month.
 * Simplified: annual compounding on yearly deposits.
 */

export interface PPFResult {
  maturity: number;
  invested: number;
  interest: number;
  investedFraction: number;
  interestFraction: number;
  yearlyBreakdown: Array<{ year: number; deposit: number; interestEarned: number; balance: number }>;
}

export function calcPPF(annualDeposit: number, ratePercent: number, years: number = 15): PPFResult {
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
  return {
    maturity: balance,
    invested,
    interest,
    investedFraction: balance > 0 ? invested / balance : 0,
    interestFraction: balance > 0 ? interest / balance : 0,
    yearlyBreakdown,
  };
}
