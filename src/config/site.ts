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
// Published tools are live. Draft tools are built but intentionally hidden. Planned tools are scope candidates only
// and must stay out of all production surfaces until their market-demand research is verified.
// New additions must use the workflow: Research -> Approve -> Draft -> Build -> Test -> Publish.

export type ToolStatus = 'published' | 'draft' | 'planned';
export type Region = 'Global' | 'IN' | 'US' | 'UK';

export type ResearchStatus = 'pending' | 'verified';
export type ResearchBasis =
  | 'founder-audit'
  | 'google-data'
  | 'keyword-serp'
  | 'official-source'
  | 'scope-only';

export interface ToolResearch {
  status: ResearchStatus;
  basis: ResearchBasis;
  source?: string;
  checkedAt?: string;         // ISO 8601 date of the demand/intent check
}

export interface Tool {
  name: string;
  slug: string;               // e.g. 'sip-calculator'
  path: string;               // e.g. '/sip-calculator' or '/in/gst-calculator'
  category: Category;
  region: Region;
  description: string;        // Used in directory cards and meta descriptions
  status: ToolStatus;
  dateModified: string;       // ISO 8601, updated only when content/logic changes
  research?: ToolResearch;    // Required for planned additions; must be verified before promotion
}

export type Category =
  | 'Investments'
  | 'Loans'
  | 'Taxes'
  | 'Business'
  | 'Corporate Finance';

export const REGION_ROUTE_PREFIX: Record<Region, string | null> = {
  Global: null,
  IN: 'in',
  US: 'us',
  UK: 'uk',
};

/**
 * Route rule:
 * - Global tools use root-level routes: /<slug>
 * - Jurisdiction-specific tools use /<region>/<slug>
 * - The route slug must equal the registry slug.
 */
export function getExpectedToolPath(slug: string, region: Region): string {
  const prefix = REGION_ROUTE_PREFIX[region];
  return prefix ? `/${prefix}/${slug}` : `/${slug}`;
}

/** Returns route/category/region errors without mutating the registry. */
export function validateToolRegistry(tools: Tool[] = TOOLS): string[] {
  const errors: string[] = [];
  const seenPaths = new Set<string>();

  for (const tool of tools) {
    if (!CATEGORIES.some((category) => category.name === tool.category)) {
      errors.push(`Unknown category for ${tool.slug}: ${tool.category}`);
    }

    const expectedPath = getExpectedToolPath(tool.slug, tool.region);
    if (tool.path !== expectedPath) {
      errors.push(
        `Invalid route for ${tool.slug}: expected ${expectedPath}, got ${tool.path}`
      );
    }

    if (seenPaths.has(tool.path)) {
      errors.push(`Duplicate route: ${tool.path}`);
    } else {
      seenPaths.add(tool.path);
    }
  }

  return errors;
}

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
    name: 'Simple Interest Calculator',
    slug: 'simple-interest-calculator',
    path: '/simple-interest-calculator',
    category: 'Investments',
    region: 'Global',
    description: 'Calculate simple interest, maturity value, and compare directly with compound interest growth.',
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
    name: 'Income Tax Calculator',
    slug: 'income-tax-calculator',
    path: '/in/income-tax-calculator',
    category: 'Taxes',
    region: 'IN',
    description: 'Compare New Tax Regime (Budget 2024) vs Old Tax Regime, Section 87A rebate, and maximize tax savings.',
    status: 'published',
    dateModified: '2026-09-20',
  },
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
    name: 'UPI MDR Calculator',
    slug: 'upi-mdr-calculator',
    path: '/in/upi-mdr-calculator',
    category: 'Business',
    region: 'IN',
    description: 'Calculate UPI merchant fees, interchange rates on PPI wallets and RuPay credit cards, and net settlement.',
    status: 'published',
    dateModified: '2026-09-20',
  },
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
  {
    name: 'Economic Order Quantity (EOQ)',
    slug: 'eoq-calculator',
    path: '/eoq-calculator',
    category: 'Business',
    region: 'Global',
    description: 'Calculate optimal inventory order batch size (EOQ) to minimize ordering and warehouse holding costs.',
    status: 'published',
    dateModified: '2026-09-20',
  },
  {
    name: 'Depreciation Calculator',
    slug: 'depreciation-calculator',
    path: '/depreciation-calculator',
    category: 'Business',
    region: 'Global',
    description: 'Calculate asset depreciation using Straight Line (SLM) and Written Down Value (WDV) methods with schedule.',
    status: 'published',
    dateModified: '2026-09-20',
  },
  {
    name: 'Working Capital Calculator',
    slug: 'working-capital-calculator',
    path: '/working-capital-calculator',
    category: 'Business',
    region: 'Global',
    description: 'Calculate Net Working Capital (NWC), Current Ratio, and Quick Ratio to measure liquidity cushion.',
    status: 'published',
    dateModified: '2026-09-20',
  },
  {
    name: 'Cost of Goods Sold (COGS)',
    slug: 'cogs-calculator',
    path: '/cogs-calculator',
    category: 'Business',
    region: 'Global',
    description: 'Calculate COGS, goods available for sale, gross profit, and gross margin across inventory flows.',
    status: 'published',
    dateModified: '2026-09-20',
  },
  {
    name: 'Inventory Turnover & Days (DSI)',
    slug: 'inventory-turnover-calculator',
    path: '/inventory-turnover-calculator',
    category: 'Business',
    region: 'Global',
    description: 'Calculate inventory turnover ratio and Days Sales of Inventory (DSI/DIO) to measure supply chain velocity.',
    status: 'published',
    dateModified: '2026-09-20',
  },
  {
    name: 'Liquidity Ratios Suite',
    slug: 'liquidity-ratios-calculator',
    path: '/liquidity-ratios-calculator',
    category: 'Business',
    region: 'Global',
    description: 'Benchmark short-term solvency with Current Ratio, Quick Acid-Test Ratio, and Cash Ratio.',
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
  // ── Planned candidates — research gate required before any build ─────────────
  // These are part of the locked 50-tool target, but none may be promoted until
  // demand/intent evidence is recorded. Current policy: use Google demand data
  // (and keyword/SERP validation where overlap risk exists).
  {
    name: 'Inflation Calculator',
    slug: 'inflation-calculator',
    path: '/inflation-calculator',
    category: 'Investments',
    region: 'Global',
    description: 'Calculate the future purchasing-power impact of inflation over time.',
    status: 'draft',
    dateModified: '2026-09-22',
    research: { status: 'verified', basis: 'google-data', checkedAt: '2026-09-22' },
  },
  {
    name: 'Savings Goal Calculator',
    slug: 'savings-goal-calculator',
    path: '/savings-goal-calculator',
    category: 'Investments',
    region: 'Global',
    description: 'Calculate the amount to save regularly to reach a target savings goal.',
    status: 'draft',
    dateModified: '2026-09-22',
    research: { status: 'verified', basis: 'google-data', checkedAt: '2026-09-22' },
  },
  {
    name: 'Mortgage Calculator',
    slug: 'mortgage-calculator',
    path: '/mortgage-calculator',
    category: 'Loans',
    region: 'Global',
    description: 'Estimate mortgage payments, total interest, and repayment over the loan term.',
    status: 'draft',
    dateModified: '2026-09-22',
    research: { status: 'verified', basis: 'keyword-serp', checkedAt: '2026-09-22' },
  },
  {
    name: 'Loan Affordability Calculator',
    slug: 'loan-affordability-calculator',
    path: '/loan-affordability-calculator',
    category: 'Loans',
    region: 'Global',
    description: 'Estimate the loan amount that may fit within a chosen repayment budget.',
    status: 'draft',
    dateModified: '2026-09-22',
    research: { status: 'verified', basis: 'google-data', checkedAt: '2026-09-22' },
  },
  {
    name: 'Debt-to-Income Ratio Calculator',
    slug: 'debt-to-income-ratio-calculator',
    path: '/debt-to-income-ratio-calculator',
    category: 'Loans',
    region: 'Global',
    description: 'Calculate debt-to-income ratio from monthly debt obligations and income.',
    status: 'draft',
    dateModified: '2026-09-22',
    research: { status: 'verified', basis: 'google-data', checkedAt: '2026-09-22' },
  },
  {
    name: 'Credit Card Payoff Calculator',
    slug: 'credit-card-payoff-calculator',
    path: '/credit-card-payoff-calculator',
    category: 'Loans',
    region: 'Global',
    description: 'Estimate payoff time, interest cost, and payment requirements for credit card balances.',
    status: 'draft',
    dateModified: '2026-09-22',
    research: { status: 'verified', basis: 'google-data', checkedAt: '2026-09-22' },
  },
  {
    name: 'Loan Amortization Calculator',
    slug: 'loan-amortization-calculator',
    path: '/loan-amortization-calculator',
    category: 'Loans',
    region: 'Global',
    description: 'Generate a loan amortization schedule showing principal, interest, and remaining balance.',
    status: 'draft',
    dateModified: '2026-09-22',
    research: { status: 'verified', basis: 'keyword-serp', checkedAt: '2026-09-22' },
  },
  {
    name: 'Interest Rate Calculator',
    slug: 'interest-rate-calculator',
    path: '/interest-rate-calculator',
    category: 'Loans',
    region: 'Global',
    description: 'Solve for the implied interest rate from principal, payment, time, and repayment inputs.',
    status: 'draft',
    dateModified: '2026-09-22',
    research: { status: 'verified', basis: 'google-data', checkedAt: '2026-09-22' },
  },
  {
    name: 'TDS Calculator',
    slug: 'tds-calculator',
    path: '/in/tds-calculator',
    category: 'Taxes',
    region: 'IN',
    description: 'Calculate tax deducted at source for supported India income and payment scenarios.',
    status: 'planned',
    dateModified: '2026-09-22',
    research: { status: 'pending', basis: 'google-data' },
  },
  {
    name: 'Capital Gains Tax Calculator',
    slug: 'capital-gains-tax-calculator',
    path: '/in/capital-gains-tax-calculator',
    category: 'Taxes',
    region: 'IN',
    description: 'Estimate Indian capital gains tax for supported asset types, holding periods, and tax rules.',
    status: 'planned',
    dateModified: '2026-09-22',
    research: { status: 'pending', basis: 'google-data' },
  },
  {
    name: 'Advance Tax Calculator',
    slug: 'advance-tax-calculator',
    path: '/in/advance-tax-calculator',
    category: 'Taxes',
    region: 'IN',
    description: 'Estimate advance income-tax instalments under applicable Indian tax rules.',
    status: 'planned',
    dateModified: '2026-09-22',
    research: { status: 'pending', basis: 'google-data' },
  },
  {
    name: 'Salary / CTC Calculator',
    slug: 'salary-ctc-calculator',
    path: '/in/salary-ctc-calculator',
    category: 'Taxes',
    region: 'IN',
    description: 'Break down salary and CTC components for an India employment package.',
    status: 'planned',
    dateModified: '2026-09-22',
    research: { status: 'pending', basis: 'google-data' },
  },
  {
    name: 'Cash Conversion Cycle Calculator',
    slug: 'cash-conversion-cycle-calculator',
    path: '/cash-conversion-cycle-calculator',
    category: 'Business',
    region: 'Global',
    description: 'Calculate the cash conversion cycle from inventory, receivables, and payables days.',
    status: 'planned',
    dateModified: '2026-09-22',
    research: { status: 'pending', basis: 'google-data' },
  },
  {
    name: 'Debt Service Coverage Ratio (DSCR) Calculator',
    slug: 'dscr-calculator',
    path: '/dscr-calculator',
    category: 'Business',
    region: 'Global',
    description: 'Calculate debt service coverage ratio from operating cash flow and debt service.',
    status: 'planned',
    dateModified: '2026-09-22',
    research: { status: 'pending', basis: 'google-data' },
  },
  {
    name: 'Discounted Payback Period Calculator',
    slug: 'discounted-payback-period-calculator',
    path: '/discounted-payback-period-calculator',
    category: 'Corporate Finance',
    region: 'Global',
    description: 'Calculate the time required to recover an investment using discounted cash flows.',
    status: 'draft',
    dateModified: '2026-09-22',
    research: { status: 'verified', basis: 'google-data', checkedAt: '2026-09-22' },
  },
  {
    name: 'Present Value Calculator',
    slug: 'present-value-calculator',
    path: '/present-value-calculator',
    category: 'Corporate Finance',
    region: 'Global',
    description: 'Calculate the present value of a future cash flow using a chosen discount rate.',
    status: 'draft',
    dateModified: '2026-09-22',
    research: { status: 'verified', basis: 'keyword-serp', checkedAt: '2026-09-22' },
  },
  {
    name: 'Future Value Calculator',
    slug: 'future-value-calculator',
    path: '/future-value-calculator',
    category: 'Corporate Finance',
    region: 'Global',
    description: 'Calculate the future value of a present amount or cash-flow series at a chosen growth rate.',
    status: 'draft',
    dateModified: '2026-09-22',
    research: { status: 'verified', basis: 'google-data', checkedAt: '2026-09-22' },
  },
];

// ── Derived helpers ────────────────────────────────────────────────────────────

/** Returns production-visible tools. Planned candidates are never production-visible. */
export function getPublishedTools(): Tool[] {
  return TOOLS.filter(
    (t) => t.status === 'published' || (PUBLISH_DRAFTS && t.status === 'draft')
  );
}

/** Returns scope candidates that still require research/build work. */
export function getPlannedTools(): Tool[] {
  return TOOLS.filter((t) => t.status === 'planned');
}

/** Returns the complete catalog, including published, draft, and planned entries. */
export function getToolCatalog(): Tool[] {
  return TOOLS;
}

/** Returns the complete catalog count (published + draft + planned). */
export function getToolCatalogCount(): number {
  return TOOLS.length;
}

/** Whether a tool has explicitly verified research evidence. */
export function isResearchVerified(tool: Tool): boolean {
  return tool.research?.status === 'verified';
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
