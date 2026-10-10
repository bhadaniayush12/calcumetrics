/**
 * Legacy paths that moved under a region prefix. Shared by astro.config.mjs
 * (static fallback pages) and functions/_middleware.ts, which resolves these in
 * the same 301 as host/trailing-slash canonicalisation so crawlers see one hop.
 * Keep public/_redirects in sync.
 * @type {Record<string, string>}
 */
export const LEGACY_REDIRECTS = {
  '/privacy': '/privacy-policy',
  '/ppf-calculator': '/in/ppf-calculator',
  '/401k-calculator': '/us/401k-calculator',
  '/income-tax-calculator': '/in/income-tax-calculator',
  '/gst-calculator': '/in/gst-calculator',
  '/hra-calculator': '/in/hra-calculator',
  '/upi-mdr-calculator': '/in/upi-mdr-calculator',
  '/tds-calculator': '/in/tds-calculator',
  '/capital-gains-tax-calculator': '/in/capital-gains-tax-calculator',
  '/advance-tax-calculator': '/in/advance-tax-calculator',
  '/salary-ctc-calculator': '/in/salary-ctc-calculator',
  '/step-up-sip-calculator': '/sip-calculator#stepup',
};
