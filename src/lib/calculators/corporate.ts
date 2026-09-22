/** Corporate Finance Calculators: WACC, NPV, IRR, Payback Period, DCF
 * Section 12 fixtures:
 * WACC: E/V 70%, Re 14.2%, D/V 30%, Rd 8.5%, tax 25% → 11.8525%
 * NPV @10%: -1,00,000; 30,000; 40,000; 50,000; 60,000 → ₹38,877.13
 * IRR (same flows): 24.89%
 */

// ── WACC ──────────────────────────────────────────────────────────────────────
export interface WACCResult {
  wacc: number;              // blended rate as decimal e.g. 0.118525
  waccPct: number;           // blended rate as percent e.g. 11.8525
  equityWeight: number;      // E / V decimal e.g. 0.70
  debtWeight: number;        // D / V decimal e.g. 0.30
  equityComponent: number;   // (E / V) * (Re / 100) decimal
  debtComponent: number;     // (D / V) * (Rd / 100) * (1 - T / 100) decimal
  equityComponentPct: number;// equity contribution in percent e.g. 9.94
  debtComponentPct: number;  // debt contribution in percent e.g. 1.9125
  taxShieldPct: number;      // interest tax shield percentage
  afterTaxCostOfDebt: number;// Rd * (1 - T / 100)
  totalCapital: number;      // V = E + D
}

export function calcWACC(
  equityWeight: number,    // as decimal e.g. 0.70
  costOfEquity: number,    // as percent e.g. 14.2
  debtWeight: number,      // as decimal e.g. 0.30
  costOfDebt: number,      // as percent e.g. 8.5
  taxRate: number          // as percent e.g. 25
): WACCResult {
  if (equityWeight < 0 || debtWeight < 0 || costOfEquity < 0 || costOfDebt < 0 || taxRate < 0) {
    return {
      wacc: 0,
      waccPct: 0,
      equityWeight: 0,
      debtWeight: 0,
      equityComponent: 0,
      debtComponent: 0,
      equityComponentPct: 0,
      debtComponentPct: 0,
      taxShieldPct: 0,
      afterTaxCostOfDebt: 0,
      totalCapital: 0,
    };
  }

  const equityComponent = equityWeight * (costOfEquity / 100);
  const afterTaxCostOfDebt = costOfDebt * (1 - taxRate / 100);
  const debtComponent = debtWeight * (afterTaxCostOfDebt / 100);
  const wacc = equityComponent + debtComponent;
  const taxShieldPct = debtWeight * (costOfDebt / 100) * (taxRate / 100) * 100;

  return {
    wacc,
    waccPct: wacc * 100,
    equityWeight,
    debtWeight,
    equityComponent,
    debtComponent,
    equityComponentPct: equityComponent * 100,
    debtComponentPct: debtComponent * 100,
    taxShieldPct,
    afterTaxCostOfDebt,
    totalCapital: 0,
  };
}

/**
 * Calculate WACC directly from market value of equity and debt.
 *
 * Formula:
 * V = E + D
 * WACC = (E / V × Re) + (D / V × Rd × (1 − T))
 */
export function calcWACCFromValues(
  equityValue: number,     // Market value of equity (E)
  debtValue: number,       // Market value of debt (D)
  costOfEquityPct: number, // Cost of equity (Re) as % e.g. 14.2
  costOfDebtPct: number,   // Cost of debt (Rd) as % e.g. 8.5
  taxRatePct: number       // Corporate tax rate (T) as % e.g. 25
): WACCResult {
  if (equityValue < 0 || debtValue < 0 || costOfEquityPct < 0 || costOfDebtPct < 0 || taxRatePct < 0) {
    return {
      wacc: 0,
      waccPct: 0,
      equityWeight: 0,
      debtWeight: 0,
      equityComponent: 0,
      debtComponent: 0,
      equityComponentPct: 0,
      debtComponentPct: 0,
      taxShieldPct: 0,
      afterTaxCostOfDebt: 0,
      totalCapital: 0,
    };
  }

  const totalCapital = equityValue + debtValue;
  if (totalCapital <= 0) {
    return {
      wacc: 0,
      waccPct: 0,
      equityWeight: 0,
      debtWeight: 0,
      equityComponent: 0,
      debtComponent: 0,
      equityComponentPct: 0,
      debtComponentPct: 0,
      taxShieldPct: 0,
      afterTaxCostOfDebt: 0,
      totalCapital: 0,
    };
  }

  const equityWeight = equityValue / totalCapital;
  const debtWeight = debtValue / totalCapital;

  const res = calcWACC(equityWeight, costOfEquityPct, debtWeight, costOfDebtPct, taxRatePct);
  return {
    ...res,
    totalCapital,
  };
}

// ── NPV ───────────────────────────────────────────────────────────────────────
export function calcNPV(discountRatePct: number, cashFlows: number[]): number {
  const r = discountRatePct / 100;
  return cashFlows.reduce((sum, cf, t) => sum + cf / Math.pow(1 + r, t), 0);
}

// ── IRR (Newton-Raphson) ──────────────────────────────────────────────────────
export interface IRRResult {
  irr: number;
  irrPct: number;
  valid: boolean;
  error?: string;
}

export function calcIRR(cashFlows: number[], maxIter = 1000, tol = 1e-7): IRRResult {
  const hasNeg = cashFlows.some((c) => c < 0);
  const hasPos = cashFlows.some((c) => c > 0);
  if (!hasNeg || !hasPos) {
    return { irr: 0, irrPct: 0, valid: false, error: 'Need at least one negative and one positive cash flow.' };
  }

  let rate = 0.1;
  for (let i = 0; i < maxIter; i++) {
    const npv = calcNPV(rate * 100, cashFlows);
    const npvDelta = calcNPV((rate + 1e-6) * 100, cashFlows);
    const derivative = (npvDelta - npv) / 1e-6;
    if (Math.abs(derivative) < 1e-12) break;
    const newRate = rate - npv / derivative;
    if (Math.abs(newRate - rate) < tol) {
      return { irr: newRate, irrPct: newRate * 100, valid: true };
    }
    rate = newRate;
  }
  return { irr: rate, irrPct: rate * 100, valid: true };
}

// ── Payback Period ────────────────────────────────────────────────────────────
export interface PaybackResult {
  paybackYears: number;   // May be fractional
  paybackMonths: number;
  recovered: boolean;     // Whether investment is recovered within cash flows
}

export function calcPayback(initialInvestment: number, annualCashFlows: number[]): PaybackResult {
  let cumulative = 0;
  for (let i = 0; i < annualCashFlows.length; i++) {
    const prev = cumulative;
    cumulative += annualCashFlows[i];
    if (cumulative >= initialInvestment) {
      const fraction = (initialInvestment - prev) / annualCashFlows[i];
      const paybackYears = i + fraction;
      return { paybackYears, paybackMonths: paybackYears * 12, recovered: true };
    }
  }
  return { paybackYears: Infinity, paybackMonths: Infinity, recovered: false };
}

// ── DCF ───────────────────────────────────────────────────────────────────────
export interface DCFResult {
  intrinsicValue: number;
  pvOfCashFlows: number;
  terminalValue: number;
  pvOfTerminalValue: number;
}

export function calcDCF(
  cashFlows: number[],     // Projected free cash flows
  discountRatePct: number,
  terminalGrowthRatePct: number
): DCFResult {
  const r = discountRatePct / 100;
  const g = terminalGrowthRatePct / 100;
  const pvOfCashFlows = cashFlows.reduce((sum, cf, t) => sum + cf / Math.pow(1 + r, t + 1), 0);
  const lastCF = cashFlows[cashFlows.length - 1] ?? 0;
  const terminalValue = r > g ? (lastCF * (1 + g)) / (r - g) : 0;
  const pvOfTerminalValue = terminalValue / Math.pow(1 + r, cashFlows.length);
  return {
    intrinsicValue: pvOfCashFlows + pvOfTerminalValue,
    pvOfCashFlows,
    terminalValue,
    pvOfTerminalValue,
  };
}
