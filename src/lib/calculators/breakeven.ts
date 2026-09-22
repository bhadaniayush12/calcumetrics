/**
 * Pure calculation functions for Break-even Analysis.
 * Section 12 fixture: Fixed ₹5,00,000, Price ₹500, Variable ₹300 → 2,500 units, ₹12,50,000 revenue
 *
 * Formulas:
 * Contribution Margin per Unit (CM) = Price − Variable Cost
 * Contribution Margin Ratio (CMR) = CM / Price
 * Variable Cost Ratio (VCR) = Variable Cost / Price
 * Break-Even Point (Units) = Fixed Costs / CM
 * Break-Even Point (Revenue) = Break-Even Units × Price = Fixed Costs / CMR
 *
 * All computations use full float precision; round only at render time.
 */

export interface BreakEvenResult {
  unitsBreakEven: number;
  revenueBreakEven: number;
  contributionMargin: number;
  contributionMarginRatio: number;
  variableCostRatio: number;
  isPossible: boolean;
}

/**
 * Calculate the break-even volume and revenue.
 *
 * @param fixedCosts - Total fixed overhead costs (e.g. rent, salaries, depreciation)
 * @param pricePerUnit - Selling price charged per unit
 * @param variableCostPerUnit - Variable cost incurred per unit (e.g. materials, shipping)
 */
export function calcBreakEven(
  fixedCosts: number,
  pricePerUnit: number,
  variableCostPerUnit: number
): BreakEvenResult {
  if (fixedCosts < 0 || pricePerUnit < 0 || variableCostPerUnit < 0) {
    return {
      unitsBreakEven: 0,
      revenueBreakEven: 0,
      contributionMargin: 0,
      contributionMarginRatio: 0,
      variableCostRatio: 0,
      isPossible: false,
    };
  }

  const cm = pricePerUnit - variableCostPerUnit;
  const isPossible = cm > 0;
  const cmRatio = pricePerUnit > 0 ? cm / pricePerUnit : 0;
  const vcRatio = pricePerUnit > 0 ? variableCostPerUnit / pricePerUnit : 0;

  let unitsBreakEven = Infinity;
  let revenueBreakEven = Infinity;

  if (isPossible) {
    if (fixedCosts === 0) {
      unitsBreakEven = 0;
      revenueBreakEven = 0;
    } else {
      unitsBreakEven = fixedCosts / cm;
      revenueBreakEven = unitsBreakEven * pricePerUnit;
    }
  }

  return {
    unitsBreakEven,
    revenueBreakEven,
    contributionMargin: cm,
    contributionMarginRatio: cmRatio,
    variableCostRatio: vcRatio,
    isPossible,
  };
}
