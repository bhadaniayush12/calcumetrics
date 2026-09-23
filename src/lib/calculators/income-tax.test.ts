import { describe, it, expect } from 'vitest';
import { calcIncomeTax } from './income-tax';
import { validate } from '../validate';
import { serializeHash, restoreFromHash } from '../url-state';

describe('5.10 Income Tax Calculator (India)', () => {
  describe('Mathematical Calculations & Budget 2024 Rules', () => {
    it('applies New Regime standard deduction of ₹75,000 and Section 87A zero tax up to ₹12.75 Lakh gross', () => {
      const res = calcIncomeTax(1275000);
      expect(res.newRegime.standardDeduction).toBe(75000);
      expect(res.newRegime.taxableIncome).toBe(1200000);
      // Section 87A rebate gives 0 tax for taxable income <= 12,00,000
      expect(res.newRegime.rebate87A).toBe(60000);
      expect(res.newRegime.totalTax).toBe(0);
    });

    it('calculates Section 87A marginal relief for New Regime when taxable income slightly exceeds ₹12,00,000', () => {
      // Gross 13,00,000 - 75k std ded = 12,25,000 taxable (excess = 25,000)
      const res = calcIncomeTax(1300000);
      expect(res.newRegime.taxableIncome).toBe(1225000);
      // Base tax before relief: 20k (4-8L) + 40k (8-12L) + 25k @ 15% (3,750) = 63,750
      expect(res.newRegime.baseTax).toBe(63750);
      // Marginal relief caps tax to excess income (₹25,000)
      expect(res.newRegime.taxAfterRebate).toBe(25000);
      // Cess 4% on 25,000 = 1,000 -> Total Tax = 26,000
      expect(res.newRegime.totalTax).toBe(26000);
    });

    it('applies Old Tax Regime standard deduction of ₹50,000 and Section 87A rebate up to ₹5,00,000 taxable', () => {
      const res = calcIncomeTax(550000);
      expect(res.oldRegime.standardDeduction).toBe(50000);
      expect(res.oldRegime.taxableIncome).toBe(500000);
      // Slabs: 2.5L-5L (2.5L @ 5% = 12,500), rebate = 12,500 -> 0 tax
      expect(res.oldRegime.rebate87A).toBe(12500);
      expect(res.oldRegime.totalTax).toBe(0);
    });

    it('matches ₹15,00,000 salary fixture comparing New vs Old Regime', () => {
      const res = calcIncomeTax(1500000, 150000, 25000, 50000);

      // New Regime: 15L - 75k = 14.25L taxable
      // Slabs: 4-8L (20k) + 8-12L (40k) + 12-14.25L (2.25L @ 15% = 33,750) = 93,750
      // Cess 4% = 3,750 -> Total = 97,500
      expect(res.newRegime.taxableIncome).toBe(1425000);
      expect(res.newRegime.totalTax).toBe(97500);

      // Old Regime: 15L - (50k std ded + 150k 80C + 25k 80D + 50k other = 275k) = 12.25L taxable
      // Slabs: 2.5-5L (12.5k) + 5-10L (100k) + 10-12.25L (2.25L @ 30% = 67.5k) = 1,80,000
      // Cess 4% = 7,200 -> Total = 1,87,200
      expect(res.oldRegime.taxableIncome).toBe(1225000);
      expect(res.oldRegime.totalTax).toBe(187200);

      expect(res.recommendedRegime).toBe('New Regime');
      expect(res.taxSavings).toBe(89700);
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

    it('correctly calculates high income bracket in New Regime (> ₹24,00,000 @ 30%)', () => {
      const res = calcIncomeTax(3000000); // 30L
      // Taxable = 30L - 75k = 29.25L
      // 4-8L: 20k
      // 8-12L: 40k
      // 12-16L: 60k
      // 16-20L: 80k
      // 20-24L: 100k
      // >24L: 5.25L @ 30% = 1,57,500
      // Base = 4,57,500 + 4% cess (18,300) = 4,75,800
      expect(res.newRegime.taxableIncome).toBe(2925000);
      expect(res.newRegime.baseTax).toBe(457500);
      expect(res.newRegime.totalTax).toBe(475800);
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
