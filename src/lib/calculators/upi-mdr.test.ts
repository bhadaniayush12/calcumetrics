import { describe, it, expect } from 'vitest';
import { calcUPIMDR } from './upi-mdr';

describe('calcUPIMDR — average ticket size', () => {
  it('charges interchange on the PPI / RuPay share when the average ticket is above ₹2,000', () => {
    // ₹5,00,000 × 20% = ₹1,00,000 chargeable; 1.1% = ₹1,100; GST 18% = ₹198
    const res = calcUPIMDR(500000, 2500, 20, 1.1, 18);
    expect(res.chargeableVolume).toBeCloseTo(100000, 6);
    expect(res.exemptVolume).toBeCloseTo(400000, 6);
    expect(res.baseMdrFee).toBeCloseTo(1100, 6);
    expect(res.gstAmount).toBeCloseTo(198, 6);
    expect(res.netSettlement).toBeCloseTo(498702, 6);
  });

  it('applies 0 interchange when the average ticket is exactly ₹2,000', () => {
    const res = calcUPIMDR(500000, 2000, 20, 1.1, 18);
    expect(res.chargeableVolume).toBe(0);
    expect(res.exemptVolume).toBe(500000);
    expect(res.totalDeductions).toBe(0);
    expect(res.netSettlement).toBe(500000);
    expect(res.effectiveRatePct).toBe(0);
  });

  it('applies 0 interchange when the average ticket is below ₹2,000', () => {
    const res = calcUPIMDR(500000, 1500, 100, 1.1, 18);
    expect(res.baseMdrFee).toBe(0);
    expect(res.netSettlement).toBe(500000);
  });

  it('charges just above the ₹2,000 boundary', () => {
    expect(calcUPIMDR(100000, 2001, 50, 1, 18).baseMdrFee).toBeCloseTo(500, 6);
  });
});
