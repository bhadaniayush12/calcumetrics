import { describe, it, expect } from 'vitest';
import { calcCAGR } from './cagr';
import { validate } from '../validate';
import { serializeHash, restoreFromHash } from '../url-state';

describe('5.4 CAGR Calculator', () => {
  describe('Mathematical Calculation', () => {
    it('matches Section 12 regression fixture: ₹1,00,000 → ₹2,50,000 in 5yr → 20.11%', () => {
      const res = calcCAGR(100000, 250000, 5);
      expect(res.cagr).toBeCloseTo(0.201124, 5);
      expect(res.cagrPct).toBeCloseTo(20.11, 2);
      expect(res.absoluteReturn).toBe(150000);
      expect(res.absoluteReturnPct).toBe(150);
      expect(res.multiple).toBe(2.5);
    });

    it('handles identical beginning and ending values (PV = FV)', () => {
      const res = calcCAGR(100000, 100000, 5);
      expect(res.cagr).toBe(0);
      expect(res.cagrPct).toBe(0);
      expect(res.absoluteReturn).toBe(0);
      expect(res.absoluteReturnPct).toBe(0);
      expect(res.multiple).toBe(1);
    });

    it('handles investment losses / negative returns (FV < PV)', () => {
      const res = calcCAGR(100000, 50000, 5);
      expect(res.cagrPct).toBeCloseTo(-12.94, 2);
      expect(res.absoluteReturn).toBe(-50000);
      expect(res.absoluteReturnPct).toBe(-50);
      expect(res.multiple).toBe(0.5);
    });

    it('handles fractional years and decimal values', () => {
      const res = calcCAGR(100000, 120000, 1.5);
      // (1.2)^(1/1.5) - 1 = (1.2)^(0.66667) - 1 = 1.12924 - 1 = 12.92%
      expect(res.cagrPct).toBeCloseTo(12.92, 2);
    });

    it('handles realistic high values', () => {
      const res = calcCAGR(10000000, 50000000, 10);
      // (5)^(1/10) - 1 = 1.1746189 - 1 = 17.46%
      expect(res.cagrPct).toBeCloseTo(17.46, 2);
      expect(res.multiple).toBe(5);
    });

    it('returns zero for invalid zero/negative cases', () => {
      expect(calcCAGR(0, 250000, 5).cagrPct).toBe(0);
      expect(calcCAGR(-100000, 250000, 5).cagrPct).toBe(0);
      expect(calcCAGR(100000, 0, 5).cagrPct).toBe(0);
      expect(calcCAGR(100000, -50000, 5).cagrPct).toBe(0);
      expect(calcCAGR(100000, 250000, 0).cagrPct).toBe(0);
      expect(calcCAGR(100000, 250000, -2).cagrPct).toBe(0);
    });
  });

  describe('Validation Schema', () => {
    const cagrSchema = {
      pv: { required: true, min: 100, max: 1000000000, label: 'Initial Investment' },
      fv: { required: true, min: 1, max: 1000000000, label: 'Final Value' },
      years: { required: true, min: 0.1, max: 100, decimal: true, label: 'Time Period (Years)' },
    };

    it('validates standard inputs successfully', () => {
      expect(validate('1,00,000', cagrSchema.pv).valid).toBe(true);
      expect(validate('2,50,000', cagrSchema.fv).valid).toBe(true);
      expect(validate('5', cagrSchema.years).valid).toBe(true);
    });

    it('rejects values below minimum', () => {
      expect(validate('0', cagrSchema.pv).valid).toBe(false);
      expect(validate('0', cagrSchema.fv).valid).toBe(false);
      expect(validate('0', cagrSchema.years).valid).toBe(false);
    });

    it('rejects non-numeric inputs', () => {
      expect(validate('abc', cagrSchema.pv).valid).toBe(false);
    });
  });

  describe('URL Hash State', () => {
    const cagrSchema = {
      pv: { required: true, min: 100, max: 1000000000, label: 'Initial Investment' },
      fv: { required: true, min: 1, max: 1000000000, label: 'Final Value' },
      y: { required: true, min: 0.1, max: 100, decimal: true, label: 'Years' },
    };

    it('serializes state accurately into deterministic query string', () => {
      const hash = serializeHash({ pv: 100000, fv: 250000, y: 5 });
      expect(hash).toBe('#fv=250000&pv=100000&y=5');
    });

    it('restores valid hash into typed numeric values', () => {
      const restored = restoreFromHash('#pv=100000&fv=250000&y=5', cagrSchema);
      expect(restored.valid).toBe(true);
      expect(restored.values.pv).toBe(100000);
      expect(restored.values.fv).toBe(250000);
      expect(restored.values.y).toBe(5);
    });

    it('safely handles invalid hash strings without throwing', () => {
      const restored = restoreFromHash('#pv=-500&fv=invalid&y=0', cagrSchema);
      expect(restored.valid).toBe(false);
      expect(restored.invalidKeys).toContain('pv');
      expect(restored.invalidKeys).toContain('fv');
      expect(restored.invalidKeys).toContain('y');
    });
  });
});
