import { describe, expect, it, beforeEach } from 'vitest';
import {
  CURRENCY_CONFIG,
  CURRENCY_STORAGE_KEY,
  DEFAULT_CURRENCY,
  DEFAULT_CURRENCY_LABEL,
  formatDisplayCurrency,
  getCurrencyConfig,
  getJurisdictionCurrency,
  getStoredCurrency,
  isJurisdictionLocked,
  isSupportedCurrency,
  normalizeCurrency,
  saveCurrency,
  SUPPORTED_CURRENCIES,
  type CurrencyCode,
} from './currency';
import { formatCurrency, formatIndian, formatIntl } from './formatters';

describe('Phase 9: Currency Display / Locale System', () => {
  // ── 1. Supported Currency List & Scope (Section 2 & 3) ─────────────────────
  it('strictly limits supported currencies to V1 scope: INR, USD, EUR, GBP', () => {
    expect(SUPPORTED_CURRENCIES).toHaveLength(4);
    expect(SUPPORTED_CURRENCIES).toContain('INR');
    expect(SUPPORTED_CURRENCIES).toContain('USD');
    expect(SUPPORTED_CURRENCIES).toContain('EUR');
    expect(SUPPORTED_CURRENCIES).toContain('GBP');

    expect(DEFAULT_CURRENCY).toBe('INR');
    expect(DEFAULT_CURRENCY_LABEL).toBe('₹ INR');
  });

  it('correctly identifies valid vs unsupported currency codes', () => {
    expect(isSupportedCurrency('INR')).toBe(true);
    expect(isSupportedCurrency('USD')).toBe(true);
    expect(isSupportedCurrency('EUR')).toBe(true);
    expect(isSupportedCurrency('GBP')).toBe(true);

    expect(isSupportedCurrency('CAD')).toBe(false);
    expect(isSupportedCurrency('AUD')).toBe(false);
    expect(isSupportedCurrency('SGD')).toBe(false);
    expect(isSupportedCurrency('JPY')).toBe(false);
    expect(isSupportedCurrency('')).toBe(false);
    expect(isSupportedCurrency(null)).toBe(false);
    expect(isSupportedCurrency(undefined)).toBe(false);
  });

  // ── 2. Normalization & Safe Fallback (Section 6) ───────────────────────────
  it('normalizes label strings, currency codes, and falls back safely to INR', () => {
    expect(normalizeCurrency('₹ INR')).toBe('INR');
    expect(normalizeCurrency('$ USD')).toBe('USD');
    expect(normalizeCurrency('€ EUR')).toBe('EUR');
    expect(normalizeCurrency('£ GBP')).toBe('GBP');

    expect(normalizeCurrency('INR')).toBe('INR');
    expect(normalizeCurrency('USD')).toBe('USD');
    expect(normalizeCurrency('EUR')).toBe('EUR');
    expect(normalizeCurrency('GBP')).toBe('GBP');

    // Invalid / unsupported values MUST fall back to DEFAULT_CURRENCY ('INR')
    expect(normalizeCurrency('CAD')).toBe('INR');
    expect(normalizeCurrency('AUD')).toBe('INR');
    expect(normalizeCurrency('INVALID')).toBe('INR');
    expect(normalizeCurrency('')).toBe('INR');
    expect(normalizeCurrency(null)).toBe('INR');
    expect(normalizeCurrency(undefined)).toBe('INR');
    expect(normalizeCurrency(123)).toBe('INR');
  });

  // ── 3. Canonical Config Metadata (Section 7) ──────────────────────────────
  it('provides exact metadata for all supported display currencies', () => {
    const inr = getCurrencyConfig('INR');
    expect(inr.symbol).toBe('₹');
    expect(inr.locale).toBe('en-IN');
    expect(inr.grouping).toBe('indian');

    const usd = getCurrencyConfig('USD');
    expect(usd.symbol).toBe('$');
    expect(usd.locale).toBe('en-US');
    expect(usd.grouping).toBe('international');

    const eur = getCurrencyConfig('EUR');
    expect(eur.symbol).toBe('€');
    expect(eur.locale).toBe('de-DE');
    expect(eur.grouping).toBe('international');

    const gbp = getCurrencyConfig('GBP');
    expect(gbp.symbol).toBe('£');
    expect(gbp.locale).toBe('en-GB');
    expect(gbp.grouping).toBe('international');
  });

  // ── 4. Absolute Principle: Currency Display != Conversion (Section 1, 12, 19)
  it('CRITICAL FIXTURE: preserves exact numeric value 100000 without FX conversion', () => {
    const rawNumericValue = 100000;

    const inrFormatted = formatDisplayCurrency(rawNumericValue, 'INR');
    const usdFormatted = formatDisplayCurrency(rawNumericValue, 'USD');
    const eurFormatted = formatDisplayCurrency(rawNumericValue, 'EUR');
    const gbpFormatted = formatDisplayCurrency(rawNumericValue, 'GBP');

    // Verify symbol attachment
    expect(inrFormatted.startsWith('₹')).toBe(true);
    expect(usdFormatted.startsWith('$')).toBe(true);
    expect(eurFormatted.startsWith('€')).toBe(true);
    expect(gbpFormatted.startsWith('£')).toBe(true);

    // Verify underlying digits are exactly 100000 (no FX multiplier applied)
    const extractDigits = (s: string) => s.replace(/[^0-9]/g, '');
    expect(extractDigits(inrFormatted)).toBe('100000');
    expect(extractDigits(usdFormatted)).toBe('100000');
    expect(extractDigits(eurFormatted)).toBe('100000');
    expect(extractDigits(gbpFormatted)).toBe('100000');
  });

  it('delegates formatCurrency from formatters.ts to canonical display formatter', () => {
    expect(formatCurrency(50000, 'INR')).toBe(formatDisplayCurrency(50000, 'INR'));
    expect(formatCurrency(50000, 'USD')).toBe(formatDisplayCurrency(50000, 'USD'));
    expect(formatCurrency(50000, 'EUR')).toBe(formatDisplayCurrency(50000, 'EUR'));
    expect(formatCurrency(50000, 'GBP')).toBe(formatDisplayCurrency(50000, 'GBP'));
  });

  // ── 5. Jurisdiction Locking (Section 8) ───────────────────────────────────
  it('locks all 9 India routes strictly to INR', () => {
    const INDIA_ROUTES = [
      '/in/income-tax-calculator',
      '/in/gst-calculator',
      '/in/hra-calculator',
      '/in/ppf-calculator',
      '/in/tds-calculator',
      '/in/capital-gains-tax-calculator',
      '/in/advance-tax-calculator',
      '/in/salary-ctc-calculator',
      '/in/upi-mdr-calculator',
    ];

    for (const route of INDIA_ROUTES) {
      expect(isJurisdictionLocked(route), `Route ${route} should be jurisdiction locked`).toBe(true);
      expect(getJurisdictionCurrency(route), `Route ${route} should lock to INR`).toBe('INR');
    }
  });

  it('locks US 401(k) calculator strictly to USD', () => {
    expect(isJurisdictionLocked('/us/401k-calculator')).toBe(true);
    expect(getJurisdictionCurrency('/us/401k-calculator')).toBe('USD');
  });

  it('leaves global calculators unlocked to allow user display selection', () => {
    const GLOBAL_ROUTES = [
      '/sip-calculator',
      '/emi-calculator',
      '/compound-interest-calculator',
      '/fd-calculator',
      '/wacc-calculator',
      '/cogs-calculator',
      '/loan-amortization-calculator',
      '/npv-calculator',
    ];

    for (const route of GLOBAL_ROUTES) {
      expect(isJurisdictionLocked(route), `Route ${route} should not be jurisdiction locked`).toBe(false);
      expect(getJurisdictionCurrency(route), `Route ${route} should have no locked currency`).toBeNull();
    }
  });

  // ── 6. Storage & SSR Safety (Section 6 & 15) ──────────────────────────────
  it('safely handles storage operations with fallback and never persists unsupported currencies', () => {
    // Mock minimal localStorage
    const store: Record<string, string> = {};
    const mockStorage = {
      getItem: (k: string) => store[k] || null,
      setItem: (k: string, v: string) => { store[k] = v; },
    };

    const origWindow = globalThis.window;
    const origStorage = globalThis.localStorage;

    try {
      (globalThis as any).window = {};
      (globalThis as any).localStorage = mockStorage;

      // Initial read with empty storage
      expect(getStoredCurrency()).toBe('INR');

      // Valid save
      const savedUSD = saveCurrency('USD');
      expect(savedUSD).toBe('USD');
      expect(mockStorage.getItem(CURRENCY_STORAGE_KEY)).toBe('$ USD');
      expect(getStoredCurrency()).toBe('USD');

      // Attempted save of unsupported currency
      const savedInvalid = saveCurrency('CAD');
      expect(savedInvalid).toBe('INR'); // normalized to default
      expect(mockStorage.getItem(CURRENCY_STORAGE_KEY)).toBe('₹ INR');
      expect(getStoredCurrency()).toBe('INR');

      // Corrupted storage entry
      mockStorage.setItem(CURRENCY_STORAGE_KEY, 'CORRUPTED_VALUE');
      expect(getStoredCurrency()).toBe('INR'); // safe fallback
    } finally {
      (globalThis as any).window = origWindow;
      (globalThis as any).localStorage = origStorage;
    }
  });

  it('is completely SSR safe when window and localStorage are undefined', () => {
    const origWindow = globalThis.window;
    const origStorage = globalThis.localStorage;

    try {
      delete (globalThis as any).window;
      delete (globalThis as any).localStorage;

      expect(getStoredCurrency()).toBe('INR');
      expect(() => saveCurrency('USD')).not.toThrow();
      expect(formatDisplayCurrency(100000, 'USD')).toBe('$100,000');
    } finally {
      (globalThis as any).window = origWindow;
      (globalThis as any).localStorage = origStorage;
    }
  });
});
