/** XIRR Calculator — Extended Internal Rate of Return for irregular cash flows
 * Uses Newton-Raphson iteration.
 * Requires at least one negative and one positive cash flow.
 */

export interface XIRRCashFlow {
  amount: number;   // Negative = outflow, positive = inflow
  date: Date;
}

export interface XIRRResult {
  xirr: number;     // As decimal
  xirrPct: number;  // As percentage
  valid: boolean;
  error?: string;
}

function npvAtRate(cashFlows: XIRRCashFlow[], rate: number): number {
  const t0 = cashFlows[0].date.getTime();
  return cashFlows.reduce((sum, cf) => {
    const years = (cf.date.getTime() - t0) / (365.25 * 24 * 3600 * 1000);
    return sum + cf.amount / Math.pow(1 + rate, years);
  }, 0);
}

export function calcXIRR(cashFlows: XIRRCashFlow[], maxIter = 1000, tol = 1e-7): XIRRResult {
  const hasNeg = cashFlows.some((c) => c.amount < 0);
  const hasPos = cashFlows.some((c) => c.amount > 0);
  if (!hasNeg || !hasPos) {
    return { xirr: 0, xirrPct: 0, valid: false, error: 'Need at least one negative and one positive cash flow.' };
  }

  const maxFlow = Math.max(...cashFlows.map((c) => Math.abs(c.amount)));
  const startRates = [0.1, 0.05, 0.2, -0.05, 0.5, -0.5];
  for (const start of startRates) {
    let rate = start;
    for (let i = 0; i < maxIter; i++) {
      // (1 + rate)^t is undefined for rate <= -100%; clamp just above it
      if (rate <= -0.999) rate = -0.99;
      const npv = npvAtRate(cashFlows, rate);
      const npvDelta = npvAtRate(cashFlows, rate + 1e-6);
      const derivative = (npvDelta - npv) / 1e-6;
      if (!Number.isFinite(derivative) || Math.abs(derivative) < 1e-12) break;
      const newRate = rate - npv / derivative;
      if (!Number.isFinite(newRate)) break;
      if (Math.abs(newRate - rate) < tol) {
        const residual = npvAtRate(cashFlows, newRate);
        if (Number.isFinite(residual) && Math.abs(residual) < Math.max(1e-6, maxFlow * 1e-6)) {
          return { xirr: newRate, xirrPct: newRate * 100, valid: true };
        }
        break;
      }
      rate = newRate;
    }
  }
  return { xirr: 0, xirrPct: 0, valid: false, error: 'XIRR did not converge to a finite real rate.' };
}
