/**
 * time-value.ts — Time Value of Money engine for Calcumetrics.
 *
 * Tier 1 shared engine (Section 3B). Consumed by:
 *   Present Value Calculator, Future Value Calculator,
 *   Discounted Payback Period Calculator, Inflation Calculator,
 *   Savings Goal Calculator.
 *
 * Design:
 *   - Pure TypeScript, zero DOM / window dependencies.
 *   - All intermediate math kept in full floating point.
 *   - No rounding applied inside this module; callers round at display time.
 *   - Compounding frequencies stored as periods-per-year integers.
 */

// ── Compounding Frequencies ──────────────────────────────────────────────────

export type CompoundFrequency =
  | 'annually'
  | 'semi-annually'
  | 'quarterly'
  | 'monthly'
  | 'continuously';

export const COMPOUND_FREQ_MAP: Record<CompoundFrequency, number> = {
  annually: 1,
  'semi-annually': 2,
  quarterly: 4,
  monthly: 12,
  continuously: Infinity,
};

// ── Present Value ────────────────────────────────────────────────────────────

export interface PVResult {
  /** Present value of the future amount. */
  pv: number;
  /** Future amount provided as input. */
  futureAmount: number;
  /** Discount applied (futureAmount - pv). */
  totalDiscount: number;
  /** Discount as a fraction of the future amount. */
  discountFraction: number;
  /** PV as a fraction of the future amount. */
  pvFraction: number;
}

/**
 * Calculate the present value of a single future cash flow.
 *
 * @param futureAmount - The future cash flow amount (must be > 0).
 * @param ratePercent  - Annual discount rate in percent (e.g. 8 for 8%).
 * @param years        - Number of years until cash flow is received (must be > 0).
 * @param frequency    - Compounding frequency. Default: 'annually'.
 */
export function calcPV(
  futureAmount: number,
  ratePercent: number,
  years: number,
  frequency: CompoundFrequency = 'annually'
): PVResult {
  const r = ratePercent / 100;
  const n = COMPOUND_FREQ_MAP[frequency];

  let pv: number;
  if (n === Infinity) {
    // Continuous compounding: PV = FV × e^(−r×t)
    pv = futureAmount * Math.exp(-r * years);
  } else {
    // Discrete: PV = FV / (1 + r/n)^(n×t)
    pv = futureAmount / Math.pow(1 + r / n, n * years);
  }

  const totalDiscount = futureAmount - pv;

  return {
    pv,
    futureAmount,
    totalDiscount,
    discountFraction: futureAmount > 0 ? totalDiscount / futureAmount : 0,
    pvFraction: futureAmount > 0 ? pv / futureAmount : 0,
  };
}

// ── Future Value ─────────────────────────────────────────────────────────────

export interface FVResult {
  /** Future value of the present amount. */
  fv: number;
  /** Present amount provided as input. */
  presentAmount: number;
  /** Interest/growth earned (fv - presentAmount). */
  totalGrowth: number;
  /** Growth as a percentage of the present amount. */
  growthPct: number;
  /** Principal fraction of the future value. */
  principalFraction: number;
  /** Growth fraction of the future value. */
  growthFraction: number;
}

/**
 * Calculate the future value of a single present cash flow.
 *
 * @param presentAmount - The present amount (must be > 0).
 * @param ratePercent   - Annual growth/interest rate in percent.
 * @param years         - Number of years to grow (must be > 0).
 * @param frequency     - Compounding frequency. Default: 'annually'.
 */
export function calcFV(
  presentAmount: number,
  ratePercent: number,
  years: number,
  frequency: CompoundFrequency = 'annually'
): FVResult {
  const r = ratePercent / 100;
  const n = COMPOUND_FREQ_MAP[frequency];

  let fv: number;
  if (n === Infinity) {
    // Continuous compounding: FV = PV × e^(r×t)
    fv = presentAmount * Math.exp(r * years);
  } else {
    // Discrete: FV = PV × (1 + r/n)^(n×t)
    fv = presentAmount * Math.pow(1 + r / n, n * years);
  }

  const totalGrowth = fv - presentAmount;

  return {
    fv,
    presentAmount,
    totalGrowth,
    growthPct: presentAmount > 0 ? (totalGrowth / presentAmount) * 100 : 0,
    principalFraction: fv > 0 ? presentAmount / fv : 0,
    growthFraction: fv > 0 ? totalGrowth / fv : 0,
  };
}

// ── Discounted Payback Period ─────────────────────────────────────────────────

export interface DiscountedPaybackResult {
  /**
   * Fractional years to recover the initial investment.
   * Infinity if investment is never recovered within the provided cash flows.
   */
  paybackYears: number;
  /** paybackYears × 12 (Infinity if not recovered). */
  paybackMonths: number;
  /** True if investment is fully recovered within the provided cash flows. */
  recovered: boolean;
  /** Cumulative discounted cash flows per period. */
  cumulativeDiscounted: Array<{
    period: number;
    cashFlow: number;
    discounted: number;
    cumulative: number;
  }>;
  /** Sum of all discounted inflows. */
  totalPVInflows: number;
}

/**
 * Calculate the discounted payback period.
 *
 * @param initialInvestment - The upfront outlay (positive number, e.g. 100000).
 * @param annualCashFlows   - Array of periodic cash inflows (positive expected).
 * @param discountRatePct   - Annual discount rate in percent.
 */
export function calcDiscountedPayback(
  initialInvestment: number,
  annualCashFlows: number[],
  discountRatePct: number
): DiscountedPaybackResult {
  const r = discountRatePct / 100;
  let cumulative = 0;
  let totalPVInflows = 0;
  const cumulativeDiscounted: DiscountedPaybackResult['cumulativeDiscounted'] = [];
  let paybackYears = Infinity;
  let recovered = false;

  for (let i = 0; i < annualCashFlows.length; i++) {
    const period = i + 1;
    const cashFlow = annualCashFlows[i];
    const discounted = cashFlow / Math.pow(1 + r, period);
    const prevCumulative = cumulative;
    cumulative += discounted;
    totalPVInflows += discounted;

    cumulativeDiscounted.push({ period, cashFlow, discounted, cumulative });

    if (!recovered && cumulative >= initialInvestment) {
      // Fractional period interpolation
      const fraction = (initialInvestment - prevCumulative) / discounted;
      paybackYears = i + fraction;
      recovered = true;
    }
  }

  return {
    paybackYears,
    paybackMonths: paybackYears === Infinity ? Infinity : paybackYears * 12,
    recovered,
    cumulativeDiscounted,
    totalPVInflows,
  };
}

// ── Inflation Purchasing Power ────────────────────────────────────────────────

export interface InflationResult {
  /** Future cost of goods that cost presentValue today. */
  futureCost: number;
  /** Purchasing power of presentValue amount in today's terms after N years of inflation. */
  futurePurchasingPower: number;
  /** Total loss of purchasing power in nominal terms. */
  purchasingPowerLoss: number;
  /** Cumulative inflation over the period (%). */
  cumulativeInflationPct: number;
  /** Present value amount. */
  presentValue: number;
  /** Year-by-year breakdown. */
  yearlyBreakdown: Array<{ year: number; futureCost: number; purchasingPower: number }>;
}

/**
 * Calculate the inflation-adjusted future cost and purchasing power erosion.
 *
 * @param presentValue  - Current value / cost of goods.
 * @param inflationPct  - Annual inflation rate in percent.
 * @param years         - Number of years.
 */
export function calcInflation(
  presentValue: number,
  inflationPct: number,
  years: number
): InflationResult {
  const r = inflationPct / 100;
  const futureCost = presentValue * Math.pow(1 + r, years);
  const futurePurchasingPower = presentValue / Math.pow(1 + r, years);
  const purchasingPowerLoss = presentValue - futurePurchasingPower;
  const cumulativeInflationPct = (futureCost / presentValue - 1) * 100;

  const yearlyBreakdown = Array.from({ length: Math.min(years, 30) }, (_, i) => {
    const year = i + 1;
    return {
      year,
      futureCost: presentValue * Math.pow(1 + r, year),
      purchasingPower: presentValue / Math.pow(1 + r, year),
    };
  });

  return {
    futureCost,
    futurePurchasingPower,
    purchasingPowerLoss,
    cumulativeInflationPct,
    presentValue,
    yearlyBreakdown,
  };
}

// ── Savings Goal ─────────────────────────────────────────────────────────────

export interface SavingsGoalResult {
  /** Required monthly contribution to reach the target. */
  monthlyContribution: number;
  /** Required annual contribution to reach the target. */
  annualContribution: number;
  /** Total contributions over the period. */
  totalContributions: number;
  /** Total interest/growth earned. */
  totalInterest: number;
  /** Target amount. */
  targetAmount: number;
  /** Current savings (initial lump sum). */
  currentSavings: number;
}

/**
 * Calculate required periodic savings to reach a target amount.
 *
 * Uses the future value of an annuity-due formula solved for PMT.
 * FV = PV × (1+r)^n + PMT × [(1+r)^n - 1] / r
 * Solved for PMT: PMT = [FV - PV × (1+r)^n] × r / [(1+r)^n - 1]
 *
 * @param targetAmount   - Goal amount to accumulate.
 * @param currentSavings - Existing savings / initial deposit (≥ 0).
 * @param returnRatePct  - Annual expected return rate in percent.
 * @param years          - Number of years to reach the goal.
 */
export function calcSavingsGoal(
  targetAmount: number,
  currentSavings: number,
  returnRatePct: number,
  years: number
): SavingsGoalResult {
  const monthlyRate = returnRatePct / 100 / 12;
  const n = years * 12; // total months

  let monthlyContribution: number;

  if (monthlyRate === 0 || n === 0) {
    // Simple case: no interest
    const remaining = Math.max(0, targetAmount - currentSavings);
    monthlyContribution = n > 0 ? remaining / n : Infinity;
  } else {
    const fvFactor = Math.pow(1 + monthlyRate, n);
    const fvOfCurrentSavings = currentSavings * fvFactor;
    const remaining = Math.max(0, targetAmount - fvOfCurrentSavings);
    // PMT = remaining × r / [(1+r)^n - 1]
    monthlyContribution = remaining > 0 ? (remaining * monthlyRate) / (fvFactor - 1) : 0;
  }

  const totalContributions = monthlyContribution * n + currentSavings;
  const totalInterest = targetAmount - totalContributions;

  return {
    monthlyContribution,
    annualContribution: monthlyContribution * 12,
    totalContributions,
    totalInterest: Math.max(0, totalInterest),
    targetAmount,
    currentSavings,
  };
}
