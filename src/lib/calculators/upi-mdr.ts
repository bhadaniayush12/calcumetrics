/** UPI MDR (Merchant Discount Rate) Calculator
 * Computes merchant transaction fees, GST, and net settlement for UPI / PPI / RuPay Credit on UPI.
 */

/** PPI / RuPay interchange applies only to transactions above this value (NPCI). */
export const PPI_INTERCHANGE_TICKET_THRESHOLD = 2000;

export interface UPIMDRResult {
  monthlyVolume: number;
  chargeableVolume: number;
  exemptVolume: number;
  baseMdrFee: number;
  gstAmount: number;
  totalDeductions: number;
  netSettlement: number;
  effectiveRatePct: number;
}

export function calcUPIMDR(
  monthlyVolume: number,
  averageTicketSize: number = 1500,
  chargeableSharePct: number = 20, // percentage of volume from PPI wallets / RuPay Credit cards
  mdrRatePct: number = 1.1,        // standard NPCI interchange cap: 1.1%
  gstRatePct: number = 18          // standard 18% GST on merchant financial services
): UPIMDRResult {
  if (monthlyVolume <= 0) {
    return {
      monthlyVolume: 0,
      chargeableVolume: 0,
      exemptVolume: 0,
      baseMdrFee: 0,
      gstAmount: 0,
      totalDeductions: 0,
      netSettlement: 0,
      effectiveRatePct: 0,
    };
  }

  // Interchange applies only above ₹2,000 per transaction, so an average ticket at or
  // below that leaves the PPI / RuPay share with 0 interchange.
  const ticketExempt = averageTicketSize <= PPI_INTERCHANGE_TICKET_THRESHOLD;
  const chargeableFraction = ticketExempt ? 0 : Math.min(100, Math.max(0, chargeableSharePct)) / 100;
  const chargeableVolume = monthlyVolume * chargeableFraction;
  const exemptVolume = monthlyVolume - chargeableVolume;

  const baseMdrFee = chargeableVolume * (Math.max(0, mdrRatePct) / 100);
  const gstAmount = baseMdrFee * (Math.max(0, gstRatePct) / 100);
  const totalDeductions = baseMdrFee + gstAmount;
  const netSettlement = monthlyVolume - totalDeductions;
  const effectiveRatePct = monthlyVolume > 0 ? (totalDeductions / monthlyVolume) * 100 : 0;

  return {
    monthlyVolume,
    chargeableVolume,
    exemptVolume,
    baseMdrFee,
    gstAmount,
    totalDeductions,
    netSettlement,
    effectiveRatePct,
  };
}
