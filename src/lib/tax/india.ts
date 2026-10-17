/**
 * india.ts — India tax primitives for Calcumetrics.
 *
 * Tier 3 shared engine (Section 3B). Consumed by:
 *   GST Calculator, HRA Calculator, TDS Calculator,
 *   Capital Gains Tax Calculator, Advance Tax Calculator,
 *   Salary / CTC Calculator.
 *
 * IMPORTANT: India Income Tax Calculator (income-tax.ts) is Phase 5 LOCKED.
 * This module adds NEW functions only and must never be imported into income-tax.ts.
 *
 * Source: Finance Act 2024-25 (Royal assent July 2024); CBIC circulars.
 * Rates last verified: September 2026.
 * These figures are legally sensitive — do not modify without citing a new
 * authoritative source and updating the "rates last verified" date.
 *
 * Design:
 *   - Pure TypeScript, zero DOM / window dependencies.
 *   - All intermediate math in full floating point; callers round at display.
 *   - INR-locked: these functions never perform currency conversion.
 */

import capitalGainsFY2026_27 from '../../data/tax/india/capital-gains/FY-2026-27.json';

// ── GST ──────────────────────────────────────────────────────────────────────

/**
 * Standard GST slabs per CGST Act, 2017 and subsequent CBIC notifications.
 * Rates last verified: September 2026 (source: cbic.gov.in).
 */
export type GSTRate = 0 | 5 | 12 | 18 | 28 | 40;

export interface GSTResult {
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
  cgst: number;  // 50% of GST (intra-state)
  sgst: number;  // 50% of GST (intra-state)
  igst: number;  // 100% of GST (inter-state)
  ratePct: number;
  /** 'exclusive': baseAmount is before GST; 'inclusive': totalAmount includes GST */
  mode: 'exclusive' | 'inclusive';
}

/**
 * Calculate GST amounts.
 *
 * @param amount   - Price amount.
 * @param ratePct  - GST rate: 0, 5, 18 or 40 (current slabs from 22 Sep 2025), or the legacy 12 or 28.
 * @param mode     - 'exclusive' if amount is pre-GST; 'inclusive' if amount includes GST.
 */
export function calcGST(
  amount: number,
  ratePct: GSTRate,
  mode: 'exclusive' | 'inclusive' = 'exclusive'
): GSTResult {
  const r = ratePct / 100;
  let baseAmount: number;
  let gstAmount: number;
  let totalAmount: number;

  if (mode === 'exclusive') {
    baseAmount = amount;
    gstAmount = amount * r;
    totalAmount = amount + gstAmount;
  } else {
    // Reverse calculation: base = total / (1 + r)
    totalAmount = amount;
    baseAmount = amount / (1 + r);
    gstAmount = amount - baseAmount;
  }

  return {
    baseAmount,
    gstAmount,
    totalAmount,
    cgst: gstAmount / 2,
    sgst: gstAmount / 2,
    igst: gstAmount,
    ratePct,
    mode,
  };
}

// ── HRA ───────────────────────────────────────────────────────────────────────

export interface HRAResult {
  /** HRA exemption claimable (minimum of the three conditions). */
  hraExemption: number;
  /** HRA received from employer. */
  hraReceived: number;
  /** Actual rent paid - 10% of basic salary. */
  rentMinus10Pct: number;
  /** 40% of basic salary (non-metro) or 50% (metro). */
  basicSalaryPct: number;
  /** Taxable HRA (hraReceived - hraExemption). */
  taxableHRA: number;
  /** Whether city is classified as metro under Income Tax Act. */
  isMetro: boolean;
}

/** Cities classified as metro for HRA exemption (Section 10(13A) of IT Act). */
export const METRO_CITIES = new Set(['delhi', 'mumbai', 'kolkata', 'chennai']);

/**
 * Calculate HRA exemption under Section 10(13A) of the Income Tax Act.
 *
 * Exemption is the MINIMUM of:
 *   1. Actual HRA received
 *   2. Actual rent paid − 10% of Basic Salary
 *   3. 50% of Basic (metro) or 40% of Basic (non-metro)
 *
 * Source: Section 10(13A) & Rule 2A, Income Tax Act 1961.
 * Rates last verified: September 2026.
 *
 * @param basicSalaryAnnual - Annual basic salary (₹).
 * @param hraReceivedAnnual - Annual HRA received from employer (₹).
 * @param rentPaidAnnual    - Annual rent paid (₹).
 * @param city              - City of residence (lowercase). Metro cities get 50%, others 40%.
 */
export function calcHRA(
  basicSalaryAnnual: number,
  hraReceivedAnnual: number,
  rentPaidAnnual: number,
  city: string
): HRAResult {
  const isMetro = METRO_CITIES.has(city.toLowerCase().trim());
  const basicPct = isMetro ? 0.5 : 0.4;

  const condition1 = hraReceivedAnnual;
  const condition2 = Math.max(0, rentPaidAnnual - 0.1 * basicSalaryAnnual);
  const condition3 = basicSalaryAnnual * basicPct;

  const hraExemption = Math.min(condition1, condition2, condition3);

  return {
    hraExemption,
    hraReceived: hraReceivedAnnual,
    rentMinus10Pct: condition2,
    basicSalaryPct: condition3,
    taxableHRA: Math.max(0, hraReceivedAnnual - hraExemption),
    isMetro,
  };
}

// ── TDS ───────────────────────────────────────────────────────────────────────

/**
 * TDS scenarios supported.
 * Rates per Finance (No.2) Act 2024 (194H/194D cut to 2%); thresholds per Finance Act 2025
 * (rationalised from 1 April 2025). Source recorded in data/tax/india/tds/current.json.
 * Rates last verified: October 2026.
 */
export type TDSSection =
  | '192'   // Salary
  | '192A'  // PF withdrawal (≥50 employees or voluntary)
  | '193'   // Interest on securities
  | '194'   // Dividend (listed company)
  | '194A'  // Interest other than securities (banks, FDs)
  | '194B'  // Winnings from lottery / crossword
  | '194BB' // Winnings from horse race
  | '194C'  // Contractor / sub-contractor
  | '194D'  // Insurance commission
  | '194H'  // Commission or brokerage
  | '194I'  // Rent
  | '194J'  // Professional / technical services
  | '194LA' // Compensation for acquisition
  | '194N'  // Cash withdrawal exceeding threshold
  | '194O'  // E-commerce operator payment
  | '194Q'; // Purchase of goods (≥50 lakh)

/**
 * TDS rate table for individuals (non-company, PAN-furnished).
 * Finance (No.2) Act 2024 rates, Finance Act 2025 thresholds. Higher rate applies when PAN not furnished.
 * Must match data/tax/india/tds/current.json (enforced by india.test.ts).
 * Rates last verified: October 2026.
 */
export const TDS_RATES: Record<TDSSection, { ratePct: number; threshold: number; description: string }> = {
  '192':   { ratePct: 0, threshold: 0, description: 'Salary — as per income tax slab (computed separately)' },
  '192A':  { ratePct: 10, threshold: 50000, description: 'PF withdrawal (< 5 yrs service)' },
  '193':   { ratePct: 10, threshold: 10000, description: 'Interest on securities' },
  '194':   { ratePct: 10, threshold: 10000, description: 'Dividend from listed company' },
  '194A':  { ratePct: 10, threshold: 50000, description: 'Interest (bank/FD) — ₹1,00,000 for senior citizens' },
  '194B':  { ratePct: 30, threshold: 10000, description: 'Lottery / crossword winnings' },
  '194BB': { ratePct: 30, threshold: 10000, description: 'Horse race winnings' },
  '194C':  { ratePct: 1, threshold: 30000, description: 'Contractor (individual/HUF); 2% for others' },
  '194D':  { ratePct: 2, threshold: 20000, description: 'Insurance commission (non-company payee)' },
  '194H':  { ratePct: 2, threshold: 20000, description: 'Commission / brokerage' },
  '194I':  { ratePct: 10, threshold: 600000, description: 'Rent (land/building) — ₹50,000 a month; 2% for plant/machinery' },
  '194J':  { ratePct: 10, threshold: 50000, description: 'Professional services; 2% for technical services' },
  '194LA': { ratePct: 10, threshold: 500000, description: 'Compensation on compulsory acquisition' },
  '194N':  { ratePct: 2, threshold: 2000000, description: 'Cash withdrawal > ₹20 lakh' },
  '194O':  { ratePct: 0.1, threshold: 500000, description: 'E-commerce operator payments (0.1% from 1 Oct 2024)' },
  '194Q':  { ratePct: 0.1, threshold: 5000000, description: 'Purchase of goods > ₹50 lakh' },
};

/**
 * Section 194A threshold for resident senior citizens (60+) on interest from banks,
 * co-operative banks and post offices, from 1 April 2025 (Finance Act 2025).
 */
export const TDS_194A_SENIOR_THRESHOLD = 100000;

export interface TDSOptions {
  /** Payee is a resident senior citizen (60+). Raises the 194A threshold to ₹1,00,000. */
  seniorCitizen?: boolean;
}

export interface TDSResult {
  /** Gross amount before TDS. */
  grossAmount: number;
  /** TDS deducted (0 if below threshold). */
  tdsAmount: number;
  /** Net amount after TDS. */
  netAmount: number;
  /** TDS rate applied (%). */
  ratePct: number;
  /** Whether the gross amount exceeded the threshold. */
  thresholdMet: boolean;
  /** Threshold for the selected section. */
  threshold: number;
  /** Section applied. */
  section: TDSSection;
}

/**
 * Calculate TDS for a supported section.
 *
 * @param grossAmount - Payment amount (₹).
 * @param section     - TDS section to apply.
 * @param options     - Payee attributes that change the threshold (senior citizen for 194A).
 */
export function calcTDS(grossAmount: number, section: TDSSection, options: TDSOptions = {}): TDSResult {
  const { ratePct } = TDS_RATES[section];
  const threshold =
    section === '194A' && options.seniorCitizen ? TDS_194A_SENIOR_THRESHOLD : TDS_RATES[section].threshold;
  const thresholdMet = grossAmount > threshold;
  const tdsAmount = thresholdMet ? (grossAmount * ratePct) / 100 : 0;

  return {
    grossAmount,
    tdsAmount,
    netAmount: grossAmount - tdsAmount,
    ratePct,
    thresholdMet,
    threshold,
    section,
  };
}

// ── Capital Gains Tax ─────────────────────────────────────────────────────────

/**
 * Capital gains tax rates for India (FY 2024-25 / AY 2025-26).
 * Post-Budget 2024 (Finance Act 2024-25, effective 23 July 2024).
 *
 * Source: Section 111A, 112, 112A Income Tax Act 1961; Finance Act 2024-25.
 * Rates last verified: September 2026.
 */
export type AssetType = 'equity' | 'equity-fund' | 'debt-fund' | 'real-estate' | 'gold' | 'other';

/** Property-indexation comparison for land/buildings acquired before 23 July 2024. */
export interface IndexationComparison {
  acquisitionFY: string;
  saleFY: string;
  ciiAcquisition: number;
  ciiSale: number;
  indexedCost: number;
  indexedGain: number;
  /** 12.5% on the un-indexed gain. */
  taxWithoutIndexation: number;
  /** 20% on the indexed gain. */
  taxWithIndexation: number;
  /** Which computation gives the lower tax (and is applied). */
  applied: 'with-indexation' | 'without-indexation';
}

export interface CapitalGainsOptions {
  /**
   * ISO date (YYYY-MM-DD) the asset was acquired. Enables the pre-23 Jul 2024 indexation option
   * for property, and the holding-period test for debt-fund units bought before 1 Apr 2023.
   * Debt funds with no acquisition date are treated as bought on/after 1 Apr 2023 (Section 50AA).
   */
  acquisitionDate?: string;
  /** ISO date of sale. Defaults to acquisitionDate + holdingMonths. */
  saleDate?: string;
}

/** CBDT Cost Inflation Index by financial year ("2026-27"), from the capital-gains tax data. */
export const COST_INFLATION_INDEX: Record<string, number> =
  capitalGainsFY2026_27.values.costInflationIndex.table;

/** Land/buildings acquired before this date keep the 20%-with-indexation option (Finance (No.2) Act 2024). */
export const INDEXATION_CUTOFF_DATE: string = capitalGainsFY2026_27.values.indexationCutoffDate;

/** Specified (debt) MF units acquired on or after this date are always short-term (Section 50AA). */
export const DEBT_FUND_50AA_DATE: string = capitalGainsFY2026_27.values.debtFund50AAFromDate;

/** Financial year label ("2026-27") for an ISO date. */
export function financialYearOf(isoDate: string): string {
  const [y, m] = isoDate.split('-').map(Number);
  const start = m >= 4 ? y : y - 1;
  return `${start}-${String((start + 1) % 100).padStart(2, '0')}`;
}

/** CII for the FY containing isoDate; assets acquired before 1 April 2001 use the base year (100). */
function ciiFor(isoDate: string): number | undefined {
  if (isoDate < '2001-04-01') return COST_INFLATION_INDEX['2001-02'];
  return COST_INFLATION_INDEX[financialYearOf(isoDate)];
}

function addMonthsISO(isoDate: string, months: number): string {
  const d = new Date(isoDate + 'T00:00:00Z');
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
}

export interface CapitalGainsResult {
  /** Sale price of asset. */
  salePrice: number;
  /** Purchase price (cost of acquisition). */
  purchasePrice: number;
  /** Capital gain amount (salePrice - purchasePrice). */
  gain: number;
  /** Whether the gain is long-term (LTCG) or short-term (STCG). */
  gainType: 'LTCG' | 'STCG';
  /** Holding period in months. */
  holdingMonths: number;
  /** Tax rate applied (%). */
  taxRatePct: number;
  /** Tax amount. */
  taxAmount: number;
  /** Surcharge + cess if applicable. */
  cess: number;
  /** Total tax (taxAmount + cess). */
  totalTax: number;
  /** Net gain after tax. */
  netGain: number;
  /** Section applied. */
  section: string;
  /** Present when property acquired before 23 July 2024 is compared with and without indexation. */
  indexation?: IndexationComparison;
}

/** Minimum holding months for LTCG classification by asset type. */
/** Holding must EXCEED this many months to qualify as long-term (Section 2(42A)). */
const LTCG_THRESHOLD_MONTHS: Record<AssetType, number> = {
  equity: 12,         // Listed equity / equity MF: more than 12 months
  'equity-fund': 12,
  'debt-fund': 24,    // Only for units acquired before 1 Apr 2023; later units are always STCG (Section 50AA)
  'real-estate': 24,  // Immovable property: more than 24 months (Budget 2024 changed from 36)
  gold: 24,           // Physical gold & SGBs: more than 24 months (Budget 2024)
  other: 24,
};

/**
 * Calculate capital gains tax (India FY 2024-25).
 *
 * Key Budget 2024 changes (effective 23 July 2024):
 *   - STCG on equity/equity MF: 20% (was 15%)
 *   - LTCG on equity/equity MF: 12.5% (was 10%) above ₹1.25 lakh
 *   - Immovable property LTCG: 12.5% without indexation (Budget 2024 revised)
 *   - Debt funds: LTCG taxed at slab (no concessional rate)
 *
 * @param salePrice      - Selling price (₹).
 * @param purchasePrice  - Purchase price / cost of acquisition (₹).
 * @param holdingMonths  - Holding period in months.
 * @param assetType      - Type of asset.
 * @param options        - Acquisition (and optional sale) date for the property indexation option.
 */
export function calcCapitalGains(
  salePrice: number,
  purchasePrice: number,
  holdingMonths: number,
  assetType: AssetType,
  options: CapitalGainsOptions = {}
): CapitalGainsResult {
  const gain = salePrice - purchasePrice;
  const ltcgThreshold = LTCG_THRESHOLD_MONTHS[assetType];
  // Section 50AA: debt-fund units acquired on/after 1 Apr 2023 are short-term whatever the holding period.
  const isSection50AA =
    assetType === 'debt-fund' && !(options.acquisitionDate && options.acquisitionDate < DEBT_FUND_50AA_DATE);
  const gainType: 'LTCG' | 'STCG' = !isSection50AA && holdingMonths > ltcgThreshold ? 'LTCG' : 'STCG';

  // Gains ≤ 0 — no tax
  if (gain <= 0) {
    return {
      salePrice, purchasePrice, gain, gainType, holdingMonths,
      taxRatePct: 0, taxAmount: 0, cess: 0, totalTax: 0, netGain: gain, section: 'N/A',
    };
  }

  let taxRatePct = 0;
  let section = '';
  let taxableGain = gain;
  let indexation: IndexationComparison | undefined;

  if (assetType === 'equity' || assetType === 'equity-fund') {
    if (gainType === 'STCG') {
      // Section 111A: STCG @ 20% (Budget 2024; was 15%)
      taxRatePct = 20;
      section = '111A';
    } else {
      // Section 112A: LTCG @ 12.5% above ₹1,25,000 exemption
      const exemption = 125000;
      taxableGain = Math.max(0, gain - exemption);
      taxRatePct = 12.5;
      section = '112A';
    }
  } else if (assetType === 'debt-fund' && isSection50AA) {
    // Debt funds (purchased on/after 1 April 2023): deemed STCG under Section 50AA, taxed at slab rate.
    // This tool does not know the user's slab, so we report 30% (highest slab) as a conservative estimate
    taxRatePct = 30;
    section = '50AA (slab rate — conservative estimate at 30%)';
  } else if (assetType === 'debt-fund') {
    // Units acquired before 1 April 2023: normal rules. More than 24 months → LTCG under Section 112
    // at 12.5% without indexation (transfers on/after 23 July 2024); otherwise slab rate.
    taxRatePct = gainType === 'STCG' ? 30 : 12.5;
    section = gainType === 'STCG' ? 'Slab rate (conservative estimate at 30%)' : '112 (12.5%, acquired before 1 Apr 2023)';
  } else if (assetType === 'real-estate') {
    if (gainType === 'STCG') {
      taxRatePct = 30; // Slab rate (conservative)
      section = 'Slab rate';
    } else {
      // Budget 2024: 12.5% without indexation (removed indexation benefit)
      taxRatePct = 12.5;
      section = '112 (12.5% no indexation, Budget 2024)';

      // Acquired before 23 July 2024 (resident individual/HUF): lower of 12.5% without
      // indexation and 20% with indexation (Finance (No.2) Act 2024).
      const { acquisitionDate } = options;
      if (acquisitionDate && acquisitionDate < INDEXATION_CUTOFF_DATE) {
        const saleDate = options.saleDate ?? addMonthsISO(acquisitionDate, holdingMonths);
        const ciiAcquisition = ciiFor(acquisitionDate);
        const ciiSale = ciiFor(saleDate);
        if (ciiAcquisition && ciiSale) {
          const indexedCost = (purchasePrice * ciiSale) / ciiAcquisition;
          const indexedGain = Math.max(0, salePrice - indexedCost);
          const taxWithoutIndexation = gain * 0.125;
          const taxWithIndexation = indexedGain * 0.20;
          const withIdx = taxWithIndexation < taxWithoutIndexation;
          indexation = {
            acquisitionFY: acquisitionDate < '2001-04-01' ? '2001-02' : financialYearOf(acquisitionDate),
            saleFY: financialYearOf(saleDate),
            ciiAcquisition,
            ciiSale,
            indexedCost,
            indexedGain,
            taxWithoutIndexation,
            taxWithIndexation,
            applied: withIdx ? 'with-indexation' : 'without-indexation',
          };
          if (withIdx) {
            taxableGain = indexedGain;
            taxRatePct = 20;
            section = '112 (20% with indexation, acquired before 23 Jul 2024)';
          } else {
            section = '112 (12.5% no indexation; lower than 20% with indexation)';
          }
        }
      }
    }
  } else if (assetType === 'gold') {
    if (gainType === 'STCG') {
      taxRatePct = 30; // Slab rate
      section = 'Slab rate';
    } else {
      taxRatePct = 12.5; // Budget 2024
      section = '112 (12.5%, Budget 2024)';
    }
  } else {
    // Budget 2024: LTCG under Section 112 is 12.5% without indexation for transfers on/after 23 July 2024
    taxRatePct = gainType === 'STCG' ? 30 : 12.5;
    section = gainType === 'STCG' ? 'Slab rate' : '112';
  }

  const taxAmount = (taxableGain * taxRatePct) / 100;
  const cess = taxAmount * 0.04; // 4% Health & Education Cess

  return {
    salePrice,
    purchasePrice,
    gain,
    gainType,
    holdingMonths,
    taxRatePct,
    taxAmount,
    cess,
    totalTax: taxAmount + cess,
    netGain: gain - taxAmount - cess,
    section,
    ...(indexation ? { indexation } : {}),
  };
}

// ── Advance Tax ───────────────────────────────────────────────────────────────

/**
 * Advance tax instalment schedule (Section 208 of IT Act 1961).
 * Applicable when estimated tax liability > ₹10,000.
 *
 * Instalments (for non-corporate taxpayers):
 *   15 June   — 15%
 *   15 Sept   — 45% (cumulative)
 *   15 Dec    — 75% (cumulative)
 *   15 March  — 100% (cumulative)
 *
 * Source: Section 208, 209, 211 Income Tax Act 1961.
 * Rates last verified: September 2026.
 */
export interface AdvanceTaxResult {
  /** Estimated annual tax liability (₹). */
  annualTaxLiability: number;
  /** Whether advance tax is required (liability > ₹10,000). */
  required: boolean;
  /** Instalment schedule. */
  instalments: Array<{
    dueDate: string;
    cumulativePct: number;
    cumulativeAmount: number;
    instalment: number;
  }>;
}

/**
 * Calculate advance tax instalments.
 *
 * @param annualTaxLiability - Estimated total income tax for the financial year (₹).
 *                             Does not include cess (caller should include cess in this figure).
 */
export function calcAdvanceTax(annualTaxLiability: number): AdvanceTaxResult {
  const required = annualTaxLiability > 10000;

  const schedule = [
    { dueDate: '15 June',    cumulativePct: 15 },
    { dueDate: '15 September', cumulativePct: 45 },
    { dueDate: '15 December',  cumulativePct: 75 },
    { dueDate: '15 March',     cumulativePct: 100 },
  ];

  let prevCumulative = 0;
  const instalments = schedule.map(({ dueDate, cumulativePct }) => {
    const cumulativeAmount = (annualTaxLiability * cumulativePct) / 100;
    const instalment = cumulativeAmount - prevCumulative;
    prevCumulative = cumulativeAmount;
    return { dueDate, cumulativePct, cumulativeAmount, instalment };
  });

  return { annualTaxLiability, required, instalments };
}

// ── Salary / CTC Breakdown ────────────────────────────────────────────────────

/**
 * Standard India salary structure breakdown.
 * Assumptions based on typical industry norms (not statutory mandates).
 * Source: common HR practice; EPF: EPF & MP Act 1952; Gratuity: Payment of Gratuity Act 1972.
 * Rates last verified: September 2026.
 */
export interface SalaryCTCResult {
  /** Annual CTC (₹). */
  ctc: number;
  /** Basic Salary (typically 40-50% of CTC). */
  basic: number;
  /** House Rent Allowance (typically 40-50% of basic). */
  hra: number;
  /** Special Allowance (residual). */
  specialAllowance: number;
  /** Employer's EPF contribution (12% of basic, max ₹15,000 basic). */
  employerEPF: number;
  /** Employee's EPF contribution (12% of basic, max ₹15,000 basic). */
  employeeEPF: number;
  /** Gross monthly salary (CTC - employer EPF - other employer contributions). */
  grossMonthlySalary: number;
  /** Net monthly take-home (gross - employee EPF - income tax approximation). */
  netMonthlySalary: number;
  /** Professional tax (₹200/month where applicable; using ₹0 as conservative estimate). */
  professionalTax: number;
  /** Annual gross salary. */
  annualGrossSalary: number;
}

/**
 * Break down a CTC into standard India salary components.
 *
 * Assumptions (clearly stated):
 *   - Basic = 40% of CTC
 *   - HRA = 40% of Basic (non-metro default)
 *   - EPF on basic up to ₹15,000 (statutory ceiling for EPF contribution)
 *   - Employer PF = 12% of basic (capped at ₹1,800/month on ₹15,000 ceiling)
 *   - Professional Tax = ₹0 (varies by state; caller should add state-specific amount)
 *   - Income tax deduction = 0 (caller should integrate with Income Tax Calculator)
 *
 * @param annualCTC - Total annual Cost to Company (₹).
 */
export function calcSalaryCTC(annualCTC: number): SalaryCTCResult {
  const basic = annualCTC * 0.40;                              // 40% of CTC
  const hra = basic * 0.40;                                    // 40% of basic (non-metro)
  const EPF_CEILING_MONTHLY = 15000;
  const EPF_CEILING_ANNUAL = EPF_CEILING_MONTHLY * 12;
  const epfBasic = Math.min(basic, EPF_CEILING_ANNUAL);
  const employerEPF = epfBasic * 0.12;                         // 12% of basic (capped)
  const employeeEPF = epfBasic * 0.12;                         // 12% of basic (capped)
  const annualGrossSalary = annualCTC - employerEPF;
  const specialAllowance = annualGrossSalary - basic - hra;
  const grossMonthlySalary = annualGrossSalary / 12;
  const netMonthlySalary = grossMonthlySalary - employeeEPF / 12;
  const professionalTax = 0;                                   // State-specific; default 0

  return {
    ctc: annualCTC,
    basic,
    hra,
    specialAllowance,
    employerEPF,
    employeeEPF,
    grossMonthlySalary,
    netMonthlySalary,
    professionalTax,
    annualGrossSalary,
  };
}
