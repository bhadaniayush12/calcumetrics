import { describe, it, expect } from 'vitest';
import { calcFD } from './fd';
import { validate } from '../validate';
import { serializeHash, restoreFromHash } from '../url-state';

describe('5.5 FD Calculator', () => {
  describe('Mathematical Calculation & Compounding Methodology', () => {
    it('matches Section 12 regression fixture: ₹1,00,000, 7%, 5yr quarterly → ₹1,41,477.82', () => {
      const res = calcFD(100000, 7, 5, 'quarterly');
      expect(res.maturity).toBeCloseTo(141477.82, 2);
      expect(res.interest).toBeCloseTo(41477.82, 2);
      expect(res.principal).toBe(100000);
      expect(res.principalFraction).toBeCloseTo(100000 / 141477.82, 4);
      expect(res.interestFraction).toBeCloseTo(41477.82 / 141477.82, 4);
    });

    it('handles all supported compounding frequencies correctly', () => {
      // Monthly (n=12)
      const monthlyRes = calcFD(100000, 7, 5, 'monthly');
      expect(monthlyRes.maturity).toBeCloseTo(141762.53, 2);

      // Half-Yearly (n=2)
      const halfYearlyRes = calcFD(100000, 7, 5, 'half-yearly');
      expect(halfYearlyRes.maturity).toBeCloseTo(141059.88, 2);

      // Annually (n=1)
      const annualRes = calcFD(100000, 7, 5, 'annually');
      expect(annualRes.maturity).toBeCloseTo(140255.17, 2);
    });

    it('handles zero interest rate correctly', () => {
      const res = calcFD(100000, 0, 5, 'quarterly');
      expect(res.maturity).toBe(100000);
      expect(res.interest).toBe(0);
      expect(res.principalFraction).toBe(1);
      expect(res.interestFraction).toBe(0);
    });

    it('handles zero tenure correctly', () => {
      const res = calcFD(100000, 7, 0, 'quarterly');
      expect(res.maturity).toBe(100000);
      expect(res.interest).toBe(0);
    });

    it('handles fractional tenure (e.g. 2.5 years)', () => {
      const res = calcFD(200000, 6.5, 2.5, 'quarterly');
      expect(res.maturity).toBeCloseTo(234982.53, 2);
    });

    it('returns zero for invalid negative or non-positive principal', () => {
      expect(calcFD(0, 7, 5).maturity).toBe(0);
      expect(calcFD(-10000, 7, 5).maturity).toBe(0);
      expect(calcFD(100000, -5, 5).maturity).toBe(0);
      expect(calcFD(100000, 7, -1).maturity).toBe(0);
    });
  });

  describe('Validation Schema', () => {
    const fdSchema = {
      principal: { required: true, min: 500, max: 100000000, integerOnly: true, label: 'Principal Amount' },
      rate: { required: true, min: 0, max: 30, decimal: true, label: 'Annual Interest Rate' },
      years: { required: true, min: 0.1, max: 50, decimal: true, label: 'Tenure (Years)' },
    };

    it('validates standard inputs successfully', () => {
      expect(validate('1,00,000', fdSchema.principal).valid).toBe(true);
      expect(validate('7.1', fdSchema.rate).valid).toBe(true);
      expect(validate('5', fdSchema.years).valid).toBe(true);
    });

    it('rejects out of range values', () => {
      expect(validate('100', fdSchema.principal).valid).toBe(false);
      expect(validate('-1', fdSchema.rate).valid).toBe(false);
      expect(validate('35', fdSchema.rate).valid).toBe(false);
      expect(validate('0', fdSchema.years).valid).toBe(false);
    });
  });

  describe('URL Hash State', () => {
    const fdSchema = {
      p: { required: true, min: 500, max: 100000000, integerOnly: true, label: 'Principal' },
      r: { required: true, min: 0, max: 30, decimal: true, label: 'Rate' },
      y: { required: true, min: 0.1, max: 50, decimal: true, label: 'Years' },
    };

    it('serializes state accurately into deterministic hash', () => {
      const hash = serializeHash({ p: 100000, r: 7.1, y: 5, f: 'quarterly' });
      expect(hash).toBe('#f=quarterly&p=100000&r=7.1&y=5');
    });

    it('restores valid hash into typed numeric values', () => {
      const restored = restoreFromHash('#p=100000&r=7&y=5', fdSchema);
      expect(restored.valid).toBe(true);
      expect(restored.values.p).toBe(100000);
      expect(restored.values.r).toBe(7);
      expect(restored.values.y).toBe(5);
    });

    it('handles invalid hash safely', () => {
      const restored = restoreFromHash('#p=-5000&r=99&y=0', fdSchema);
      expect(restored.valid).toBe(false);
      expect(restored.invalidKeys).toContain('p');
      expect(restored.invalidKeys).toContain('r');
      expect(restored.invalidKeys).toContain('y');
    });
  });

  describe('Canonical Result & Validation Audit (Phase 5 Repair)', () => {
    it('notifies subscribers exactly once per setResult call (single canonical write)', async () => {
      const { setResult, subscribeResult, resetResult } = await import('../result-bus');
      resetResult();

      let updates = 0;
      const unsub = subscribeResult(() => {
        updates++;
      });

      setResult({
        heroValue: '₹1,41,478',
        heroLabel: 'Maturity Value',
        fields: { 'fd-result-maturity': '₹1,41,478' },
      });

      expect(updates).toBe(1);
      unsub();
    });

    it('rejects empty and invalid strings without silent coercion to 0', () => {
      const fdSchema = {
        p: { required: true, min: 500, max: 100000000, integerOnly: true, label: 'Principal Amount' },
        r: { required: true, min: 0, max: 30, decimal: true, label: 'Annual Interest Rate' },
        y: { required: true, min: 0.1, max: 50, decimal: true, label: 'Tenure (Years)' },
      };

      // Empty strings
      expect(validate('', fdSchema.p).valid).toBe(false);
      expect(validate('  ', fdSchema.r).valid).toBe(false);

      // Non-numeric strings
      expect(validate('abc', fdSchema.p).valid).toBe(false);
      expect(validate('invalid', fdSchema.y).valid).toBe(false);

      // Valid zero where allowed (rate min: 0)
      const zeroRate = validate('0', fdSchema.r);
      expect(zeroRate.valid).toBe(true);
      if (zeroRate.valid) expect(zeroRate.value).toBe(0);

      // Valid decimal values
      const decimalRate = validate('7.25', fdSchema.r);
      expect(decimalRate.valid).toBe(true);
      if (decimalRate.valid) expect(decimalRate.value).toBe(7.25);

      const decimalYears = validate('2.5', fdSchema.y);
      expect(decimalYears.valid).toBe(true);
      if (decimalYears.valid) expect(decimalYears.value).toBe(2.5);
    });
  });
});
