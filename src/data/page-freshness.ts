// src/data/page-freshness.ts
// "Last reviewed" source of truth for pages that state rates, slabs, thresholds or laws.
// The visible note (FreshnessNote.astro) and each page's JSON-LD dateModified both read from here.
//
// Dating rule: pages changed in the PR that edits them get that day's date; every other page carries the
// date of the last git commit that changed its rates or rules (commit noted in `commit`). Only list a page
// after reviewing it, and never add a date for a page nobody reviewed.

export interface PageFreshness {
  /** ISO date (YYYY-MM-DD). */
  lastReviewed: string;
  /** One line: what changed on that date. */
  whatChanged: string;
  /** Commit that made the change, for audit. */
  commit: string;
}

export const PAGE_FRESHNESS: Record<string, PageFreshness> = {
  '/in/income-tax-calculator': {
    lastReviewed: '2026-10-27',
    whatChanged: 'Footer now refers to Tax year 2026-27 under the Income-tax Act, 2025.',
    commit: 'e045351',
  },
  '/in/gst-calculator': {
    lastReviewed: '2026-10-19',
    whatChanged: 'Rate guidance, invoice examples and the GST Council source link updated.',
    commit: 'a8c5167',
  },
  '/in/hra-calculator': {
    lastReviewed: '2026-10-27',
    whatChanged: 'Meta title and description now cite section 11 and Schedule III of the Income-tax Act, 2025.',
    commit: 'e045351',
  },
  '/in/tds-calculator': {
    lastReviewed: '2026-10-24',
    whatChanged: 'Moved to sections 392–393 of the Income-tax Act, 2025; cash withdrawal threshold now ₹1 crore.',
    commit: '4c12582',
  },
  '/in/advance-tax-calculator': {
    lastReviewed: '2026-10-24',
    whatChanged: 'Heading and text now say tax year 2026-27 under the Income-tax Act, 2025.',
    commit: '4c12582',
  },
  '/in/capital-gains-tax-calculator': {
    lastReviewed: '2026-10-17',
    whatChanged: 'Section 50AA treatment now applied by acquisition date.',
    commit: 'e71a968',
  },
  '/in/salary-ctc-calculator': {
    lastReviewed: '2026-10-17',
    whatChanged: 'Year label set to FY 2025-26 to match the tax data the calculator uses.',
    commit: 'd2cf889',
  },
  '/in/ppf-calculator': {
    lastReviewed: '2026-09-23',
    whatChanged: '7.1% rate and ₹500–₹1,50,000 yearly deposit limits recorded with the Ministry of Finance source.',
    commit: 'c62c964',
  },
  '/in/upi-mdr-calculator': {
    lastReviewed: '2026-10-19',
    whatChanged: 'Answers on the deferred MDR rollout and the ₹2,000 PPI interchange rule rewritten.',
    commit: '69a91a4',
  },
  '/fd-calculator': {
    lastReviewed: '2026-10-27',
    whatChanged: 'Deposit-interest TDS note and FAQs now cite section 393(1) of the Income-tax Act, 2025.',
    commit: 'e045351',
  },
  '/rd-calculator': {
    lastReviewed: '2026-10-27',
    whatChanged: 'Deposit-interest TDS note now cites section 393(1) of the Income-tax Act, 2025.',
    commit: 'e045351',
  },
  '/home-loan-calculator': {
    lastReviewed: '2026-09-23',
    whatChanged: 'India tax note on principal and interest deductions added.',
    commit: '70bc886',
  },
  '/us/401k-calculator': {
    lastReviewed: '2026-10-17',
    whatChanged: 'Contributions capped at the 2026 IRS elective deferral limit of $24,500.',
    commit: 'fd394c9',
  },
  '/methodology': {
    lastReviewed: '2026-09-24',
    whatChanged: 'Statutory tax sections revised: slabs, rebate and GST rates.',
    commit: 'bd1d72a',
  },
};

/** Freshness entry for a route, or undefined if the page has not been reviewed. */
export function getFreshness(path: string): PageFreshness | undefined {
  // Built routes may carry ".html" (build.format 'file') or a trailing slash.
  const key = path.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  return PAGE_FRESHNESS[key];
}
