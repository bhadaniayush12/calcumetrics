import { describe, it, expect } from 'vitest';
import { calcWACC, calcWACCFromValues } from './corporate';
import { validate } from '../validate';
import { serializeHash, restoreFromHash } from '../url-state';

describe('5.8 WACC Calculator', () => {
  describe('Mathematical Calculation', () => {
    it('matches Section 12 regression fixture: E/V 70%, Re 14.2%, D/V 30%, Rd 8.5%, Tax 25%', () => {
      const res = calcWACCFromValues(7000000, 3000000, 14.2, 8.5, 25);
      expect(res.totalCapital).toBe(10000000);
      expect(res.equityWeight).toBeCloseTo(0.70, 4);
      expect(res.debtWeight).toBeCloseTo(0.30, 4);
      expect(res.waccPct).toBeCloseTo(11.8525, 4);
      expect(res.equityComponentPct).toBeCloseTo(9.94, 4);
      expect(res.debtComponentPct).toBeCloseTo(1.9125, 4);
      expect(res.afterTaxCostOfDebt).toBeCloseTo(6.375, 4);
      expect(res.taxShieldPct).toBeCloseTo(0.6375, 4);
    });

    it('matches legacy calcWACC weights interface', () => {
      const res = calcWACC(0.70, 14.2, 0.30, 8.5, 25);
      expect(res.waccPct).toBeCloseTo(11.8525, 4);
      expect(res.debtComponentPct).toBeCloseTo(1.9125, 4);
    });

    it('handles zero total capital gracefully without dividing by zero', () => {
      const res = calcWACCFromValues(0, 0, 14.2, 8.5, 25);
      expect(res.wacc).toBe(0);
      expect(res.waccPct).toBe(0);
      expect(res.totalCapital).toBe(0);
    });

    it('handles all-equity capital structure (100% Equity)', () => {
      const res = calcWACCFromValues(5000000, 0, 15, 8, 25);
      expect(res.equityWeight).toBe(1);
      expect(res.debtWeight).toBe(0);
      expect(res.waccPct).toBe(15);
      expect(res.debtComponentPct).toBe(0);
    });

    it('handles all-debt capital structure (100% Debt)', () => {
      const res = calcWACCFromValues(0, 5000000, 15, 10, 30);
      expect(res.equityWeight).toBe(0);
      expect(res.debtWeight).toBe(1);
      // After-tax Rd = 10 * (1 - 0.30) = 7.0%
      expect(res.waccPct).toBeCloseTo(7.0, 4);
    });

    it('handles zero corporate tax rate (no tax shield)', () => {
      const res = calcWACCFromValues(6000000, 4000000, 12, 8, 0);
      // 0.60 * 12 + 0.40 * 8 = 7.2 + 3.2 = 10.4%
      expect(res.waccPct).toBeCloseTo(10.4, 4);
      expect(res.taxShieldPct).toBe(0);
    });

    it('handles 100% corporate tax rate (debt interest completely shielded)', () => {
      const res = calcWACCFromValues(6000000, 4000000, 12, 8, 100);
      // 0.60 * 12 + 0.40 * 0 = 7.2%
      expect(res.waccPct).toBeCloseTo(7.2, 4);
      expect(res.afterTaxCostOfDebt).toBe(0);
    });

    it('rejects negative capital or rates by returning zeros', () => {
      expect(calcWACCFromValues(-1000, 5000, 10, 5, 20).wacc).toBe(0);
      expect(calcWACCFromValues(5000, -1000, 10, 5, 20).wacc).toBe(0);
      expect(calcWACCFromValues(5000, 5000, -10, 5, 20).wacc).toBe(0);
      expect(calcWACCFromValues(5000, 5000, 10, -5, 20).wacc).toBe(0);
      expect(calcWACCFromValues(5000, 5000, 10, 5, -20).wacc).toBe(0);
    });
  });

  describe('Validation Schema', () => {
    const waccSchema = {
      equity: { required: true, min: 0, max: 100000000000, decimal: true, label: 'Market Value of Equity' },
      debt: { required: true, min: 0, max: 100000000000, decimal: true, label: 'Market Value of Debt' },
      costEquity: { required: true, min: 0, max: 100, decimal: true, label: 'Cost of Equity (Re)' },
      costDebt: { required: true, min: 0, max: 100, decimal: true, label: 'Cost of Debt (Rd)' },
      taxRate: { required: true, min: 0, max: 100, decimal: true, label: 'Corporate Tax Rate (T)' },
    };

    it('validates standard inputs successfully', () => {
      expect(validate('70,00,000', waccSchema.equity).valid).toBe(true);
      expect(validate('30,00,000', waccSchema.debt).valid).toBe(true);
      expect(validate('14.2', waccSchema.costEquity).valid).toBe(true);
      expect(validate('8.5', waccSchema.costDebt).valid).toBe(true);
      expect(validate('25', waccSchema.taxRate).valid).toBe(true);
    });

    it('accepts zero debt and zero tax as valid boundary inputs', () => {
      expect(validate('0', waccSchema.debt).valid).toBe(true);
      expect(validate('0', waccSchema.taxRate).valid).toBe(true);
    });

    it('rejects percentage rates above 100%', () => {
      expect(validate('105', waccSchema.costEquity).valid).toBe(false);
      expect(validate('150', waccSchema.taxRate).valid).toBe(false);
    });

    it('rejects negative numbers and malformed strings', () => {
      expect(validate('-500', waccSchema.equity).valid).toBe(false);
      expect(validate('-5', waccSchema.costDebt).valid).toBe(false);
      expect(validate('abc', waccSchema.taxRate).valid).toBe(false);
      expect(validate('', waccSchema.costEquity).valid).toBe(false);
    });
  });

  describe('URL Hash State', () => {
    const waccSchema = {
      e: { required: true, min: 0, max: 100000000000, decimal: true, label: 'Equity' },
      d: { required: true, min: 0, max: 100000000000, decimal: true, label: 'Debt' },
      re: { required: true, min: 0, max: 100, decimal: true, label: 'Cost of Equity' },
      rd: { required: true, min: 0, max: 100, decimal: true, label: 'Cost of Debt' },
      t: { required: true, min: 0, max: 100, decimal: true, label: 'Tax Rate' },
    };

    it('serializes state accurately into deterministic query string', () => {
      const hash = serializeHash({ e: 7000000, d: 3000000, re: 14.2, rd: 8.5, t: 25 });
      expect(hash).toBe('#d=3000000&e=7000000&rd=8.5&re=14.2&t=25');
    });

    it('restores valid hash into typed numeric values', () => {
      const restored = restoreFromHash('#d=3000000&e=7000000&rd=8.5&re=14.2&t=25', waccSchema);
      expect(restored.valid).toBe(true);
      expect(restored.values.e).toBe(7000000);
      expect(restored.values.d).toBe(3000000);
      expect(restored.values.re).toBe(14.2);
      expect(restored.values.rd).toBe(8.5);
      expect(restored.values.t).toBe(25);
    });

    it('safely rejects corrupted hash fields without crashing', () => {
      const restored = restoreFromHash('#e=-10&d=3000000&re=bad&rd=8.5&t=25', waccSchema);
      expect(restored.valid).toBe(false);
      expect(restored.invalidKeys).toContain('e');
      expect(restored.invalidKeys).toContain('re');
      expect(restored.values.d).toBe(3000000);
    });
  });
});
