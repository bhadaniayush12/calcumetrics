# PHASE 14 — INDEXABILITY MATRIX

> **Purpose:** Records the intended indexability state for every meaningful public URL.
> Verified against source code as of 2026-09-23, commit 4107e95 on branch `development`.
> This document reflects ACTUAL implementation, not desired future state.
> Updates made in subsequent batches will be noted with [UPDATED: BatchN].

---

## Legend

| Column | Meaning |
|--------|---------|
| URL | Full path (no domain) |
| Page Type | What kind of page this is |
| Index? | Should Google index this? (Yes = index,follow / No = noindex,follow) |
| Canonical | Self-canonical URL |
| Sitemap? | Appears in a sitemap XML? |
| Reason | Rationale for indexability decision |

---

## Homepage

| URL | Page Type | Index? | Canonical | Sitemap? | Reason |
|-----|-----------|--------|-----------|----------|--------|
| `/` | Homepage | **YES** | `https://calcumetrics.com/` | sitemap-pages.xml | Primary landing page |

---

## Calculator Directory

| URL | Page Type | Index? | Canonical | Sitemap? | Reason |
|-----|-----------|--------|-----------|----------|--------|
| `/calculators` | Directory | **YES** | `https://calcumetrics.com/calculators` | sitemap-pages.xml | Discovery hub for all 50 tools |

---

## Category Hub Pages

| URL | Page Type | Index? | Canonical | Sitemap? | Reason |
|-----|-----------|--------|-----------|----------|--------|
| `/investments` | Category Hub | **YES** | `https://calcumetrics.com/investments` | sitemap-hubs.xml | 13 tools ≥ 4 threshold |
| `/loans` | Category Hub | **YES** | `https://calcumetrics.com/loans` | sitemap-hubs.xml | 10 tools ≥ 4 threshold |
| `/taxes` | Category Hub | **YES** | `https://calcumetrics.com/taxes` | sitemap-hubs.xml | 7 tools ≥ 4 threshold |
| `/business` | Category Hub | **YES** | `https://calcumetrics.com/business` | sitemap-hubs.xml | 13 tools ≥ 4 threshold |
| `/corporate-finance` | Category Hub | **YES** | `https://calcumetrics.com/corporate-finance` | sitemap-hubs.xml | 8 tools ≥ 4 threshold |

---

## Investment Calculators (13 tools)

| URL | Page Type | Region | Index? | Canonical | Sitemap? | Reason |
|-----|-----------|--------|--------|-----------|----------|--------|
| `/sip-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/sip-calculator` | sitemap-tools.xml | Published, high-value tool |
| `/lump-sum-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/lump-sum-calculator` | sitemap-tools.xml | Published |
| `/compound-interest-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/compound-interest-calculator` | sitemap-tools.xml | Published |
| `/simple-interest-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/simple-interest-calculator` | sitemap-tools.xml | Published |
| `/cagr-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/cagr-calculator` | sitemap-tools.xml | Published |
| `/xirr-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/xirr-calculator` | sitemap-tools.xml | Published |
| `/fd-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/fd-calculator` | sitemap-tools.xml | Published |
| `/rd-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/rd-calculator` | sitemap-tools.xml | Published |
| `/inflation-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/inflation-calculator` | sitemap-tools.xml | Published |
| `/savings-goal-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/savings-goal-calculator` | sitemap-tools.xml | Published |
| `/in/ppf-calculator` | Calculator | India | **YES** | `https://calcumetrics.com/in/ppf-calculator` | sitemap-tools.xml | Published, India-specific |
| `/us/401k-calculator` | Calculator | US | **YES** | `https://calcumetrics.com/us/401k-calculator` | sitemap-tools.xml | Published, US-specific |

---

## Loan Calculators (10 tools)

| URL | Page Type | Region | Index? | Canonical | Sitemap? | Reason |
|-----|-----------|--------|--------|-----------|----------|--------|
| `/emi-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/emi-calculator` | sitemap-tools.xml | Published |
| `/home-loan-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/home-loan-calculator` | sitemap-tools.xml | Published |
| `/car-loan-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/car-loan-calculator` | sitemap-tools.xml | Published |
| `/loan-prepayment-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/loan-prepayment-calculator` | sitemap-tools.xml | Published |
| `/mortgage-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/mortgage-calculator` | sitemap-tools.xml | Published |
| `/loan-affordability-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/loan-affordability-calculator` | sitemap-tools.xml | Published |
| `/debt-to-income-ratio-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/debt-to-income-ratio-calculator` | sitemap-tools.xml | Published |
| `/credit-card-payoff-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/credit-card-payoff-calculator` | sitemap-tools.xml | Published |
| `/loan-amortization-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/loan-amortization-calculator` | sitemap-tools.xml | Published |
| `/interest-rate-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/interest-rate-calculator` | sitemap-tools.xml | Published |

---

## Tax Calculators (7 tools — all India)

| URL | Page Type | Region | Index? | Canonical | Sitemap? | Reason |
|-----|-----------|--------|--------|-----------|----------|--------|
| `/in/income-tax-calculator` | Calculator | India | **YES** | `https://calcumetrics.com/in/income-tax-calculator` | sitemap-tools.xml | Published, India-specific |
| `/in/gst-calculator` | Calculator | India | **YES** | `https://calcumetrics.com/in/gst-calculator` | sitemap-tools.xml | Published, India-specific |
| `/in/hra-calculator` | Calculator | India | **YES** | `https://calcumetrics.com/in/hra-calculator` | sitemap-tools.xml | Published, India-specific |
| `/in/tds-calculator` | Calculator | India | **YES** | `https://calcumetrics.com/in/tds-calculator` | sitemap-tools.xml | Published, India-specific |
| `/in/capital-gains-tax-calculator` | Calculator | India | **YES** | `https://calcumetrics.com/in/capital-gains-tax-calculator` | sitemap-tools.xml | Published, India-specific |
| `/in/advance-tax-calculator` | Calculator | India | **YES** | `https://calcumetrics.com/in/advance-tax-calculator` | sitemap-tools.xml | Published, India-specific |
| `/in/salary-ctc-calculator` | Calculator | India | **YES** | `https://calcumetrics.com/in/salary-ctc-calculator` | sitemap-tools.xml | Published, India-specific |

---

## Business Calculators (13 tools)

| URL | Page Type | Region | Index? | Canonical | Sitemap? | Reason |
|-----|-----------|--------|--------|-----------|----------|--------|
| `/in/upi-mdr-calculator` | Calculator | India | **YES** | `https://calcumetrics.com/in/upi-mdr-calculator` | sitemap-tools.xml | Published, India-specific |
| `/break-even-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/break-even-calculator` | sitemap-tools.xml | Published |
| `/profit-margin-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/profit-margin-calculator` | sitemap-tools.xml | Published |
| `/markup-vs-margin-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/markup-vs-margin-calculator` | sitemap-tools.xml | Published |
| `/roi-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/roi-calculator` | sitemap-tools.xml | Published |
| `/eoq-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/eoq-calculator` | sitemap-tools.xml | Published |
| `/depreciation-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/depreciation-calculator` | sitemap-tools.xml | Published |
| `/working-capital-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/working-capital-calculator` | sitemap-tools.xml | Published |
| `/cogs-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/cogs-calculator` | sitemap-tools.xml | Published |
| `/inventory-turnover-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/inventory-turnover-calculator` | sitemap-tools.xml | Published |
| `/liquidity-ratios-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/liquidity-ratios-calculator` | sitemap-tools.xml | Published |
| `/cash-conversion-cycle-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/cash-conversion-cycle-calculator` | sitemap-tools.xml | Published |
| `/dscr-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/dscr-calculator` | sitemap-tools.xml | Published |

---

## Corporate Finance Calculators (8 tools)

| URL | Page Type | Region | Index? | Canonical | Sitemap? | Reason |
|-----|-----------|--------|--------|-----------|----------|--------|
| `/wacc-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/wacc-calculator` | sitemap-tools.xml | Published |
| `/npv-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/npv-calculator` | sitemap-tools.xml | Published |
| `/irr-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/irr-calculator` | sitemap-tools.xml | Published |
| `/payback-period-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/payback-period-calculator` | sitemap-tools.xml | Published |
| `/dcf-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/dcf-calculator` | sitemap-tools.xml | Published |
| `/discounted-payback-period-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/discounted-payback-period-calculator` | sitemap-tools.xml | Published |
| `/present-value-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/present-value-calculator` | sitemap-tools.xml | Published |
| `/future-value-calculator` | Calculator | Global | **YES** | `https://calcumetrics.com/future-value-calculator` | sitemap-tools.xml | Published |

---

## Blog Pages

### Blog Index

| URL | Page Type | Index? | Canonical | Sitemap? | Reason |
|-----|-----------|--------|-----------|----------|--------|
| `/blog` | Blog Index | **YES** | `https://calcumetrics.com/blog` | sitemap-pages.xml | Discovery hub for 30 articles |

### Blog Articles (30 posts — slugs extracted from registry)

> NOTE: The slug list below is derived from the `slug:` field at the top of each post object.
> Relational slug references within `relatedArticles` arrays are not included here.

| URL | Page Type | Index? | Canonical | Sitemap? | Batch File |
|-----|-----------|--------|-----------|----------|-----------|
| `/blog/cagr-vs-xirr` | Article | **YES** | `https://calcumetrics.com/blog/cagr-vs-xirr` | sitemap-pages.xml | posts-phase11 |
| `/blog/home-loan-prepayment-vs-sip` | Article | **YES** | `https://calcumetrics.com/blog/home-loan-prepayment-vs-sip` | sitemap-pages.xml | posts-phase11 |
| `/blog/real-rate-of-return` | Article | **YES** | `https://calcumetrics.com/blog/real-rate-of-return` | sitemap-pages.xml | posts-phase11 |
| `/blog/flat-vs-reducing-interest-rate` | Article | **YES** | `https://calcumetrics.com/blog/flat-vs-reducing-interest-rate` | sitemap-pages.xml | posts-phase11 |
| `/blog/old-vs-new-tax-regime` | Article | **YES** | `https://calcumetrics.com/blog/old-vs-new-tax-regime` | sitemap-pages.xml | posts-phase11 |
| `/blog/capital-gains-tax-rules` | Article | **YES** | `https://calcumetrics.com/blog/capital-gains-tax-rules` | sitemap-pages.xml | posts-phase11 |
| `/blog/markup-vs-margin` | Article | **YES** | `https://calcumetrics.com/blog/markup-vs-margin` | sitemap-pages.xml | posts-phase11 |
| `/blog/npv-vs-irr` | Article | **YES** | `https://calcumetrics.com/blog/npv-vs-irr` | sitemap-pages.xml | posts-phase11 |
| `/blog/cash-conversion-cycle` | Article | **YES** | `https://calcumetrics.com/blog/cash-conversion-cycle` | sitemap-pages.xml | posts-phase11 |
| `/blog/advance-tax-guide` | Article | **YES** | `https://calcumetrics.com/blog/advance-tax-guide` | sitemap-pages.xml | posts-phase11 |
| `/blog/ppf-interest-calculation-5th-day-rule` | Article | **YES** | `https://calcumetrics.com/blog/ppf-interest-calculation-5th-day-rule` | sitemap-pages.xml | batch1 |
| `/blog/traditional-vs-roth-401k` | Article | **YES** | `https://calcumetrics.com/blog/traditional-vs-roth-401k` | sitemap-pages.xml | batch1 |
| `/blog/apr-vs-apy-compounding-frequency` | Article | **YES** | `https://calcumetrics.com/blog/apr-vs-apy-compounding-frequency` | sitemap-pages.xml | batch1 |
| `/blog/rd-vs-sip` | Article | **YES** | `https://calcumetrics.com/blog/rd-vs-sip` | sitemap-pages.xml | batch1 |
| `/blog/debt-to-income-ratio-for-mortgage` | Article | **YES** | `https://calcumetrics.com/blog/debt-to-income-ratio-for-mortgage` | sitemap-pages.xml | batch1 |
| `/blog/debt-avalanche-vs-snowball` | Article | **YES** | `https://calcumetrics.com/blog/debt-avalanche-vs-snowball` | sitemap-pages.xml | batch2 |
| `/blog/how-loan-amortization-works` | Article | **YES** | `https://calcumetrics.com/blog/how-loan-amortization-works` | sitemap-pages.xml | batch2 |
| `/blog/fixed-vs-floating-rate-loans` | Article | **YES** | `https://calcumetrics.com/blog/fixed-vs-floating-rate-loans` | sitemap-pages.xml | batch2 |
| `/blog/ctc-vs-in-hand-salary` | Article | **YES** | `https://calcumetrics.com/blog/ctc-vs-in-hand-salary` | sitemap-pages.xml | batch2 |
| `/blog/gst-input-tax-credit-rules` | Article | **YES** | `https://calcumetrics.com/blog/gst-input-tax-credit-rules` | sitemap-pages.xml | batch2 |
| `/blog/tds-vs-advance-tax-difference` | Article | **YES** | `https://calcumetrics.com/blog/tds-vs-advance-tax-difference` | sitemap-pages.xml | batch3 |
| `/blog/how-to-calculate-break-even-point` | Article | **YES** | `https://calcumetrics.com/blog/how-to-calculate-break-even-point` | sitemap-pages.xml | batch3 |
| `/blog/economic-order-quantity-eoq-guide` | Article | **YES** | `https://calcumetrics.com/blog/economic-order-quantity-eoq-guide` | sitemap-pages.xml | batch3 |
| `/blog/straight-line-vs-reducing-balance-depreciation` | Article | **YES** | `https://calcumetrics.com/blog/straight-line-vs-reducing-balance-depreciation` | sitemap-pages.xml | batch3 |
| `/blog/dscr-ratio-for-business-loans` | Article | **YES** | `https://calcumetrics.com/blog/dscr-ratio-for-business-loans` | sitemap-pages.xml | batch3 |
| `/blog/current-ratio-vs-quick-ratio` | Article | **YES** | `https://calcumetrics.com/blog/current-ratio-vs-quick-ratio` | sitemap-pages.xml | batch4 |
| `/blog/cogs-vs-opex-accounting` | Article | **YES** | `https://calcumetrics.com/blog/cogs-vs-opex-accounting` | sitemap-pages.xml | batch4 |
| `/blog/how-to-calculate-wacc` | Article | **YES** | `https://calcumetrics.com/blog/how-to-calculate-wacc` | sitemap-pages.xml | batch4 |
| `/blog/dcf-valuation-terminal-value-guide` | Article | **YES** | `https://calcumetrics.com/blog/dcf-valuation-terminal-value-guide` | sitemap-pages.xml | batch4 |
| `/blog/payback-period-vs-discounted-payback` | Article | **YES** | `https://calcumetrics.com/blog/payback-period-vs-discounted-payback` | sitemap-pages.xml | batch4 |

> **TOTAL BLOG POSTS: 30**

---

## Supporting Pages

| URL | Page Type | Index? | Canonical | Sitemap? | Reason |
|-----|-----------|--------|-----------|----------|--------|
| `/about` | About | **YES** | `https://calcumetrics.com/about` | sitemap-pages.xml | Trust signal, useful for users |
| `/methodology` | Methodology | **YES** | `https://calcumetrics.com/methodology` | sitemap-pages.xml | E-E-A-T, formula transparency |
| `/contact` | Contact | **YES** | `https://calcumetrics.com/contact` | sitemap-pages.xml | Required for AdSense compliance |
| `/privacy-policy` | Legal | **YES** | `https://calcumetrics.com/privacy-policy` | sitemap-pages.xml | Required by AdSense ToS |
| `/terms` | Legal | **YES** | `https://calcumetrics.com/terms` | sitemap-pages.xml | Policy page |
| `/disclaimer` | Legal | **YES** | `https://calcumetrics.com/disclaimer` | sitemap-pages.xml | Policy page |
| `/cookie-policy` | Legal | **YES** | `https://calcumetrics.com/cookie-policy` | sitemap-pages.xml | Cookie disclosure |

---

## Special/Infrastructure URLs

| URL | Page Type | Index? | Canonical | Sitemap? | Reason |
|-----|-----------|--------|-----------|----------|--------|
| `/404` | Error Page | **NO** | N/A | No | Standard; not useful content |
| `/sitemap-index.xml` | XML | N/A | N/A | N/A | Sitemap itself |
| `/sitemap-tools.xml` | XML | N/A | N/A | N/A | Sitemap itself |
| `/sitemap-hubs.xml` | XML | N/A | N/A | N/A | Sitemap itself |
| `/sitemap-pages.xml` | XML | N/A | N/A | N/A | Sitemap itself |
| `/robots.txt` | Robots | N/A | N/A | N/A | Robots directive |
| `/ads.txt` | Ads.txt | N/A | N/A | N/A | Publisher authorization |
| `/favicon.svg`, `/favicon.ico` | Asset | N/A | N/A | N/A | Browser assets |

---

## Language Routes

| Pattern | Status | Reason |
|---------|--------|--------|
| `/hi/*` | **DOES NOT EXIST** | Hindi routes removed in Phase 13; not restored |
| `/es/*` | **DOES NOT EXIST** | Never existed in current codebase |
| `/fr/*` | **DOES NOT EXIST** | Never existed in current codebase |
| `/pt/*` | **DOES NOT EXIST** | Never existed in current codebase |
| `/de/*` | **DOES NOT EXIST** | Never existed in current codebase |

Calcumetrics is English-only. No i18n routes exist or are planned for Phase 14.

---

## Duplicate URL Risk Assessment

| Risk | Verdict |
|------|---------|
| /in/ routes competing with global routes | No overlap — all /in/ tools are India-specific and do not duplicate global tools |
| /us/ routes competing with global routes | No overlap — 401k is US-only |
| Trailing slash variants | Homepage canonical uses trailing slash `/`; all others use no trailing slash. Consistent. |
| Calculator slugs duplicated across regions | Verified clean — no slug appears in both Global and IN/US prefixes |

---

## Summary Counts

| Type | Count | Indexed | Not Indexed |
|------|-------|---------|-------------|
| Homepage | 1 | 1 | 0 |
| Calculator Directory | 1 | 1 | 0 |
| Category Hubs | 5 | 5 | 0 |
| Calculators (Global) | 40 | 40 | 0 |
| Calculators (India) | 9 | 9 | 0 |
| Calculators (US) | 1 | 1 | 0 |
| Blog Index | 1 | 1 | 0 |
| Blog Articles | 30 | 30 | 0 |
| Supporting Pages | 7 | 7 | 0 |
| Error/Infrastructure | Various | 0 | /404 + infra |
| **TOTAL PUBLIC CONTENT** | **95** | **95** | **0 + /404** |

---

*Created: 2026-09-23. Will be updated as batch fixes are applied.*
