/** Income Tax Calculator (India)
 * Compares New Tax Regime (Budget 2024 / FY 2024-25 / AY 2025-26) vs Old Tax Regime
 */

export interface TaxRegimeBreakdown {
  grossIncome: number;
  standardDeduction: number;
  totalDeductions: number;
  taxableIncome: number;
  baseTax: number;
  rebate87A: number;
  taxAfterRebate: number;
  cess: number;
  totalTax: number;
  effectiveRatePct: number;
  takeHomeIncome: number;
}

export interface IncomeTaxResult {
  newRegime: TaxRegimeBreakdown;
  oldRegime: TaxRegimeBreakdown;
  recommendedRegime: 'New Regime' | 'Old Regime' | 'Equal';
  taxSavings: number;
}

export function calcIncomeTax(
  grossIncome: number,
  deductions80C: number = 0,
  deductions80D: number = 0,
  otherDeductions: number = 0
): IncomeTaxResult {
  if (grossIncome <= 0) {
    const empty: TaxRegimeBreakdown = {
      grossIncome: 0,
      standardDeduction: 0,
      totalDeductions: 0,
      taxableIncome: 0,
      baseTax: 0,
      rebate87A: 0,
      taxAfterRebate: 0,
      cess: 0,
      totalTax: 0,
      effectiveRatePct: 0,
      takeHomeIncome: 0,
    };
    return { newRegime: empty, oldRegime: empty, recommendedRegime: 'Equal', taxSavings: 0 };
  }

  // ── 1. New Tax Regime (Budget 2024) ───────────────────────────────────────
  const newStdDed = 75000;
  const newTaxable = Math.max(0, grossIncome - newStdDed);
  let newBaseTax = 0;

  if (newTaxable > 1500000) {
    newBaseTax += (newTaxable - 1500000) * 0.30;
    newBaseTax += 300000 * 0.20; // 12L-15L
    newBaseTax += 200000 * 0.15; // 10L-12L
    newBaseTax += 300000 * 0.10; // 7L-10L
    newBaseTax += 400000 * 0.05; // 3L-7L
  } else if (newTaxable > 1200000) {
    newBaseTax += (newTaxable - 1200000) * 0.20;
    newBaseTax += 200000 * 0.15;
    newBaseTax += 300000 * 0.10;
    newBaseTax += 400000 * 0.05;
  } else if (newTaxable > 1000000) {
    newBaseTax += (newTaxable - 1000000) * 0.15;
    newBaseTax += 300000 * 0.10;
    newBaseTax += 400000 * 0.05;
  } else if (newTaxable > 700000) {
    newBaseTax += (newTaxable - 700000) * 0.10;
    newBaseTax += 400000 * 0.05;
  } else if (newTaxable > 300000) {
    newBaseTax += (newTaxable - 300000) * 0.05;
  }

  // Section 87A rebate for New Regime (up to 7,00,000 taxable income)
  let newRebate = 0;
  if (newTaxable <= 700000) {
    newRebate = newBaseTax;
  }
  const newTaxAfterRebate = Math.max(0, newBaseTax - newRebate);
  const newCess = newTaxAfterRebate * 0.04;
  const newTotalTax = Math.round(newTaxAfterRebate + newCess);

  const newRegime: TaxRegimeBreakdown = {
    grossIncome,
    standardDeduction: newStdDed,
    totalDeductions: newStdDed,
    taxableIncome: newTaxable,
    baseTax: Math.round(newBaseTax),
    rebate87A: Math.round(newRebate),
    taxAfterRebate: Math.round(newTaxAfterRebate),
    cess: Math.round(newCess),
    totalTax: newTotalTax,
    effectiveRatePct: grossIncome > 0 ? (newTotalTax / grossIncome) * 100 : 0,
    takeHomeIncome: grossIncome - newTotalTax,
  };

  // ── 2. Old Tax Regime ────────────────────────────────────────────────────
  const oldStdDed = 50000;
  const capped80C = Math.min(150000, Math.max(0, deductions80C));
  const capped80D = Math.min(100000, Math.max(0, deductions80D));
  const validOther = Math.max(0, otherDeductions);
  const oldTotalDeductions = oldStdDed + capped80C + capped80D + validOther;
  const oldTaxable = Math.max(0, grossIncome - oldTotalDeductions);
  let oldBaseTax = 0;

  if (oldTaxable > 1000000) {
    oldBaseTax += (oldTaxable - 1000000) * 0.30;
    oldBaseTax += 500000 * 0.20; // 5L-10L
    oldBaseTax += 250000 * 0.05; // 2.5L-5L
  } else if (oldTaxable > 500000) {
    oldBaseTax += (oldTaxable - 500000) * 0.20;
    oldBaseTax += 250000 * 0.05;
  } else if (oldTaxable > 250000) {
    oldBaseTax += (oldTaxable - 250000) * 0.05;
  }

  // Section 87A rebate for Old Regime (up to 5,00,000 taxable income)
  let oldRebate = 0;
  if (oldTaxable <= 500000) {
    oldRebate = oldBaseTax;
  }
  const oldTaxAfterRebate = Math.max(0, oldBaseTax - oldRebate);
  const oldCess = oldTaxAfterRebate * 0.04;
  const oldTotalTax = Math.round(oldTaxAfterRebate + oldCess);

  const oldRegime: TaxRegimeBreakdown = {
    grossIncome,
    standardDeduction: oldStdDed,
    totalDeductions: oldTotalDeductions,
    taxableIncome: oldTaxable,
    baseTax: Math.round(oldBaseTax),
    rebate87A: Math.round(oldRebate),
    taxAfterRebate: Math.round(oldTaxAfterRebate),
    cess: Math.round(oldCess),
    totalTax: oldTotalTax,
    effectiveRatePct: grossIncome > 0 ? (oldTotalTax / grossIncome) * 100 : 0,
    takeHomeIncome: grossIncome - oldTotalTax,
  };

  const taxSavings = Math.abs(oldTotalTax - newTotalTax);
  const recommendedRegime: 'New Regime' | 'Old Regime' | 'Equal' =
    newTotalTax < oldTotalTax
      ? 'New Regime'
      : oldTotalTax < newTotalTax
      ? 'Old Regime'
      : 'Equal';

  return {
    newRegime,
    oldRegime,
    recommendedRegime,
    taxSavings,
  };
}
