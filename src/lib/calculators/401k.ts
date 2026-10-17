/** 401(k) Calculator — US specific
 * Models annual contributions with employer match, annual compounding.
 */

/**
 * IRS elective deferral limits for 2026 (IR-2025-111, Nov. 13, 2025; Notice 2025-67):
 * $24,500 base; age 50+ catch-up $8,000 (total $32,500); ages 60–63 catch-up $11,250.
 * https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500
 */
export const K401_LIMIT_YEAR = 2026;
export const K401_ELECTIVE_DEFERRAL_LIMIT = 24500;
export const K401_CATCH_UP_50_PLUS = 8000;
export const K401_CATCH_UP_60_TO_63 = 11250;

export interface K401Result {
  maturity: number;
  employeeContributed: number;
  employerContributed: number;
  totalContributed: number;
  gain: number;
  contributedFraction: number;
  gainFraction: number;
  /** Elective deferral cap applied to the employee contribution each year. */
  deferralLimit: number;
  /** True when the requested contribution % exceeded the cap and was reduced to it. */
  employeeContribCapped: boolean;
  yearlyBreakdown: Array<{
    year: number;
    employeeContrib: number;
    employerContrib: number;
    gain: number;
    balance: number;
  }>;
}

export function calc401K(
  annualSalary: number,
  contributionPct: number,
  employerMatchPct: number,
  employerMatchUpToPct: number,
  ratePercent: number,
  years: number,
  deferralLimit: number = K401_ELECTIVE_DEFERRAL_LIMIT
): K401Result {
  const rate = ratePercent / 100;
  const requestedContrib = annualSalary * (contributionPct / 100);
  // Employee deferrals cannot exceed the IRS elective deferral limit.
  const empContribPerYear = Math.min(requestedContrib, deferralLimit);
  const employeeContribCapped = requestedContrib > deferralLimit;
  // The employer matches what the employee actually defers, up to the match ceiling.
  const matchableContrib = Math.min(empContribPerYear, annualSalary * (employerMatchUpToPct / 100));
  const erContribPerYear = matchableContrib * (employerMatchPct / 100);

  let balance = 0;
  let totalEmp = 0, totalEr = 0;
  const yearlyBreakdown = [];

  for (let yr = 1; yr <= years; yr++) {
    const prevBalance = balance;
    balance = (balance + empContribPerYear + erContribPerYear) * (1 + rate);
    const gainThisYear = balance - prevBalance - empContribPerYear - erContribPerYear;
    totalEmp += empContribPerYear;
    totalEr += erContribPerYear;
    yearlyBreakdown.push({
      year: yr,
      employeeContrib: empContribPerYear,
      employerContrib: erContribPerYear,
      gain: gainThisYear,
      balance,
    });
  }

  const totalContributed = totalEmp + totalEr;
  const gain = balance - totalContributed;
  return {
    maturity: balance,
    employeeContributed: totalEmp,
    employerContributed: totalEr,
    totalContributed,
    gain,
    contributedFraction: balance > 0 ? totalContributed / balance : 0,
    gainFraction: balance > 0 ? gain / balance : 0,
    deferralLimit,
    employeeContribCapped,
    yearlyBreakdown,
  };
}
