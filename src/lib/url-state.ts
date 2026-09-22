/**
 * url-state.ts — URL hash state serialization and restoration for Calcumetrics.
 *
 * Phase 4.4 Architecture: Reusable URL Hash State Engine
 *
 *   serializeHash(state)
 *       ↓
 *   #p=25000&r=12&y=15
 *       ↓
 *   restoreFromHash(hash, schema)
 *       ↓
 *   RestoreResult { valid, values, invalidKeys, restoredKeys, missingKeys, raw }
 *
 * ─── Design Principles ───────────────────────────────────────────────────────
 *
 *   1. Zero external dependencies — pure TypeScript, standard Web URL conventions.
 *   2. SSR & SSG safe — no access to window, document, or location at module evaluation.
 *   3. Deterministic — sorted keys guarantee identical hash strings for identical state.
 *   4. Validation integration — validates parsed numbers via Phase 4.3 `validate()`.
 *   5. Safe degradation — malformed syntax or invalid numbers are ignored without throwing.
 *   6. No silent coercion — empty or missing values never become 0.
 *   7. Immutable — input state and schema objects are never mutated.
 *   8. Precision preserving — decimals and financial figures retain numeric fidelity.
 */

import { validate, type ValidationRules } from './validate';

// ─── Types ───────────────────────────────────────────────────────────────────

/**
 * Primitive values accepted for hash serialization.
 * null, undefined, and empty string are omitted from the serialized output.
 */
export type HashStateValue = string | number | boolean | null | undefined;

export type HashState = Record<string, HashStateValue>;

/**
 * Result of restoring calculator state from a URL hash against a schema.
 */
export interface RestoreResult<T extends Record<string, ValidationRules> = Record<string, ValidationRules>> {
  /**
   * True if at least one schema field was present in the hash AND no present
   * schema fields failed validation.
   */
  valid: boolean;

  /**
   * Validated numeric values for fields that passed validation.
   * In mixed scenarios, valid fields are preserved here so callers can
   * safely restore partial valid state.
   */
  values: Partial<Record<keyof T & string, number>>;

  /**
   * Schema keys that were present in the hash but failed validation.
   */
  invalidKeys: (keyof T & string)[];

  /**
   * Schema keys that were present in the hash and passed validation.
   */
  restoredKeys: (keyof T & string)[];

  /**
   * Schema keys that were defined in the schema but absent from the hash.
   */
  missingKeys: (keyof T & string)[];

  /**
   * All raw string key-value pairs extracted from the hash.
   */
  raw: Record<string, string>;
}

// ─── Internal Helpers ────────────────────────────────────────────────────────

/**
 * Safely decode a URI component without throwing on malformed percent sequences.
 */
function safeDecode(encoded: string): string {
  try {
    return decodeURIComponent(encoded.replace(/\+/g, ' '));
  } catch {
    // If malformed percent encoding (e.g. "%ZZ"), return raw string safely
    return encoded;
  }
}

/**
 * Parse raw key-value string pairs from a hash string.
 */
function parseRawHash(hash: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!hash || typeof hash !== 'string') return result;

  // Strip leading '#' characters if present
  let clean = hash.trim();
  while (clean.startsWith('#')) {
    clean = clean.slice(1);
  }

  if (clean === '') return result;

  // Split on '&'
  const pairs = clean.split('&');

  for (const pair of pairs) {
    if (!pair) continue;

    const eqIdx = pair.indexOf('=');
    if (eqIdx === -1) {
      // Missing '=': ignore invalid pair safely
      continue;
    }

    const rawKey = pair.slice(0, eqIdx);
    const rawVal = pair.slice(eqIdx + 1);

    const key = safeDecode(rawKey).trim();
    if (!key) continue; // Empty key is invalid

    const val = safeDecode(rawVal).trim();

    // Deterministic duplicate-key behavior: last key wins (standard URL query behavior)
    result[key] = val;
  }

  return result;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Serialize a calculator state object into a deterministic URL hash string.
 *
 * - Sorts keys alphabetically for deterministic output.
 * - Encodes keys and values using encodeURIComponent.
 * - Skips null, undefined, and empty string values.
 * - Prepends '#' if pairs exist; returns '' if empty.
 * - Does NOT mutate the input state object.
 *
 * @param state - Key-value map of calculator inputs
 * @returns Serialized hash string (e.g. "#p=25000&r=12&y=15") or ""
 */
export function serializeHash(state: HashState): string {
  if (!state || typeof state !== 'object') return '';

  const keys = Object.keys(state).sort();
  const pairs: string[] = [];

  for (const key of keys) {
    const val = state[key];
    if (val === null || val === undefined || val === '') continue;

    const encodedKey = encodeURIComponent(key);
    const encodedVal = encodeURIComponent(String(val));
    pairs.push(`${encodedKey}=${encodedVal}`);
  }

  return pairs.length > 0 ? `#${pairs.join('&')}` : '';
}

/**
 * Restore and validate calculator input values from a URL hash string
 * against a declarative schema of ValidationRules.
 *
 * - Safely ignores malformed pairs or invalid tokens without throwing.
 * - Validates each present schema field using centralized validate().
 * - Restores valid numeric values with full precision.
 * - Does not coerce empty or invalid values to 0.
 * - Never mutates the schema object.
 *
 * @param hash - URL hash string (with or without '#')
 * @param schema - Record mapping input names to ValidationRules
 * @returns RestoreResult with validation status and valid numbers
 */
export function restoreFromHash<T extends Record<string, ValidationRules>>(
  hash: string,
  schema: T
): RestoreResult<T> {
  const raw = parseRawHash(hash);
  const values: Partial<Record<keyof T & string, number>> = {};
  const invalidKeys: (keyof T & string)[] = [];
  const restoredKeys: (keyof T & string)[] = [];
  const missingKeys: (keyof T & string)[] = [];

  for (const key of Object.keys(schema) as (keyof T & string)[]) {
    if (Object.prototype.hasOwnProperty.call(raw, key)) {
      const rawVal = raw[key];
      const rules = schema[key];
      const res = validate(rawVal, rules);

      if (res.valid && res.value !== undefined) {
        values[key] = res.value;
        restoredKeys.push(key);
      } else {
        invalidKeys.push(key);
      }
    } else {
      missingKeys.push(key);
    }
  }

  // Valid overall only if at least one field was restored and no fields failed
  const valid = restoredKeys.length > 0 && invalidKeys.length === 0;

  return {
    valid,
    values,
    invalidKeys,
    restoredKeys,
    missingKeys,
    raw,
  };
}

/**
 * Parse a URL hash string.
 *
 * Overload 1: parseHash(hash) → Record<string, string> (raw key-value map)
 * Overload 2: parseHash(hash, schema) → RestoreResult<T> (validated state)
 */
export function parseHash(hash: string): Record<string, string>;
export function parseHash<T extends Record<string, ValidationRules>>(
  hash: string,
  schema: T
): RestoreResult<T>;
export function parseHash<T extends Record<string, ValidationRules>>(
  hash: string,
  schema?: T
): Record<string, string> | RestoreResult<T> {
  if (schema) {
    return restoreFromHash(hash, schema);
  }
  return parseRawHash(hash);
}

// ─── Browser Helpers (SSR / SSG Safe) ────────────────────────────────────────

/**
 * Safely read window.location.hash in browser environments.
 * Returns empty string in Node / SSR / SSG environments.
 */
export function readCurrentHash(): string {
  if (typeof window !== 'undefined' && window.location) {
    return window.location.hash || '';
  }
  return '';
}

/**
 * Safely update the browser URL hash without causing a page jump.
 * Uses history.replaceState by default to avoid polluting session history.
 * No-op in Node / SSR / SSG environments.
 *
 * @param hash - Target hash string (e.g. "#p=25000&r=12")
 * @param replace - Whether to replace history state (default: true)
 */
export function updateHash(hash: string, replace = true): void {
  if (typeof window === 'undefined' || !window.location) return;

  const normalized = hash ? (hash.startsWith('#') ? hash : `#${hash}`) : '';
  const current = window.location.hash || '';
  if (normalized === current) return;

  if (replace && window.history?.replaceState) {
    const newUrl = window.location.pathname + window.location.search + normalized;
    window.history.replaceState(window.history.state, '', newUrl);
  } else {
    window.location.hash = normalized;
  }
}
