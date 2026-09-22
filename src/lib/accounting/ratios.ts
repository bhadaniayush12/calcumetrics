/**
 * ratios.ts — Accounting ratio engine for Calcumetrics.
 *
 * Tier 4 shared engine (Section 3B). Consumed by:
 *   Working Capital Calculator, COGS Calculator, Inventory Turnover Calculator,
 *   Liquidity Ratios Suite, Cash Conversion Cycle Calculator,
 *   Debt Service Coverage Ratio (DSCR) Calculator.
 *
 * Design:
 *   - Pure TypeScript, zero DOM / window dependencies.
 *   - All intermediate math in full floating point; callers round at display.
 *   - Accounting sign conventions: assets & revenues are positive values.
 *   - Ratio definitions are consistent across all consumers — no per-tool
 *     redefinition of the same ratio with slightly different formula.
 */

// ── Working Capital ───────────────────────────────────────────────────────────

export interface WorkingCapitalResult {
  /** Net Working Capital = Current Assets − Current Liabilities. */
  nwc: number;
  /** Current Ratio = Current Assets / Current Liabilities. */
  currentRatio: number;
  /** Quick Ratio = (Current Assets − Inventory) / Current Liabilities. */
  quickRatio: number;
  /** Cash Ratio = Cash & Equivalents / Current Liabilities. */
  cashRatio: number;
  currentAssets: number;
  currentLiabilities: number;
  inventory: number;
  cash: number;
}

/**
 * Calculate working capital and associated liquidity ratios.
 *
 * @param currentAssets      - Total current assets (₹ or currency-agnostic).
 * @param currentLiabilities - Total current liabilities.
 * @param inventory          - Inventory component of current assets.
 * @param cash               - Cash & cash equivalents component of current assets.
 */
export function calcWorkingCapital(
  currentAssets: number,
  currentLiabilities: number,
  inventory: number,
  cash: number
): WorkingCapitalResult {
  const nwc = currentAssets - currentLiabilities;
  const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : Infinity;
  const quickRatio = currentLiabilities > 0
    ? (currentAssets - inventory) / currentLiabilities
    : Infinity;
  const cashRatio = currentLiabilities > 0 ? cash / currentLiabilities : Infinity;

  return { nwc, currentRatio, quickRatio, cashRatio, currentAssets, currentLiabilities, inventory, cash };
}

// ── Liquidity Ratios Suite ────────────────────────────────────────────────────

export interface LiquidityRatiosResult {
  /** Current Ratio = Current Assets / Current Liabilities. */
  currentRatio: number;
  /** Quick (Acid-Test) Ratio = (Cash + Short-term Securities + Net Receivables) / Current Liabilities. */
  quickRatio: number;
  /** Cash Ratio = Cash & Equivalents / Current Liabilities. */
  cashRatio: number;
  /** Qualitative interpretation of current ratio. */
  currentRatioAssessment: string;
  /** Qualitative interpretation of quick ratio. */
  quickRatioAssessment: string;
}

/**
 * Calculate the Liquidity Ratios Suite from its canonical inputs.
 * These formulas are identical to those in calcWorkingCapital above,
 * ensuring no per-tool formula drift.
 *
 * @param cash             - Cash and cash equivalents.
 * @param receivables      - Net accounts receivable.
 * @param inventory        - Inventory value.
 * @param otherCurrentAssets - Other current assets (prepaid, etc.).
 * @param currentLiabilities - Total current liabilities.
 */
export function calcLiquidityRatios(
  cash: number,
  receivables: number,
  inventory: number,
  otherCurrentAssets: number,
  currentLiabilities: number
): LiquidityRatiosResult {
  const currentAssets = cash + receivables + inventory + otherCurrentAssets;
  const currentRatio = currentLiabilities > 0 ? currentAssets / currentLiabilities : Infinity;
  const quickRatio = currentLiabilities > 0
    ? (cash + receivables) / currentLiabilities
    : Infinity;
  const cashRatio = currentLiabilities > 0 ? cash / currentLiabilities : Infinity;

  function assessCurrentRatio(r: number): string {
    if (r >= 2) return 'Strong — well above the 2:1 benchmark';
    if (r >= 1.5) return 'Good — comfortable liquidity cushion';
    if (r >= 1) return 'Adequate — can meet current obligations';
    if (r >= 0.5) return 'Weak — limited ability to cover current obligations';
    return 'Critical — current liabilities exceed current assets';
  }

  function assessQuickRatio(r: number): string {
    if (r >= 1.5) return 'Strong — very liquid without relying on inventory';
    if (r >= 1) return 'Good — can meet immediate obligations';
    if (r >= 0.5) return 'Fair — moderate dependence on inventory';
    return 'Weak — relies heavily on inventory liquidation';
  }

  return {
    currentRatio,
    quickRatio,
    cashRatio,
    currentRatioAssessment: assessCurrentRatio(currentRatio),
    quickRatioAssessment: assessQuickRatio(quickRatio),
  };
}

// ── COGS ─────────────────────────────────────────────────────────────────────

export interface COGSResult {
  /** Cost of Goods Sold = Opening Inventory + Purchases − Closing Inventory. */
  cogs: number;
  /** Gross Profit = Revenue − COGS. */
  grossProfit: number;
  /** Gross Profit Margin = Gross Profit / Revenue × 100 (%). */
  grossMarginPct: number;
  /** Goods Available for Sale = Opening Inventory + Purchases. */
  goodsAvailableForSale: number;
  openingInventory: number;
  purchases: number;
  closingInventory: number;
  revenue: number;
}

/**
 * Calculate COGS, gross profit, and gross margin.
 *
 * @param openingInventory - Beginning inventory value.
 * @param purchases        - Net purchases during the period.
 * @param closingInventory - Ending inventory value.
 * @param revenue          - Net revenue for the period.
 */
export function calcCOGS(
  openingInventory: number,
  purchases: number,
  closingInventory: number,
  revenue: number
): COGSResult {
  const goodsAvailableForSale = openingInventory + purchases;
  const cogs = goodsAvailableForSale - closingInventory;
  const grossProfit = revenue - cogs;
  const grossMarginPct = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

  return { cogs, grossProfit, grossMarginPct, goodsAvailableForSale, openingInventory, purchases, closingInventory, revenue };
}

// ── Inventory Turnover ────────────────────────────────────────────────────────

export interface InventoryTurnoverResult {
  /** Inventory Turnover Ratio = COGS / Average Inventory. */
  inventoryTurnover: number;
  /** Days Sales of Inventory (DSI) = 365 / Inventory Turnover. */
  dsi: number;
  /** Average Inventory = (Opening + Closing) / 2. */
  averageInventory: number;
  cogs: number;
}

/**
 * Calculate inventory turnover ratio and DSI.
 *
 * @param cogs             - Cost of Goods Sold for the period.
 * @param openingInventory - Beginning inventory value.
 * @param closingInventory - Ending inventory value.
 * @param daysInPeriod     - Days in the reporting period. Default: 365.
 */
export function calcInventoryTurnover(
  cogs: number,
  openingInventory: number,
  closingInventory: number,
  daysInPeriod = 365
): InventoryTurnoverResult {
  const averageInventory = (openingInventory + closingInventory) / 2;
  const inventoryTurnover = averageInventory > 0 ? cogs / averageInventory : 0;
  const dsi = inventoryTurnover > 0 ? daysInPeriod / inventoryTurnover : Infinity;

  return { inventoryTurnover, dsi, averageInventory, cogs };
}

// ── Cash Conversion Cycle ─────────────────────────────────────────────────────

export interface CCCResult {
  /** Cash Conversion Cycle = DSO + DSI − DPO (days). */
  ccc: number;
  /** Days Sales Outstanding = (Accounts Receivable / Revenue) × Days. */
  dso: number;
  /** Days Sales of Inventory = (Inventory / COGS) × Days. */
  dsi: number;
  /** Days Payable Outstanding = (Accounts Payable / COGS) × Days. */
  dpo: number;
  /** Interpretation: positive = cash tied up; negative = float advantage. */
  assessment: string;
}

/**
 * Calculate the Cash Conversion Cycle.
 *
 * CCC = DSO + DSI − DPO
 *
 * @param accountsReceivable - Net accounts receivable.
 * @param revenue            - Net revenue for the period.
 * @param inventory          - Inventory value.
 * @param cogs               - Cost of Goods Sold.
 * @param accountsPayable    - Accounts payable.
 * @param daysInPeriod       - Days in the reporting period. Default: 365.
 */
export function calcCCC(
  accountsReceivable: number,
  revenue: number,
  inventory: number,
  cogs: number,
  accountsPayable: number,
  daysInPeriod = 365
): CCCResult {
  const dso = revenue > 0 ? (accountsReceivable / revenue) * daysInPeriod : 0;
  const dsi = cogs > 0 ? (inventory / cogs) * daysInPeriod : 0;
  const dpo = cogs > 0 ? (accountsPayable / cogs) * daysInPeriod : 0;
  const ccc = dso + dsi - dpo;

  let assessment: string;
  if (ccc < 0) {
    assessment = 'Negative CCC — company collects cash before paying suppliers (strong cash position)';
  } else if (ccc <= 30) {
    assessment = 'Excellent — cash cycle is very short';
  } else if (ccc <= 60) {
    assessment = 'Good — cash cycle is within industry norms';
  } else if (ccc <= 90) {
    assessment = 'Fair — cash is tied up for a moderate period';
  } else {
    assessment = 'Weak — significant cash is locked up in operations';
  }

  return { ccc, dso, dsi, dpo, assessment };
}

// ── DSCR ──────────────────────────────────────────────────────────────────────

export interface DSCRResult {
  /** Debt Service Coverage Ratio = Net Operating Income / Total Debt Service. */
  dscr: number;
  /** Net Operating Income (NOI) used. */
  noi: number;
  /** Total Debt Service (principal + interest for the period). */
  totalDebtService: number;
  /** Qualitative assessment. */
  assessment: string;
}

/**
 * Calculate Debt Service Coverage Ratio.
 *
 * DSCR = Net Operating Income / Total Debt Service
 *
 * Thresholds:
 *   ≥ 2.0   — Strong / easily serviceable
 *   ≥ 1.25  — Good (common minimum for commercial lenders)
 *   ≥ 1.0   — Break-even (barely covers debt service)
 *   < 1.0   — Insufficient cash flow to service debt
 *
 * @param netOperatingIncome - EBIT or NOI for the period.
 * @param totalDebtService   - Total principal + interest due in the same period.
 */
export function calcDSCR(netOperatingIncome: number, totalDebtService: number): DSCRResult {
  const dscr = totalDebtService > 0 ? netOperatingIncome / totalDebtService : Infinity;

  let assessment: string;
  if (dscr >= 2) assessment = 'Strong — operating income more than covers debt obligations';
  else if (dscr >= 1.25) assessment = 'Good — comfortable DSCR; meets most lender requirements';
  else if (dscr >= 1) assessment = 'Break-even — operating income barely covers debt service';
  else assessment = 'Insufficient — operating income does not cover total debt service';

  return { dscr, noi: netOperatingIncome, totalDebtService, assessment };
}
