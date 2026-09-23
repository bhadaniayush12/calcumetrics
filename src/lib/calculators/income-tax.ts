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

  // ── 1. New Tax Regime (Current FY 2025-26 & FY 2026-27) ─────────────────
  // Slabs: 0-4L Nil, 4-8L 5%, 8-12L 10%, 12-16L 15%, 16-20L 20%, 20-24L 25%, >24L 30%
  // Standard deduction: ₹75,000. Section 87A rebate: zero tax up to ₹12 Lakh taxable.
  const newStdDed = 75000;
  const newTaxable = Math.max(0, grossIncome - newStdDed);
  let newBaseTax = 0;

  if (newTaxable > 2400000) {
    newBaseTax += (newTaxable - 2400000) * 0.30;
    newBaseTax += 400000 * 0.25; // 20L-24L (1,00,000)
    newBaseTax += 400000 * 0.20; // 16L-20L (80,000)
    newBaseTax += 400000 * 0.15; // 12L-16L (60,000)
    newBaseTax += 400000 * 0.10; // 8L-12L  (40,000)
    newBaseTax += 400000 * 0.05; // 4L-8L   (20,000)
  } else if (newTaxable > 2000000) {
    newBaseTax += (newTaxable - 2000000) * 0.25;
    newBaseTax += 400000 * 0.20;
    newBaseTax += 400000 * 0.15;
    newBaseTax += 400000 * 0.10;
    newBaseTax += 400000 * 0.05;
  } else if (newTaxable > 1600000) {
    newBaseTax += (newTaxable - 1600000) * 0.20;
    newBaseTax += 400000 * 0.15;
    newBaseTax += 400000 * 0.10;
    newBaseTax += 400000 * 0.05;
  } else if (newTaxable > 1200000) {
    newBaseTax += (newTaxable - 1200000) * 0.15;
    newBaseTax += 400000 * 0.10;
    newBaseTax += 400000 * 0.05;
  } else if (newTaxable > 800000) {
    newBaseTax += (newTaxable - 800000) * 0.10;
    newBaseTax += 400000 * 0.05;
  } else if (newTaxable > 400000) {
    newBaseTax += (newTaxable - 400000) * 0.05;
  }

  // Section 87A rebate for New Regime (zero tax up to ₹12,00,000 taxable income, with marginal relief)
  let newRebate = 0;
  if (newTaxable <= 1200000) {
    newRebate = newBaseTax;
  } else {
    // Marginal relief under Section 87A: tax payable cannot exceed taxable income minus ₹12,00,000
    const excessIncome = newTaxable - 1200000;
    if (newBaseTax > excessIncome) {
      newRebate = newBaseTax - excessIncome;
    }
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
