import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import {
  CURRENCY_CONFIG,
  CURRENCY_STORAGE_KEY,
  DEFAULT_CURRENCY,
  DEFAULT_CURRENCY_LABEL,
  detectUserCurrency,
  formatDisplayCurrency,
  formatPresetChip,
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
  // Empty storage falls back to detectUserCurrency(), which reads the runner's
  // timezone and navigator languages; pin both so CI (UTC, en-US) matches IST.
  const resolved = Intl.DateTimeFormat.prototype.resolvedOptions;
  function stubRegion(timeZone: string, language: string) {
    vi.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockImplementation(function (this: Intl.DateTimeFormat) {
      return { ...resolved.call(this), timeZone };
    });
    vi.stubGlobal('navigator', { language, languages: [language] });
  }

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('safely handles storage operations with fallback and never persists unsupported currencies', () => {
    // Mock minimal localStorage
    const store: Record<string, string> = {};
    const mockStorage = {
      getItem: (k: string) => store[k] || null,
      setItem: (k: string, v: string) => { store[k] = v; },
    };

    vi.stubGlobal('window', {});
    vi.stubGlobal('localStorage', mockStorage);

    // Initial read with empty storage: India detects INR, US detects USD
    stubRegion('Asia/Kolkata', 'en-IN');
    expect(getStoredCurrency()).toBe('INR');
    stubRegion('America/New_York', 'en-US');
    expect(getStoredCurrency()).toBe('USD');

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

  // ── 7. Timezone & Locale Currency Detection (Item 30) ────────────────────
  it('detects user currency based on timezone and locale with safe fallback', () => {
    // UK Timezone and locale -> GBP
    expect(detectUserCurrency('Europe/London')).toBe('GBP');
    expect(detectUserCurrency('', 'en-GB')).toBe('GBP');

    // Eurozone Timezones and locales -> EUR
    expect(detectUserCurrency('Europe/Berlin')).toBe('EUR');
    expect(detectUserCurrency('Europe/Paris')).toBe('EUR');
    expect(detectUserCurrency('Europe/Madrid')).toBe('EUR');
    expect(detectUserCurrency('Europe/Rome')).toBe('EUR');
    expect(detectUserCurrency('', 'de-DE')).toBe('EUR');
    expect(detectUserCurrency('', 'fr-FR')).toBe('EUR');
    expect(detectUserCurrency('', 'es-ES')).toBe('EUR');

    // US Timezones and locale -> USD
    expect(detectUserCurrency('America/New_York')).toBe('USD');
    expect(detectUserCurrency('America/Chicago')).toBe('USD');
    expect(detectUserCurrency('America/Los_Angeles')).toBe('USD');
    expect(detectUserCurrency('', 'en-US')).toBe('USD');

    // India Timezone and locale -> INR
    expect(detectUserCurrency('Asia/Kolkata')).toBe('INR');
    expect(detectUserCurrency('Asia/Calcutta')).toBe('INR');
    expect(detectUserCurrency('', 'en-IN')).toBe('INR');
    expect(detectUserCurrency('', 'hi')).toBe('INR');

    expect(detectUserCurrency('Etc/Unknown', 'xyz')).toBe('USD');
    expect(detectUserCurrency('', '')).toBe('USD');
  });

  it('falls back to USD (not INR) for unmapped regions; only India gets INR', () => {
    // Australia / New Zealand
    expect(detectUserCurrency('Australia/Sydney', 'en-AU')).toBe('USD');
    expect(detectUserCurrency('Australia/Perth', '')).toBe('USD');
    expect(detectUserCurrency('Pacific/Auckland', 'en-NZ')).toBe('USD');
    // Gulf
    expect(detectUserCurrency('Asia/Dubai', 'ar-AE')).toBe('USD');
    expect(detectUserCurrency('Asia/Riyadh', 'ar-SA')).toBe('USD');
    expect(detectUserCurrency('Asia/Qatar', 'en')).toBe('USD');
    // Other Asia / Africa / generic English
    expect(detectUserCurrency('Asia/Singapore', 'en-SG')).toBe('USD');
    expect(detectUserCurrency('Asia/Tokyo', 'ja-JP')).toBe('USD');
    expect(detectUserCurrency('Africa/Lagos', 'en-NG')).toBe('USD');
    expect(detectUserCurrency('', 'en')).toBe('USD');
    // India is still INR by timezone or locale
    expect(detectUserCurrency('Asia/Kolkata', 'en-US')).toBe('INR');
    expect(detectUserCurrency('', 'ta-IN')).toBe('INR');
  });

  // ── 8. Preset Chip Dynamic Localization ────────────────────────────────────
  it('formats preset chip amounts correctly for Indian vs International currencies', () => {
    // INR formatting
    expect(formatPresetChip(5000, 'INR')).toBe('₹5k');
    expect(formatPresetChip(25000, 'INR')).toBe('₹25k');
    expect(formatPresetChip(100000, 'INR')).toBe('₹1L');
    expect(formatPresetChip(1000000, 'INR')).toBe('₹10L');
    expect(formatPresetChip(2500000, 'INR')).toBe('₹25L');
    expect(formatPresetChip(10000000, 'INR')).toBe('₹1 Cr');

    // USD formatting
    expect(formatPresetChip(5000, 'USD')).toBe('$5k');
    expect(formatPresetChip(25000, 'USD')).toBe('$25k');
    expect(formatPresetChip(100000, 'USD')).toBe('$100k');
    expect(formatPresetChip(500000, 'USD')).toBe('$500k');
    expect(formatPresetChip(1000000, 'USD')).toBe('$1M');
    expect(formatPresetChip(2500000, 'USD')).toBe('$2.5M');
    expect(formatPresetChip(10000000, 'USD')).toBe('$10M');

    // EUR formatting
    expect(formatPresetChip(1000000, 'EUR')).toBe('€1M');
    // GBP formatting
    expect(formatPresetChip(1000000, 'GBP')).toBe('£1M');
  });
});


describe('moneyRules', () => {
  it('marks the rule as an amount and resolves currency at read time', async () => {
    const { moneyRules } = await import('./currency');
    const rules = moneyRules({ required: true, min: 10000, label: 'Loan Amount' });
    expect(rules.amount).toBe(true);
    expect(rules.min).toBe(10000);
    expect(rules.currency).toBe('INR'); // SSR / no window → default currency
  });
});

describe('formatDisplayCurrency: signs and non-finite values', () => {
  it('puts the minus sign before the symbol', () => {
    expect(formatDisplayCurrency(-1250, 'INR')).toBe('-₹1,250');
    expect(formatDisplayCurrency(-1250000, 'INR')).toBe('-₹12,50,000');
    expect(formatDisplayCurrency(-1250, 'USD')).toBe('-$1,250');
    expect(formatDisplayCurrency(-1250.5, 'GBP', 2)).toBe('-£1,250.50');
    expect(formatDisplayCurrency(-1250, 'EUR')).toBe('-€1.250');
  });

  it('renders -0 and values that round to zero without a sign', () => {
    expect(formatDisplayCurrency(-0, 'INR')).toBe('₹0');
    expect(formatDisplayCurrency(-0.4, 'INR')).toBe('₹0');
    expect(formatDisplayCurrency(-0.001, 'USD', 2)).toBe('$0.00');
  });

  it('renders NaN and Infinity as "-"', () => {
    expect(formatDisplayCurrency(NaN, 'INR')).toBe('-');
    expect(formatDisplayCurrency(Infinity, 'USD')).toBe('-');
    expect(formatDisplayCurrency(-Infinity, 'EUR')).toBe('-');
    expect(formatPresetChip(NaN, 'INR')).toBe('-');
  });
});
