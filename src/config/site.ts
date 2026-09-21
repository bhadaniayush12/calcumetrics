// src/config/site.ts
// Section 26.6 — Feature flags and site config (single source of truth)

export const SITE_URL = 'https://calcumetrics.com';
export const SITE_NAME = 'Calcumetrics';
export const SITE_EMAIL = 'hello@calcumetrics.com';

// ── Feature flags (Section 26.6) ──────────────────────────────────────────────
export const SHOW_BLOG_NAV = false;    // Show Blog in header only when 5+ posts are live
export const SHOW_LANGUAGE = false;    // Language selector off until translated pages exist
export const ENABLE_DARK_MODE = false; // Theme toggle off until dark palette is built & tested
export const ADS_ENABLED = false;      // Ad slots rendered only after AdSense is approved
export const PUBLISH_DRAFTS = false;   // Exclude draft pages from nav, counts, sitemap, search

// ── Tool registry (Section 7 + 13) ────────────────────────────────────────────
// Single source of truth. Used by: directory, hubs, footer, nav counts, sitemap, search index.
// Only list tools that are fully built. status:'draft' tools are excluded at build.

export type ToolStatus = 'published' | 'draft';
export type Region = 'Global' | 'IN' | 'US' | 'UK';

export interface Tool {
  name: string;
  slug: string;               // e.g. 'sip-calculator'
  path: string;               // e.g. '/sip-calculator' or '/in/gst-calculator'
  category: Category;
  region: Region;
  description: string;        // Used in directory cards and meta descriptions
  status: ToolStatus;
  dateModified: string;       // ISO 8601, updated only when content/logic changes
}

export type Category =
  | 'Investments'
  | 'Loans'
  | 'Taxes'
  | 'Business'
  | 'Corporate Finance';

export const TOOLS: Tool[] = [
  // ── Investments ────────────────────────────────────────────────────────────
  {
    name: 'SIP Calculator',
    slug: 'sip-calculator',
    path: '/sip-calculator',
    category: 'Investments',
    region: 'Global',
    description: 'Calculate maturity value and wealth gain for Systematic Investment Plans with monthly compounding.',
    status: 'published',
    dateModified: '2026-09-20',
  },
  {
    name: 'Lump Sum Calculator',
    slug: 'lump-sum-calculator',
    path: '/lump-sum-calculator',
    category: 'Investments',
    region: 'Global',
    description: 'Calculate the future value of a one-time investment with compound interest.',
    status: 'published',
    dateModified: '2026-09-20',
  },
  {
    name: 'Compound Interest Calculator',
    slug: 'compound-interest-calculator',
    path: '/compound-interest-calculator',
    category: 'Investments',
    region: 'Global',
    description: 'Calculate compound interest for any principal, rate, time, and compounding frequency.',
    status: 'published',
    dateModified: '2026-09-20',
  },
  {
    name: 'CAGR Calculator',
    slug: 'cagr-calculator',
    path: '/cagr-calculator',
    category: 'Investments',
    region: 'Global',
    description: 'Calculate the Compound Annual Growth Rate between two investment values over time.',
    status: 'published',
    dateModified: '2026-09-20',
  },
  {
    name: 'XIRR Calculator',
    slug: 'xirr-calculator',
    path: '/xirr-calculator',
    category: 'Investments',
    region: 'Global',
    description: 'Calculate the extended internal rate of return for irregular cash flows and dates.',
    status: 'published',
    dateModified: '2026-09-20',
  },
  {
    name: 'Fixed Deposit (FD) Calculator',
    slug: 'fd-calculator',
    path: '/fd-calculator',
    category: 'Investments',
    region: 'Global',
    description: 'Calculate maturity value and interest earned on fixed deposits with quarterly compounding.',
    status: 'published',
    dateModified: '2026-09-20',
  },
  {
    name: 'Recurring Deposit (RD) Calculator',
    slug: 'rd-calculator',
    path: '/rd-calculator',
    category: 'Investments',
    region: 'Global',
    description: 'Calculate maturity value for recurring deposit schemes with monthly contributions.',
    status: 'published',
    dateModified: '2026-09-20',
  },
  {
    name: 'PPF Calculator',
    slug: 'ppf-calculator',
    path: '/in/ppf-calculator',
    category: 'Investments',
    region: 'IN',
    description: 'Calculate Public Provident Fund maturity value with India-specific interest rates and 15-year lock-in.',
    status: 'published',
    dateModified: '2026-09-20',
  },
  {
    name: '401(k) Calculator',
    slug: '401k-calculator',
    path: '/us/401k-calculator',
    category: 'Investments',
    region: 'US',
    description: 'Calculate 401(k) retirement savings growth with employer match and annual contribution limits.',
    status: 'published',
    dateModified: '2026-09-20',
  },

  // ── Loans ──────────────────────────────────────────────────────────────────
  {
    name: 'EMI Calculator',
    slug: 'emi-calculator',
    path: '/emi-calculator',
    category: 'Loans',
    region: 'Global',
    description: 'Calculate monthly EMI, total interest, and repayment schedule for any loan.',
    status: 'published',
    dateModified: '2026-09-20',
  },
  {
    name: 'Home Loan Calculator',
    slug: 'home-loan-calculator',
    path: '/home-loan-calculator',
    category: 'Loans',
    region: 'Global',
    description: 'Calculate home loan EMI, total interest paid, and year-by-year amortization schedule.',
    status: 'published',
    dateModified: '2026-09-20',
  },
  {
    name: 'Car Loan Calculator',
    slug: 'car-loan-calculator',
    path: '/car-loan-calculator',
    category: 'Loans',
    region: 'Global',
    description: 'Calculate monthly car loan payments, total cost, and interest over the loan term.',
    status: 'published',
    dateModified: '2026-09-20',
  },
  {
    name: 'Loan Prepayment Calculator',
    slug: 'loan-prepayment-calculator',
    path: '/loan-prepayment-calculator',
    category: 'Loans',
    region: 'Global',
    description: 'Calculate interest savings and revised tenure when making a partial prepayment on your loan.',
    status: 'published',
    dateModified: '2026-09-20',
  },

  // ── Taxes ──────────────────────────────────────────────────────────────────
  {
    name: 'GST Calculator',
    slug: 'gst-calculator',
    path: '/in/gst-calculator',
    category: 'Taxes',
    region: 'IN',
    description: 'Calculate GST amounts for any base price using India\'s current tax slabs (5%, 12%, 18%, 28%).',
    status: 'published',
    dateModified: '2026-09-20',
  },
  {
    name: 'HRA Calculator',
    slug: 'hra-calculator',
    path: '/in/hra-calculator',
    category: 'Taxes',
    region: 'IN',
    description: 'Calculate House Rent Allowance tax exemption under India\'s Income Tax rules.',
    status: 'published',
    dateModified: '2026-09-20',
  },

  // ── Business ───────────────────────────────────────────────────────────────
  {
    name: 'Break-even Calculator',
    slug: 'break-even-calculator',
    path: '/break-even-calculator',
    category: 'Business',
    region: 'Global',
    description: 'Calculate the break-even point in units and revenue for any fixed and variable cost structure.',
    status: 'published',
    dateModified: '2026-09-20',
  },
  {
    name: 'Profit Margin Calculator',
    slug: 'profit-margin-calculator',
    path: '/profit-margin-calculator',
    category: 'Business',
    region: 'Global',
    description: 'Calculate gross, operating, and net profit margins from revenue and cost inputs.',
    status: 'published',
    dateModified: '2026-09-20',
  },
  {
    name: 'Markup vs Margin Calculator',
    slug: 'markup-vs-margin-calculator',
    path: '/markup-vs-margin-calculator',
    category: 'Business',
    region: 'Global',
    description: 'Understand and convert between markup percentage and gross margin for pricing decisions.',
    status: 'published',
    dateModified: '2026-09-20',
  },
  {
    name: 'ROI Calculator',
    slug: 'roi-calculator',
    path: '/roi-calculator',
    category: 'Business',
    region: 'Global',
    description: 'Calculate return on investment as a percentage and annualised rate for any investment.',
    status: 'published',
    dateModified: '2026-09-20',
  },

  // ── Corporate Finance ──────────────────────────────────────────────────────
  {
    name: 'WACC Calculator',
    slug: 'wacc-calculator',
    path: '/wacc-calculator',
    category: 'Corporate Finance',
    region: 'Global',
    description: 'Calculate Weighted Average Cost of Capital from equity, debt, and tax rate inputs.',
    status: 'published',
    dateModified: '2026-09-20',
  },
  {
    name: 'NPV Calculator',
    slug: 'npv-calculator',
    path: '/npv-calculator',
    category: 'Corporate Finance',
    region: 'Global',
    description: 'Calculate Net Present Value of a series of cash flows at a given discount rate.',
    status: 'published',
    dateModified: '2026-09-20',
  },
  {
    name: 'IRR Calculator',
    slug: 'irr-calculator',
    path: '/irr-calculator',
    category: 'Corporate Finance',
    region: 'Global',
    description: 'Calculate the Internal Rate of Return for a series of cash flows using numerical iteration.',
    status: 'published',
    dateModified: '2026-09-20',
  },
  {
    name: 'Payback Period Calculator',
    slug: 'payback-period-calculator',
    path: '/payback-period-calculator',
    category: 'Corporate Finance',
    region: 'Global',
    description: 'Calculate how long it takes to recover an initial investment from projected cash flows.',
    status: 'published',
    dateModified: '2026-09-20',
  },
  {
    name: 'DCF Calculator',
    slug: 'dcf-calculator',
    path: '/dcf-calculator',
    category: 'Corporate Finance',
    region: 'Global',
    description: 'Calculate the intrinsic value of an investment using the Discounted Cash Flow method.',
    status: 'published',
    dateModified: '2026-09-20',
  },
];

// ── Derived helpers ────────────────────────────────────────────────────────────

/** Returns only published tools (respects PUBLISH_DRAFTS flag) */
export function getPublishedTools(): Tool[] {
  return TOOLS.filter((t) => PUBLISH_DRAFTS || t.status === 'published');
}

/** Tools grouped by category (published only) */
export function getToolsByCategory(): Map<Category, Tool[]> {
  const map = new Map<Category, Tool[]>();
  for (const tool of getPublishedTools()) {
    const list = map.get(tool.category) ?? [];
    list.push(tool);
    map.set(tool.category, list);
  }
  return map;
}

/** Count of published tools (used in nav / hero) */
export function getToolCount(): number {
  return getPublishedTools().length;
}

/** Categories with their counts (for nav dropdown and directory chips) */
export const CATEGORIES: { name: Category; href: string }[] = [
  { name: 'Investments',       href: '/investments' },
  { name: 'Loans',             href: '/loans' },
  { name: 'Taxes',             href: '/taxes' },
  { name: 'Business',         href: '/business' },
  { name: 'Corporate Finance', href: '/corporate-finance' },
];
