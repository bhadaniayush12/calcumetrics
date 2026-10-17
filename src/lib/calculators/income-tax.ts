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
  /** Surcharge after marginal relief. */
  surcharge: number;
  /** Marginal relief deducted from surcharge at the ₹50L / ₹1Cr / ₹2Cr / ₹5Cr thresholds. */
  marginalRelief: number;
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

type Regime = 'new' | 'old';

/** Slab tax (before rebate, surcharge and cess) on taxable income under the New Regime. */
function newRegimeSlabTax(taxable: number): number {
  let tax = 0;
  if (taxable > 2400000) {
    tax += (taxable - 2400000) * 0.30;
    tax += 400000 * 0.25; // 20L-24L (1,00,000)
    tax += 400000 * 0.20; // 16L-20L (80,000)
    tax += 400000 * 0.15; // 12L-16L (60,000)
    tax += 400000 * 0.10; // 8L-12L  (40,000)
    tax += 400000 * 0.05; // 4L-8L   (20,000)
  } else if (taxable > 2000000) {
    tax += (taxable - 2000000) * 0.25;
    tax += 400000 * 0.20;
    tax += 400000 * 0.15;
    tax += 400000 * 0.10;
    tax += 400000 * 0.05;
  } else if (taxable > 1600000) {
    tax += (taxable - 1600000) * 0.20;
    tax += 400000 * 0.15;
    tax += 400000 * 0.10;
    tax += 400000 * 0.05;
  } else if (taxable > 1200000) {
    tax += (taxable - 1200000) * 0.15;
    tax += 400000 * 0.10;
    tax += 400000 * 0.05;
  } else if (taxable > 800000) {
    tax += (taxable - 800000) * 0.10;
    tax += 400000 * 0.05;
  } else if (taxable > 400000) {
    tax += (taxable - 400000) * 0.05;
  }
  return tax;
}

/** Slab tax (before rebate, surcharge and cess) on taxable income under the Old Regime. */
function oldRegimeSlabTax(taxable: number): number {
  let tax = 0;
  if (taxable > 1000000) {
    tax += (taxable - 1000000) * 0.30;
    tax += 500000 * 0.20; // 5L-10L
    tax += 250000 * 0.05; // 2.5L-5L
  } else if (taxable > 500000) {
    tax += (taxable - 500000) * 0.20;
    tax += 250000 * 0.05;
  } else if (taxable > 250000) {
    tax += (taxable - 250000) * 0.05;
  }
  return tax;
}

/**
 * Surcharge rate for an individual: >₹50L 10%, >₹1Cr 15%, >₹2Cr 25%,
 * >₹5Cr 37% (Old Regime; capped at 25% under the New Regime, Section 115BAC).
 */
function surchargeRate(taxable: number, regime: Regime): number {
  if (taxable > 50000000) return regime === 'old' ? 0.37 : 0.25;
  if (taxable > 20000000) return 0.25;
  if (taxable > 10000000) return 0.15;
  if (taxable > 5000000) return 0.10;
  return 0;
}

const SURCHARGE_THRESHOLDS = [50000000, 20000000, 10000000, 5000000];

/**
 * Surcharge with marginal relief: tax + surcharge on income above a threshold may not
 * exceed tax + surcharge at the threshold plus the income earned above it.
 */
function calcSurcharge(
  taxable: number,
  tax: number,
  regime: Regime,
  slabTax: (income: number) => number
): { surcharge: number; marginalRelief: number } {
  const rate = surchargeRate(taxable, regime);
  if (rate === 0) return { surcharge: 0, marginalRelief: 0 };

  const grossSurcharge = tax * rate;
  const threshold = SURCHARGE_THRESHOLDS.find((t) => taxable > t)!;
  const atThreshold = slabTax(threshold) * (1 + surchargeRate(threshold, regime));
  const maxTotal = atThreshold + (taxable - threshold);
  const surcharge = Math.max(0, Math.min(grossSurcharge, maxTotal - tax));

  return { surcharge, marginalRelief: grossSurcharge - surcharge };
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
      surcharge: 0,
      marginalRelief: 0,
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
  const newBaseTax = newRegimeSlabTax(newTaxable);

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
  const newSur = calcSurcharge(newTaxable, newTaxAfterRebate, 'new', newRegimeSlabTax);
  // 4% Health & Education Cess on tax + surcharge
  const newCess = (newTaxAfterRebate + newSur.surcharge) * 0.04;
  const newTotalTax = Math.round(newTaxAfterRebate + newSur.surcharge + newCess);

  const newRegime: TaxRegimeBreakdown = {
    grossIncome,
    standardDeduction: newStdDed,
    totalDeductions: newStdDed,
    taxableIncome: newTaxable,
    baseTax: Math.round(newBaseTax),
    rebate87A: Math.round(newRebate),
    taxAfterRebate: Math.round(newTaxAfterRebate),
    surcharge: Math.round(newSur.surcharge),
    marginalRelief: Math.round(newSur.marginalRelief),
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
  const oldBaseTax = oldRegimeSlabTax(oldTaxable);

  // Section 87A rebate for Old Regime (up to 5,00,000 taxable income)
  let oldRebate = 0;
  if (oldTaxable <= 500000) {
    oldRebate = oldBaseTax;
  }
  const oldTaxAfterRebate = Math.max(0, oldBaseTax - oldRebate);
  const oldSur = calcSurcharge(oldTaxable, oldTaxAfterRebate, 'old', oldRegimeSlabTax);
  const oldCess = (oldTaxAfterRebate + oldSur.surcharge) * 0.04;
  const oldTotalTax = Math.round(oldTaxAfterRebate + oldSur.surcharge + oldCess);

  const oldRegime: TaxRegimeBreakdown = {
    grossIncome,
    standardDeduction: oldStdDed,
    totalDeductions: oldTotalDeductions,
    taxableIncome: oldTaxable,
    baseTax: Math.round(oldBaseTax),
    rebate87A: Math.round(oldRebate),
    taxAfterRebate: Math.round(oldTaxAfterRebate),
    surcharge: Math.round(oldSur.surcharge),
    marginalRelief: Math.round(oldSur.marginalRelief),
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
