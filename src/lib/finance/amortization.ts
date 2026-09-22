/**
 * amortization.ts — Loan amortization engine for Calcumetrics.
 *
 * Tier 2 shared engine (Section 3B). Consumed by:
 *   Loan Amortization, Mortgage, Loan Affordability,
 *   Debt-to-Income Ratio, Credit Card Payoff, Interest Rate solver.
 *
 * Design:
 *   - Pure TypeScript, zero DOM / window dependencies.
 *   - All intermediate math in full floating point; callers round at display.
 *   - Reducing-balance (French amortization) model.
 *   - Newton-Raphson solver for implied rate with max-iteration + tolerance guards.
 */

// ── Amortization Schedule ────────────────────────────────────────────────────

export interface AmortizationPeriod {
  period: number;      // 1-indexed payment number
  payment: number;     // Fixed EMI payment
  principal: number;   // Principal portion of this payment
  interest: number;    // Interest portion of this payment
  balance: number;     // Remaining principal after this payment
}

export interface AmortizationResult {
  /** Fixed periodic payment (EMI). */
  emi: number;
  /** Total amount paid over the loan term. */
  totalPayment: number;
  /** Total interest paid over the loan term. */
  totalInterest: number;
  /** Original principal. */
  principal: number;
  /** Annual rate (percent). */
  annualRatePct: number;
  /** Tenure in months. */
  tenureMonths: number;
  /** Principal fraction of total payment. */
  principalFraction: number;
  /** Interest fraction of total payment. */
  interestFraction: number;
  /**
   * Period-by-period schedule.
   * For performance, full schedule is only included when generateSchedule = true.
   */
  schedule: AmortizationPeriod[];
}

/**
 * Generate a full loan amortization schedule.
 *
 * @param principal        - Loan amount.
 * @param annualRatePct    - Annual interest rate in percent (e.g. 8.5 for 8.5%).
 * @param tenureYears      - Loan tenure in years.
 * @param generateSchedule - Whether to include period-by-period schedule. Default: false.
 */
export function calcAmortization(
  principal: number,
  annualRatePct: number,
  tenureYears: number,
  generateSchedule = false
): AmortizationResult {
  const tenureMonths = Math.round(tenureYears * 12);
  const r = annualRatePct / 100 / 12; // monthly rate

  // EMI = [P × r × (1+r)^n] / [(1+r)^n − 1]
  let emi: number;
  if (r === 0) {
    emi = tenureMonths > 0 ? principal / tenureMonths : 0;
  } else {
    const factor = Math.pow(1 + r, tenureMonths);
    emi = (principal * r * factor) / (factor - 1);
  }

  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principal;

  let schedule: AmortizationPeriod[] = [];
  if (generateSchedule) {
    let balance = principal;
    for (let i = 1; i <= tenureMonths; i++) {
      const interest = balance * r;
      const principalPortion = emi - interest;
      balance = Math.max(0, balance - principalPortion);
      schedule.push({
        period: i,
        payment: emi,
        principal: principalPortion,
        interest,
        balance,
      });
    }
  }

  return {
    emi,
    totalPayment,
    totalInterest,
    principal,
    annualRatePct,
    tenureMonths,
    principalFraction: totalPayment > 0 ? principal / totalPayment : 0,
    interestFraction: totalPayment > 0 ? totalInterest / totalPayment : 0,
    schedule,
  };
}

// ── Max Affordable Principal (Loan Affordability) ────────────────────────────

export interface AffordabilityResult {
  /** Maximum loan amount supportable by the given EMI budget. */
  maxLoanAmount: number;
  /** The EMI budget used (monthly payment). */
  monthlyBudget: number;
  /** Total interest that would be paid at the max loan amount. */
  totalInterest: number;
  /** Total repayment over the tenure. */
  totalRepayment: number;
}

/**
 * Calculate the maximum loan amount affordable for a given monthly payment.
 *
 * Inverts EMI formula: P = EMI × [(1+r)^n − 1] / [r × (1+r)^n]
 *
 * @param monthlyBudget - Maximum monthly payment the borrower can afford.
 * @param annualRatePct - Annual interest rate in percent.
 * @param tenureYears   - Loan tenure in years.
 */
export function calcAffordability(
  monthlyBudget: number,
  annualRatePct: number,
  tenureYears: number
): AffordabilityResult {
  const n = Math.round(tenureYears * 12);
  const r = annualRatePct / 100 / 12;

  let maxLoanAmount: number;
  if (r === 0) {
    maxLoanAmount = n > 0 ? monthlyBudget * n : 0;
  } else {
    const factor = Math.pow(1 + r, n);
    maxLoanAmount = (monthlyBudget * (factor - 1)) / (r * factor);
  }

  const totalRepayment = monthlyBudget * n;
  const totalInterest = totalRepayment - maxLoanAmount;

  return {
    maxLoanAmount,
    monthlyBudget,
    totalInterest: Math.max(0, totalInterest),
    totalRepayment,
  };
}

// ── Debt-to-Income Ratio ─────────────────────────────────────────────────────

export interface DTIResult {
  /** DTI as a percentage (e.g. 36.5 for 36.5%). */
  dtiPct: number;
  /** Monthly debt obligations. */
  monthlyDebt: number;
  /** Gross monthly income. */
  grossMonthlyIncome: number;
  /** Qualitative assessment of the DTI level. */
  assessment: 'excellent' | 'good' | 'fair' | 'poor' | 'very-poor';
}

/**
 * Calculate debt-to-income ratio.
 *
 * Thresholds (common lending benchmarks):
 *   ≤ 20%  — Excellent
 *   ≤ 28%  — Good
 *   ≤ 36%  — Fair
 *   ≤ 43%  — Poor (borderline for many lenders)
 *   > 43%  — Very Poor
 *
 * @param monthlyDebt        - Total monthly debt obligations (EMI, rent, credit card minimum).
 * @param grossMonthlyIncome - Gross (pre-tax) monthly income.
 */
export function calcDTI(monthlyDebt: number, grossMonthlyIncome: number): DTIResult {
  const dtiPct = grossMonthlyIncome > 0 ? (monthlyDebt / grossMonthlyIncome) * 100 : 0;

  let assessment: DTIResult['assessment'];
  if (dtiPct <= 20) assessment = 'excellent';
  else if (dtiPct <= 28) assessment = 'good';
  else if (dtiPct <= 36) assessment = 'fair';
  else if (dtiPct <= 43) assessment = 'poor';
  else assessment = 'very-poor';

  return { dtiPct, monthlyDebt, grossMonthlyIncome, assessment };
}

// ── Credit Card Payoff ────────────────────────────────────────────────────────

export interface CreditCardPayoffResult {
  /** Total months to pay off the balance. */
  payoffMonths: number;
  /** Total amount paid (principal + interest). */
  totalPaid: number;
  /** Total interest paid. */
  totalInterest: number;
  /** Monthly payment used. */
  monthlyPayment: number;
  /** Original balance. */
  balance: number;
  /** Whether the payment covers at least the first month's interest. */
  paymentSufficient: boolean;
}

/**
 * Calculate credit card payoff timeline.
 *
 * Uses reducing-balance model with fixed monthly payment.
 * Returns { paymentSufficient: false } if monthly payment ≤ first month's interest.
 *
 * @param balance        - Current outstanding balance.
 * @param aprPct         - Annual Percentage Rate (APR) in percent.
 * @param monthlyPayment - Fixed monthly payment.
 */
export function calcCreditCardPayoff(
  balance: number,
  aprPct: number,
  monthlyPayment: number
): CreditCardPayoffResult {
  const monthlyRate = aprPct / 100 / 12;
  const firstMonthInterest = balance * monthlyRate;

  if (monthlyPayment <= firstMonthInterest) {
    return {
      payoffMonths: Infinity,
      totalPaid: Infinity,
      totalInterest: Infinity,
      monthlyPayment,
      balance,
      paymentSufficient: false,
    };
  }

  // n = -log(1 - r×P/EMI) / log(1 + r)
  let payoffMonths: number;
  if (monthlyRate === 0) {
    payoffMonths = Math.ceil(balance / monthlyPayment);
  } else {
    payoffMonths = Math.ceil(
      -Math.log(1 - (monthlyRate * balance) / monthlyPayment) / Math.log(1 + monthlyRate)
    );
  }

  const totalPaid = monthlyPayment * payoffMonths;
  const totalInterest = totalPaid - balance;

  return {
    payoffMonths,
    totalPaid,
    totalInterest: Math.max(0, totalInterest),
    monthlyPayment,
    balance,
    paymentSufficient: true,
  };
}

// ── Implied Interest Rate Solver ──────────────────────────────────────────────

export interface ImpliedRateResult {
  /** Solved annual rate in percent, or NaN if not found. */
  annualRatePct: number;
  /** Monthly rate in percent. */
  monthlyRatePct: number;
  /** Whether the solver converged to a valid solution. */
  valid: boolean;
  /** Human-readable error message if not valid. */
  error?: string;
}

/**
 * Solve for the implied annual interest rate given principal, EMI, and tenure.
 *
 * Uses Newton-Raphson numerical method.
 * Max iterations: 200. Tolerance: 1e-10.
 * Explicit no-solution state — never returns NaN or Infinity.
 *
 * @param principal   - Loan amount.
 * @param emi         - Fixed monthly payment.
 * @param tenureYears - Loan tenure in years.
 */
export function calcImpliedRate(
  principal: number,
  emi: number,
  tenureYears: number
): ImpliedRateResult {
  const n = Math.round(tenureYears * 12);

  // Guard: EMI must be > P/n (otherwise no positive rate exists)
  if (emi <= 0 || principal <= 0 || n <= 0) {
    return { annualRatePct: 0, monthlyRatePct: 0, valid: false, error: 'Inputs must be positive.' };
  }
  if (emi <= principal / n) {
    return {
      annualRatePct: 0,
      monthlyRatePct: 0,
      valid: false,
      error: 'Monthly payment is too low to cover principal repayment. No valid rate exists.',
    };
  }

  // f(r) = P × r × (1+r)^n / [(1+r)^n - 1] - EMI = 0
  function f(r: number): number {
    if (r === 0) return principal / n - emi;
    const factor = Math.pow(1 + r, n);
    return (principal * r * factor) / (factor - 1) - emi;
  }

  function df(r: number): number {
    // Numerical derivative
    const h = 1e-8;
    return (f(r + h) - f(r - h)) / (2 * h);
  }

  const starts = [0.01, 0.005, 0.02, 0.001, 0.03];
  const MAX_ITER = 200;
  const TOL = 1e-10;

  for (const start of starts) {
    let r = start;
    for (let i = 0; i < MAX_ITER; i++) {
      const fv = f(r);
      const dfv = df(r);
      if (!Number.isFinite(dfv) || Math.abs(dfv) < 1e-15) break;
      const next = r - fv / dfv;
      if (!Number.isFinite(next) || next <= 0) break;
      if (Math.abs(next - r) < TOL && Math.abs(f(next)) < 1) {
        const annualRatePct = next * 12 * 100;
        return { annualRatePct, monthlyRatePct: next * 100, valid: true };
      }
      r = next;
    }
  }

  return {
    annualRatePct: 0,
    monthlyRatePct: 0,
    valid: false,
    error: 'Could not solve for a valid interest rate with the given inputs.',
  };
}
