# Calcumetrics — SEO Implementation Plan

> **Author:** Phase 15 SEO Implementation  
> **Created:** 2026-09-24  
> **Branch:** development (post Phase 14 completion)  
> **Keyword Source:** `docs/adsense/Calcumetrics_AI_SEO_Keyword_Map.md`  
> **Status:** COMPLETED & VERIFIED (419 tests passing, 96 pages clean build, 50/50 calculators optimized)

---

## Executive Summary

Phase 14 SEO is already complete (all 50 calculators implemented, 419 tests passing, 96 pages building clean).  
The newly pulled `Calcumetrics_AI_SEO_Keyword_Map.md` is the **source of truth** for this phase.

This plan audits every calculator title, meta description, and content against the finalized keyword map, then implements targeted improvements where gaps exist — without duplicating Phase 14 work or breaking anything.

**Key constraint:** Phase 14 used good SEO structure but predated the finalized keyword map. Some titles/descriptions/content may not align with the keyword map primaries. This plan closes that gap specifically.

---

## A. Repository Architecture

### Framework & Build

| Item | Value |
|------|-------|
| Framework | Astro 7.x (SSG — all 50 calculator pages are static .astro files) |
| Build command | `npm run build` (astro build) |
| Dev server | `npm run dev` (astro dev) |
| Test command | `npm test` (vitest, 419 tests, 25 files) |
| Package manager | npm |
| Node requirement | >=22.12.0 |
| Config | `astro.config.mjs` — site: https://calcumetrics.com, Tailwind CSS v4, @astrojs/sitemap NOT used (custom sitemap) |

### Routing Architecture

- **Global tools** → `/[slug]` (40 tools, root-level .astro files)
- **India tools** → `/in/[slug]` (9 tools in `src/pages/in/`)
- **US tools** → `/us/[slug]` (1 tool in `src/pages/us/`)
- No dynamic routes for calculators — each is a dedicated static file
- Redirects: `/privacy` → `/privacy-policy` (in astro.config.mjs)

### Calculator Page Architecture

```
src/pages/[calc].astro
  frontmatter (---...---):
    imports: Layout, CalculatorLayout, UI components, lib/calculators/*, formatters, TOOLS
    SSG fixture computation (pre-rendered default values)
    related = TOOLS.filter(...)
    canonicalUrl, pageTitle, pageDesc constants
    jsonld = { @context, @graph: [WebApplication, BreadcrumbList, FAQPage] }
  template:
    <Layout title={pageTitle} description={pageDesc} canonical={canonicalUrl}>
      <Fragment slot="head"><script type="application/ld+json" .../></Fragment>
      <CalculatorLayout toolName=... category=... categoryHref=... heroValue=...>
        <Fragment slot="inputs"> H1, intro p, sliders/inputs </Fragment>
        <Fragment slot="outputs"> (optional custom panels) </Fragment>
        <Fragment slot="below"> formula, example, FAQ, related tools, blog links </Fragment>
      </CalculatorLayout>
    </Layout>
```

### Shared Components

| Component | File | Role |
|-----------|------|------|
| Layout | `src/layouts/Layout.astro` | `<head>`: title, description, canonical, robots, OG, Twitter; `<slot name="head">` for JSON-LD |
| CalculatorLayout | `src/components/calculator/CalculatorLayout.astro` | Visible breadcrumb + BreadcrumbList schema, input/output split, mobile bar, Get Info inspector |
| Header | `src/components/Header.astro` | Navigation |
| Footer | `src/components/Footer.astro` | Footer |
| IndiaTaxSourceNotice | `src/components/calculator/IndiaTaxSourceNotice.astro` | Statutory sources (India tools) |

### Metadata Architecture

- `title`, `description`, `canonical` props → passed to `<Layout>`
- Layout renders: `<title>`, `<meta name="description">`, `<link rel="canonical">`, `<meta name="robots">`, all OG tags, all Twitter tags
- JSON-LD via `<slot name="head">`: each calculator injects its own `@graph`
- No shared metadata utility — each page owns its SEO constants

### Schema Architecture

Every calculator page: `WebApplication` + `BreadcrumbList` + `FAQPage` in a single `@graph`.

### Sitemap Architecture

| File | Contents |
|------|----------|
| `sitemap-index.xml` | References the three sub-sitemaps |
| `sitemap-tools.xml` | All 50 published tools with `dateModified` (registry-driven) |
| `sitemap-hubs.xml` | 5 category hub pages |
| `sitemap-pages.xml` | Homepage, /calculators, blog index, 30 blog articles (dynamic lastmod) |

### Country/Locale Architecture

- India tools: `/in/` prefix, INR currency, Indian terminology, statutory notice
- US tools: `/us/` prefix, USD, US-specific context  
- No language routes (English-only). `lang="en"` on `<html>`
- User can select display currency on global tools (stored in localStorage)

---

## B. Current SEO Audit (Post Phase 14)

Phase 14 completed on 2026-09-23. All baseline defects resolved.

| SEO Element | Status | Notes |
|-------------|--------|-------|
| Title tags | ✅ All 50 unique, brand-suffixed | May not match keyword map primaries everywhere |
| Meta descriptions | ✅ All 50 unique, 90–160 chars | May not use assigned primary keyword naturally |
| H1s | ✅ One H1 per page, tool name | Correct — must remain tool name |
| Canonicals | ✅ All 50 self-canonical | Including /in/ and /us/ prefixes |
| Open Graph | ✅ og:type, title, description, url, image 1200x630 | Layout.astro |
| Twitter cards | ✅ summary_large_image, all meta tags | Layout.astro |
| Breadcrumbs (visible) | ✅ Home → Category → Tool, all 50 | CalculatorLayout |
| BreadcrumbList JSON-LD | ✅ All 50, matches visible | Per-page |
| WebApplication JSON-LD | ✅ All 50 | Per-page |
| FAQPage JSON-LD | ✅ All 50, 4–7 Q&As | Per-page |
| Sitemap | ✅ 50 tools + hubs + pages | Registry-driven |
| robots.txt | ✅ AI bots explicitly allowed | GPTBot, ClaudeBot, PerplexityBot, Google-Extended, OAI-SearchBot |
| 404 noindex | ✅ robots="noindex,follow" | Verified |
| Calculator ↔ calculator links | ✅ 3 related tools per page | Via TOOLS.filter |
| Calculator ↔ blog links | ✅ All 50 link to relevant articles | Added Batch 5 |
| Blog → calculator links | ✅ All 30 articles link to calculators | Verified |
| OG images | ✅ /og/default.png exists, per-category PNGs | Created Batch 6 |
| Organization schema | ✅ logo + sameAs on homepage | Added Batch 3 |
| Article schema on blog | ✅ author, publisher, dates | Added Batch 6 |
| Tests | ✅ 419 tests, 25 files, all pass | As of 2026-09-24 |
| Build | ✅ 96 pages, clean | As of 2026-09-24 |

**What Phase 14 did NOT do** (because the keyword map was not yet available):
- Align titles/descriptions to the finalized keyword map primary keywords
- Use supporting keywords naturally in section headings, formula sections, FAQ text
- Handle SUBSTITUTED MAIN tools' title patterns per keyword map rules

---

## C. 50-Page Keyword Implementation Matrix

> Status: F=FINAL, SM=SUBSTITUTED MAIN, W=WATCH, R=REVIEW/LOW QUALITY

| # | Category | Tool | Route | Primary Keyword | KW Status | Action Required |
|---|----------|------|-------|----------------|-----------|----------------|
| 1 | Investments | SIP Calculator | `/sip-calculator` | `sip calculator` | F | Verify "sip investment plan calculator" + "step up sip calculator" in content |
| 2 | Investments | Lump Sum Calculator | `/lump-sum-calculator` | `lump sum calculator` | F | Verify "lump sum investment calculator" + "lump sum sip calculator" in content |
| 3 | Investments | Compound Interest Calculator | `/compound-interest-calculator` | `compound interest calculator` | F | Verify "compound interest formula" in formula section; "daily compound interest calculator" in content |
| 4 | Investments | Simple Interest Calculator | `/simple-interest-calculator` | `simple interest calculator` | F | Verify "simple interest formula" + "equation for simple interest" in formula section |
| 5 | Investments | CAGR Calculator | `/cagr-calculator` | `cagr calculator` | F | Audit title; verify "cagr formula" + "cagr growth rate calculator" natural in content |
| 6 | Investments | XIRR Calculator | `/xirr-calculator` | `xirr calculator` | F | Verify "xirr meaning" + "mutual fund xirr" in content/FAQ |
| 7 | Investments | FD Calculator | `/fd-calculator` | `fd calculator` | F | Verify "fd rate calculator" + "fd interest calculator" in content |
| 8 | Investments | RD Calculator | `/rd-calculator` | `recurring deposit calculator` | F | Verify "calculate recurring deposit" + "recurring deposit calculator sbi" |
| 9 | Investments | PPF Calculator | `/in/ppf-calculator` | `ppf calculator` | F | Audit title; verify "calculate ppf" + "ppf maturity calculator" |
| 10 | Investments | 401(k) Calculator | `/us/401k-calculator` | `401 k calculator` | W | WATCH — supporting vol is very low; use 1–2x naturally only |
| 11 | Investments | Inflation Calculator | `/inflation-calculator` | `inflation calculator` | F | Audit title; verify "cpi inflation calculator" + "us inflation calculator" |
| 12 | Investments | Savings Goal Calculator | `/savings-goal-calculator` | `savings goal calculator` | F | Verify "savings goal" + "savings goals" natural in intro/content |
| 13 | Loans | EMI Calculator | `/emi-calculator` | `emi calculator` | F | Verify "loan emi calculator" + "calculate emi" in content |
| 14 | Loans | Home Loan Calculator | `/home-loan-calculator` | `home loan calculator` | F | Audit title; verify "home loan emi calculator" + "sbi home loan calculator" |
| 15 | Loans | Car Loan Calculator | `/car-loan-calculator` | `car loan calculator` | F | Audit title; verify "car loan payment calculator" + "car loan interest calculator" |
| 16 | Loans | Loan Prepayment Calculator | `/loan-prepayment-calculator` | `loan prepayment calculator` | F | Verify "home loan prepayment calculator" + "prepayment calculator" |
| 17 | Loans | Mortgage Calculator | `/mortgage-calculator` | `mortgage calculator` | W | WATCH — medium competition; ensure "mortgage payment calculator" + "mortgage repayment calculator" natural |
| 18 | Loans | Loan Affordability Calculator | `/loan-affordability-calculator` | `loan affordability calculator` | W | WATCH — exact primary is 500 vol; ensure "home loan affordability calculator" (50K) appears in content |
| 19 | Loans | DTI Calculator | `/debt-to-income-ratio-calculator` | `debt to income ratio calculator` | F | Verify "debt to income ratio formula" + "calculate debt to income ratio" |
| 20 | Loans | Credit Card Payoff Calculator | `/credit-card-payoff-calculator` | `credit card payoff calculator` | F | Verify "credit card debt payoff calculator" + "payoff credit card calculator" |
| 21 | Loans | Loan Amortization Calculator | `/loan-amortization-calculator` | `loan amortization calculator` | F | Verify "loan amortization schedule calculator" + "loan calculator with amortization" |
| 22 | Loans | Interest Rate Calculator | `/interest-rate-calculator` | `interest rate calculator` | F | Verify "effective interest rate calculator" + "monthly interest rate calculator" |
| 23 | Taxes | Income Tax Calculator | `/in/income-tax-calculator` | `income tax calculator` | F | Verify "income and tax calculator" + "income tax calculator new regime" |
| 24 | Taxes | GST Calculator | `/in/gst-calculator` | `gst calculator` | F | Verify "calculate gst online" + "cgst and sgst calculator" |
| 25 | Taxes | HRA Calculator | `/in/hra-calculator` | `hra calculator` | F | Verify "calculate hra deduction" + "hra exemption calculator" |
| 26 | Taxes | TDS Calculator | `/in/tds-calculator` | `tds calculator` | F | Verify "tds tax calculator" + "calculate tds on salary" |
| 27 | Taxes | Capital Gains Tax Calculator | `/in/capital-gains-tax-calculator` | `capital gains tax calculator` | F | Verify "capital gains calculator" + "short term capital gains tax rate" |
| 28 | Taxes | Advance Tax Calculator | `/in/advance-tax-calculator` | `advance tax calculator` | R | REVIEW/LQ — ONLY 1 genuine supporting kw. Use "advance income tax calculator" once. No forced stuffing |
| 29 | Taxes | Salary CTC Calculator | `/in/salary-ctc-calculator` | `salary ctc calculator` | F | Verify "in hand salary calculator" + "ctc to in hand salary calculator" |
| 30 | Business | UPI MDR Calculator | `/in/upi-mdr-calculator` | `upi mdr` | SM | SUBSTITUTED MAIN — update title/description to use "upi mdr"; H1 stays "UPI MDR Calculator" |
| 31 | Business | Break-even Calculator | `/break-even-calculator` | `break even calculator` | F | Verify "break even analysis" + "break even point formula" in content |
| 32 | Business | Profit Margin Calculator | `/profit-margin-calculator` | `profit margin calculator` | F | Verify "gross profit margin" + "net profit margin formula" |
| 33 | Business | Markup vs Margin Calculator | `/markup-vs-margin-calculator` | `markup vs margin calculator` | F | Verify "calculate markup" + "margin and markup" |
| 34 | Business | ROI Calculator | `/roi-calculator` | `roi calculator` | F | Verify "roi formula" + "return on investment roi formula" |
| 35 | Business | EOQ Calculator | `/eoq-calculator` | `calculate economic order quantity` | SM | SUBSTITUTED MAIN — update title to include "calculate economic order quantity"; H1 stays "EOQ Calculator" |
| 36 | Business | Depreciation Calculator | `/depreciation-calculator` | `depreciation calculator` | F | Verify "depreciation formula" + "straight line depreciation calculator" |
| 37 | Business | Working Capital Calculator | `/working-capital-calculator` | `net working capital calculation` | SM | SUBSTITUTED MAIN — update title/description to lead with "net working capital calculation" |
| 38 | Business | COGS Calculator | `/cogs-calculator` | `cogs formula` | SM | SUBSTITUTED MAIN — update title to lead with "cogs formula"; "cost of goods sold formula" in content |
| 39 | Business | Inventory Turnover Calculator | `/inventory-turnover-calculator` | `inventory conversion cycle formula` | R | REVIEW/LQ — mapped primary does NOT match page intent. Use natural inventory turnover terms. Do NOT force mapped primary |
| 40 | Business | Liquidity Ratios Suite | `/liquidity-ratios-calculator` | `formula for liquidity ratio` | R | REVIEW/LQ — supporting kws (current ratio, quick ratio) are real demand. Lead with those. Generic primary used once max if natural |
| 41 | Business | Cash Conversion Cycle Calculator | `/cash-conversion-cycle-calculator` | `cash conversion cycle calculator` | F | Verify "cash conversion cycle formula" in formula section |
| 42 | Business | DSCR Calculator | `/dscr-calculator` | `debt service coverage ratio calculator` | F | Audit title; verify "dscr ratio calculator" + "calculate dscr ratio" |
| 43 | Corp Finance | WACC Calculator | `/wacc-calculator` | `wacc calculator` | F | Verify "wacc formula" + "wacc equation" in content |
| 44 | Corp Finance | NPV Calculator | `/npv-calculator` | `npv calculator` | F | Verify "npv formula" + "net present value npv formula" |
| 45 | Corp Finance | IRR Calculator | `/irr-calculator` | `irr calculator` | F | Audit title; verify "irr solver" + "calculate irr calculator" |
| 46 | Corp Finance | Payback Period Calculator | `/payback-period-calculator` | `payback period calculator` | F | Verify "formula for payback period" + "payback period" |
| 47 | Corp Finance | DCF Calculator | `/dcf-calculator` | `dcf calculator` | F | Verify "dcf formula" + "dcf cash flow formula" |
| 48 | Corp Finance | Discounted Payback Period Calculator | `/discounted-payback-period-calculator` | `discounted payback period calculator` | F | Verify "discounted payback period formula" |
| 49 | Corp Finance | Present Value Calculator | `/present-value-calculator` | `present value calculator` | F | Verify "present value formula" + "present value equation" |
| 50 | Corp Finance | Future Value Calculator | `/future-value-calculator` | `future value calculator` | F | Verify "formula for future value" + "calculate future value calculator" |

---

## D. Metadata Strategy

### Title Pattern

```
[Primary Keyword or Natural Tool Name]: [Benefit/Context] | Calcumetrics
```

- Primary keyword in first segment (before the colon)
- For SUBSTITUTED MAIN tools: substituted keyword drives the title; H1 stays as natural product name
- Target: 50–70 characters
- No keyword stuffing — must read naturally

### Meta Description

- 130–160 characters
- Primary keyword in first ~50 characters where possible
- Clear user benefit communicated
- Supporting keywords included where natural
- No superlatives, no fake claims

### H1 Strategy

- Always the natural tool name ("SIP Calculator", "EOQ Calculator")
- SUBSTITUTED MAIN tools: H1 is still the product name; keyword moves to intro text and title
- One H1 per page, always in the `inputs` slot

### Duplicate Prevention

- TOOLS registry enforces unique slugs (enforced by `site.test.ts`)
- All 50 titles already unique from Phase 14
- Keyword map assigns one primary per calculator — no cross-page duplication risk

---

## E. Content Strategy

### Primary Keyword Placement (per page)

1. `<title>` — already implemented
2. `<meta description>` — already implemented
3. Intro paragraph (first 1–2 sentences) in the inputs slot — verify/improve
4. First relevant H2 or section heading in the `below` slot — verify/improve
5. WebApplication JSON-LD `name` — already implemented

### Supporting Keyword Placement

Natural locations only:
- Formula section headings and explanations
- Worked example sections
- FAQ question text
- Related tools section descriptions

Rules:
- Max 2 uses of any supporting keyword per page
- Never as H1
- Never artificially inserted — readability first

### REVIEW / LOW QUALITY Tool Rules

| Tool | Rule |
|------|------|
| Advance Tax Calculator (#28) | Only 1 genuine supporting kw: "advance income tax calculator". Use once. Do not invent others |
| Inventory Turnover (#39) | Mapped primary "inventory conversion cycle formula" does not describe this page. Use natural page intent: "inventory turnover ratio", "days sales of inventory", "DSI". Do NOT put mapped primary in title or H1 |
| Liquidity Ratios Suite (#40) | Supporting kws (current ratio formula, quick ratio formula) are the real demand. Use them naturally. Generic primary "formula for liquidity ratio" used once max if natural |

---

## F. Internal Linking Strategy

Phase 14 already implemented:
- ✅ Every calculator links to 3 related calculators
- ✅ Every calculator links to relevant blog articles
- ✅ Every blog article links to relevant calculators
- ✅ All link integrity validated by `seo.test.ts`

This plan: no new internal linking infrastructure. Will verify anchor text is descriptive (not just bare tool name) where easily improvable.

---

## G. Technical SEO Strategy

All items below are already implemented and verified. This plan verifies they remain intact after content changes.

| Item | Status | Action |
|------|--------|--------|
| Sitemap (all 50 tools) | ✅ Complete | Verify post-implementation |
| robots.txt (AI bots) | ✅ Correct | No change |
| Canonical (all 50) | ✅ Self-canonical | Verify post-implementation |
| Indexability (index,follow) | ✅ All 50 | Verify no noindex accidentally added |
| WebApplication JSON-LD | ✅ All 50 | Verify after FAQ text changes |
| BreadcrumbList | ✅ All 50 | No change |
| FAQPage JSON-LD | ✅ All 50 | Update Q&A text to include supporting kws naturally where relevant |
| Open Graph (1200x630) | ✅ Correct | No change |
| Twitter cards | ✅ Correct | No change |
| 404 noindex | ✅ Verified | No change |

---

## H. Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Breaking calculator JS while editing content | Low | Critical | Never modify `<script>` blocks. Only edit SEO constants and `below` slot HTML |
| Duplicate content across similar tools | Medium | High | Each page's content is tool-specific. Cross-check before writing |
| Accidentally adding noindex to production pages | Low | Critical | Grep robots= after each batch; run build to confirm |
| Breaking FAQPage JSON-LD | Low | Medium | Keep JSON-LD Q&A and visible FAQ in sync |
| Keyword stuffing | Medium | High | Supporting keywords used ≤2x per page, always in natural context |
| Distorting tool names in H1 | Low | Medium | H1 always stays as natural product name |
| Build failure from .astro edit | Low | High | Run `npm run build` after each batch |
| Forcing REVIEW/LQ keywords inappropriately | Medium | Medium | Per-tool explicit rules in Section E |
| Canonical conflicts /in/ vs global | Very Low | High | No slug duplication — verified in Phase 14 |

---

## I. File-Level Implementation Plan

### Files Expected to Change (all 50 .astro calculator pages)

**Batch A — Verify/minor content alignment (29 pages, FINAL status)**  
Titles already correct; verify supporting keywords appear naturally in content sections:
- `sip-calculator.astro`, `lump-sum-calculator.astro`, `compound-interest-calculator.astro`
- `simple-interest-calculator.astro`, `cagr-calculator.astro`, `xirr-calculator.astro`
- `fd-calculator.astro`, `rd-calculator.astro`, `in/ppf-calculator.astro`
- `savings-goal-calculator.astro`, `emi-calculator.astro`, `loan-prepayment-calculator.astro`
- `debt-to-income-ratio-calculator.astro`, `credit-card-payoff-calculator.astro`
- `loan-amortization-calculator.astro`, `interest-rate-calculator.astro`
- `in/income-tax-calculator.astro`, `in/gst-calculator.astro`, `in/hra-calculator.astro`
- `in/tds-calculator.astro`, `in/capital-gains-tax-calculator.astro`, `in/salary-ctc-calculator.astro`
- `profit-margin-calculator.astro`, `markup-vs-margin-calculator.astro`, `roi-calculator.astro`
- `wacc-calculator.astro`, `npv-calculator.astro`, `payback-period-calculator.astro`
- `present-value-calculator.astro`

**Batch B — Title/Description/Intro updates (SUBSTITUTED MAIN, 4 pages)**
- `in/upi-mdr-calculator.astro` — primary: `upi mdr`
- `eoq-calculator.astro` — primary: `calculate economic order quantity`  
- `working-capital-calculator.astro` — primary: `net working capital calculation`
- `cogs-calculator.astro` — primary: `cogs formula`

**Batch C — WATCH tools + remaining FINAL verification (13 pages)**
- `us/401k-calculator.astro`, `mortgage-calculator.astro`, `loan-affordability-calculator.astro`
- `inflation-calculator.astro`, `home-loan-calculator.astro`, `car-loan-calculator.astro`
- `break-even-calculator.astro`, `depreciation-calculator.astro`
- `cash-conversion-cycle-calculator.astro`, `dscr-calculator.astro`
- `irr-calculator.astro`, `dcf-calculator.astro`, `discounted-payback-period-calculator.astro`
- `future-value-calculator.astro`

**Batch D — REVIEW/LOW QUALITY tools (careful, 3 pages)**
- `in/advance-tax-calculator.astro` — 1 genuine supporting kw only
- `inventory-turnover-calculator.astro` — mapped primary does not match intent
- `liquidity-ratios-calculator.astro` — lead with current/quick ratio terms

### Files NOT Expected to Change

- `src/layouts/Layout.astro` — infrastructure is correct
- `src/components/calculator/CalculatorLayout.astro` — breadcrumbs correct
- `src/pages/sitemap-*.xml.ts` — registry-driven, no changes needed
- `public/robots.txt` — correct
- `src/config/site.ts` — tool registry correct
- All `src/lib/calculators/*.ts` — calculation logic MUST NOT change
- All `src/data/blog/*.ts` — blog posts correct
- All `*.test.ts` files — must pass unchanged

---

## J. Validation Plan

### After Every Batch

1. `npm test` — all 419 tests must pass
2. `npm run build` — all 96 pages must build clean

### Final Validation Checklist

| Check | Method | Expected |
|-------|--------|---------|
| Build | `npm run build` | 96 pages, 0 errors |
| Tests | `npm test` | 419+ tests, all pass |
| Title uniqueness | Grep `pageTitle` + `title=` across all pages | No duplicates |
| Canonical uniqueness | Grep `canonicalUrl` | No duplicates, all self-canonical |
| No production noindex | Grep `robots=` on calculator pages | All `index,follow,...` |
| H1 count | Grep `<h1` on calculator pages | Exactly 1 per page |
| Keyword in title | Audit matrix above | All FINAL/SM: primary keyword present |
| Supporting keywords in content | Manual spot-check per page | Natural, not stuffed |
| Sitemap completeness | Inspect built sitemap-tools.xml | All 50 tools present |
| Internal links | `npm test` (seo.test.ts) | All pass |
| git diff review | `git diff --stat` | Only expected .astro content files changed |

---

## Keyword Status Summary

| Status | Count | Notes |
|--------|-------|-------|
| FINAL | 43 | Use primary normally; supporting kws natural in content |
| SUBSTITUTED MAIN | 4 | UPI MDR, EOQ, Working Capital, COGS — substituted kw drives title/meta |
| WATCH | 3 | 401k, Mortgage, Loan Affordability — use carefully, low/medium volume caveats |
| REVIEW / LOW QUALITY | 3 | Advance Tax, Inventory Turnover, Liquidity Ratios — strict per-tool rules apply |
| **TOTAL** | **53 kw slots** | **50 tools** |

---

## What Changes vs. What Stays

### CHANGES
- Titles on SUBSTITUTED MAIN tools (4 pages) — to reflect keyword map primaries
- Meta descriptions on pages where primary keyword is not naturally present
- Intro paragraph text on pages where primary keyword is absent from first 2 sentences
- Section headings / formula text / FAQ questions where supporting keywords can be added naturally
- JSON-LD FAQ Q&A text where supporting keywords fit naturally

### STAYS THE SAME
- All H1s (always the natural tool name)
- All calculator JavaScript logic
- All calculation formulas
- All breadcrumb structure (schema + visible)
- All canonical URLs
- All robots directives
- All internal link targets (only anchor text may be refined)
- Sitemap, robots.txt, site.ts, test files

---
## IMPLEMENTATION STATUS — COMPLETED & VERIFIED

- **Executed on:** 2026-09-24
- **Pages Updated:** 50/50 calculator tools audited, aligned with keyword map, and formatted
- **Title Validation:** 100% compliant (50–70 characters, brand-suffixed `| Calcumetrics`, primary keyword leading)
- **Description Validation:** 100% compliant (130–160 characters, natural, keyword-optimized)
- **Schema Alignment:** JSON-LD WebApplication and FAQPage synchronized
- **Tests:** 419 passed (25 test files)
- **Production Build:** 96 pages cleanly generated in static build

