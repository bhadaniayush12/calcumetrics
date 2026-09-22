import { describe, it, expect } from 'vitest';
import { calcEMI, calcEMIAmortization } from './emi';
import { validate } from '../validate';
import { serializeHash, restoreFromHash } from '../url-state';

describe('5.6 EMI Calculator', () => {
  describe('Mathematical Calculation', () => {
    it('matches Section 12 regression fixture: ₹10,00,000, 8.5%, 20yr → EMI ₹8,678, interest ₹10,82,776', () => {
      const res = calcEMI(1000000, 8.5, 20);
      expect(res.emi).toBeCloseTo(8678.23, 2);
      expect(res.emiRounded).toBe(8678);
      expect(Math.round(res.totalInterest)).toBe(1082776);
      expect(Math.round(res.totalPayment)).toBe(2082776);
      expect(res.principal).toBe(1000000);
      expect(res.principalFraction).toBeCloseTo(1000000 / 2082775.76, 4);
      expect(res.interestFraction).toBeCloseTo(1082775.76 / 2082775.76, 4);
    });

    it('handles zero interest rate correctly (0% interest loan)', () => {
      const res = calcEMI(120000, 0, 1); // 12 months, 10,000/mo
      expect(res.emi).toBe(10000);
      expect(res.emiRounded).toBe(10000);
      expect(res.totalInterest).toBe(0);
      expect(res.totalPayment).toBe(120000);
      expect(res.principalFraction).toBe(1);
      expect(res.interestFraction).toBe(0);
    });

    it('handles decimal rates and tenure accurately', () => {
      const res = calcEMI(500000, 7.25, 5);
      expect(res.emi).toBeCloseTo(9959.68, 2);
      expect(res.emiRounded).toBe(9960);
      expect(Math.round(res.totalPayment)).toBe(597581);
      expect(Math.round(res.totalInterest)).toBe(97581);
    });

    it('handles high loan values (e.g. ₹5 Crore luxury home loan)', () => {
      const res = calcEMI(50000000, 9.0, 30);
      expect(res.emi).toBeCloseTo(402311.31, 2);
      expect(res.emiRounded).toBe(402311);
    });

    it('returns zero for invalid negative or non-positive values', () => {
      expect(calcEMI(0, 8.5, 20).emi).toBe(0);
      expect(calcEMI(-100000, 8.5, 20).emi).toBe(0);
      expect(calcEMI(1000000, -2, 20).emi).toBe(0);
      expect(calcEMI(1000000, 8.5, 0).emi).toBe(0);
      expect(calcEMI(1000000, 8.5, -5).emi).toBe(0);
    });
  });

  describe('Amortization Schedule', () => {
    it('generates an accurate amortization schedule ending with zero balance', () => {
      const rows = calcEMIAmortization(1000000, 8.5, 20);
      expect(rows.length).toBe(20);
      expect(rows[0].year).toBe(1);
      expect(rows[19].year).toBe(20);
      expect(rows[19].balance).toBe(0);

      // Total principal repaid across 20 years must equal original principal
      const totalPrincipalRepaid = rows.reduce((acc, row) => acc + row.principal, 0);
      expect(Math.round(totalPrincipalRepaid)).toBe(1000000);
    });
  });

  describe('Validation Schema', () => {
    const emiSchema = {
      principal: { required: true, min: 1000, max: 1000000000, integerOnly: true, label: 'Loan Amount' },
      rate: { required: true, min: 0, max: 50, decimal: true, label: 'Annual Interest Rate' },
      years: { required: true, min: 0.1, max: 50, decimal: true, label: 'Loan Tenure (Years)' },
    };

    it('validates standard inputs successfully', () => {
      expect(validate('10,00,000', emiSchema.principal).valid).toBe(true);
      expect(validate('8.5', emiSchema.rate).valid).toBe(true);
      expect(validate('20', emiSchema.years).valid).toBe(true);
    });

    it('rejects values below min or above max', () => {
      expect(validate('500', emiSchema.principal).valid).toBe(false);
      expect(validate('-1', emiSchema.rate).valid).toBe(false);
      expect(validate('60', emiSchema.rate).valid).toBe(false);
      expect(validate('0', emiSchema.years).valid).toBe(false);
    });
  });

  describe('URL Hash State', () => {
    const emiSchema = {
      p: { required: true, min: 1000, max: 1000000000, integerOnly: true, label: 'Loan Amount' },
      r: { required: true, min: 0, max: 50, decimal: true, label: 'Interest Rate' },
      y: { required: true, min: 0.1, max: 50, decimal: true, label: 'Tenure' },
    };

    it('serializes state accurately into deterministic query string', () => {
      const hash = serializeHash({ p: 1000000, r: 8.5, y: 20 });
      expect(hash).toBe('#p=1000000&r=8.5&y=20');
    });

    it('restores valid hash into typed numeric values', () => {
      const restored = restoreFromHash('#p=1000000&r=8.5&y=20', emiSchema);
      expect(restored.valid).toBe(true);
      expect(restored.values.p).toBe(1000000);
      expect(restored.values.r).toBe(8.5);
      expect(restored.values.y).toBe(20);
    });

    it('handles invalid hash safely', () => {
      const restored = restoreFromHash('#p=xyz&r=-1&y=0', emiSchema);
      expect(restored.valid).toBe(false);
      expect(restored.invalidKeys).toContain('p');
      expect(restored.invalidKeys).toContain('r');
      expect(restored.invalidKeys).toContain('y');
    });
  });
});
