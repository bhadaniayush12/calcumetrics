/**
 * Number formatting utilities — Section 2 & 5.
 * Indian grouping: 10,00,000 (lakhs/crores)
 * International grouping: 1,000,000
 * font-variant-numeric: tabular-nums applied in CSS; these functions return strings only.
 */

import {
  type CurrencyCode,
  CURRENCY_CONFIG,
  formatDisplayCurrency,
} from './currency';

export type LocaleFormat = 'indian' | 'international';
export type Currency = CurrencyCode;

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: CURRENCY_CONFIG.INR.symbol,
  USD: CURRENCY_CONFIG.USD.symbol,
  EUR: CURRENCY_CONFIG.EUR.symbol,
  GBP: CURRENCY_CONFIG.GBP.symbol,
};

export const CURRENCY_LOCALE: Record<Currency, { locale: string; grouping: LocaleFormat }> = {
  INR: { locale: CURRENCY_CONFIG.INR.locale, grouping: CURRENCY_CONFIG.INR.grouping },
  USD: { locale: CURRENCY_CONFIG.USD.locale, grouping: CURRENCY_CONFIG.USD.grouping },
  EUR: { locale: CURRENCY_CONFIG.EUR.locale, grouping: CURRENCY_CONFIG.EUR.grouping },
  GBP: { locale: CURRENCY_CONFIG.GBP.locale, grouping: CURRENCY_CONFIG.GBP.grouping },
};

/**
 * Format a number with Indian grouping (e.g. 1,26,14,400).
 * Rounds to the nearest integer; no decimal places.
 */
export function formatIndian(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

/**
 * Format a number with international grouping (e.g. 1,261,440).
 */
export function formatIntl(value: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format a currency amount with the appropriate symbol and grouping.
 * Delegates to canonical formatDisplayCurrency (Phase 9).
 */
export function formatCurrency(value: number, currency: Currency = 'INR', decimals = 0): string {
  return formatDisplayCurrency(value, currency, decimals);
}

/**
 * Format a percentage with up to 2 decimal places.
 */
export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a coverage ratio like "1.50x". A ratio against zero liabilities is
 * Infinity, which has no meaningful multiple, so it is labelled instead.
 */
export function formatRatio(value: number, decimals = 2): string {
  return Number.isFinite(value) ? `${value.toFixed(decimals)}x` : 'No liabilities';
}

/**
 * Live digit-grouping formatter for input fields.
 * Strips non-numeric chars (except decimal point), then re-groups.
 * Returns the formatted string and caret offset from the end.
 */
export function formatLiveInput(raw: string, format: LocaleFormat): string {
  // Strip everything except digits and one decimal point
  const stripped = raw.replace(/[^0-9.]/g, '');
  const parts = stripped.split('.');
  const intPart = parts[0] || '';
  const decPart = parts.length > 1 ? '.' + parts[1] : '';

  if (!intPart) return decPart ? '0' + decPart : '';

  const num = parseInt(intPart, 10);
  if (isNaN(num)) return '';

  const grouped = format === 'indian'
    ? new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(num)
    : new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num);

  return grouped + decPart;
}

/**
 * Universal smart input parser:
 * - Shorthand multipliers:
 *   k/K: * 1,000
 *   m/M: * 1,000,000
 *   b/B: * 1,000,000,000
 *   l/L/lac/lacs/lakh/lakhs: * 100,000
 *   cr/Cr/crore/crores: * 10,000,000
 * - European decimal comma notation:
 *   - "4,5" -> 4.5
 *   - "4,5%" -> 4.5
 *   - "1.000,50" -> 1000.50
 *   - When activeCurrency is EUR, single commas act as decimal points (e.g. "1000,50" -> 1000.50)
 *   - When activeCurrency is EUR, dot-grouped integers are thousands (e.g. "12.345" -> 12345)
 * - Supports negative numbers, leading currency symbols (₹, $, €, £), percentage signs (%)
 * - Returns number | null
 */
export function parseSmartInput(
  str: string | number | null | undefined,
  activeCurrency?: string
): number | null {
  if (typeof str === 'number') {
    return isFinite(str) ? (Object.is(str, -0) ? 0 : str) : null;
  }
  if (typeof str !== 'string') return null;

  let s = str.trim();
  if (!s) return null;

  const lower = s.toLowerCase();
  if (lower === 'infinity' || lower === '+infinity') return Infinity;
  if (lower === '-infinity') return -Infinity;

  // Strip known currency symbols
  const CURRENCY_SYMBOLS_REGEX = /[₹$€£]/g;
  s = s.replace(CURRENCY_SYMBOLS_REGEX, '').trim();

  // Strip percentage sign
  s = s.replace(/%/g, '').trim();

  // Check sign
  let sign = 1;
  if (s.startsWith('-')) {
    sign = -1;
    s = s.slice(1).trimStart();
  } else if (s.startsWith('+')) {
    s = s.slice(1).trimStart();
  }

  // Strip currency symbols again if symbol was placed after sign (e.g. "-₹10,000")
  s = s.replace(CURRENCY_SYMBOLS_REGEX, '').trim();
  if (!s) return null;

  // Check for shorthand multipliers at the end
  const suffixMatch = s.match(/^(.*?)\s*(crores?|cr|lakhs?|lacs?|l|k|m|b)$/i);
  let multiplier = 1;
  let baseStr = s;

  if (suffixMatch) {
    baseStr = suffixMatch[1].trim();
    const suf = suffixMatch[2].toLowerCase();
    if (suf === 'k') multiplier = 1e3;
    else if (suf === 'm') multiplier = 1e6;
    else if (suf === 'b') multiplier = 1e9;
    else if (suf === 'cr' || suf === 'crore' || suf === 'crores') multiplier = 1e7;
    else if (suf === 'l' || suf === 'lac' || suf === 'lacs' || suf === 'lakh' || suf === 'lakhs') multiplier = 1e5;
  }

  if (!baseStr) return null;

  let normalized: string;
  const hasComma = baseStr.includes(',');
  const hasDot = baseStr.includes('.');

  if (hasComma && hasDot) {
    const lastComma = baseStr.lastIndexOf(',');
    const lastDot = baseStr.lastIndexOf('.');
    if (lastComma > lastDot) {
      // European format: "1.000,50" or "1.234.567,89"
      normalized = baseStr.replace(/\./g, '').replace(',', '.');
    } else {
      // International or Indian format: "1,000.50" or "10,00,000.50"
      normalized = baseStr.replace(/,/g, '');
    }
  } else if (hasComma) {
    const commaCount = (baseStr.match(/,/g) || []).length;
    if (commaCount > 1) {
      // Multiple commas: e.g. "1,000,000" or "10,00,000" -> thousand separators
      normalized = baseStr.replace(/,/g, '');
    } else {
      // Exactly one comma
      const parts = baseStr.split(',');
      // When digits after comma != 3 (e.g. "4,5", "12,75", "1000,50", "0,5"), treat as decimal point
      if (parts[1].length !== 3) {
        normalized = `${parts[0]}.${parts[1]}`;
      } else {
        // e.g. "50,000", "25,000" in USD/EUR/INR -> thousand separator
        normalized = baseStr.replace(/,/g, '');
      }
    }
  } else if (activeCurrency === 'EUR' && /^\d{1,3}(?:\.\d{3})+$/.test(baseStr)) {
    // de-DE groups thousands with dots: "12.345" / "1.234.567" are integers, not decimals.
    // Without this, a value the field itself formatted re-parses as 12.345.
    normalized = baseStr.replace(/\./g, '');
  } else {
    normalized = baseStr;
  }

  // Validate normalized numeric format
  if (!/^\d+(\.\d+)?$/.test(normalized) && !/^\.\d+$/.test(normalized)) {
    return null;
  }

  const num = parseFloat(normalized);
  if (isNaN(num) || !isFinite(num)) return null;

  let result = sign * num * multiplier;
  if (Object.is(result, -0)) result = 0;
  return result;
}

/**
 * Strip formatting characters and parse to float.
 * Uses parseSmartInput for shorthand and European notation support.
 * Returns NaN if not a valid number.
 */
export function parseFormattedNumber(value: string, activeCurrency?: string): number {
  const smart = parseSmartInput(value, activeCurrency);
  if (smart !== null) return smart;
  const legacy = parseFloat(value.replace(/[^0-9.-]/g, ''));
  return legacy;
}

/** Trim "1.50" → "1.5" and "2.00" → "2" in a fixed-decimal string. */
function trimFixed(str: string): string {
  return str.replace(/\.0+$/, '').replace(/(\.\d*?[1-9])0+$/, '$1');
}

/**
 * Pick the Indian unit (Crore / Lakh / plain) AFTER rounding, so values that round
 * up across a boundary (e.g. 99,99,999.6 → "100 Lakh") move to the larger unit.
 */
function indianUnitParts(
  value: number,
  decimals: number
): { sign: string; unit: 'cr' | 'lakh' | 'plain'; str: string } {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  const lakhStr = (abs / 100000).toFixed(decimals);
  if (abs >= 10000000 || parseFloat(lakhStr) >= 100) {
    return { sign, unit: 'cr', str: trimFixed((abs / 10000000).toFixed(decimals)) };
  }
  if (Math.round(abs) >= 100000) {
    return { sign, unit: 'lakh', str: trimFixed(lakhStr) };
  }
  return { sign, unit: 'plain', str: formatIndian(abs) };
}

/**
 * Format a number into compact Indian notation (e.g. ₹1.26 Cr, ₹81.14 Lakh, ₹25,000).
 */
export function formatIndianCompact(value: number, symbol = '₹', decimals = 2): string {
  const { sign, unit, str } = indianUnitParts(value, decimals);
  if (unit === 'cr') return `${sign}${symbol}${str} Cr`;
  if (unit === 'lakh') return `${sign}${symbol}${str} Lakh`;
  return `${sign}${symbol}${str}`;
}

/**
 * Format a number into full Indian words (e.g. ₹1.26 Crore, ₹81.14 Lakh, ₹25,000).
 */
export function formatIndianWords(value: number, symbol = '₹', decimals = 2): string {
  const { sign, unit, str } = indianUnitParts(value, decimals);
  if (unit === 'cr') return `${sign}${symbol}${str} Crore`;
  if (unit === 'lakh') return `${sign}${symbol}${str} Lakh`;
  return `${sign}${symbol}${str}`;
}

/**
 * Universal compact currency formatter that respects active currency.
 * In INR mode: uses Lakhs and Crores (₹1.26 Cr, ₹81.14 Lakh).
 * In international mode: uses K, M, B ($1.26M, €500K).
 */
export function formatCompactCurrency(value: number, currency: Currency = 'INR', decimals = 2): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '₹';
  if (currency === 'INR') {
    return formatIndianCompact(value, symbol, decimals);
  }

  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 1000000000) {
    const b = abs / 1000000000;
    const str = b.toFixed(decimals).replace(/\.00$/, '').replace(/(\.[1-9])0$/, '$1');
    return `${sign}${symbol}${str}B`;
  }
  if (abs >= 1000000) {
    const m = abs / 1000000;
    const str = m.toFixed(decimals).replace(/\.00$/, '').replace(/(\.[1-9])0$/, '$1');
    return `${sign}${symbol}${str}M`;
  }
  if (abs >= 1000) {
    const k = abs / 1000;
    const str = k.toFixed(1).replace(/\.0$/, '');
    return `${sign}${symbol}${str}K`;
  }
  return `${sign}${symbol}${new Intl.NumberFormat(CURRENCY_LOCALE[currency].locale, { maximumFractionDigits: decimals }).format(abs)}`;
}

/**
 * Format an ISO date string (YYYY-MM-DD) into human-friendly format (e.g. '24 Sep 2026').
 */
export function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length < 3) return isoDate;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12) return isoDate;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${day} ${months[month - 1]} ${year}`;
}

