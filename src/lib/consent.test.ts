import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  CONSENT_STORAGE_KEY,
  getConsentChoice,
  isAnalyticsAllowed,
  isConsentRegionTimezone,
  saveConsentChoice,
  shouldShowConsentBanner,
} from './consent';

describe('consent', () => {
  let store: Record<string, string>;
  let cookieWrites: string[];

  beforeEach(() => {
    store = {};
    cookieWrites = [];
    (globalThis as any).localStorage = {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => { store[k] = v; },
      removeItem: (k: string) => { delete store[k]; },
    };
    (globalThis as any).window = { gtag: vi.fn() };
    (globalThis as any).location = { hostname: 'www.calcumetrics.com' };
    (globalThis as any).document = {
      get cookie() { return '_ga=GA1.1.1; _ga_ABC=GS1; cm_other=1'; },
      set cookie(v: string) { cookieWrites.push(v); },
    };
  });

  afterEach(() => {
    delete (globalThis as any).window;
    delete (globalThis as any).document;
    delete (globalThis as any).location;
  });

  it('treats Europe/* and EEA Atlantic zones as consent regions', () => {
    expect(isConsentRegionTimezone('Europe/Berlin')).toBe(true);
    expect(isConsentRegionTimezone('Europe/London')).toBe(true);
    expect(isConsentRegionTimezone('Atlantic/Reykjavik')).toBe(true);
    expect(isConsentRegionTimezone('Asia/Kolkata')).toBe(false);
    expect(isConsentRegionTimezone('America/New_York')).toBe(false);
  });

  it('shows the banner only in consent regions before a choice is made', () => {
    expect(shouldShowConsentBanner('Europe/Paris')).toBe(true);
    expect(shouldShowConsentBanner('Asia/Kolkata')).toBe(false);
    saveConsentChoice(false);
    expect(shouldShowConsentBanner('Europe/Paris')).toBe(false);
  });

  it('defaults analytics off in consent regions and on elsewhere', () => {
    expect(isAnalyticsAllowed('Europe/Madrid')).toBe(false);
    expect(isAnalyticsAllowed('Asia/Kolkata')).toBe(true);
  });

  it('a saved choice overrides the regional default', () => {
    saveConsentChoice(true);
    expect(isAnalyticsAllowed('Europe/Madrid')).toBe(true);
    saveConsentChoice(false);
    expect(isAnalyticsAllowed('Asia/Kolkata')).toBe(false);
  });

  it('stores the shape analytics.ts reads and pushes a gtag consent update', () => {
    saveConsentChoice(true);
    expect(JSON.parse(store[CONSENT_STORAGE_KEY]).analytics).toBe(true);
    expect((window as any).gtag).toHaveBeenCalledWith('consent', 'update', { analytics_storage: 'granted' });
    expect(getConsentChoice()?.analytics).toBe(true);
  });

  it('deletes only GA cookies when analytics is turned off', () => {
    saveConsentChoice(false);
    expect((window as any).gtag).toHaveBeenCalledWith('consent', 'update', { analytics_storage: 'denied' });
    expect(cookieWrites.some((c) => c.startsWith('_ga=;'))).toBe(true);
    expect(cookieWrites.some((c) => c.startsWith('_ga_ABC=;') && c.includes('domain=.calcumetrics.com'))).toBe(true);
    expect(cookieWrites.some((c) => c.startsWith('cm_other'))).toBe(false);
  });

  it('ignores malformed stored values', () => {
    store[CONSENT_STORAGE_KEY] = '{bad json';
    expect(getConsentChoice()).toBeNull();
  });
});
