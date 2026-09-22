import { describe, it, expect } from 'vitest';
import { calcBreakEven } from './breakeven';
import { validate } from '../validate';
import { serializeHash, restoreFromHash } from '../url-state';

describe('5.7 Break-Even Calculator', () => {
  describe('Mathematical Calculation', () => {
    it('matches Section 12 regression fixture: ₹5,00,000 fixed, ₹500 price, ₹300 variable', () => {
      const res = calcBreakEven(500000, 500, 300);
      expect(res.unitsBreakEven).toBe(2500);
      expect(res.revenueBreakEven).toBe(1250000);
      expect(res.contributionMargin).toBe(200);
      expect(res.contributionMarginRatio).toBeCloseTo(0.40, 4);
      expect(res.variableCostRatio).toBeCloseTo(0.60, 4);
      expect(res.isPossible).toBe(true);
    });

    it('handles zero fixed costs correctly (instant break-even at 0 units)', () => {
      const res = calcBreakEven(0, 500, 300);
      expect(res.unitsBreakEven).toBe(0);
      expect(res.revenueBreakEven).toBe(0);
      expect(res.contributionMargin).toBe(200);
      expect(res.isPossible).toBe(true);
    });

    it('handles zero contribution margin (price equals variable cost)', () => {
      const res = calcBreakEven(500000, 300, 300);
      expect(res.contributionMargin).toBe(0);
      expect(res.unitsBreakEven).toBe(Infinity);
      expect(res.revenueBreakEven).toBe(Infinity);
      expect(res.isPossible).toBe(false);
    });

    it('handles negative contribution margin (price less than variable cost)', () => {
      const res = calcBreakEven(500000, 250, 300);
      expect(res.contributionMargin).toBe(-50);
      expect(res.unitsBreakEven).toBe(Infinity);
      expect(res.revenueBreakEven).toBe(Infinity);
      expect(res.isPossible).toBe(false);
    });

    it('handles decimal prices and variable costs accurately', () => {
      const res = calcBreakEven(15000, 24.50, 9.50);
      // CM = 24.50 - 9.50 = 15.00
      // Units = 15000 / 15 = 1000
      // Revenue = 1000 * 24.50 = 24500
      expect(res.contributionMargin).toBe(15);
      expect(res.unitsBreakEven).toBe(1000);
      expect(res.revenueBreakEven).toBe(24500);
      expect(res.contributionMarginRatio).toBeCloseTo(15 / 24.5, 4);
      expect(res.isPossible).toBe(true);
    });

    it('rejects negative inputs by returning zero result and isPossible: false', () => {
      expect(calcBreakEven(-50000, 100, 50).isPossible).toBe(false);
      expect(calcBreakEven(50000, -100, 50).isPossible).toBe(false);
      expect(calcBreakEven(50000, 100, -50).isPossible).toBe(false);
    });
  });

  describe('Validation Schema', () => {
    const beSchema = {
      fixed: { required: true, min: 0, max: 1000000000, decimal: true, label: 'Fixed Costs' },
      price: { required: true, min: 0.01, max: 10000000, decimal: true, label: 'Selling Price per Unit' },
      variable: { required: true, min: 0, max: 10000000, decimal: true, label: 'Variable Cost per Unit' },
    };

    it('validates standard inputs successfully', () => {
      expect(validate('5,00,000', beSchema.fixed).valid).toBe(true);
      expect(validate('500', beSchema.price).valid).toBe(true);
      expect(validate('300', beSchema.variable).valid).toBe(true);
    });

    it('accepts zero fixed costs and zero variable costs as valid', () => {
      const fixedRes = validate('0', beSchema.fixed);
      const varRes = validate('0', beSchema.variable);
      expect(fixedRes.valid).toBe(true);
      expect(varRes.valid).toBe(true);
      if (fixedRes.valid) expect(fixedRes.value).toBe(0);
      if (varRes.valid) expect(varRes.value).toBe(0);
    });

    it('rejects zero or negative selling price', () => {
      expect(validate('0', beSchema.price).valid).toBe(false);
      expect(validate('-10', beSchema.price).valid).toBe(false);
    });

    it('rejects negative fixed or variable costs', () => {
      expect(validate('-5000', beSchema.fixed).valid).toBe(false);
      expect(validate('-100', beSchema.variable).valid).toBe(false);
    });

    it('rejects non-numeric characters and malformed numbers', () => {
      expect(validate('abc', beSchema.fixed).valid).toBe(false);
      expect(validate('500..00', beSchema.price).valid).toBe(false);
      expect(validate('', beSchema.fixed).valid).toBe(false);
    });
  });

  describe('URL Hash State', () => {
    const beSchema = {
      f: { required: true, min: 0, max: 1000000000, decimal: true, label: 'Fixed Costs' },
      p: { required: true, min: 0.01, max: 10000000, decimal: true, label: 'Price' },
      v: { required: true, min: 0, max: 10000000, decimal: true, label: 'Variable Cost' },
    };

    it('serializes state accurately into deterministic query string', () => {
      const hash = serializeHash({ f: 500000, p: 500, v: 300 });
      expect(hash).toBe('#f=500000&p=500&v=300');
    });

    it('restores valid hash into typed numeric values', () => {
      const restored = restoreFromHash('#f=500000&p=500&v=300', beSchema);
      expect(restored.valid).toBe(true);
      expect(restored.values.f).toBe(500000);
      expect(restored.values.p).toBe(500);
      expect(restored.values.v).toBe(300);
    });

    it('handles out of order keys deterministically', () => {
      const restored = restoreFromHash('#v=300&f=500000&p=500', beSchema);
      expect(restored.valid).toBe(true);
      expect(restored.values.f).toBe(500000);
      expect(restored.values.p).toBe(500);
      expect(restored.values.v).toBe(300);
    });

    it('safely rejects invalid values in hash without throwing', () => {
      const restored = restoreFromHash('#f=-100&p=zero&v=300', beSchema);
      expect(restored.valid).toBe(false);
      expect(restored.invalidKeys).toContain('f');
      expect(restored.invalidKeys).toContain('p');
      expect(restored.values.v).toBe(300);
    });
  });
});
