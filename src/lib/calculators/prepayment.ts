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

  if (outstandingPrincipal <= 0 || remainingMonths <= 0 || ratePercent < 0) {
    return {
      originalEMI: 0,
      originalTotalInterest: 0,
      originalMonthsRemaining: Math.max(0, remainingMonths),
      newMonthsRemaining: Math.max(0, remainingMonths),
      monthsSaved: 0,
      interestSaved: 0,
    };
  }

  // Current EMI
  const emi = r === 0
    ? outstandingPrincipal / remainingMonths
    : (outstandingPrincipal * r * Math.pow(1 + r, remainingMonths)) / (Math.pow(1 + r, remainingMonths) - 1);
  const originalTotalInterest = emi * remainingMonths - outstandingPrincipal;

  // A prepayment can at most clear the loan
  const newPrincipal = Math.max(0, outstandingPrincipal - Math.max(0, prepaymentAmount));

  if (newPrincipal === 0) {
    return {
      originalEMI: emi,
      originalTotalInterest,
      originalMonthsRemaining: remainingMonths,
      newMonthsRemaining: 0,
      monthsSaved: remainingMonths,
      interestSaved: originalTotalInterest,
      ...(option === 'reduce-emi' ? { newEMI: 0 } : {}),
    };
  }

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
        interestSaved: 0, // No interest is charged at 0%, so none can be saved
      };
    }
    // n = -ln(1 - r*P/EMI) / ln(1+r)
    const exactMonths = -Math.log(1 - (r * newPrincipal) / emi) / Math.log(1 + r);
    const newMonths = Math.ceil(exactMonths - 1e-9);
    // Interest over the shortened term. The last instalment is partial, so use the
    // closed-form balance after (newMonths − 1) full payments instead of emi × newMonths.
    const full = newMonths - 1;
    const balBeforeLast = newPrincipal * Math.pow(1 + r, full) - (emi * (Math.pow(1 + r, full) - 1)) / r;
    const lastPayment = Math.max(0, balBeforeLast) * (1 + r);
    const newInterest = emi * full + lastPayment - newPrincipal;
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
