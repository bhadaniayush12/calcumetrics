import { describe, it, expect } from 'vitest';
import {
  validate,
  validateAll,
  isValid,
  isInvalid,
  isOptionalEmpty,
  allValid,
  getFirstError,
  getValues,
  ValidationPresets,
  type ValidationRules,
  type ValidationErrorCode,
} from './validate';

describe('Phase 4.3 — Centralized Validation Engine', () => {
  // ── Requirement 1: Required field with valid value ─────────────────────────
  it('1. required field with valid value succeeds', () => {
    const res = validate('1500', { required: true });
    expect(res.valid).toBe(true);
    if (res.valid) {
      expect(res.value).toBe(1500);
      expect(res.error).toBeUndefined();
    }
  });

  // ── Requirement 2: Required field empty ────────────────────────────────────
  it('2. required field empty fails with REQUIRED code', () => {
    const res = validate('', { required: true });
    expect(res.valid).toBe(false);
    if (!res.valid) {
      expect(res.error.code).toBe('REQUIRED');
      expect(res.error.message).toBe('Value is required.');
    }
  });

  // ── Requirement 3: Optional empty field ────────────────────────────────────
  it('3. optional empty field succeeds with undefined value (not 0)', () => {
    const res = validate('', { required: false });
    expect(res.valid).toBe(true);
    if (res.valid) {
      expect(res.value).toBeUndefined();
      expect(res.value).not.toBe(0);
    }
    expect(isOptionalEmpty(res)).toBe(true);
  });

  // ── Requirement 4: Min boundary valid ──────────────────────────────────────
  it('4. min boundary valid succeeds at exact boundary', () => {
    const res = validate('500', { min: 500 });
    expect(res.valid).toBe(true);
    if (res.valid) {
      expect(res.value).toBe(500);
    }
  });

  // ── Requirement 5: Below min invalid ───────────────────────────────────────
  it('5. below min invalid fails with BELOW_MIN code', () => {
    const res = validate('499.99', { min: 500 });
    expect(res.valid).toBe(false);
    if (!res.valid) {
      expect(res.error.code).toBe('BELOW_MIN');
      expect(res.error.message).toContain('at least 500');
    }
  });

  // ── Requirement 6: Max boundary valid ──────────────────────────────────────
  it('6. max boundary valid succeeds at exact boundary', () => {
    const res = validate('100', { max: 100 });
    expect(res.valid).toBe(true);
    if (res.valid) {
      expect(res.value).toBe(100);
    }
  });

  // ── Requirement 7: Above max invalid ───────────────────────────────────────
  it('7. above max invalid fails with ABOVE_MAX code', () => {
    const res = validate('100.01', { max: 100 });
    expect(res.valid).toBe(false);
    if (!res.valid) {
      expect(res.error.code).toBe('ABOVE_MAX');
      expect(res.error.message).toContain('at most 100');
    }
  });

  // ── Requirement 8: Decimal allowed ─────────────────────────────────────────
  it('8. decimal allowed succeeds with fractional numbers by default or explicitly', () => {
    const res1 = validate('12.75');
    expect(res1.valid).toBe(true);
    if (res1.valid) expect(res1.value).toBe(12.75);

    const res2 = validate('0.05', { decimal: true });
    expect(res2.valid).toBe(true);
    if (res2.valid) expect(res2.value).toBe(0.05);
  });

  // ── Requirement 9: Decimal rejected ────────────────────────────────────────
  it('9. decimal rejected when decimal: false fails with DECIMAL_NOT_ALLOWED', () => {
    const res = validate('12.75', { decimal: false });
    expect(res.valid).toBe(false);
    if (!res.valid) {
      expect(res.error.code).toBe('DECIMAL_NOT_ALLOWED');
      expect(res.error.message).toBe('Value must be a whole number.');
    }
  });

  // ── Requirement 10: Negative allowed ───────────────────────────────────────
  it('10. negative allowed succeeds when negativeAllowed: true', () => {
    const res = validate('-15000', { negativeAllowed: true });
    expect(res.valid).toBe(true);
    if (res.valid) {
      expect(res.value).toBe(-15000);
    }
  });

  // ── Requirement 11: Negative rejected ──────────────────────────────────────
  it('11. negative rejected by default and when negativeAllowed: false', () => {
    const resDefault = validate('-10');
    expect(resDefault.valid).toBe(false);
    if (!resDefault.valid) {
      expect(resDefault.error.code).toBe('NEGATIVE_NOT_ALLOWED');
      expect(resDefault.error.message).toBe('Value cannot be negative.');
    }

    const resExplicit = validate('-10', { negativeAllowed: false });
    expect(resExplicit.valid).toBe(false);
    if (!resExplicit.valid) {
      expect(resExplicit.error.code).toBe('NEGATIVE_NOT_ALLOWED');
    }
  });

  // ── Requirement 12: Integer-only valid integer ─────────────────────────────
  it('12. integer-only valid integer succeeds', () => {
    const res = validate('25', { integerOnly: true });
    expect(res.valid).toBe(true);
    if (res.valid) {
      expect(res.value).toBe(25);
    }
  });

  // ── Requirement 13: Integer-only rejects decimal ───────────────────────────
  it('13. integer-only rejects decimal with NOT_AN_INTEGER', () => {
    const res = validate('25.5', { integerOnly: true });
    expect(res.valid).toBe(false);
    if (!res.valid) {
      expect(res.error.code).toBe('NOT_AN_INTEGER');
      expect(res.error.message).toBe('Value must be a whole number (no decimal places).');
    }
  });

  // ── Requirement 14: Non-finite value rejected ──────────────────────────────
  it('14. non-finite values (Infinity, -Infinity) rejected with NON_FINITE', () => {
    expect(validate(Infinity).valid).toBe(false);
    expect(validate(Infinity).error?.code).toBe('NON_FINITE');

    expect(validate(-Infinity).valid).toBe(false);
    expect(validate(-Infinity).error?.code).toBe('NON_FINITE');

    expect(validate('Infinity').valid).toBe(false);
    expect(validate('Infinity').error?.code).toBe('NON_FINITE');

    expect(validate('-Infinity').valid).toBe(false);
    expect(validate('-Infinity').error?.code).toBe('NON_FINITE');
  });

  // ── Requirement 15: Multiple rules together ────────────────────────────────
  it('15. multiple rules together are evaluated correctly', () => {
    const rules: ValidationRules = {
      required: true,
      min: 1,
      max: 30,
      integerOnly: true,
      negativeAllowed: false,
      label: 'Tenure',
    };

    // Valid case
    const validRes = validate('15', rules);
    expect(validRes.valid).toBe(true);
    if (validRes.valid) expect(validRes.value).toBe(15);

    // Multiple failures evaluated in defined priority order
    const belowMin = validate('0', rules);
    expect(belowMin.valid).toBe(false);
    expect(belowMin.error?.code).toBe('BELOW_MIN');

    const aboveMax = validate('35', rules);
    expect(aboveMax.valid).toBe(false);
    expect(aboveMax.error?.code).toBe('ABOVE_MAX');

    const nonInt = validate('15.5', rules);
    expect(nonInt.valid).toBe(false);
    expect(nonInt.error?.code).toBe('NOT_AN_INTEGER');
  });

  // ── Requirement 16: Deterministic error codes ──────────────────────────────
  it('16. produces deterministic error codes across failure modes', () => {
    const testCases: [unknown, ValidationRules, ValidationErrorCode][] = [
      ['', { required: true }, 'REQUIRED'],
      ['not-a-number', {}, 'NOT_A_NUMBER'],
      [Infinity, {}, 'NON_FINITE'],
      ['-5', { negativeAllowed: false }, 'NEGATIVE_NOT_ALLOWED'],
      ['4.2', { integerOnly: true }, 'NOT_AN_INTEGER'],
      ['4.2', { decimal: false }, 'DECIMAL_NOT_ALLOWED'],
      ['5', { min: 10 }, 'BELOW_MIN'],
      ['15', { max: 10 }, 'ABOVE_MAX'],
      ['100', { currency: 'INVALID_CURRENCY_CODE' }, 'INVALID_CURRENCY'],
    ];

    for (const [input, rules, expectedCode] of testCases) {
      const res = validate(input as any, rules);
      expect(res.valid).toBe(false);
      expect(res.error?.code).toBe(expectedCode);
    }
  });

  // ── Requirement 17: Deterministic human-readable messages ──────────────────
  it('17. produces deterministic human-readable messages using custom label', () => {
    const resWithLabel = validate('', { required: true, label: 'Monthly SIP' });
    expect(resWithLabel.error?.message).toBe('Monthly SIP is required.');

    const resDefaultLabel = validate('', { required: true });
    expect(resDefaultLabel.error?.message).toBe('Value is required.');

    const resMin = validate('5', { min: 10, label: 'Principal' });
    expect(resMin.error?.message).toBe('Principal must be at least 10.');

    const resMax = validate('50', { max: 20, label: 'Rate' });
    expect(resMax.error?.message).toBe('Rate must be at most 20.');
  });

  // ── Requirement 18: Currency metadata accepted ─────────────────────────────
  it('18. currency metadata accepted for INR, USD, EUR, GBP', () => {
    for (const curr of ['INR', 'USD', 'EUR', 'GBP'] as const) {
      const res = validate('1000', { currency: curr });
      expect(res.valid).toBe(true);
      if (res.valid) expect(res.value).toBe(1000);
    }
  });

  // ── Requirement 19: Currency does not perform conversion ───────────────────
  it('19. currency metadata does NOT perform conversion or rate adjustments', () => {
    const inrRes = validate('1000', { currency: 'INR' });
    const usdRes = validate('1000', { currency: 'USD' });
    const eurRes = validate('1000', { currency: 'EUR' });
    const gbpRes = validate('1000', { currency: 'GBP' });

    expect(inrRes.value).toBe(1000);
    expect(usdRes.value).toBe(1000);
    expect(eurRes.value).toBe(1000);
    expect(gbpRes.value).toBe(1000);
  });

  // ── Requirement 20: Input is not mutated ───────────────────────────────────
  it('20. input values and rules objects are never mutated', () => {
    const rules: ValidationRules = Object.freeze({
      required: true,
      min: 10,
      max: 100,
      currency: 'INR',
      label: 'Investment',
    });

    const input = '50';
    const res = validate(input, rules);
    expect(res.valid).toBe(true);
    expect(rules.min).toBe(10);
    expect(rules.max).toBe(100);
  });

  // ── Edge Cases ─────────────────────────────────────────────────────────────
  describe('Edge Cases', () => {
    it('whitespace-only strings treated as empty (not 0)', () => {
      // Required whitespace-only fails with REQUIRED
      const reqRes = validate('   ', { required: true });
      expect(reqRes.valid).toBe(false);
      expect(reqRes.error?.code).toBe('REQUIRED');

      // Optional whitespace-only succeeds with undefined (NOT 0)
      const optRes = validate('   ', { required: false });
      expect(optRes.valid).toBe(true);
      expect(optRes.value).toBeUndefined();
      expect(optRes.value).not.toBe(0);
    });

    it('zero is preserved as 0 and not treated as empty', () => {
      const numZero = validate(0, { required: true });
      expect(numZero.valid).toBe(true);
      expect(numZero.value).toBe(0);

      const strZero = validate('0', { required: true });
      expect(strZero.valid).toBe(true);
      expect(strZero.value).toBe(0);

      // Boundary min check on zero
      const minZero = validate(0, { min: 1 });
      expect(minZero.valid).toBe(false);
      expect(minZero.error?.code).toBe('BELOW_MIN');
    });

    it('very small decimals handled with precision', () => {
      const res = validate('0.000001', { min: 0 });
      expect(res.valid).toBe(true);
      expect(res.value).toBe(0.000001);

      const intCheck = validate('0.000001', { integerOnly: true });
      expect(intCheck.valid).toBe(false);
      expect(intCheck.error?.code).toBe('NOT_AN_INTEGER');
    });

    it('leading and trailing whitespace is safely trimmed', () => {
      const res = validate('   4200   ', { min: 1000 });
      expect(res.valid).toBe(true);
      expect(res.value).toBe(4200);
    });

    it('numeric strings vs numbers produce identical validation results', () => {
      const rules: ValidationRules = { min: 10, max: 100 };
      const strRes = validate('42', rules);
      const numRes = validate(42, rules);

      expect(strRes.valid).toBe(true);
      expect(numRes.valid).toBe(true);
      expect(strRes.value).toBe(numRes.value);
    });

    // ── Grouping & Formatted Numbers Hardening ──────────────────────────────
    describe('Comma Grouping & Malformed Format Hardening', () => {
      it('preserves all required valid formatted numeric patterns', () => {
        // Unformatted integer
        expect(validate('1000').value).toBe(1000);
        // Standard international grouping
        expect(validate('1,000').value).toBe(1000);
        expect(validate('100,000').value).toBe(100000);
        expect(validate('1,000,000.50').value).toBe(1000000.5);
        // Indian grouping (Lakhs & Crores)
        expect(validate('1,00,000').value).toBe(100000);
        expect(validate('10,00,000').value).toBe(1000000);
        expect(validate('1,00,00,000').value).toBe(10000000);
        expect(validate('10,00,000.50').value).toBe(1000000.5);
        // Valid formatted with currency symbols
        expect(validate('₹10,00,000').value).toBe(1000000);
        expect(validate('$1,000.50').value).toBe(1000.5);
        expect(validate('€1,000.50').value).toBe(1000.5);
        expect(validate('£1,000.50').value).toBe(1000.5);
        // Valid negative formatted when negativeAllowed: true
        expect(validate('-1,000', { negativeAllowed: true }).value).toBe(-1000);
        expect(validate('-10,00,000', { negativeAllowed: true }).value).toBe(-1000000);
        expect(validate('-₹10,00,000', { negativeAllowed: true }).value).toBe(-1000000);
      });

      it('rejects malformed comma grouping formats with NOT_A_NUMBER', () => {
        const malformedInputs = [
          '1,,000',          // Consecutive commas
          ',1000',           // Leading comma
          '1000,',           // Trailing comma
          '1,00',            // Insufficient digits after comma
          '1,0',             // Single digit after comma
          '1,0000',          // 4 digits after comma
          '1,000,00',        // Mixed grouping: 3 then 2 digits
          '1,000,0000',      // Malformed 4 digits at end
          '1,2,3,4',         // Arbitrary single-digit comma splits
          '10,000,000,0',    // Trailing single digit
          '100,00',          // Invalid 2-digit group
          '1,00,00',         // Invalid trailing 2-digit group
          '100,00,000',      // 3-digit leading group in Indian format
          '10,000,00',       // 4 digits middle in Indian format
          ',',               // Single comma
          ',,',              // Double comma
          '1,000.5,0',       // Comma in decimal fraction
          '100.0,0',         // Comma in decimal fraction
          '1, 000',          // Space after comma
          '1 ,000',          // Space before comma
          '₹1,,000',         // Currency with malformed grouping
          '$1,00',           // Currency with malformed grouping
          '-1,,000',         // Negative with malformed grouping
          '-1,00',           // Negative with malformed grouping
        ];

        for (const input of malformedInputs) {
          const res = validate(input, { negativeAllowed: true });
          expect(res.valid).toBe(false);
          expect(res.error?.code).toBe('NOT_A_NUMBER');
        }
      });

      it('does not break unformatted numbers, zero, or decimals', () => {
        // Zero representations
        expect(validate('0').value).toBe(0);
        expect(validate(0).value).toBe(0);
        expect(validate('0.00').value).toBe(0);
        expect(validate('-0').value).toBe(0);

        // Leading dot decimals
        expect(validate('.5').value).toBe(0.5);
        expect(validate('.005').value).toBe(0.005);

        // Large unformatted integers
        expect(validate('1000000000').value).toBe(1000000000);

        // Whitespace trimming with formatted numbers
        expect(validate('   10,00,000   ').value).toBe(1000000);
        expect(validate('   $1,000.50   ').value).toBe(1000.5);
      });
    });

    it('rejects invalid non-numeric strings without silent coercion', () => {
      expect(validate('12abc').valid).toBe(false);
      expect(validate('12abc').error?.code).toBe('NOT_A_NUMBER');

      expect(validate('abc12').valid).toBe(false);
      expect(validate('abc12').error?.code).toBe('NOT_A_NUMBER');

      expect(validate('1.2.3').valid).toBe(false);
      expect(validate('1.2.3').error?.code).toBe('NOT_A_NUMBER');

      expect(validate('--5').valid).toBe(false);
      expect(validate('--5').error?.code).toBe('NOT_A_NUMBER');

      expect(validate('12 34').valid).toBe(false);
      expect(validate('12 34').error?.code).toBe('NOT_A_NUMBER');

      expect(validate(NaN).valid).toBe(false);
      expect(validate(NaN).error?.code).toBe('NOT_A_NUMBER');
    });

    it('safely handles null and undefined inputs', () => {
      expect(validate(null, { required: true }).valid).toBe(false);
      expect(validate(null, { required: true }).error?.code).toBe('REQUIRED');

      expect(validate(undefined, { required: true }).valid).toBe(false);
      expect(validate(undefined, { required: true }).error?.code).toBe('REQUIRED');

      expect(validate(null, { required: false }).valid).toBe(true);
      expect(validate(null, { required: false }).value).toBeUndefined();

      expect(validate(undefined, { required: false }).valid).toBe(true);
      expect(validate(undefined, { required: false }).value).toBeUndefined();
    });
  });

  // ── Multi-Field Validation (validateAll) ────────────────────────────────────
  describe('validateAll & Helper Utilities', () => {
    it('validates a complete calculator input set', () => {
      const results = validateAll({
        investment: { value: '25,000', rules: { required: true, min: 500 } },
        rate: { value: '12', rules: { required: true, min: 1, max: 30 } },
        years: { value: '15', rules: { required: true, min: 1, max: 40, integerOnly: true } },
      });

      expect(allValid(results)).toBe(true);
      expect(getFirstError(results)).toBeNull();

      const values = getValues(results);
      expect(values.investment).toBe(25000);
      expect(values.rate).toBe(12);
      expect(values.years).toBe(15);
    });

    it('identifies failures correctly with getFirstError', () => {
      const results = validateAll({
        investment: { value: '25,000', rules: { required: true, min: 500 } },
        rate: { value: '45', rules: { required: true, min: 1, max: 30, label: 'Expected Return' } },
        years: { value: '15', rules: { required: true, min: 1, max: 40, integerOnly: true } },
      });

      expect(allValid(results)).toBe(false);
      const firstErr = getFirstError(results);
      expect(firstErr).not.toBeNull();
      expect(firstErr?.field).toBe('rate');
      expect(firstErr?.error.code).toBe('ABOVE_MAX');
      expect(firstErr?.error.message).toContain('Expected Return must be at most 30');
    });

    it('type guards work as expected', () => {
      const success = validate('10');
      const failure = validate('abc');

      expect(isValid(success)).toBe(true);
      expect(isInvalid(success)).toBe(false);

      expect(isValid(failure)).toBe(false);
      expect(isInvalid(failure)).toBe(true);
    });
  });

  // ── Predefined Presets ─────────────────────────────────────────────────────
  describe('ValidationPresets', () => {
    it('currencyAmount preset validates currency amounts', () => {
      const rules = ValidationPresets.currencyAmount('INR');
      expect(validate('5000', rules).valid).toBe(true);
      expect(validate('-100', rules).valid).toBe(false);
      expect(validate('-100', rules).error?.code).toBe('NEGATIVE_NOT_ALLOWED');
    });

    it('percentageRate preset validates percentages within 0–100', () => {
      const rules = ValidationPresets.percentageRate();
      expect(validate('12.5', rules).valid).toBe(true);
      expect(validate('100.5', rules).valid).toBe(false);
      expect(validate('100.5', rules).error?.code).toBe('ABOVE_MAX');
    });

    it('positiveInteger preset validates whole positive numbers', () => {
      const rules = ValidationPresets.positiveInteger(1);
      expect(validate('10', rules).valid).toBe(true);
      expect(validate('0', rules).valid).toBe(false);
      expect(validate('10.5', rules).valid).toBe(false);
    });

    it('cashFlow preset permits signed decimals', () => {
      const rules = ValidationPresets.cashFlow('USD');
      expect(validate('-50000.50', rules).valid).toBe(true);
      expect(validate('25000', rules).valid).toBe(true);
    });
  });
});
