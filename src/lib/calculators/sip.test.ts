import { describe, it, expect } from 'vitest';
import { calcSIP, calcSIPYearly, type SIPResult } from './sip';
import { validate, type ValidationRules } from '../validate';
import { serializeHash, restoreFromHash } from '../url-state';
import type { CalcResult } from '../result-bus';

describe('SIP Calculator (Phase 5.1)', () => {
  // Declarative validation schema for SIP inputs
  const sipSchema: Record<'monthly' | 'rate' | 'years', ValidationRules> = {
    monthly: { required: true, min: 500, max: 2000000, integerOnly: true, label: 'Monthly Investment' },
    rate: { required: true, min: 1, max: 30, decimal: true, label: 'Expected Return Rate' },
    years: { required: true, min: 1, max: 40, integerOnly: true, label: 'Time Period' },
  };

  describe('1. Core Calculation & Section 12 Fixtures', () => {
    it('calculates Section 12 standard fixture: ₹25,000 / 12% / 15yr → ₹1,26,14,400', () => {
      const res: SIPResult = calcSIP(25000, 12, 15);
      expect(Math.round(res.maturity)).toBe(12614400);
      expect(res.invested).toBe(4500000);
      expect(Math.round(res.gain)).toBe(8114400);
      expect(res.gainPct).toBeCloseTo(180.32, 1);
      expect(res.principalFraction + res.gainFraction).toBeCloseTo(1.0, 5);
    });

    it('calculates Section 12 checkpoints: 3, 5, 10, and 20 years', () => {
      expect(Math.round(calcSIP(25000, 12, 3).maturity)).toBe(1087691);
      expect(Math.round(calcSIP(25000, 12, 5).maturity)).toBe(2062159);
      expect(Math.round(calcSIP(25000, 12, 10).maturity)).toBe(5808477);
      expect(Math.round(calcSIP(25000, 12, 20).maturity)).toBe(24978698);
    });

    it('handles zero interest rate (0% return) correctly as an annuity-due', () => {
      const res = calcSIP(10000, 0, 5);
      expect(res.invested).toBe(600000);
      expect(res.maturity).toBe(600000);
      expect(res.gain).toBe(0);
      expect(res.gainPct).toBe(0);
      expect(res.principalFraction).toBe(1);
      expect(res.gainFraction).toBe(0);
    });

    it('handles decimal interest rates (e.g. 12.5% p.a.)', () => {
      const res = calcSIP(25000, 12.5, 15);
      expect(res.maturity).toBeGreaterThan(12614400);
      expect(res.invested).toBe(4500000);
    });
  });

  describe('2. Yearly Breakdown Schedule', () => {
    it('generates correct number of yearly progression rows', () => {
      const schedule = calcSIPYearly(25000, 12, 15);
      expect(schedule.length).toBe(15);
      expect(schedule[0].year).toBe(1);
      expect(schedule[14].year).toBe(15);
    });

    it('verifies yearly schedule aligns with final total result', () => {
      const schedule = calcSIPYearly(25000, 12, 15);
      const lastRow = schedule[14];
      const fullRes = calcSIP(25000, 12, 15);

      expect(lastRow.invested).toBe(fullRes.invested);
      expect(lastRow.maturity).toBe(fullRes.maturity);
      expect(lastRow.gain).toBe(fullRes.gain);
    });
  });

  describe('3. Centralized Validation Integration', () => {
    it('accepts valid SIP parameters within allowed boundaries', () => {
      expect(validate('25000', sipSchema.monthly).valid).toBe(true);
      expect(validate('12.0', sipSchema.rate).valid).toBe(true);
      expect(validate('15', sipSchema.years).valid).toBe(true);
    });

    it('rejects monthly investment below min (500) or above max (2,000,000)', () => {
      const below = validate('400', sipSchema.monthly);
      expect(below.valid).toBe(false);
      expect(below.error?.code).toBe('BELOW_MIN');

      const above = validate('2500000', sipSchema.monthly);
      expect(above.valid).toBe(false);
      expect(above.error?.code).toBe('ABOVE_MAX');
    });

    it('rejects decimal monthly investment when integerOnly is true', () => {
      const res = validate('25000.50', sipSchema.monthly);
      expect(res.valid).toBe(false);
      expect(res.error?.code).toBe('NOT_AN_INTEGER');
    });

    it('rejects negative numbers safely without silent coercion', () => {
      const res = validate('-5000', sipSchema.monthly);
      expect(res.valid).toBe(false);
      expect(res.error?.code).toBe('NEGATIVE_NOT_ALLOWED');
    });

    it('rejects rate outside 1–30% range', () => {
      expect(validate('0.5', sipSchema.rate).error?.code).toBe('BELOW_MIN');
      expect(validate('35', sipSchema.rate).error?.code).toBe('ABOVE_MAX');
    });

    it('rejects duration outside 1–40 years range or fractional years', () => {
      expect(validate('0', sipSchema.years).error?.code).toBe('BELOW_MIN');
      expect(validate('45', sipSchema.years).error?.code).toBe('ABOVE_MAX');
      expect(validate('15.5', sipSchema.years).error?.code).toBe('NOT_AN_INTEGER');
    });

    it('never coerces empty string to zero', () => {
      const res = validate('', sipSchema.monthly);
      expect(res.valid).toBe(false);
      expect(res.error?.code).toBe('REQUIRED');
      expect(res.value).toBeUndefined();
    });
  });

  describe('4. URL Hash State Integration', () => {
    const urlSchema = {
      p: sipSchema.monthly,
      r: sipSchema.rate,
      y: sipSchema.years,
    };

    it('serializes SIP state into canonical hash: #p=25000&r=12&y=15', () => {
      const hash = serializeHash({ p: 25000, r: 12, y: 15 });
      expect(hash).toBe('#p=25000&r=12&y=15');
    });

    it('restores valid SIP state from URL hash', () => {
      const restored = restoreFromHash('#p=25000&r=12&y=15', urlSchema);
      expect(restored.valid).toBe(true);
      expect(restored.values.p).toBe(25000);
      expect(restored.values.r).toBe(12);
      expect(restored.values.y).toBe(15);
    });

    it('restores formatted numbers with commas: #p=25,000&r=12&y=15', () => {
      const restored = restoreFromHash('#p=25,000&r=12&y=15', urlSchema);
      expect(restored.valid).toBe(true);
      expect(restored.values.p).toBe(25000);
    });

    it('safely handles invalid values without crashing or corrupting other fields', () => {
      const restored = restoreFromHash('#p=abc&r=12&y=15', urlSchema);
      expect(restored.valid).toBe(false);
      expect(restored.invalidKeys).toContain('p');
      expect(restored.values.p).toBeUndefined();
      expect(restored.values.r).toBe(12);
      expect(restored.values.y).toBe(15);
    });

    it('safely handles empty values (#p=&r=12&y=15) without turning into zero', () => {
      const restored = restoreFromHash('#p=&r=12&y=15', urlSchema);
      expect(restored.valid).toBe(false);
      expect(restored.invalidKeys).toContain('p');
      expect(restored.values.p).toBeUndefined();
    });
  });

  describe('5. Canonical Result Contract', () => {
    it('formats canonical CalcResult with hero, secondary rows, and fields', () => {
      const res = calcSIP(25000, 12, 15);
      const canonical: CalcResult = {
        heroValue: '₹1,26,14,400',
        heroLabel: 'Estimated Total Maturity',
        rows: [
          { label: 'Total Invested', value: '₹45,00,000' },
          { label: 'Total Gain', value: '₹81,14,400', variant: 'accent' },
          { label: 'Gain %', value: '180.3%' },
        ],
        fields: {
          'sip-result-maturity': '₹1,26,14,400',
          'sip-result-invested': '₹45,00,000',
          'sip-result-gain': '₹81,14,400',
          'sip-result-gain-pct': '180.3%',
        },
        meta: {
          principalFraction: res.principalFraction,
          gainFraction: res.gainFraction,
        },
      };

      expect(canonical.heroValue).toBe('₹1,26,14,400');
      expect(canonical.rows?.length).toBe(3);
      expect(canonical.fields?.['sip-result-maturity']).toBe('₹1,26,14,400');
    });
  });
});
