import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getCalculatorType, hasAnalyticsConsent, trackCalculatorCompletion } from './analytics';

describe('analytics module', () => {
  let store: Record<string, string> = {};
  const mockStorage = {
    getItem: (k: string) => store[k] || null,
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { store = {}; },
  };

  const origWindow = (globalThis as any).window;
  const origStorage = (globalThis as any).localStorage;

  beforeEach(() => {
    store = {};
    (globalThis as any).window = {
      location: { pathname: '/sip-calculator' },
      dataLayer: [],
      gtag: vi.fn(),
    };
    (globalThis as any).localStorage = mockStorage;
  });

  afterEach(() => {
    (globalThis as any).window = origWindow;
    (globalThis as any).localStorage = origStorage;
    vi.restoreAllMocks();
  });

  describe('getCalculatorType', () => {
    it('normalizes standard calculator URLs', () => {
      expect(getCalculatorType('/sip-calculator')).toBe('sip');
      expect(getCalculatorType('/cagr-calculator')).toBe('cagr');
      expect(getCalculatorType('/emi-calculator')).toBe('emi');
    });

    it('normalizes regional and hyphenated URLs', () => {
      expect(getCalculatorType('/in/income-tax-calculator')).toBe('income_tax');
      expect(getCalculatorType('/in/gst-calculator/')).toBe('gst');
      expect(getCalculatorType('/in/salary-ctc-calculator')).toBe('salary_ctc');
      expect(getCalculatorType('/us/401k-calculator')).toBe('401k');
      expect(getCalculatorType('/home-loan-calculator')).toBe('home_loan');
      expect(getCalculatorType('/compound-interest-calculator')).toBe('compound_interest');
    });

    it('handles query parameters and hashes', () => {
      expect(getCalculatorType('/sip-calculator?p=25000&r=12#results')).toBe('sip');
    });
  });

  describe('hasAnalyticsConsent & Consent Mode v2', () => {
    it('returns true by default when no denial is present', () => {
      expect(hasAnalyticsConsent()).toBe(true);
    });

    it('returns false when analytics_storage is denied via dataLayer consent command', () => {
      (globalThis as any).window.dataLayer = [
        ['consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied' }],
      ];
      expect(hasAnalyticsConsent()).toBe(false);
    });

    it('returns true when analytics_storage is subsequently updated to granted in dataLayer', () => {
      (globalThis as any).window.dataLayer = [
        ['consent', 'default', { analytics_storage: 'denied' }],
        ['consent', 'update', { analytics_storage: 'granted' }],
      ];
      expect(hasAnalyticsConsent()).toBe(true);
    });

    it('returns false when google_tag_data explicitly marks analytics_storage denied', () => {
      (globalThis as any).window.google_tag_data = {
        ics: {
          entries: {
            analytics_storage: { default: 2 }, // 2 = denied
          },
        },
      };
      expect(hasAnalyticsConsent()).toBe(false);
    });

    it('returns false when local storage has denied consent', () => {
      mockStorage.setItem('cm_consent', JSON.stringify({ analytics_storage: 'denied' }));
      expect(hasAnalyticsConsent()).toBe(false);
    });
  });

  describe('trackCalculatorCompletion', () => {
    it('fires gtag calculate_click event with calculator_type when consent is granted', () => {
      const gtagSpy = vi.fn();
      (globalThis as any).window.gtag = gtagSpy;

      const result = trackCalculatorCompletion('income_tax');
      expect(result).toBe(true);
      expect(gtagSpy).toHaveBeenCalledWith('event', 'calculate_click', {
        calculator_type: 'income_tax',
      });
    });

    it('does NOT fire gtag calculate_click when consent is denied (Consent Mode v2)', () => {
      const gtagSpy = vi.fn();
      (globalThis as any).window.gtag = gtagSpy;
      (globalThis as any).window.dataLayer = [
        ['consent', 'default', { analytics_storage: 'denied' }],
      ];

      const result = trackCalculatorCompletion('income_tax');
      expect(result).toBe(false);
      expect(gtagSpy).not.toHaveBeenCalled();
    });

    it('falls back to dataLayer.push when gtag function is absent', () => {
      delete (globalThis as any).window.gtag;
      const dl: any[] = [];
      (globalThis as any).window.dataLayer = dl;

      const result = trackCalculatorCompletion('sip');
      expect(result).toBe(true);
      expect(dl).toContainEqual({
        event: 'calculate_click',
        calculator_type: 'sip',
      });
    });
  });
});
