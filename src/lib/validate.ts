/**
 * validate.ts — Centralized input validation engine for Calcumetrics.
 *
 * Phase 4.3 Architecture: Single Centralized Validation Engine
 *
 *   validate(value, rules)
 *       ↓
 *   ValidationResult: ValidationSuccess | ValidationFailure
 *
 * ─── Design Principles ───────────────────────────────────────────────────────
 *
 *   1. Zero external dependencies — pure TypeScript, no runtime libraries.
 *   2. No silent coercion — empty strings never become 0; invalid strings reject.
 *   3. Immutable — input values and rules objects are never mutated.
 *   4. Deterministic — identical input + identical rules → identical result and code.
 *   5. Composable — all rules are evaluated in a single validate() call.
 *   6. Node & Browser testable — pure logic, zero window / DOM dependencies.
 *   7. Calculator-focused — streamlined for financial and metric inputs.
 *
 * ─── Currency Handling ───────────────────────────────────────────────────────
 *
 *   The `currency` rule acts as validation metadata only.
 *   It does NOT perform FX conversion, rate lookups, or numeric transforms.
 *   It verifies that the provided currency code is a recognized Calcumetrics
 *   currency ('INR', 'USD', 'EUR', 'GBP'), and ensures the returned value
 *   remains in that currency's native units without conversion.
 *
 * ─── Usage ───────────────────────────────────────────────────────────────────
 *
 *   import { validate } from '../lib/validate';
 *
 *   const result = validate('25,000', {
 *     required: true,
 *     min: 500,
 *     max: 200000,
 *     decimal: false,
 *     negativeAllowed: false,
 *     label: 'Monthly Investment',
 *   });
 *
 *   if (!result.valid) {
 *     console.error(result.error.code, result.error.message);
 *   } else if (result.value !== undefined) {
 *     recalc(result.value);
 *   }
 */

// ─── Supported Currency Codes ────────────────────────────────────────────────

/**
 * Recognized Calcumetrics currency codes.
 * Aligns with formatters.ts Currency type.
 */
export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

const VALID_CURRENCY_CODES = new Set<string>(['INR', 'USD', 'EUR', 'GBP']);

// ─── Deterministic Error Codes ───────────────────────────────────────────────

/**
 * Machine-readable validation error codes.
 * Stable across versions for UI state branching.
 */
export type ValidationErrorCode =
  | 'REQUIRED'              // Field is required but empty/whitespace-only
  | 'NOT_A_NUMBER'          // Value cannot be parsed as a valid numeric literal
  | 'NON_FINITE'            // Value is Infinity or -Infinity
  | 'BELOW_MIN'             // Value is less than rules.min
  | 'ABOVE_MAX'             // Value is greater than rules.max
  | 'DECIMAL_NOT_ALLOWED'   // Value has fractional part when decimal is false
  | 'NEGATIVE_NOT_ALLOWED'  // Value is negative when negativeAllowed is false
  | 'NOT_AN_INTEGER'        // Value is not an integer when integerOnly is true
  | 'INVALID_CURRENCY';     // Currency metadata code is not recognized

// ─── Declarative Rules Interface ─────────────────────────────────────────────

/**
 * Declarative validation rules for a single calculator input.
 *
 * Rule evaluation order:
 *   1. required (empty/missing check)
 *   2. numeric parse (NOT_A_NUMBER / NON_FINITE)
 *   3. negativeAllowed (sign check)
 *   4. integerOnly (whole integer check)
 *   5. decimal (fractional check)
 *   6. min (minimum boundary check)
 *   7. max (maximum boundary check)
 *   8. currency (currency code validity check)
 */
export interface ValidationRules {
  /**
   * Whether the field must have a non-empty value.
   * If true and input is empty/whitespace-only, returns error code 'REQUIRED'.
   * If false or omitted, empty inputs succeed with value = undefined (never 0).
   * Default: false.
   */
  required?: boolean;

  /**
   * Minimum permitted value (inclusive boundary).
   * Returns 'BELOW_MIN' if parsed value < min.
   */
  min?: number;

  /**
   * Maximum permitted value (inclusive boundary).
   * Returns 'ABOVE_MAX' if parsed value > max.
   */
  max?: number;

  /**
   * Whether decimal (fractional) values are permitted.
   * When explicitly false, non-integers return 'DECIMAL_NOT_ALLOWED'.
   * Default: true.
   */
  decimal?: boolean;

  /**
   * Whether negative values are permitted.
   * When false (default), values < 0 return 'NEGATIVE_NOT_ALLOWED'.
   * When true, negative numbers are accepted (e.g. NPV cash outflows).
   * Default: false.
   */
  negativeAllowed?: boolean;

  /**
   * Whether the value must be a whole integer.
   * When true, non-integer values return 'NOT_AN_INTEGER'.
   * Default: false.
   */
  integerOnly?: boolean;

  /**
   * Alias for `integerOnly`.
   * When true, non-integer values return 'NOT_AN_INTEGER'.
   * Default: false.
   */
  integer?: boolean;

  /**
   * Currency metadata for this field.
   * Validates currency code is one of 'INR', 'USD', 'EUR', 'GBP'.
   * Does NOT perform FX conversion or rate adjustments.
   * Invalid currency codes return 'INVALID_CURRENCY'.
   */
  currency?: CurrencyCode | string;

  /**
   * Human-readable label used as the subject in error messages.
   * Defaults to 'Value'.
   * @example 'Monthly Investment', 'Annual Interest Rate', 'Tenure'
   */
  label?: string;
}

// ─── Validation Result Types ─────────────────────────────────────────────────

export interface ValidationError {
  /** Deterministic machine-readable error code */
  code: ValidationErrorCode;
  /** Human-readable explanation suitable for user display */
  message: string;
}

/**
 * Successful validation result.
 * - For non-empty inputs: `value` is the parsed number.
 * - For optional empty inputs: `value` is `undefined` (never 0).
 */
export interface ValidationSuccess {
  valid: true;
  value?: number;
  error?: never;
}

/**
 * Failed validation result with deterministic error details.
 */
export interface ValidationFailure {
  valid: false;
  value?: never;
  error: ValidationError;
}

export type ValidationResult = ValidationSuccess | ValidationFailure;

// ─── Internal Helpers ────────────────────────────────────────────────────────

/**
 * Currency symbols stripped during input parsing (₹, $, €, £).
 */
const KNOWN_CURRENCY_SYMBOLS = /[\u20B9$€£]/g;

/**
 * International grouping pattern for integers:
 * e.g. "1,000", "10,000", "100,000", "1,000,000"
 * First group has 1-3 digits; all subsequent comma groups have exactly 3 digits.
 */
const INTL_GROUPING_PATTERN = /^\d{1,3}(?:,\d{3})+$/;

/**
 * Indian grouping pattern for integers (Lakhs & Crores):
 * e.g. "1,000", "10,000", "1,00,000", "10,00,000", "1,00,00,000"
 * First group has 1-2 digits; intermediate comma groups have 2 digits; last comma group has 3 digits.
 */
const INDIAN_GROUPING_PATTERN = /^\d{1,2}(?:,\d{2})*,\d{3}$/;

/**
 * Pure unformatted digits pattern for integers:
 * e.g. "0", "1", "100", "1000", "1000000"
 */
const UNFORMATTED_INTEGER_PATTERN = /^\d+$/;

/**
 * Clean and parse an input string into a number or null/NaN/Infinity.
 *
 * Rules:
 * - Leading/trailing whitespace is trimmed.
 * - Empty string after trim -> null (signals empty input).
 * - Infinity / -Infinity / +Infinity string -> Infinity / -Infinity.
 * - Removes recognized currency symbols (₹, $, €, £).
 * - Strictly validates thousand comma grouping (International and Indian patterns).
 * - Rejects malformed comma grouping (e.g. "1,,000", "1,00", ",1000", "1,000,00") with NaN.
 * - Rejects any strings with extra dots, letters, or invalid characters with NaN.
 * - Preserves leading minus sign for signed parsing.
 */
function parseStringInput(trimmed: string): number | null {
  if (trimmed === '') return null;

  // Check explicit infinity strings
  const lower = trimmed.toLowerCase();
  if (lower === 'infinity' || lower === '+infinity') return Infinity;
  if (lower === '-infinity') return -Infinity;

  let s = trimmed;

  // Strip leading currency symbols before sign check (e.g. "₹-10,000" or "₹10,000")
  s = s.replace(KNOWN_CURRENCY_SYMBOLS, '').trim();

  // Check sign
  let sign = 1;
  if (s.startsWith('-')) {
    sign = -1;
    s = s.slice(1).trimStart();
  } else if (s.startsWith('+')) {
    s = s.slice(1).trimStart();
  }

  // Strip currency symbols again in case symbol was placed after sign (e.g. "-₹10,000" or "-$500")
  s = s.replace(KNOWN_CURRENCY_SYMBOLS, '').trim();

  if (s === '') return NaN;

  // Separate integer and decimal portions (if any)
  let intPart: string;
  let decPart: string | undefined;

  if (s.includes('.')) {
    const dotParts = s.split('.');
    // More than one decimal dot is invalid
    if (dotParts.length !== 2) return NaN;
    [intPart, decPart] = dotParts;

    // Decimal part cannot contain commas, spaces, or non-digit characters
    if (decPart !== '' && !/^\d+$/.test(decPart)) {
      return NaN;
    }
  } else {
    intPart = s;
  }

  // Validate the integer part
  let parsedIntString: string;

  if (intPart === '') {
    // e.g. ".5" or "."
    // If there is no decimal part or decimal part is empty, "." alone is invalid
    if (decPart === undefined || decPart === '') return NaN;
    parsedIntString = '0';
  } else if (intPart.includes(',')) {
    // Comma grouping is present: MUST strictly match International OR Indian format
    const isValidGrouping =
      INTL_GROUPING_PATTERN.test(intPart) || INDIAN_GROUPING_PATTERN.test(intPart);
    if (!isValidGrouping) {
      return NaN;
    }
    parsedIntString = intPart.replace(/,/g, '');
  } else {
    // Unformatted integer: must consist solely of digits
    if (!UNFORMATTED_INTEGER_PATTERN.test(intPart)) {
      return NaN;
    }
    parsedIntString = intPart;
  }

  // Assemble full canonical numeric string
  const canonicalString =
    decPart !== undefined && decPart !== ''
      ? `${parsedIntString}.${decPart}`
      : parsedIntString;

  const num = parseFloat(canonicalString);
  if (isNaN(num)) return NaN;

  // Handle -0 normalization
  const result = sign * num;
  return Object.is(result, -0) ? 0 : result;
}

/**
 * Centralized human-readable message generator.
 */
function buildMessage(
  code: ValidationErrorCode,
  rules: ValidationRules
): string {
  const label = rules.label?.trim() || 'Value';

  switch (code) {
    case 'REQUIRED':
      return `${label} is required.`;

    case 'NOT_A_NUMBER':
      return `${label} must be a valid number.`;

    case 'NON_FINITE':
      return `${label} must be a finite number.`;

    case 'NEGATIVE_NOT_ALLOWED':
      return `${label} cannot be negative.`;

    case 'NOT_AN_INTEGER':
      return `${label} must be a whole number (no decimal places).`;

    case 'DECIMAL_NOT_ALLOWED':
      return `${label} must be a whole number.`;

    case 'BELOW_MIN':
      return `${label} must be at least ${rules.min}.`;

    case 'ABOVE_MAX':
      return `${label} must be at most ${rules.max}.`;

    case 'INVALID_CURRENCY':
      return `Currency "${rules.currency}" is not a recognized currency code. Use INR, USD, EUR, or GBP.`;

    default: {
      const _exhaustive: never = code;
      return `${label}: invalid input.`;
    }
  }
}

function fail(code: ValidationErrorCode, rules: ValidationRules): ValidationFailure {
  return {
    valid: false,
    error: {
      code,
      message: buildMessage(code, rules),
    },
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Validate a raw input value against a set of declarative rules.
 *
 * Accepts either:
 * - a `string` (from HTML input elements)
 * - a `number` (from programmatic calls or numeric steppers)
 *
 * Does NOT mutate the input value or rules object.
 * Does NOT coerce empty input to 0.
 *
 * @param input - The value to validate (string or number)
 * @param rules - Declarative validation rules
 * @returns ValidationSuccess with parsed value, or ValidationFailure with error
 */
export function validate(
  input: string | number | null | undefined,
  rules: ValidationRules = {}
): ValidationResult {
  // ── Step 1: Null / Undefined / Empty Check ────────────────────────────────
  if (input === null || input === undefined) {
    if (rules.required === true) {
      return fail('REQUIRED', rules);
    }
    return { valid: true, value: undefined };
  }

  let parsed: number;

  if (typeof input === 'number') {
    if (Number.isNaN(input)) {
      return fail('NOT_A_NUMBER', rules);
    }
    if (!Number.isFinite(input)) {
      return fail('NON_FINITE', rules);
    }
    parsed = Object.is(input, -0) ? 0 : input;
  } else {
    const trimmed = String(input).trim();
    if (trimmed === '') {
      if (rules.required === true) {
        return fail('REQUIRED', rules);
      }
      // Optional empty input is valid without producing 0
      return { valid: true, value: undefined };
    }

    const res = parseStringInput(trimmed);
    if (res === null) {
      if (rules.required === true) {
        return fail('REQUIRED', rules);
      }
      return { valid: true, value: undefined };
    }

    if (Number.isNaN(res)) {
      return fail('NOT_A_NUMBER', rules);
    }

    if (!Number.isFinite(res)) {
      return fail('NON_FINITE', rules);
    }

    parsed = res;
  }

  // ── Step 2: Negative Allowed Check ───────────────────────────────────────
  // Default is false (disallow negative numbers) unless explicitly enabled
  if (parsed < 0 && rules.negativeAllowed !== true) {
    return fail('NEGATIVE_NOT_ALLOWED', rules);
  }

  // ── Step 3: Integer Only Check ───────────────────────────────────────────
  if ((rules.integerOnly === true || rules.integer === true) && !Number.isInteger(parsed)) {
    return fail('NOT_AN_INTEGER', rules);
  }

  // ── Step 4: Decimal Allowed Check ─────────────────────────────────────────
  // Decimal defaults to true; fails if explicitly set to false and value has decimals
  if (rules.decimal === false && !Number.isInteger(parsed)) {
    return fail('DECIMAL_NOT_ALLOWED', rules);
  }

  // ── Step 5: Min Boundary Check ───────────────────────────────────────────
  if (rules.min !== undefined && parsed < rules.min) {
    return fail('BELOW_MIN', rules);
  }

  // ── Step 6: Max Boundary Check ───────────────────────────────────────────
  if (rules.max !== undefined && parsed > rules.max) {
    return fail('ABOVE_MAX', rules);
  }

  // ── Step 7: Currency Metadata Check ──────────────────────────────────────
  // Validates currency code validity only — does NOT convert or alter value
  if (rules.currency !== undefined && !VALID_CURRENCY_CODES.has(rules.currency)) {
    return fail('INVALID_CURRENCY', rules);
  }

  // ── All Rules Passed ─────────────────────────────────────────────────────
  return { valid: true, value: parsed };
}

/**
 * Validate multiple named fields in a single call.
 *
 * @param fields - Record mapping field names to { value, rules? } pairs
 * @returns Record mapping field names to ValidationResult
 *
 * @example
 *   const results = validateAll({
 *     monthly: { value: '25000', rules: { required: true, min: 500 } },
 *     rate:    { value: '12',    rules: { required: true, min: 0.1, max: 50 } },
 *     years:   { value: '15',    rules: { required: true, min: 1, max: 40, integerOnly: true } },
 *   });
 */
export function validateAll<K extends string>(
  fields: Record<K, { value: string | number | null | undefined; rules?: ValidationRules }>
): Record<K, ValidationResult> {
  const result = {} as Record<K, ValidationResult>;
  for (const key of Object.keys(fields) as K[]) {
    const item = fields[key];
    result[key] = validate(item.value, item.rules);
  }
  return result;
}

// ─── Type Guards and Convenience Helpers ─────────────────────────────────────

/**
 * Type guard: returns true if validation passed.
 */
export function isValid(result: ValidationResult): result is ValidationSuccess {
  return result.valid === true;
}

/**
 * Type guard: returns true if validation failed.
 */
export function isInvalid(result: ValidationResult): result is ValidationFailure {
  return result.valid === false;
}

/**
 * Returns true if the result represents an optional empty input.
 */
export function isOptionalEmpty(result: ValidationResult): boolean {
  return result.valid === true && result.value === undefined;
}

/**
 * Check whether all field results from validateAll are valid.
 */
export function allValid(results: Record<string, ValidationResult>): boolean {
  return Object.values(results).every((r) => r.valid);
}

/**
 * Extract the first failure from a validateAll result map, or null if all valid.
 */
export function getFirstError(
  results: Record<string, ValidationResult>
): { field: string; error: ValidationError } | null {
  for (const [field, res] of Object.entries(results)) {
    if (!res.valid) {
      return { field, error: res.error };
    }
  }
  return null;
}

/**
 * Extract valid numeric values from a validateAll result map.
 */
export function getValues<K extends string>(
  results: Record<K, ValidationResult>
): Partial<Record<K, number>> {
  const values: Partial<Record<K, number>> = {};
  for (const [key, res] of Object.entries(results) as [K, ValidationResult][]) {
    if (res.valid && res.value !== undefined) {
      values[key] = res.value;
    }
  }
  return values;
}

// ─── Predefined Validation Presets ───────────────────────────────────────────

export const ValidationPresets = {
  /**
   * Positive currency amount (e.g. SIP installment, principal, loan amount).
   */
  currencyAmount: (currency: CurrencyCode = 'INR'): ValidationRules => ({
    required: true,
    min: 0,
    negativeAllowed: false,
    decimal: true,
    currency,
  }),

  /**
   * Percentage rate (0 to 100).
   */
  percentageRate: (): ValidationRules => ({
    required: true,
    min: 0,
    max: 100,
    negativeAllowed: false,
    decimal: true,
  }),

  /**
   * Positive integer count or tenure (e.g. years, installments).
   */
  positiveInteger: (min = 1): ValidationRules => ({
    required: true,
    min,
    negativeAllowed: false,
    integerOnly: true,
  }),

  /**
   * Signed cash flow (can be negative for outflows, positive for inflows).
   */
  cashFlow: (currency: CurrencyCode = 'INR'): ValidationRules => ({
    required: false,
    negativeAllowed: true,
    decimal: true,
    currency,
  }),
} as const;
