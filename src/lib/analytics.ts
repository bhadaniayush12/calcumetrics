/**
 * analytics.ts — GA4 event tracking with Google Consent Mode v2 support.
 *
 * Requirements:
 * 1. Event: 'calculate_click'
 * 2. Parameter: 'calculator_type' (e.g. 'income_tax', 'sip', 'cagr', 'emi')
 * 3. Strict Consent Mode v2 enforcement: only fires when analytics_storage is granted.
 * 4. Zero sensitive inputs or outputs recorded.
 */

/**
 * Checks whether analytics consent is granted under Google Consent Mode v2.
 */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;

  // 1. Check Google Consent Mode v2 internal state via google_tag_data
  const gtd = (window as any).google_tag_data;
  if (gtd?.ics?.entries?.analytics_storage) {
    const entry = gtd.ics.entries.analytics_storage;
    const status = entry.update !== undefined ? entry.update : entry.default;
    // Status 2 is explicitly denied; 1 is granted
    if (status === 2 || status === false) return false;
    if (status === 1 || status === true) return true;
  }

  // 2. Check window.dataLayer for Consent Mode v2 commands
  const dl = (window as any).dataLayer;
  if (Array.isArray(dl)) {
    // Scan backwards to find the most recent consent command
    for (let i = dl.length - 1; i >= 0; i--) {
      const item = dl[i];
      if (item && (item[0] === 'consent' || item.event === 'consent')) {
        const settings = item[2] || item.consent_settings;
        if (settings && typeof settings.analytics_storage === 'string') {
          if (settings.analytics_storage === 'denied') return false;
          if (settings.analytics_storage === 'granted') return true;
        }
      }
    }
  }

  // 3. Check for local consent storage (e.g., custom CMP or cookie banner)
  try {
    const localConsent = localStorage.getItem('cm_consent') || localStorage.getItem('consent_settings');
    if (localConsent) {
      const parsed = JSON.parse(localConsent);
      if (parsed.analytics === false || parsed.analytics_storage === 'denied') return false;
      if (parsed.analytics === true || parsed.analytics_storage === 'granted') return true;
    }
  } catch {}

  // 4. Default: permitted unless explicitly denied
  return true;
}

/**
 * Extracts a normalized calculator_type from a pathname or slug.
 * Examples:
 *   '/in/income-tax-calculator' -> 'income_tax'
 *   '/sip-calculator'           -> 'sip'
 *   '/cagr-calculator'          -> 'cagr'
 *   '/emi-calculator'           -> 'emi'
 *   '/home-loan-calculator'     -> 'home_loan'
 */
export function getCalculatorType(pathname: string): string {
  if (!pathname) return 'unknown';
  const clean = pathname.split('?')[0].split('#')[0].replace(/\/+$/, '');
  const segment = clean.split('/').pop() || '';
  const type = segment.replace(/-calculator$/, '').replace(/-/g, '_');
  return type || 'unknown';
}

/**
 * Sends the calculate_click event to GA4 if analytics consent is granted.
 * Respects Google Consent Mode v2.
 */
export function trackCalculatorCompletion(calculatorType: string): boolean {
  if (typeof window === 'undefined') return false;

  // Consent Mode v2 Gate: Only fire if analytics consent is granted
  if (!hasAnalyticsConsent()) {
    return false;
  }

  const payload = {
    calculator_type: calculatorType,
  };

  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', 'calculate_click', payload);
    return true;
  }

  if (Array.isArray((window as any).dataLayer)) {
    (window as any).dataLayer.push({
      event: 'calculate_click',
      ...payload,
    });
    return true;
  }

  return false;
}
