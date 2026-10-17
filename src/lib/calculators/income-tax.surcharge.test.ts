import { describe, it, expect } from 'vitest';
import { calcIncomeTax } from './income-tax';

/**
 * Surcharge + marginal relief hand calculations. Each case is set at a TAXABLE income T:
 *   New Regime gross = T + 75,000 (standard deduction)
 *   Old Regime gross = T + 50,000 (standard deduction, no other deductions)
 *
 * Slab tax above the top slab:
 *   New: tax(T) = 30% × (T − 24,00,000) + 3,00,000   (20k + 40k + 60k + 80k + 1,00,000)
 *   Old: tax(T) = 30% × (T − 10,00,000) + 1,12,500   (12,500 + 1,00,000)
 *
 * Surcharge: >50L 10%, >1Cr 15%, >2Cr 25%, >5Cr 37% (old) / 25% (new).
 * Marginal relief: tax + surcharge ≤ (tax + surcharge at threshold) + (T − threshold).
 * Cess: 4% on (tax + surcharge).
 */
const NEW_STD = 75000;
const OLD_STD = 50000;
const newAt = (taxable: number) => calcIncomeTax(taxable + NEW_STD).newRegime;
const oldAt = (taxable: number) => calcIncomeTax(taxable + OLD_STD).oldRegime;

describe('Income tax surcharge — New Regime', () => {
  it('₹50L: no surcharge (threshold is "exceeding" ₹50L)', () => {
    // tax = 0.3 × 26,00,000 + 3,00,000 = 10,80,000; cess 43,200; total 11,23,200
    const r = newAt(5000000);
    expect(r.taxAfterRebate).toBe(1080000);
    expect(r.surcharge).toBe(0);
    expect(r.cess).toBe(43200);
    expect(r.totalTax).toBe(1123200);
  });

  it('₹50.1L: 10% surcharge limited by marginal relief', () => {
    // tax = 0.3 × 26,10,000 + 3,00,000 = 10,83,000; 10% = 1,08,300
    // cap: 10,80,000 (tax at 50L, no surcharge) + 10,000 = 10,90,000 → surcharge 7,000, relief 1,01,300
    // cess = 4% × 10,90,000 = 43,600; total 11,33,600
    const r = newAt(5010000);
    expect(r.taxAfterRebate).toBe(1083000);
    expect(r.surcharge).toBe(7000);
    expect(r.marginalRelief).toBe(101300);
    expect(r.cess).toBe(43600);
    expect(r.totalTax).toBe(1133600);
  });

  it('₹1Cr: 10% surcharge (1Cr is not "exceeding" 1Cr)', () => {
    // tax = 0.3 × 76,00,000 + 3,00,000 = 25,80,000; 10% = 2,58,000
    // relief cap vs 50L = 10,80,000 + 50,00,000 = 60,80,000 (not binding)
    // cess = 4% × 28,38,000 = 1,13,520; total 29,51,520
    const r = newAt(10000000);
    expect(r.surcharge).toBe(258000);
    expect(r.marginalRelief).toBe(0);
    expect(r.cess).toBe(113520);
    expect(r.totalTax).toBe(2951520);
  });

  it('₹2.5Cr: 25% surcharge', () => {
    // tax = 0.3 × 2,26,00,000 + 3,00,000 = 70,80,000; 25% = 17,70,000
    // relief cap vs 2Cr = 55,80,000 × 1.15 + 50,00,000 = 1,14,17,000 (not binding)
    // cess = 4% × 88,50,000 = 3,54,000; total 92,04,000
    const r = newAt(25000000);
    expect(r.surcharge).toBe(1770000);
    expect(r.cess).toBe(354000);
    expect(r.totalTax).toBe(9204000);
  });

  it('₹6Cr: surcharge capped at 25% under the New Regime', () => {
    // tax = 0.3 × 5,76,00,000 + 3,00,000 = 1,75,80,000; 25% = 43,95,000
    // cess = 4% × 2,19,75,000 = 8,79,000; total 2,28,54,000
    const r = newAt(60000000);
    expect(r.taxAfterRebate).toBe(17580000);
    expect(r.surcharge).toBe(4395000);
    expect(r.cess).toBe(879000);
    expect(r.totalTax).toBe(22854000);
  });
});

describe('Income tax surcharge — Old Regime', () => {
  it('₹50L: no surcharge', () => {
    // tax = 0.3 × 40,00,000 + 1,12,500 = 13,12,500; cess 52,500; total 13,65,000
    const r = oldAt(5000000);
    expect(r.taxAfterRebate).toBe(1312500);
    expect(r.surcharge).toBe(0);
    expect(r.totalTax).toBe(1365000);
  });

  it('₹50.1L: 10% surcharge limited by marginal relief', () => {
    // tax = 0.3 × 40,10,000 + 1,12,500 = 13,15,500; 10% = 1,31,550
    // cap: 13,12,500 + 10,000 = 13,22,500 → surcharge 7,000, relief 1,24,550
    // cess = 4% × 13,22,500 = 52,900; total 13,75,400
    const r = oldAt(5010000);
    expect(r.surcharge).toBe(7000);
    expect(r.marginalRelief).toBe(124550);
    expect(r.cess).toBe(52900);
    expect(r.totalTax).toBe(1375400);
  });

  it('₹1Cr: 10% surcharge', () => {
    // tax = 0.3 × 90,00,000 + 1,12,500 = 28,12,500; 10% = 2,81,250
    // cess = 4% × 30,93,750 = 1,23,750; total 32,17,500
    const r = oldAt(10000000);
    expect(r.surcharge).toBe(281250);
    expect(r.cess).toBe(123750);
    expect(r.totalTax).toBe(3217500);
  });

  it('₹2.5Cr: 25% surcharge', () => {
    // tax = 0.3 × 2,40,00,000 + 1,12,500 = 73,12,500; 25% = 18,28,125
    // cess = 4% × 91,40,625 = 3,65,625; total 95,06,250
    const r = oldAt(25000000);
    expect(r.surcharge).toBe(1828125);
    expect(r.cess).toBe(365625);
    expect(r.totalTax).toBe(9506250);
  });

  it('₹6Cr: 37% surcharge', () => {
    // tax = 0.3 × 5,90,00,000 + 1,12,500 = 1,78,12,500; 37% = 65,90,625
    // relief cap vs 5Cr = 1,48,12,500 × 1.25 + 1,00,00,000 = 2,85,15,625 (not binding)
    // cess = 4% × 2,44,03,125 = 9,76,125; total 2,53,79,250
    const r = oldAt(60000000);
    expect(r.surcharge).toBe(6590625);
    expect(r.marginalRelief).toBe(0);
    expect(r.cess).toBe(976125);
    expect(r.totalTax).toBe(25379250);
  });

  it('₹5.01Cr: 37% surcharge limited by marginal relief at ₹5Cr', () => {
    // tax = 0.3 × 4,91,00,000 + 1,12,500 = 1,48,42,500; 37% = 54,91,725
    // cap: tax(5Cr) 1,48,12,500 × 1.25 = 1,85,15,625; + 1,00,000 = 1,86,15,625
    // surcharge = 1,86,15,625 − 1,48,42,500 = 37,73,125
    // cess = 4% × 1,86,15,625 = 7,44,625; total 1,93,60,250
    const r = oldAt(50100000);
    expect(r.surcharge).toBe(3773125);
    expect(r.cess).toBe(744625);
    expect(r.totalTax).toBe(19360250);
  });
});
