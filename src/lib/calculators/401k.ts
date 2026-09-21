/** 401(k) Calculator — US specific
 * Models annual contributions with employer match, annual compounding.
 */

export interface K401Result {
  maturity: number;
  employeeContributed: number;
  employerContributed: number;
  totalContributed: number;
  gain: number;
  contributedFraction: number;
  gainFraction: number;
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
  years: number
): K401Result {
  const rate = ratePercent / 100;
  const empContribPerYear = annualSalary * (contributionPct / 100);
  const matchableContrib = annualSalary * (Math.min(contributionPct, employerMatchUpToPct) / 100);
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
    yearlyBreakdown,
  };
}
