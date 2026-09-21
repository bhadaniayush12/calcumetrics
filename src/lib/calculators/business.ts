/** Business Calculators: Profit Margin, Markup vs Margin, ROI */

// ── Profit Margin ────────────────────────────────────────────────────────────
export interface ProfitMarginResult {
  grossProfit: number;
  grossMarginPct: number;
  netProfit: number;
  netMarginPct: number;
}

export function calcProfitMargin(revenue: number, cogs: number, operatingExpenses: number = 0, taxes: number = 0): ProfitMarginResult {
  const grossProfit = revenue - cogs;
  const grossMarginPct = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
  const netProfit = grossProfit - operatingExpenses - taxes;
  const netMarginPct = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  return { grossProfit, grossMarginPct, netProfit, netMarginPct };
}

// ── Markup vs Margin ──────────────────────────────────────────────────────────
export interface MarkupMarginResult {
  markupPct: number;
  marginPct: number;
  sellingPrice: number;
  profit: number;
}

export function markupToMargin(markupPct: number): number {
  return (markupPct / (100 + markupPct)) * 100;
}

export function marginToMarkup(marginPct: number): number {
  return marginPct < 100 ? (marginPct / (100 - marginPct)) * 100 : Infinity;
}

export function calcMarkupMargin(cost: number, markupPct: number): MarkupMarginResult {
  const sellingPrice = cost * (1 + markupPct / 100);
  const profit = sellingPrice - cost;
  const marginPct = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
  return { markupPct, marginPct, sellingPrice, profit };
}

// ── ROI ───────────────────────────────────────────────────────────────────────
export interface ROIResult {
  roi: number;           // Absolute ROI %
  annualisedROI: number; // Annualised ROI %
  netProfit: number;
}

export function calcROI(initialInvestment: number, finalValue: number, years: number = 1): ROIResult {
  const netProfit = finalValue - initialInvestment;
  const roi = initialInvestment > 0 ? (netProfit / initialInvestment) * 100 : 0;
  const annualisedROI = years > 0 && initialInvestment > 0
    ? (Math.pow(finalValue / initialInvestment, 1 / years) - 1) * 100
    : 0;
  return { roi, annualisedROI, netProfit };
}
