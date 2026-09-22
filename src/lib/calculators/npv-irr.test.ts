import { describe, it, expect } from 'vitest';
import { calcNPV, calcNPVDetails, calcIRR } from './corporate';
import { validate } from '../validate';
import { serializeHash, restoreFromHash } from '../url-state';

describe('5.9 NPV & IRR Calculators', () => {
  describe('NPV Calculations', () => {
    it('matches Section 12 regression fixture: -1,00,000, [30k, 40k, 50k, 60k] @10%', () => {
      const cfs = [-100000, 30000, 40000, 50000, 60000];
      const npv = calcNPV(10, cfs);
      expect(npv).toBeCloseTo(38877.13, 2);

      const details = calcNPVDetails(10, 100000, [30000, 40000, 50000, 60000]);
      expect(details.npv).toBeCloseTo(38877.13, 2);
      expect(details.totalDiscountedInflows).toBeCloseTo(138877.13, 2);
      expect(details.totalUndiscountedInflows).toBe(180000);
      expect(details.netUndiscountedGain).toBe(80000);
      expect(details.profitabilityIndex).toBeCloseTo(1.3888, 4);
      expect(details.isViable).toBe(true);
      expect(details.yearlyDiscounted).toHaveLength(4);
    });

    it('handles zero discount rate correctly (undiscounted sum)', () => {
      const details = calcNPVDetails(0, 100000, [30000, 40000, 50000, 60000]);
      expect(details.npv).toBe(80000);
      expect(details.totalDiscountedInflows).toBe(180000);
      expect(details.profitabilityIndex).toBe(1.8);
      expect(details.isViable).toBe(true);
    });

    it('correctly identifies negative NPV (unviable project)', () => {
      const details = calcNPVDetails(30, 100000, [20000, 20000, 20000, 20000]);
      expect(details.npv).toBeLessThan(0);
      expect(details.profitabilityIndex).toBeLessThan(1);
      expect(details.isViable).toBe(false);
    });

    it('handles zero initial outflow gracefully', () => {
      const details = calcNPVDetails(10, 0, [10000, 20000]);
      expect(details.npv).toBeCloseTo(details.totalDiscountedInflows, 2);
      expect(details.profitabilityIndex).toBe(0);
      expect(details.isViable).toBe(true);
    });
  });

  describe('IRR Calculations', () => {
    it('matches Section 12 regression fixture: [-100k, 30k, 40k, 50k, 60k] → 24.89%', () => {
      const cfs = [-100000, 30000, 40000, 50000, 60000];
      const res = calcIRR(cfs);
      expect(res.valid).toBe(true);
      expect(res.irrPct).toBeCloseTo(24.89, 2);
      // Verify NPV at this IRR is effectively zero
      const npvAtIRR = calcNPV(res.irrPct, cfs);
      expect(Math.abs(npvAtIRR)).toBeLessThan(1.0);
    });

    it('calculates simple 1-year 100% return', () => {
      const res = calcIRR([-1000, 2000]);
      expect(res.valid).toBe(true);
      expect(res.irrPct).toBeCloseTo(100.0, 2);
    });

    it('fails gracefully when all cash flows are positive', () => {
      const res = calcIRR([10000, 20000, 30000]);
      expect(res.valid).toBe(false);
      expect(res.error).toBeDefined();
    });

    it('fails gracefully when all cash flows are negative', () => {
      const res = calcIRR([-10000, -20000, -30000]);
      expect(res.valid).toBe(false);
      expect(res.error).toBeDefined();
    });
  });

  describe('Validation Schemas', () => {
    const npvSchema = {
      r: { required: true, min: 0, max: 100, decimal: true, label: 'Discount Rate' },
      c0: { required: true, min: 0, max: 10000000000, decimal: true, label: 'Initial Outflow' },
      c1: { required: true, min: 0, max: 10000000000, decimal: true, label: 'Year 1 Inflow' },
      c2: { required: true, min: 0, max: 10000000000, decimal: true, label: 'Year 2 Inflow' },
    };

    it('validates NPV parameters successfully', () => {
      expect(validate('10', npvSchema.r).valid).toBe(true);
      expect(validate('1,00,000', npvSchema.c0).valid).toBe(true);
      expect(validate('30,000', npvSchema.c1).valid).toBe(true);
    });

    it('rejects negative discount rate or invalid numbers', () => {
      expect(validate('-5', npvSchema.r).valid).toBe(false);
      expect(validate('xyz', npvSchema.c0).valid).toBe(false);
      expect(validate('', npvSchema.c1).valid).toBe(false);
    });
  });

  describe('URL Hash State', () => {
    const npvSchema = {
      c0: { required: true, min: 0, max: 10000000000, decimal: true, label: 'Outflow' },
      c1: { required: true, min: 0, max: 10000000000, decimal: true, label: 'Y1' },
      c2: { required: true, min: 0, max: 10000000000, decimal: true, label: 'Y2' },
      c3: { required: true, min: 0, max: 10000000000, decimal: true, label: 'Y3' },
      c4: { required: true, min: 0, max: 10000000000, decimal: true, label: 'Y4' },
      r: { required: true, min: 0, max: 100, decimal: true, label: 'Rate' },
    };

    it('serializes NPV state into deterministic query string', () => {
      const hash = serializeHash({ r: 10, c0: 100000, c1: 30000, c2: 40000, c3: 50000, c4: 60000 });
      expect(hash).toBe('#c0=100000&c1=30000&c2=40000&c3=50000&c4=60000&r=10');
    });

    it('restores NPV state from hash', () => {
      const restored = restoreFromHash('#c0=100000&c1=30000&c2=40000&c3=50000&c4=60000&r=10', npvSchema);
      expect(restored.valid).toBe(true);
      expect(restored.values.r).toBe(10);
      expect(restored.values.c0).toBe(100000);
      expect(restored.values.c1).toBe(30000);
      expect(restored.values.c4).toBe(60000);
    });
  });
});
