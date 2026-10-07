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
 * Auto-detects the appropriate initial currency based on client locale / timezone.
 * Rules:
 *   - Europe/London or en-GB -> GBP
 *   - Europe/Berlin, Europe/Paris, Europe/Madrid, Europe/Rome, or de/fr/es locales -> EUR
 *   - America/New_York, America/Chicago, America/Los_Angeles or en-US -> USD
 *   - Asia/Kolkata or en-IN or fallback -> INR
 */
export function detectUserCurrency(customTz?: string, customLocale?: string): CurrencyCode {
  if (typeof window === 'undefined' && customTz === undefined && customLocale === undefined) return DEFAULT_CURRENCY;
  try {
    let tz = customTz !== undefined
      ? customTz
      : (typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : '');
    tz = (tz || '').trim();

    // 1. Timezone detection
    if (tz) {
      if (tz === 'Europe/London' || tz === 'Europe/Belfast' || tz === 'Europe/Jersey' || tz === 'Europe/Guernsey' || tz === 'Europe/Isle_of_Man' || tz.includes('London')) {
        return 'GBP';
      }
      if (
        tz === 'Europe/Berlin' ||
        tz === 'Europe/Paris' ||
        tz === 'Europe/Madrid' ||
        tz === 'Europe/Rome' ||
        tz === 'Europe/Amsterdam' ||
        tz === 'Europe/Brussels' ||
        tz === 'Europe/Vienna' ||
        tz === 'Europe/Dublin' ||
        tz === 'Europe/Lisbon' ||
        tz === 'Europe/Helsinki' ||
        tz === 'Europe/Athens' ||
        tz.startsWith('Europe/')
      ) {
        return 'EUR';
      }
      if (
        tz === 'America/New_York' ||
        tz === 'America/Chicago' ||
        tz === 'America/Los_Angeles' ||
        tz === 'America/Denver' ||
        tz === 'America/Phoenix' ||
        tz === 'America/Anchorage' ||
        tz === 'America/Honolulu' ||
        tz === 'America/Detroit' ||
        tz === 'America/Boise' ||
        tz.startsWith('America/') ||
        tz.startsWith('US/')
      ) {
        return 'USD';
      }
      if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta' || tz.includes('Kolkata') || tz.includes('Calcutta')) {
        return 'INR';
      }
    }

    // 2. Language/Locale detection
    let langs: string[] = [];
    if (customLocale !== undefined) {
      langs = customLocale ? [customLocale] : [];
    } else if (typeof navigator !== 'undefined') {
      langs = navigator.languages ? Array.from(navigator.languages) : [navigator.language];
    }

    for (const rawLang of langs) {
      if (!rawLang || typeof rawLang !== 'string') continue;
      const lang = rawLang.toLowerCase().trim();
      if (lang === 'en-gb' || lang.startsWith('en-gb')) {
        return 'GBP';
      }
      if (
        lang.startsWith('de') ||
        lang.startsWith('fr') ||
        lang.startsWith('es') ||
        lang.startsWith('it') ||
        lang.startsWith('nl') ||
        lang.startsWith('pt') ||
        lang.startsWith('el') ||
        lang.startsWith('fi')
      ) {
        return 'EUR';
      }
      if (lang === 'en-us' || lang.startsWith('en-us')) {
        return 'USD';
      }
      if (
        lang === 'en-in' ||
        lang.startsWith('en-in') ||
        lang.startsWith('hi') ||
        lang.startsWith('ta') ||
        lang.startsWith('te') ||
        lang.startsWith('bn') ||
        lang.startsWith('gu') ||
        lang.startsWith('mr') ||
        lang.startsWith('kn') ||
        lang.startsWith('ml') ||
        lang.startsWith('pa')
      ) {
        return 'INR';
      }
    }
  } catch {}
  return DEFAULT_CURRENCY;
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
    if (!raw) {
      return detectUserCurrency();
    }
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

/**
 * Formats a numeric preset chip value dynamically based on currency code and symbol.
 * In INR:
 *   >= 10,000,000 -> ₹1 Cr
 *   >= 100,000    -> ₹1L (or ₹10L, ₹50L)
 *   >= 1,000      -> ₹5k
 * In International (USD/EUR/GBP):
 *   >= 1,000,000,000 -> $1B
 *   >= 1,000,000     -> $1M (or $2.5M, $10M)
 *   >= 1,000         -> $5k (or $100k)
 */
export function formatPresetChip(num: number, code: CurrencyCode = DEFAULT_CURRENCY, customSymbol?: string): string {
  const sym = customSymbol || CURRENCY_CONFIG[code]?.symbol || '₹';
  if (code === 'INR') {
    if (num >= 10000000) {
      const cr = num / 10000000;
      const str = cr % 1 === 0 ? String(cr) : cr.toFixed(1);
      return `${sym}${str} Cr`;
    }
    if (num >= 100000) {
      const l = num / 100000;
      const str = l % 1 === 0 ? String(l) : l.toFixed(1);
      return `${sym}${str}L`;
    }
    if (num >= 1000) {
      const k = num / 1000;
      const str = k % 1 === 0 ? String(k) : k.toFixed(1);
      return `${sym}${str}k`;
    }
    return `${sym}${num}`;
  } else {
    if (num >= 1000000000) {
      const b = num / 1000000000;
      const str = b % 1 === 0 ? String(b) : b.toFixed(1);
      return `${sym}${str}B`;
    }
    if (num >= 1000000) {
      const m = num / 1000000;
      const str = m % 1 === 0 ? String(m) : m.toFixed(1);
      return `${sym}${str}M`;
    }
    if (num >= 1000) {
      const k = num / 1000;
      const str = k % 1 === 0 ? String(k) : k.toFixed(1);
      return `${sym}${str}k`;
    }
    return `${sym}${num}`;
  }
}

