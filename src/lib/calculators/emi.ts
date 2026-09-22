/** EMI (Equated Monthly Instalment) Calculator
 * Section 12: ₹10,00,000, 8.5% p.a., 20 yrs → EMI ₹8,678; total interest ₹10,82,776
 * Formula: EMI = P × r × (1+r)^n / ((1+r)^n − 1)
 * Use unrounded EMI internally; round only for display.
 */

export interface EMIResult {
  emi: number;           // Monthly EMI (unrounded for internal use)
  emiRounded: number;    // Displayed EMI
  totalPayment: number;
  totalInterest: number;
  principal: number;
  principalFraction: number;
  interestFraction: number;
}

export function calcEMI(principal: number, ratePercent: number, years: number): EMIResult {
  if (principal <= 0 || ratePercent < 0 || years <= 0) {
    return {
      emi: 0,
      emiRounded: 0,
      totalPayment: 0,
      totalInterest: 0,
      principal: 0,
      principalFraction: 0,
      interestFraction: 0,
    };
  }
  const n = years * 12;
  const r = ratePercent / (12 * 100);

  let emi: number;
  if (r === 0) {
    emi = principal / n;
  } else {
    emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  const emiRounded = Math.round(emi);
  // Total payment uses unrounded EMI internally (per spec)
  const totalPayment = emi * n;
  const totalInterest = totalPayment - principal;

  return {
    emi,
    emiRounded,
    totalPayment,
    totalInterest,
    principal,
    principalFraction: totalPayment > 0 ? principal / totalPayment : 0,
    interestFraction: totalPayment > 0 ? totalInterest / totalPayment : 0,
  };
}

/** Year-by-year amortization schedule */
export function calcEMIAmortization(
  principal: number,
  ratePercent: number,
  years: number
): Array<{ year: number; payment: number; principal: number; interest: number; balance: number }> {
  const { emi } = calcEMI(principal, ratePercent, years);
  const r = ratePercent / (12 * 100);
  let balance = principal;
  const rows: Array<{ year: number; payment: number; principal: number; interest: number; balance: number }> = [];

  for (let yr = 1; yr <= years; yr++) {
    let yearPayment = 0, yearPrincipal = 0, yearInterest = 0;
    for (let mo = 0; mo < 12 && balance > 0; mo++) {
      const intCharge = balance * r;
      const principalPart = Math.min(emi - intCharge, balance);
      balance -= principalPart;
      yearPayment += emi;
      yearPrincipal += principalPart;
      yearInterest += intCharge;
    }
    rows.push({
      year: yr,
      payment: yearPayment,
      principal: yearPrincipal,
      interest: yearInterest,
      balance: Math.max(0, balance),
    });
  }
  return rows;
}
