import { describe, it, expect } from 'vitest';
import { calcIncomeTax } from './income-tax';
import { validate } from '../validate';
import { serializeHash, restoreFromHash } from '../url-state';

describe('5.10 Income Tax Calculator (India)', () => {
  describe('Mathematical Calculations & Budget 2024 Rules', () => {
    it('applies Budget 2024 New Regime standard deduction of ₹75,000', () => {
      const res = calcIncomeTax(775000);
      expect(res.newRegime.standardDeduction).toBe(75000);
      expect(res.newRegime.taxableIncome).toBe(700000);
      // Section 87A rebate gives 0 tax for taxable income <= 7,00,000
      expect(res.newRegime.rebate87A).toBe(20000);
      expect(res.newRegime.totalTax).toBe(0);
    });

    it('calculates Section 87A rebate cutoff for New Regime (tax applies above ₹7,00,000 taxable)', () => {
      // Gross 8,00,000 - 75k std ded = 7,25,000 taxable
      const res = calcIncomeTax(800000);
      expect(res.newRegime.taxableIncome).toBe(725000);
      expect(res.newRegime.rebate87A).toBe(0); // No 87A rebate above 7L
      // Slabs: 3-7L (4L @ 5% = 20,000) + 7-7.25L (25k @ 10% = 2,500) = 22,500 base tax
      expect(res.newRegime.baseTax).toBe(22500);
      // Cess 4% = 900 -> Total Tax = 23,400
      expect(res.newRegime.totalTax).toBe(23400);
    });

    it('applies Old Tax Regime standard deduction of ₹50,000 and Section 87A rebate up to ₹5,00,000 taxable', () => {
      const res = calcIncomeTax(550000);
      expect(res.oldRegime.standardDeduction).toBe(50000);
      expect(res.oldRegime.taxableIncome).toBe(500000);
      // Slabs: 2.5L-5L (2.5L @ 5% = 12,500), rebate = 12,500 -> 0 tax
      expect(res.oldRegime.rebate87A).toBe(12500);
      expect(res.oldRegime.totalTax).toBe(0);
    });

    it('matches ₹12,00,000 salary fixture comparing New vs Old Regime', () => {
      const res = calcIncomeTax(1200000, 150000, 25000, 50000);

      // New Regime: 12L - 75k = 11.25L taxable
      // Slabs: 3-7L (20k) + 7-10L (30k) + 10-11.25L (1.25L @ 15% = 18,750) = 68,750
      // Cess 4% = 2,750 -> Total = 71,500
      expect(res.newRegime.taxableIncome).toBe(1125000);
      expect(res.newRegime.totalTax).toBe(71500);

      // Old Regime: 12L - (50k std ded + 150k 80C + 25k 80D + 50k other = 275k) = 9.25L taxable
      // Slabs: 2.5-5L (12.5k) + 5-9.25L (4.25L @ 20% = 85k) = 97,500
      // Cess 4% = 3,900 -> Total = 1,01,400
      expect(res.oldRegime.taxableIncome).toBe(925000);
      expect(res.oldRegime.totalTax).toBe(101400);

      expect(res.recommendedRegime).toBe('New Regime');
      expect(res.taxSavings).toBe(29900);
    });

    it('caps Section 80C at ₹1,50,000 and 80D at ₹1,00,000 in Old Regime', () => {
      const res = calcIncomeTax(1500000, 250000, 150000, 0);
      expect(res.oldRegime.totalDeductions).toBe(50000 + 150000 + 100000); // 3,00,000 total capped
    });

    it('handles zero or negative gross income safely', () => {
      const resZero = calcIncomeTax(0);
      expect(resZero.newRegime.totalTax).toBe(0);
      expect(resZero.oldRegime.totalTax).toBe(0);
      expect(resZero.recommendedRegime).toBe('Equal');

      const resNeg = calcIncomeTax(-100000);
      expect(resNeg.newRegime.totalTax).toBe(0);
      expect(resNeg.oldRegime.totalTax).toBe(0);
    });

    it('correctly calculates high income bracket in New Regime (> ₹15,00,000 @ 30%)', () => {
      const res = calcIncomeTax(2000000); // 20L
      // Taxable = 20L - 75k = 19.25L
      // 3-7L: 20k
      // 7-10L: 30k
      // 10-12L: 30k (2L @ 15%)
      // 12-15L: 60k (3L @ 20%)
      // >15L: 4.25L @ 30% = 1,27,500
      // Base = 2,67,500 + 4% cess (10,700) = 2,78,200
      expect(res.newRegime.taxableIncome).toBe(1925000);
      expect(res.newRegime.baseTax).toBe(267500);
      expect(res.newRegime.totalTax).toBe(278200);
    });
  });

  describe('Validation Schema', () => {
    const itSchema = {
      gross: { required: true, min: 0, max: 1000000000, decimal: true, label: 'Gross Annual Income' },
      c80: { required: true, min: 0, max: 150000, decimal: true, label: 'Section 80C' },
      d80: { required: true, min: 0, max: 100000, decimal: true, label: 'Section 80D' },
      other: { required: true, min: 0, max: 100000000, decimal: true, label: 'Other Deductions' },
    };

    it('validates standard inputs successfully', () => {
      expect(validate('12,00,000', itSchema.gross).valid).toBe(true);
      expect(validate('1,50,000', itSchema.c80).valid).toBe(true);
      expect(validate('25,000', itSchema.d80).valid).toBe(true);
      expect(validate('50,000', itSchema.other).valid).toBe(true);
    });

    it('rejects values above maximum statutory caps', () => {
      expect(validate('200000', itSchema.c80).valid).toBe(false); // 80C cap is 1.5L
      expect(validate('150000', itSchema.d80).valid).toBe(false); // 80D cap is 1L
    });

    it('rejects negative numbers and malformed strings', () => {
      expect(validate('-50000', itSchema.gross).valid).toBe(false);
      expect(validate('abc', itSchema.c80).valid).toBe(false);
    });
  });

  describe('URL Hash State', () => {
    const itSchema = {
      g: { required: true, min: 0, max: 1000000000, decimal: true, label: 'Gross' },
      c: { required: true, min: 0, max: 150000, decimal: true, label: '80C' },
      d: { required: true, min: 0, max: 100000, decimal: true, label: '80D' },
      o: { required: true, min: 0, max: 100000000, decimal: true, label: 'Other' },
    };

    it('serializes tax inputs into deterministic query string', () => {
      const hash = serializeHash({ g: 1200000, c: 150000, d: 25000, o: 50000 });
      expect(hash).toBe('#c=150000&d=25000&g=1200000&o=50000');
    });

    it('restores tax inputs accurately from hash', () => {
      const restored = restoreFromHash('#c=150000&d=25000&g=1200000&o=50000', itSchema);
      expect(restored.valid).toBe(true);
      expect(restored.values.g).toBe(1200000);
      expect(restored.values.c).toBe(150000);
      expect(restored.values.d).toBe(25000);
      expect(restored.values.o).toBe(50000);
    });
  });
});
