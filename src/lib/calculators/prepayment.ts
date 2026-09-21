/** Loan prepayment calculator */

export interface PrepaymentResult {
  originalEMI: number;
  originalTotalInterest: number;
  originalMonthsRemaining: number;
  newMonthsRemaining: number;   // if tenure reduced
  monthsSaved: number;
  interestSaved: number;
  newEMI?: number;              // if EMI reduced instead
}

export function calcLoanPrepayment(
  outstandingPrincipal: number,
  ratePercent: number,
  remainingMonths: number,
  prepaymentAmount: number,
  option: 'reduce-tenure' | 'reduce-emi' = 'reduce-tenure'
): PrepaymentResult {
  const r = ratePercent / (12 * 100);

  // Current EMI
  const emi = r === 0
    ? outstandingPrincipal / remainingMonths
    : (outstandingPrincipal * r * Math.pow(1 + r, remainingMonths)) / (Math.pow(1 + r, remainingMonths) - 1);
  const originalTotalInterest = emi * remainingMonths - outstandingPrincipal;

  const newPrincipal = outstandingPrincipal - prepaymentAmount;

  if (option === 'reduce-tenure') {
    // Find new months required with same EMI
    if (r === 0) {
      const newMonths = Math.ceil(newPrincipal / emi);
      return {
        originalEMI: emi,
        originalTotalInterest,
        originalMonthsRemaining: remainingMonths,
        newMonthsRemaining: newMonths,
        monthsSaved: remainingMonths - newMonths,
        interestSaved: emi * (remainingMonths - newMonths),
      };
    }
    // n = -ln(1 - r*P/EMI) / ln(1+r)
    const newMonths = Math.ceil(-Math.log(1 - (r * newPrincipal) / emi) / Math.log(1 + r));
    const newInterest = emi * newMonths - newPrincipal;
    return {
      originalEMI: emi,
      originalTotalInterest,
      originalMonthsRemaining: remainingMonths,
      newMonthsRemaining: newMonths,
      monthsSaved: remainingMonths - newMonths,
      interestSaved: originalTotalInterest - newInterest,
    };
  } else {
    // Reduce EMI, keep tenure
    const newEMI = r === 0
      ? newPrincipal / remainingMonths
      : (newPrincipal * r * Math.pow(1 + r, remainingMonths)) / (Math.pow(1 + r, remainingMonths) - 1);
    const newInterest = newEMI * remainingMonths - newPrincipal;
    return {
      originalEMI: emi,
      originalTotalInterest,
      originalMonthsRemaining: remainingMonths,
      newMonthsRemaining: remainingMonths,
      monthsSaved: 0,
      interestSaved: originalTotalInterest - newInterest,
      newEMI,
    };
  }
}
