// src/data/hubs.ts
// Topic hubs: single source of truth for hub pages, the header/home/directory hub links,
// the hub sitemap and the "More in <hub>" links on posts. Membership is explicit so a hub can
// list related tools from other registry categories (e.g. Everyday Math), and hubs.test.ts
// checks that every published calculator and post belongs to at least one hub.

import type { Category } from '../config/site';

export type HubId = 'loans' | 'investing' | 'tax-india' | 'business' | 'corporate-finance' | 'everyday-math';

export interface HubGroup {
  heading: string;
  /** Tool paths from the registry in src/config/site.ts. */
  tools: string[];
  /** Blog post slugs. */
  posts: string[];
}

export interface HubFaq {
  question: string;
  answer: string;
}

export interface Hub {
  id: HubId;
  href: string;
  /** Short label for nav, chips and breadcrumbs. */
  name: string;
  h1: string;
  title: string;
  description: string;
  ogImage: string;
  ogImageAlt: string;
  /** Registry category whose tools and posts link back here by default. */
  category?: Category;
  /** Whole hub is India-only and rendered inside data-currency-lock="INR". */
  indiaOnly?: boolean;
  /** 150–250 words: what is here and who it is for. One string per paragraph. */
  intro: string[];
  groups: HubGroup[];
  faqs: HubFaq[];
  /** Optional parent hub shown as a link (Corporate Finance sits inside Business & Accounting). */
  parent?: HubId;
  /** ISO date the hub page's own content last changed (intro, groups or FAQs). */
  updated: string;
}

export const HUBS: Hub[] = [
  {
    id: 'loans',
    updated: '2026-10-24',
    href: '/loans',
    name: 'Loans',
    h1: 'Loan Calculators and Guides',
    title: 'Loan Calculators: EMI, Mortgage & Payoff | Calcumetrics',
    description: 'Free loan calculators and guides: EMI, home and car loans, mortgage, affordability, prepayment and debt payoff, with worked examples.',
    ogImage: '/og/categories/loans.png',
    ogImageAlt: 'Calcumetrics loan calculators: EMI, home loan, mortgage and prepayment',
    category: 'Loans',
    intro: [
      'This hub collects every Calcumetrics loan calculator and the guides that explain the numbers behind them. Start with the EMI calculator for any fixed-rate instalment loan, then move to the home loan, car loan or mortgage calculators when you also need the down payment, total interest and the full repayment schedule.',
      'Before you borrow, the affordability and debt-to-income calculators show how much a lender is likely to approve against your income. After you borrow, the amortization and prepayment calculators show how each payment splits between interest and principal, and whether a part-payment should cut your EMI or your tenure. If you only know the payment, the interest rate calculator works backwards to the rate you are really paying, and the credit card payoff calculator shows what a higher monthly payment saves.',
      'The guides cover the decisions people get stuck on: flat versus reducing rates, fixed versus floating loans, what to do after a rate hike, and which debt to repay first. It is written for first-time borrowers, home buyers comparing offers and anyone planning to become debt-free. Every calculator runs in your browser, so the figures you enter are never sent to us.',
    ],
    groups: [
      {
        heading: 'EMI and loan repayment',
        tools: ['/emi-calculator', '/home-loan-calculator', '/car-loan-calculator', '/loan-amortization-calculator', '/loan-prepayment-calculator', '/interest-rate-calculator'],
        posts: ['how-loan-amortization-works', 'flat-vs-reducing-interest-rate', 'fixed-vs-floating-rate-loans', 'home-loan-prepayment-vs-sip', 'increase-emi-or-extend-tenure-after-rate-hike', 'rbi-repo-rate-hike-emi-impact', 'sbi-home-loan-rate-hike-october-2026-emi'],
      },
      {
        heading: 'Mortgages and borrowing limits',
        tools: ['/mortgage-calculator', '/loan-affordability-calculator', '/debt-to-income-ratio-calculator'],
        posts: ['debt-to-income-ratio-for-mortgage', 'debt-to-income-ratio-uk', 'how-mortgage-amortization-works', 'mortgage-rates-7-4-percent-buy-or-wait'],
      },
      {
        heading: 'Paying off debt',
        tools: ['/credit-card-payoff-calculator'],
        posts: ['debt-avalanche-vs-snowball'],
      },
    ],
    faqs: [
      { question: 'How is a loan EMI calculated?', answer: 'EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where P is the loan amount, r is the monthly interest rate (annual rate ÷ 12 ÷ 100) and n is the number of monthly instalments. Early instalments are mostly interest; later ones are mostly principal.' },
      { question: 'Should a prepayment reduce my EMI or my tenure?', answer: 'Reducing the tenure usually saves more total interest, because the balance is cleared sooner. Reducing the EMI lowers the monthly outflow instead. The loan prepayment calculator shows both outcomes side by side for your loan.' },
      { question: 'What is the difference between a flat and a reducing interest rate?', answer: 'A flat rate charges interest on the original loan amount for the whole term, while a reducing rate charges interest only on the balance still outstanding. The same quoted number therefore costs far more as a flat rate.' },
      { question: 'How much loan can I afford?', answer: 'Lenders look at how much of your income already goes to debt payments. The loan affordability and debt-to-income calculators apply common lender limits to your income and existing debts, but each lender sets its own rules.' },
    ],
  },
  {
    id: 'investing',
    updated: '2026-10-24',
    href: '/investments',
    name: 'Investing',
    h1: 'Investing Calculators and Guides',
    title: 'Investing Calculators: SIP, FD, CAGR & More | Calcumetrics',
    description: 'Free investing calculators and guides: SIP, lump sum, FD, RD, PPF, CAGR, XIRR, inflation and savings goals, with worked examples.',
    ogImage: '/og/categories/investments.png',
    ogImageAlt: 'Calcumetrics investing calculators: SIP, FD, CAGR and XIRR',
    category: 'Investments',
    intro: [
      'This hub brings together the Calcumetrics calculators and guides for growing savings. Use the SIP and lump sum calculators to project mutual fund or index fund investments, and the fixed deposit, recurring deposit and PPF calculators for guaranteed-return products. To measure what an investment actually earned, the CAGR calculator handles a single start and end value, while the XIRR calculator handles several deposits and withdrawals on different dates.',
      'Long-term planning tools sit alongside them. The compound and simple interest calculators show how returns build up, the inflation calculator shows what money will be worth in future, and the savings goal calculator works out the monthly amount needed to reach a target. US readers will also find a 401(k) calculator and a guide to choosing between traditional and Roth contributions.',
      'The guides explain the questions behind the numbers: CAGR versus XIRR, RD versus SIP, how PPF interest is credited, real returns after inflation, and what recent rate changes mean for deposits. The hub is meant for new investors, salaried savers comparing products and anyone checking a fund statement. Calculations run in your browser and nothing you enter is stored.',
    ],
    groups: [
      {
        heading: 'SIPs and market investments',
        tools: ['/sip-calculator', '/lump-sum-calculator', '/cagr-calculator', '/xirr-calculator'],
        posts: ['cagr-vs-xirr', 'rd-vs-sip', 'dhanteras-2026-gold-vs-sip', 'diwali-bonus-2026-lump-sum-sip-or-prepay'],
      },
      {
        heading: 'Deposits and small savings',
        tools: ['/fd-calculator', '/rd-calculator', '/in/ppf-calculator'],
        posts: ['fd-rates-after-rbi-hike-lock-now-or-wait', 'rbi-repo-rate-5-50-fd-returns-october-2026', 'small-savings-rates-october-december-2026', 'ppf-interest-calculation-5th-day-rule'],
      },
      {
        heading: 'Growth, inflation and goals',
        tools: ['/compound-interest-calculator', '/simple-interest-calculator', '/inflation-calculator', '/savings-goal-calculator'],
        posts: ['real-rate-of-return', 'apr-vs-apy-compounding-frequency'],
      },
      {
        heading: 'Retirement (US)',
        tools: ['/us/401k-calculator'],
        posts: ['traditional-vs-roth-401k'],
      },
    ],
    faqs: [
      { question: 'What is the difference between CAGR and XIRR?', answer: 'CAGR is the yearly growth rate between one starting value and one ending value. XIRR is the yearly return when money goes in or out on several dates, such as monthly SIP instalments, so it is the right measure for a SIP.' },
      { question: 'Is a SIP better than a lump sum?', answer: 'Neither is always better. A lump sum has more time in the market if prices rise steadily, while a SIP spreads purchases over time and suits regular income. The SIP and lump sum calculators show both outcomes at the same assumed return.' },
      { question: 'How do I account for inflation in my returns?', answer: 'Real return ≈ (1 + nominal return) ÷ (1 + inflation) − 1. A deposit earning 7% while prices rise 5% grows purchasing power by only about 1.9% a year. The inflation calculator shows what a future amount is worth today.' },
      { question: 'Are the returns shown guaranteed?', answer: 'Only fixed-rate products such as FDs, RDs and PPF (at the current notified rate) have predictable returns. Projections for SIPs, lump sums and other market investments use the return you enter and are illustrations, not promises.' },
    ],
  },
  {
    id: 'tax-india',
    updated: '2026-10-24',
    href: '/taxes',
    name: 'Tax (India)',
    h1: 'India Tax Calculators and Guides',
    title: 'India Tax Calculators: Income Tax, TDS, GST | Calcumetrics',
    description: 'India tax calculators and guides for tax year 2026-27: income tax, salary, HRA, TDS, advance tax, capital gains and GST under the Income-tax Act, 2025.',
    ogImage: '/og/categories/taxes.png',
    ogImageAlt: 'Calcumetrics India tax calculators: income tax, HRA, TDS and GST',
    category: 'Taxes',
    indiaOnly: true,
    intro: [
      'This hub covers Indian direct and indirect tax: every Calcumetrics tax calculator and the guides that explain the rules behind it. From tax year 2026-27 income tax is governed by the Income-tax Act, 2025, while returns for FY 2025-26 still follow the Income-tax Act, 1961. Each calculator states which year and which law it applies at the top of the page.',
      'Salaried taxpayers can start with the income tax calculator to compare the default new regime with the old regime, then use the salary CTC calculator to see take-home pay and the HRA calculator to work out the exempt part of house rent allowance. Freelancers, investors and business owners will use the advance tax, TDS and capital gains calculators, and anyone pricing goods or services can add or remove GST at any slab.',
      'The guides go deeper: old versus new regime break-even points, the section 87A rebate and marginal relief, advance tax due dates with worked examples, TDS versus advance tax, capital gains on shares and IPOs, GST input tax credit, and a section-by-section guide to the new Act for salaried people. It is written for employees, students of B.Com and CA, and small business owners. Results are estimates for planning, not filing advice.',
    ],
    groups: [
      {
        heading: 'Income tax and salary',
        tools: ['/in/income-tax-calculator', '/in/salary-ctc-calculator', '/in/hra-calculator'],
        posts: ['old-vs-new-tax-regime', 'section-87a-marginal-relief-new-regime-example', 'new-income-tax-act-2025-salaried-guide', 'ctc-vs-in-hand-salary', 'hra-exemption-least-of-three-solved-example', 'itr-due-date-21-november-2026-late-fee-interest'],
      },
      {
        heading: 'Advance tax and TDS',
        tools: ['/in/advance-tax-calculator', '/in/tds-calculator'],
        posts: ['advance-tax-guide', 'advance-tax-due-dates-calculation-example', 'tds-vs-advance-tax-difference'],
      },
      {
        heading: 'Capital gains',
        tools: ['/in/capital-gains-tax-calculator'],
        posts: ['capital-gains-tax-rules', 'jio-platforms-ipo-listing-gains-tax'],
      },
      {
        heading: 'GST',
        tools: ['/in/gst-calculator'],
        posts: ['gst-input-tax-credit-rules'],
      },
    ],
    faqs: [
      { question: 'Which tax regime applies by default in tax year 2026-27?', answer: 'The new regime under section 202 of the Income-tax Act, 2025 is the default. Individuals without business income can opt out of it when filing the return; those with business income must opt out by the return due date under section 202(4).' },
      { question: 'Can I claim HRA exemption under the new regime?', answer: 'No. Section 202(2)(a)(i) computes income under the new regime without the house rent allowance exemption in Schedule III (Table Sl. No. 11), so HRA only helps if you opt for the old regime.' },
      { question: 'When do I have to pay advance tax?', answer: 'If your tax for the year after TDS and TCS is ₹10,000 or more, pay advance tax in four instalments: 15% by 15 June, 45% by 15 September, 75% by 15 December and 100% by 15 March. The advance tax calculator splits your estimate across these dates.' },
      { question: 'Do these calculators work for FY 2025-26?', answer: 'Payments, income and returns for FY 2025-26 remain under the Income-tax Act, 1961. Each calculator shows the year and law it uses; where a page covers only tax year 2026-27, use it for planning and check the 1961 rules for earlier years.' },
    ],
  },
  {
    id: 'business',
    updated: '2026-10-24',
    href: '/business',
    name: 'Business & Accounting',
    h1: 'Business and Accounting Calculators',
    title: 'Business & Accounting Calculators and Guides | Calcumetrics',
    description: 'Free business and accounting calculators: break-even, margins, COGS, working capital, inventory, ratios, DSCR, depreciation and valuation.',
    ogImage: '/og/categories/business.png',
    ogImageAlt: 'Calcumetrics business and accounting calculators: break-even, margins and ratios',
    category: 'Business',
    intro: [
      'This hub gathers the Calcumetrics calculators and guides for running and analysing a business. Pricing tools come first: the break-even, profit margin, markup versus margin, cost of goods sold and ROI calculators show whether a product or project pays for itself and at what volume.',
      'Operations and finance follow. The working capital, cash conversion cycle, inventory turnover and economic order quantity calculators show how quickly cash moves through the business and how much stock to hold. The liquidity ratios and DSCR calculators show what a banker sees when you apply for credit, and the depreciation calculator covers straight-line and written-down value methods. Indian merchants can also check the cost of card and UPI payments with the MDR calculator.',
      'For investment decisions, the corporate finance group links to NPV, IRR, payback, WACC and DCF calculators, which also have their own hub. The guides include solved numericals written for B.Com and Class 12 accounts students alongside practical explainers for owners, such as current versus quick ratio and COGS versus operating expenses. Everything runs in your browser, so business figures you enter stay on your device.',
    ],
    groups: [
      {
        heading: 'Pricing and profitability',
        tools: ['/break-even-calculator', '/profit-margin-calculator', '/markup-vs-margin-calculator', '/cogs-calculator', '/roi-calculator'],
        posts: ['how-to-calculate-break-even-point', 'break-even-point-solved-example-class-12', 'markup-vs-margin', 'cogs-vs-opex-accounting'],
      },
      {
        heading: 'Working capital and inventory',
        tools: ['/working-capital-calculator', '/cash-conversion-cycle-calculator', '/inventory-turnover-calculator', '/eoq-calculator'],
        posts: ['cash-conversion-cycle', 'economic-order-quantity-eoq-guide', 'eoq-carrying-cost-percentage-solved-example'],
      },
      {
        heading: 'Ratios and business credit',
        tools: ['/liquidity-ratios-calculator', '/dscr-calculator'],
        posts: ['current-ratio-vs-quick-ratio', 'dscr-ratio-for-business-loans', 'dscr-calculation-bank-loan-example'],
      },
      {
        heading: 'Depreciation',
        tools: ['/depreciation-calculator'],
        posts: ['straight-line-vs-reducing-balance-depreciation', 'wdv-depreciation-numerical-with-solution'],
      },
      {
        heading: 'Payments in India',
        tools: ['/in/upi-mdr-calculator'],
        posts: ['upi-mdr-above-2000-merchant-charges'],
      },
      {
        heading: 'Corporate finance and valuation',
        tools: ['/npv-calculator', '/irr-calculator', '/payback-period-calculator', '/discounted-payback-period-calculator', '/wacc-calculator', '/dcf-calculator'],
        posts: ['npv-vs-irr', 'how-to-calculate-wacc', 'dcf-valuation-terminal-value-guide', 'payback-period-vs-discounted-payback'],
      },
    ],
    faqs: [
      { question: 'What is the difference between markup and margin?', answer: 'Markup is profit as a percentage of cost; margin is profit as a percentage of the selling price. A 50% markup on cost gives a 33.3% margin, so mixing them up leads to underpricing.' },
      { question: 'How is the break-even point calculated?', answer: 'Break-even units = fixed costs ÷ (selling price per unit − variable cost per unit). The denominator is the contribution margin per unit; every unit sold beyond break-even adds that amount to profit.' },
      { question: 'What DSCR do lenders look for?', answer: 'Debt service coverage ratio = net operating income ÷ total debt payments. A ratio below 1 means income does not cover repayments; many lenders look for about 1.25 or higher, but each sets its own minimum.' },
      { question: 'Current ratio or quick ratio: which should I use?', answer: 'The current ratio counts all current assets, including inventory. The quick ratio leaves inventory out, so it is the stricter test when stock is slow to sell. The liquidity ratios calculator shows both.' },
    ],
  },
  {
    id: 'corporate-finance',
    updated: '2026-10-24',
    href: '/corporate-finance',
    name: 'Corporate Finance',
    h1: 'Corporate Finance Calculators and Guides',
    title: 'Corporate Finance Calculators: NPV, IRR, WACC | Calcumetrics',
    description: 'Free corporate finance calculators and guides: NPV, IRR, payback, discounted payback, WACC, DCF, present value and future value.',
    ogImage: '/og/categories/corporate-finance.png',
    ogImageAlt: 'Calcumetrics corporate finance calculators: NPV, IRR, WACC and DCF',
    category: 'Corporate Finance',
    parent: 'business',
    intro: [
      'This hub holds the Calcumetrics calculators and guides for capital budgeting and valuation. It is part of the wider Business & Accounting hub and is aimed at finance students, analysts and founders who need to judge whether a project or company is worth the money.',
      'For project decisions, the NPV calculator discounts a stream of cash flows at your required return, the IRR calculator finds the rate at which NPV is zero, and the payback and discounted payback calculators show how long it takes to recover the investment. For valuation, the WACC calculator builds a discount rate from the cost of equity and after-tax cost of debt, and the DCF calculator values a business from projected free cash flow plus a terminal value. The present value and future value calculators handle single amounts and series, which underpin all of the above.',
      'The guides explain when NPV and IRR disagree, how to build a WACC step by step, how terminal value dominates most DCF models, and why discounted payback is a stricter test than simple payback. Each calculator shows its formula and a worked example, and runs entirely in your browser.',
    ],
    groups: [
      {
        heading: 'Capital budgeting',
        tools: ['/npv-calculator', '/irr-calculator', '/payback-period-calculator', '/discounted-payback-period-calculator'],
        posts: ['npv-vs-irr', 'payback-period-vs-discounted-payback'],
      },
      {
        heading: 'Valuation and cost of capital',
        tools: ['/wacc-calculator', '/dcf-calculator', '/present-value-calculator', '/future-value-calculator'],
        posts: ['how-to-calculate-wacc', 'dcf-valuation-terminal-value-guide'],
      },
    ],
    faqs: [
      { question: 'Why can NPV and IRR give different answers?', answer: 'IRR assumes cash flows are reinvested at the IRR itself and can have several values when cash flows change sign more than once. NPV uses your actual required return, so when the two disagree on mutually exclusive projects, NPV is the safer guide.' },
      { question: 'What goes into WACC?', answer: 'WACC = (E ÷ V) × cost of equity + (D ÷ V) × cost of debt × (1 − tax rate), where E and D are the market values of equity and debt and V = E + D. The tax term reflects that interest is usually tax-deductible.' },
      { question: 'How is terminal value calculated in a DCF?', answer: 'With the Gordon growth method, terminal value = final-year free cash flow × (1 + g) ÷ (WACC − g), where g is a long-run growth rate below WACC. It is then discounted back to today along with the forecast-year cash flows.' },
      { question: 'What is the difference between payback and discounted payback?', answer: 'Simple payback counts how many years undiscounted cash flows take to repay the investment. Discounted payback discounts each cash flow first, so it is always longer and accounts for the time value of money.' },
    ],
  },
  {
    id: 'everyday-math',
    updated: '2026-10-24',
    href: '/everyday-math',
    name: 'Everyday Math',
    h1: 'Everyday Money Math Calculators',
    title: 'Everyday Money Math Calculators | Calcumetrics',
    description: 'Everyday money math in one place: simple and compound interest, interest rates, inflation, present and future value, savings goals, margins and ROI.',
    ogImage: '/og/default.png',
    ogImageAlt: 'Calcumetrics everyday money math calculators',
    intro: [
      'This hub is for the quick sums that come up in everyday money decisions, before you need a specialist tool. It pulls together the Calcumetrics calculators for the core formulas: simple interest, compound interest, the interest rate hidden in a loan or deposit, and the effect of inflation on what money will buy.',
      'Time-value tools let you move money across years. The future value calculator shows what an amount grows to, the present value calculator shows what a future sum is worth today, and the savings goal calculator works out how much to set aside each month to reach a target. For percentages in buying and selling, the profit margin, markup versus margin and ROI calculators answer the questions that trip people up most, such as why a 50% markup is not a 50% margin.',
      'Short guides explain the ideas behind the numbers, including APR versus APY, flat versus reducing interest, real returns after inflation and markup versus margin. The hub suits students, households checking a quote or a bank offer, and anyone who wants to see the working rather than trust a headline rate. Each calculator shows its formula and runs in your browser.',
    ],
    groups: [
      {
        heading: 'Interest basics',
        tools: ['/simple-interest-calculator', '/compound-interest-calculator', '/interest-rate-calculator'],
        posts: ['apr-vs-apy-compounding-frequency', 'flat-vs-reducing-interest-rate'],
      },
      {
        heading: 'Money over time',
        tools: ['/inflation-calculator', '/future-value-calculator', '/present-value-calculator', '/savings-goal-calculator'],
        posts: ['real-rate-of-return', 'cagr-vs-xirr'],
      },
      {
        heading: 'Percentages in buying and selling',
        tools: ['/profit-margin-calculator', '/markup-vs-margin-calculator', '/roi-calculator'],
        posts: ['markup-vs-margin'],
      },
    ],
    faqs: [
      { question: 'What is the difference between simple and compound interest?', answer: 'Simple interest is earned only on the original amount: interest = principal × rate × time. Compound interest is also earned on interest already added, so the balance grows faster the longer the money stays invested and the more often interest is compounded.' },
      { question: 'What is the difference between APR and APY?', answer: 'APR is the annual rate before compounding. APY (or effective annual rate) includes compounding: APY = (1 + APR ÷ n)^n − 1, where n is the number of compounding periods a year. Monthly compounding at 12% APR gives about 12.68% APY.' },
      { question: 'How does inflation change the value of money?', answer: 'At a constant inflation rate i, an amount today needs to grow to amount × (1 + i)^years to buy the same things later. At 6% inflation prices roughly double in 12 years.' },
      { question: 'How do I calculate a percentage return?', answer: 'Return % = (final value − amount invested) ÷ amount invested × 100. To compare investments held for different lengths of time, convert it to an annual rate with the CAGR formula.' },
    ],
  },
];

export function getHub(id: HubId): Hub {
  const hub = HUBS.find((h) => h.id === id);
  if (!hub) throw new Error(`Unknown hub: ${id}`);
  return hub;
}

/** Primary hub for a registry category (used for tool breadcrumbs and post "More in" links). */
export function hubForCategory(category: Category): Hub {
  const hub = HUBS.find((h) => h.category === category);
  if (!hub) throw new Error(`No hub for category: ${category}`);
  return hub;
}

/** All hubs that list a tool path. */
export function hubsForTool(path: string): Hub[] {
  return HUBS.filter((h) => h.groups.some((g) => g.tools.includes(path)));
}

/** All hubs that list a post slug. */
export function hubsForPost(slug: string): Hub[] {
  return HUBS.filter((h) => h.groups.some((g) => g.posts.includes(slug)));
}
