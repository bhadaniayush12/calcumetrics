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
 * Strip formatting characters and parse to float.
 * Returns NaN if not a valid number.
 */
export function parseFormattedNumber(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]/g, ''));
}

/**
 * Format a number into compact Indian notation (e.g. ₹1.26 Cr, ₹81.14 Lakh, ₹25,000).
 */
export function formatIndianCompact(value: number, symbol = '₹', decimals = 2): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 10000000) {
    const cr = abs / 10000000;
    const str = cr.toFixed(decimals).replace(/\.00$/, '').replace(/(\.[1-9])0$/, '$1');
    return `${sign}${symbol}${str} Cr`;
  }
  if (abs >= 100000) {
    const lakh = abs / 100000;
    const str = lakh.toFixed(decimals).replace(/\.00$/, '').replace(/(\.[1-9])0$/, '$1');
    return `${sign}${symbol}${str} Lakh`;
  }
  return `${sign}${symbol}${formatIndian(abs)}`;
}

/**
 * Format a number into full Indian words (e.g. ₹1.26 Crore, ₹81.14 Lakh, ₹25,000).
 */
export function formatIndianWords(value: number, symbol = '₹', decimals = 2): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 10000000) {
    const cr = abs / 10000000;
    const str = cr.toFixed(decimals).replace(/\.00$/, '').replace(/(\.[1-9])0$/, '$1');
    return `${sign}${symbol}${str} Crore`;
  }
  if (abs >= 100000) {
    const lakh = abs / 100000;
    const str = lakh.toFixed(decimals).replace(/\.00$/, '').replace(/(\.[1-9])0$/, '$1');
    return `${sign}${symbol}${str} Lakh`;
  }
  return `${sign}${symbol}${formatIndian(abs)}`;
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

