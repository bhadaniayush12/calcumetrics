/** Break-even Calculator
 * Section 12: fixed ₹5,00,000, price ₹500, variable ₹300 → 2,500 units
 * Formula: BEP (units) = Fixed Costs / (Price − Variable Cost per Unit)
 */
export interface BreakEvenResult {
  unitsBreakEven: number;
  revenueBreakEven: number;
  contributionMargin: number;
  contributionMarginRatio: number;
}

export function calcBreakEven(fixedCosts: number, pricePerUnit: number, variableCostPerUnit: number): BreakEvenResult {
  const cm = pricePerUnit - variableCostPerUnit;
  const units = cm > 0 ? fixedCosts / cm : Infinity;
  return {
    unitsBreakEven: units,
    revenueBreakEven: units * pricePerUnit,
    contributionMargin: cm,
    contributionMarginRatio: pricePerUnit > 0 ? cm / pricePerUnit : 0,
  };
}
