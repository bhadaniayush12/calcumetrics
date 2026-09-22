/**
 * currency.ts — Canonical Currency & Display Locale System (Phase 9)
 *
 * Core Principle: Currency display != currency conversion.
 *   The currency selector alters ONLY symbol and locale-aware number formatting.
 *   The underlying numeric amount is NEVER multiplied, divided, or transformed
 *   by exchange rates. No FX APIs or conversions exist in Calcumetrics.
 *
 * Supported Display Currencies (V1 scope):
 *   - INR (₹, en-IN, Indian grouping)
 *   - USD ($, en-US, International grouping)
 *   - EUR (€, de-DE, International grouping)
 *   - GBP (£, en-GB, International grouping)
 *
 * Storage & Invariants:
 *   - Canonical localStorage key: 'cm_currency'
 *   - Stored format: '₹ INR' | '$ USD' | '€ EUR' | '£ GBP' (or raw currency code)
 *   - Safe fallback: invalid / unknown values safely fall back to 'INR' ('₹ INR')
 *   - SSR safe: zero DOM/window/localStorage access during build time
 *   - Jurisdiction locking: /in/* is strictly locked to INR; /us/* is strictly locked to USD
 */

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';
export type CurrencyLabel = '₹ INR' | '$ USD' | '€ EUR' | '£ GBP';
export type LocaleGrouping = 'indian' | 'international';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: CurrencyLabel;
  locale: string;
  grouping: LocaleGrouping;
  name: string;
}

export const SUPPORTED_CURRENCIES: readonly CurrencyCode[] = ['INR', 'USD', 'EUR', 'GBP'] as const;

export const DEFAULT_CURRENCY: CurrencyCode = 'INR';
export const DEFAULT_CURRENCY_LABEL: CurrencyLabel = '₹ INR';
export const CURRENCY_STORAGE_KEY = 'cm_currency';

export const CURRENCY_CONFIG: Record<CurrencyCode, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    label: '₹ INR',
    locale: 'en-IN',
    grouping: 'indian',
    name: 'Indian Rupee',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    label: '$ USD',
    locale: 'en-US',
    grouping: 'international',
    name: 'US Dollar',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    label: '€ EUR',
    locale: 'de-DE',
    grouping: 'international',
    name: 'Euro',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    label: '£ GBP',
    locale: 'en-GB',
    grouping: 'international',
    name: 'British Pound',
  },
};

/**
 * Type guard for supported currency codes.
 */
export function isSupportedCurrency(value: unknown): value is CurrencyCode {
  return typeof value === 'string' && (SUPPORTED_CURRENCIES as readonly string[]).includes(value);
}

/**
 * Normalizes any string, label, or unknown value to a valid CurrencyCode.
 * Safely defaults to 'INR' on null, undefined, or unsupported values (e.g. 'CAD').
 */
export function normalizeCurrency(value: unknown): CurrencyCode {
  if (!value || typeof value !== 'string') return DEFAULT_CURRENCY;
  const trimmed = value.trim();

  // Exact code match
  if (isSupportedCurrency(trimmed)) return trimmed;

  // Match from label (e.g. '₹ INR', '$ USD', '€ EUR', '£ GBP')
  if (trimmed.includes('INR') || trimmed.includes('₹')) return 'INR';
  if (trimmed.includes('USD') || trimmed.includes('$')) return 'USD';
  if (trimmed.includes('EUR') || trimmed.includes('€')) return 'EUR';
  if (trimmed.includes('GBP') || trimmed.includes('£')) return 'GBP';

  return DEFAULT_CURRENCY;
}

/**
 * Returns configuration metadata for a given currency code.
 */
export function getCurrencyConfig(code: unknown): CurrencyConfig {
  const normalized = normalizeCurrency(code);
  return CURRENCY_CONFIG[normalized];
}

/**
 * Client-side safe getter for stored currency.
 * Returns DEFAULT_CURRENCY during SSR or when localStorage is inaccessible/empty.
 */
export function getStoredCurrency(): CurrencyCode {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return DEFAULT_CURRENCY;
  }
  try {
    const raw = localStorage.getItem(CURRENCY_STORAGE_KEY);
    return normalizeCurrency(raw);
  } catch {
    return DEFAULT_CURRENCY;
  }
}

/**
 * Client-side safe setter for stored currency.
 * Validates the value and never persists unsupported currency identifiers.
 * Returns the normalized CurrencyCode that was persisted.
 */
export function saveCurrency(value: unknown): CurrencyCode {
  const code = normalizeCurrency(value);
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      const config = CURRENCY_CONFIG[code];
      localStorage.setItem(CURRENCY_STORAGE_KEY, config.label);
    } catch {
      // QuotaExceeded or security error in private browsing — silently ignore
    }
  }
  return code;
}

/**
 * Checks whether a given route pathname belongs to a jurisdiction-locked region.
 * Locked routes ignore the global currency selector.
 */
export function isJurisdictionLocked(pathname: string): boolean {
  if (!pathname || typeof pathname !== 'string') return false;
  const normalized = pathname.replace(/\/$/, '') || '/';
  return (
    normalized.startsWith('/in/') ||
    normalized === '/in' ||
    normalized.startsWith('/us/') ||
    normalized === '/us' ||
    normalized.startsWith('/uk/') ||
    normalized === '/uk'
  );
}

/**
 * Returns the statutory currency code for jurisdiction-locked routes,
 * or null if the route is a global-display calculator.
 */
export function getJurisdictionCurrency(pathname: string): CurrencyCode | null {
  if (!pathname || typeof pathname !== 'string') return null;
  const normalized = pathname.replace(/\/$/, '') || '/';
  if (normalized.startsWith('/in/') || normalized === '/in') return 'INR';
  if (normalized.startsWith('/us/') || normalized === '/us') return 'USD';
  if (normalized.startsWith('/uk/') || normalized === '/uk') return 'GBP';
  return null;
}

/**
 * Formats a numeric value into a display currency string using standard Intl.NumberFormat.
 * NEVER alters the underlying numeric value (Zero FX conversion invariant).
 */
export function formatDisplayCurrency(
  value: number,
  currencyCode: unknown = DEFAULT_CURRENCY,
  decimals = 0
): string {
  const config = getCurrencyConfig(currencyCode);
  const rounded = decimals === 0 ? Math.round(value) : value;

  const formattedNumber = new Intl.NumberFormat(config.locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(rounded);

  return `${config.symbol}${formattedNumber}`;
}
