/**
 * calculator-types.ts — Canonical calculator archetypes for Calcumetrics.
 *
 * Every calculator page should declare its type by passing the `calcType` prop
 * to CalculatorLayout. The value is stamped onto the DOM as `data-calc-type`
 * for tooling, auditing, and future A/B logic.
 *
 * Usage (in a calculator page frontmatter or script):
 *
 *   import { CalculatorType } from '../lib/calculator-types';
 *
 *   <CalculatorLayout calcType={CalculatorType.Advanced} ... />
 */

/**
 * The 6 approved canonical calculator archetypes.
 *
 * | Type            | Inputs      | Outputs                                      | Examples                        |
 * |-----------------|-------------|----------------------------------------------|---------------------------------|
 * | Simple          | ≤ 4         | 1 primary result                             | CAGR, Simple Interest, ROI      |
 * | MultiInput      | 5–10        | 1 combined result set                        | COGS, EMI, Depreciation         |
 * | Advanced        | Any         | Primary result + derived metrics / chart     | SIP, FD, DCF, IRR               |
 * | Suite           | 1 shared set| Multiple related ratio outputs               | Liquidity Ratios, Working Capital|
 * | DualComparison  | 2 input sets| Two independent results shown side-by-side   | Markup vs Margin                |
 * | RepeatableRow   | Dynamic rows| Aggregate over variable row count            | XIRR, future row-based calcs    |
 */
export const CalculatorType = {
  /**
   * Single formula, ≤ 4 inputs, one primary result.
   * Examples: CAGR, Simple Interest, ROI, Break-Even, Profit Margin.
   */
  Simple: 'simple',

  /**
   * Multi-input form producing one combined result set (no chart).
   * Examples: COGS, EMI, Depreciation, EOQ, Inventory Turnover.
   */
  MultiInput: 'multi-input',

  /**
   * Multi-input with a primary result plus derived metrics table or chart.
   * Examples: SIP, FD, RD, Compound Interest, DCF, NPV, Payback Period.
   */
  Advanced: 'advanced',

  /**
   * Single shared input set producing multiple related ratio outputs.
   * Examples: Liquidity Ratios Suite, Working Capital Ratios.
   */
  Suite: 'suite',

  /**
   * Two independent computations rendered side-by-side for comparison.
   * Examples: Markup vs Margin, Loan Prepayment comparison.
   */
  DualComparison: 'dual-comparison',

  /**
   * Dynamic row addition per item; aggregate computed over variable row count.
   * Examples: XIRR, IRR (multi cash-flow), future repeatable-row calculators.
   */
  RepeatableRow: 'repeatable-row',
} as const;

/**
 * Union type of all valid calculator type values.
 * Use this as a prop type when you need a typed string:
 *
 *   calcType?: CalculatorType
 */
export type CalculatorType = (typeof CalculatorType)[keyof typeof CalculatorType];
