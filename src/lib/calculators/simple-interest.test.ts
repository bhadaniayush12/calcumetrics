import { describe, it, expect } from 'vitest';
import { calcSimpleInterest } from './simple-interest';
import { validate } from '../validate';
import { serializeHash, restoreFromHash } from '../url-state';

describe('5.3 Simple Interest Calculator', () => {
  describe('Mathematical Calculation', () => {
    it('matches Section 12 regression fixture: ₹1,00,000, 7.5%, 5yr', () => {
      const res = calcSimpleInterest(100000, 7.5, 5);
      expect(res.interest).toBe(37500);
      expect(res.totalAmount).toBe(137500);
      expect(res.compoundInterestAmount).toBeCloseTo(143562.93, 2);
      expect(res.compoundingAdvantage).toBeCloseTo(6062.93, 2);
    });

    it('handles zero interest rate correctly: 0% yields zero interest and total equals principal', () => {
      const res = calcSimpleInterest(100000, 0, 5);
      expect(res.interest).toBe(0);
      expect(res.totalAmount).toBe(100000);
      expect(res.compoundInterestAmount).toBe(100000);
      expect(res.compoundingAdvantage).toBe(0);
    });

    it('handles zero tenure correctly: 0 years yields zero interest', () => {
      const res = calcSimpleInterest(50000, 8, 0);
      expect(res.interest).toBe(0);
      expect(res.totalAmount).toBe(50000);
      expect(res.compoundingAdvantage).toBe(0);
    });

    it('handles decimal rate and decimal years', () => {
      const res = calcSimpleInterest(250000, 6.75, 3.5);
      // SI = 250000 * 6.75 * 3.5 / 100 = 59062.5
      expect(res.interest).toBe(59062.5);
      expect(res.totalAmount).toBe(309062.5);
    });

    it('handles large principal amounts safely', () => {
      const res = calcSimpleInterest(10000000, 10, 10);
      // SI = 10,000,000 * 10 * 10 / 100 = 10,000,000
      expect(res.interest).toBe(10000000);
      expect(res.totalAmount).toBe(20000000);
    });

    it('returns zero for non-positive principal or negative parameters', () => {
      expect(calcSimpleInterest(0, 5, 5).totalAmount).toBe(0);
      expect(calcSimpleInterest(-1000, 5, 5).totalAmount).toBe(0);
      expect(calcSimpleInterest(100000, -5, 5).totalAmount).toBe(0);
      expect(calcSimpleInterest(100000, 5, -2).totalAmount).toBe(0);
    });
  });

  describe('Validation Schema', () => {
    const siSchema = {
      principal: { required: true, min: 500, max: 100000000, integerOnly: true, label: 'Principal Amount' },
      rate: { required: true, min: 0, max: 100, decimal: true, label: 'Annual Interest Rate' },
      years: { required: true, min: 0.1, max: 50, decimal: true, label: 'Time Period (Tenure)' },
    };

    it('validates standard inputs successfully', () => {
      expect(validate('1,00,000', siSchema.principal).valid).toBe(true);
      expect(validate('7.5', siSchema.rate).valid).toBe(true);
      expect(validate('5', siSchema.years).valid).toBe(true);
    });

    it('accepts zero rate as valid', () => {
      const res = validate('0', siSchema.rate);
      expect(res.valid).toBe(true);
      if (res.valid) expect(res.value).toBe(0);
    });

    it('rejects out of bound values', () => {
      expect(validate('100', siSchema.principal).valid).toBe(false); // below min 500
      expect(validate('-1', siSchema.rate).valid).toBe(false); // below min 0
      expect(validate('105', siSchema.rate).valid).toBe(false); // above max 100
      expect(validate('0', siSchema.years).valid).toBe(false); // below min 0.1
    });

    it('rejects decimal principal when integerOnly is set', () => {
      expect(validate('10000.50', siSchema.principal).valid).toBe(false);
    });
  });

  describe('URL Hash State', () => {
    const siSchema = {
      p: { required: true, min: 500, max: 100000000, integerOnly: true, label: 'Principal' },
      r: { required: true, min: 0, max: 100, decimal: true, label: 'Rate' },
      y: { required: true, min: 0.1, max: 50, decimal: true, label: 'Years' },
    };

    it('serializes state accurately into deterministic query string', () => {
      const hash = serializeHash({ p: 100000, r: 7.5, y: 5 });
      expect(hash).toBe('#p=100000&r=7.5&y=5');
    });

    it('restores valid hash into typed numeric values', () => {
      const restored = restoreFromHash('#p=100000&r=7.5&y=5', siSchema);
      expect(restored.valid).toBe(true);
      expect(restored.values.p).toBe(100000);
      expect(restored.values.r).toBe(7.5);
      expect(restored.values.y).toBe(5);
    });

    it('safely handles partial or invalid hash strings without throwing', () => {
      const restored = restoreFromHash('#p=abc&r=999&y=5', siSchema);
      expect(restored.valid).toBe(false);
      expect(restored.invalidKeys).toContain('p');
      expect(restored.invalidKeys).toContain('r');
      expect(restored.values.y).toBe(5);
    });
  });
});
