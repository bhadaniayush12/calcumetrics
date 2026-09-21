/** Tax calculators — GST and HRA (India)
 * Section 8: rates sourced from rates.json, never hard-coded.
 */

// ── GST ───────────────────────────────────────────────────────────────────────
export interface GSTResult {
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
  cgst?: number;        // For intra-state
  sgst?: number;        // For intra-state
  igst?: number;        // For inter-state
  isInterState: boolean;
  slab: number;
}

export function calcGST(
  amount: number,
  slab: number,         // e.g. 5, 12, 18, 28
  isInterState: boolean = false,
  direction: 'add' | 'remove' = 'add'
): GSTResult {
  let baseAmount: number;
  let gstAmount: number;

  if (direction === 'add') {
    baseAmount = amount;
    gstAmount = (amount * slab) / 100;
  } else {
    // Remove GST: base = total / (1 + slab/100)
    baseAmount = (amount * 100) / (100 + slab);
    gstAmount = amount - baseAmount;
  }

  const totalAmount = baseAmount + gstAmount;
  const halfGST = gstAmount / 2;

  return {
    baseAmount,
    gstAmount,
    totalAmount,
    cgst: isInterState ? undefined : halfGST,
    sgst: isInterState ? undefined : halfGST,
    igst: isInterState ? gstAmount : undefined,
    isInterState,
    slab,
  };
}

// ── HRA ───────────────────────────────────────────────────────────────────────
export interface HRAResult {
  exemption: number;
  taxableHRA: number;
  // The three limits
  actualHRA: number;
  rentMinusTenPct: number;
  metroLimit: number;
}

/**
 * HRA exemption = min of:
 * 1. Actual HRA received
 * 2. Rent paid − 10% of basic salary
 * 3. 50% of basic (metro) or 40% of basic (non-metro)
 */
export function calcHRA(
  basicSalary: number,
  hraReceived: number,
  rentPaid: number,
  isMetro: boolean
): HRAResult {
  const actualHRA = hraReceived;
  const rentMinusTenPct = Math.max(0, rentPaid - 0.1 * basicSalary);
  const metroLimit = basicSalary * (isMetro ? 0.5 : 0.4);
  const exemption = Math.min(actualHRA, rentMinusTenPct, metroLimit);
  return {
    exemption,
    taxableHRA: Math.max(0, hraReceived - exemption),
    actualHRA,
    rentMinusTenPct,
    metroLimit,
  };
}
