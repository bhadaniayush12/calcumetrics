/**
 * Number formatting utilities — Section 2 & 5.
 * Indian grouping: 10,00,000 (lakhs/crores)
 * International grouping: 1,000,000
 * font-variant-numeric: tabular-nums applied in CSS; these functions return strings only.
 */

export type LocaleFormat = 'indian' | 'international';
export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

const CURRENCY_LOCALE: Record<Currency, { locale: string; grouping: LocaleFormat }> = {
  INR: { locale: 'en-IN', grouping: 'indian' },
  USD: { locale: 'en-US', grouping: 'international' },
  EUR: { locale: 'de-DE', grouping: 'international' },
  GBP: { locale: 'en-GB', grouping: 'international' },
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
 */
export function formatCurrency(value: number, currency: Currency = 'INR', decimals = 0): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const { grouping } = CURRENCY_LOCALE[currency];
  const formatted = grouping === 'indian'
    ? formatIndian(value)
    : formatIntl(value, decimals);
  return `${symbol}${formatted}`;
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
