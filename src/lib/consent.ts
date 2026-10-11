/**
 * consent.ts — First-party cookie consent for Google Analytics (Consent Mode v2).
 *
 * - Choice is stored in localStorage `cm_consent` as { analytics: boolean, ts: number }
 *   (the shape `hasAnalyticsConsent()` in analytics.ts already reads).
 * - EEA / UK / Swiss visitors default to analytics denied (region default in Layout.astro)
 *   and see the consent banner until they choose.
 * - Advertising storage stays denied; AdSense is not live yet.
 */

export const CONSENT_STORAGE_KEY = 'cm_consent';

export interface ConsentChoice {
  analytics: boolean;
  ts: number;
}

/** Timezones outside `Europe/*` that belong to EEA / UK / Swiss territory. */
const CONSENT_REGION_EXTRA_TZ = new Set([
  'Atlantic/Reykjavik',
  'Atlantic/Canary',
  'Atlantic/Madeira',
  'Atlantic/Azores',
  'Atlantic/Faroe',
  'Arctic/Longyearbyen',
]);

/**
 * True when the visitor's timezone suggests a jurisdiction that requires opt-in
 * consent. Deliberately broad: all `Europe/*` zones get asked.
 */
export function isConsentRegionTimezone(tz?: string): boolean {
  const zone = tz ?? (typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : '');
  if (!zone) return false;
  return zone.startsWith('Europe/') || CONSENT_REGION_EXTRA_TZ.has(zone);
}

/** Returns the stored choice, or null when the visitor has not chosen yet. */
export function getConsentChoice(): ConsentChoice | null {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed?.analytics === 'boolean' ? { analytics: parsed.analytics, ts: Number(parsed.ts) || 0 } : null;
  } catch {
    return null;
  }
}

/** Effective analytics state: the stored choice, else denied in consent regions, else granted. */
export function isAnalyticsAllowed(tz?: string): boolean {
  const choice = getConsentChoice();
  if (choice) return choice.analytics;
  return !isConsentRegionTimezone(tz);
}

/** Whether to show the first-visit banner. */
export function shouldShowConsentBanner(tz?: string): boolean {
  return getConsentChoice() === null && isConsentRegionTimezone(tz);
}

/** Removes GA cookies (`_ga`, `_ga_*`) on the current host and its parent domain. */
function clearAnalyticsCookies(): void {
  const names = document.cookie
    .split(';')
    .map((c) => c.split('=')[0].trim())
    .filter((n) => n === '_ga' || n.startsWith('_ga_'));
  const host = location.hostname;
  const domains = ['', host, `.${host.replace(/^www\./, '')}`];
  for (const name of names) {
    for (const d of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ''}`;
    }
  }
}

/** Persists the choice and pushes a Consent Mode update to gtag. */
export function saveConsentChoice(analytics: boolean): ConsentChoice {
  const choice: ConsentChoice = { analytics, ts: Date.now() };
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(choice));
  } catch {
    // Storage blocked — the choice still applies for this page view
  }
  const gtag = (window as any).gtag;
  if (typeof gtag === 'function') {
    gtag('consent', 'update', { analytics_storage: analytics ? 'granted' : 'denied' });
  }
  if (!analytics) clearAnalyticsCookies();
  return choice;
}
