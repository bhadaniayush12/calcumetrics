# B.Com solved-example posts: audit

Branch: `content/bcom-solved-examples` (from `origin/main` at 3c9eb3d). Not merged, not deployed.
Date: 23 October 2026. Author field: Dev. Schema: Article + FAQPage + BreadcrumbList (rendered by `src/pages/blog/[slug].astro`, verified in `dist/`).

## How numbers were produced

Every example figure is interpolated at build time from an engine call inside the post file, so the page cannot drift from the engine. Engines used:

| Engine | File |
|---|---|
| `calcIncomeTax` | `src/lib/calculators/income-tax.ts` |
| `calcDepreciation` | `src/lib/calculators/depreciation.ts` |
| `calcDSCR` | `src/lib/accounting/ratios.ts` |
| `calcBreakEven` | `src/lib/calculators/breakeven.ts` |
| `calcAdvanceTax` | `src/lib/tax/india.ts` |
| `calcSimpleInterest` | `src/lib/calculators/simple-interest.ts` |
| `calcEOQ` | `src/lib/calculators/eoq.ts` |
| `calcHRA` | `src/lib/calculators/taxes.ts` (the engine the HRA page uses) |
| `calcPPF` | `src/lib/calculators/ppf.ts` |

Labels used below: **[official]** = taken from an official page opened on 23 Oct 2026; **[engine]** = engine output; **[input]** = labelled example input chosen for the question; **[arith]** = intermediate arithmetic shown in working, checked against engine output.

Word counts: "visible" = direct answer + body + FAQs (what a reader sees); "body" = article body only. Tables are included in body text.

## Calculator paths

All 8 calculator paths exist and are published in `src/config/site.ts`: `/in/income-tax-calculator`, `/depreciation-calculator`, `/dscr-calculator`, `/break-even-calculator`, `/in/advance-tax-calculator`, `/eoq-calculator`, `/in/hra-calculator`, `/in/ppf-calculator`. No topic was skipped.

Back-links were added to the related-guides box on 7 calculator pages. `/in/income-tax-calculator` has no related-guides box, so no back-link was added there.

## Sources that failed or were rejected

- `incometaxindia.gov.in` returns HTTP 403 to plain fetches. Its pages were read through a browser-rendering fetcher instead.
- `https://www.incometaxindia.gov.in/w/section-234c` was opened but **rejected**: it shows an older text of section 234C (1.5% a month; 30%/60% for non-corporates). The current rules were taken from the Department's "Interest and fees" and "How to calculate interest under section 234C" pages instead.
- `https://www.incometaxindia.gov.in/w/depreciation` returned 404. Section 32 facts came from the "Deductions allowable" page.
- The Section 32 rate for general plant and machinery (often quoted as 15%) could not be confirmed on an opened official page, so **no tax depreciation rate is stated**.
- No official source was found for Indian bank minimum DSCR norms, so **no threshold is stated**. The DSCR post tells readers to get the figure from their lender.
- The PPF rate for Oct–Dec 2026 is not in the NSI table (it lists quarters up to Jul–Sep 2026). The post says 7.1% is the rate NSI lists for April 2025 to September 2026.
- Whether HRA exemption is available under the new regime was not stated on an opened official page. The HRA post only says availability depends on the regime and links to the regime comparison.

---

## 1. Section 87A marginal relief

- URL: https://calcumetrics.com/blog/section-87a-marginal-relief-new-regime-example
- Market: India-Only (whole article INR-locked by the template)
- Words: 1,275 visible / 1,032 body
- Year: FY 2025-26 (AY 2026-27), Income-tax Act 1961
- Sources opened:
  - https://www.incometaxindia.gov.in/w/what-is-rebate-under-section-87a-for-f.y-2025-26-and-who-can-claim-it- (₹60,000 rebate, ₹12,00,000 limit, marginal relief wording)
  - https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1 (AY 2026-27 new-regime slabs, 4% cess on tax + surcharge)
  - https://www.incometaxindia.gov.in/w/income-from-salary (₹75,000 standard deduction, section 115BAC(1A)(ii))
  - https://www.incometaxindia.gov.in/w/brief-on-budget (threshold raised 7L→12L, 25k→60k; special-rate income excluded from rebate)

| Number | Origin |
|---|---|
| ₹12,00,000 limit, ₹60,000 max rebate, slab rates, 4% cess, ₹75,000 standard deduction | [official] |
| Gross salaries ₹12,75,000 / ₹12,90,000 / ₹13,20,000 / ₹13,50,000 | [input] |
| Ex 1: total income ₹12,15,000; slab tax ₹62,250; excess ₹15,000; rebate ₹47,250; tax ₹15,000; cess ₹600; total ₹15,600 | [engine] `calcIncomeTax(1290000).newRegime` |
| Ex 1 slab parts ₹20,000 / ₹40,000 / ₹2,250 | [arith] sums to engine `baseTax` |
| Ex 1 "without relief" ₹64,740 | [arith] engine `baseTax` × 1.04 |
| Ex 2: total income ₹12,75,000; slab tax ₹71,250; excess ₹75,000; rebate ₹0; cess ₹2,850; total ₹74,100 | [engine] `calcIncomeTax(1350000).newRegime` |
| Table rows for the four salaries (incl. ₹12,75,000 → ₹0 tax) | [engine] |
| Relief end point ≈ ₹12,70,588 total income / ₹13,45,588 salary | [arith] 60,000 + 0.15y = y; engine returns rebate ₹0 at both ₹13,45,588 and ₹13,45,589 |

## 2. WDV depreciation numerical

- URL: https://calcumetrics.com/blog/wdv-depreciation-numerical-with-solution
- Market: Both. The Section 32 section and the tax FAQ are in `data-currency-lock="INR"`; the general maths is neutral.
- Words: 1,197 visible / 981 body
- Sources opened: https://www.incometaxindia.gov.in/w/deductions-allowable-to-tax-payer (s.32(1)(ii) WDV per block; 50% where used < 180 days)

| Number | Origin |
|---|---|
| 10% WDV rate, cost ₹2,00,000 / ₹3,00,000, sale ₹75,000 on 30 Sept Year 3, one-third sold | [input] |
| Ex 1 schedule: 20,000 / 18,000 / 16,200; closing 1,80,000 / 1,62,000 / 1,45,800; total 54,200 | [engine] `calcDepreciation(200000, 200000×0.9³, 3, 'WDV')`. The residual is set so the engine's derived rate is exactly 10% |
| Ex 2 part sold: 10,000 / 9,000; WDV ₹81,000 | [engine] `calcDepreciation(100000, 81000, 2, 'WDV')` |
| Ex 2 six-month charge ₹4,050; book value ₹76,950 | [engine] `calcDepreciation(81000, 81000×0.95, 1, 'WDV')` (10% × 6/12 = 5%) |
| Loss on sale ₹1,950 | [arith] engine book value − sale price |
| Year 3 total depreciation ₹20,250 | [arith] engine 4,050 + engine 16,200 |
| SLM comparison 20,000 a year, total 60,000, closing 1,40,000 | [engine] `calcDepreciation(200000, 140000, 3, 'SLM')` |
| 180 days / 50% | [official] |

## 3. DSCR for a bank loan

- URL: https://calcumetrics.com/blog/dscr-calculation-bank-loan-example
- Market: Both. The "Indian bank project report" section and the Indian-minimum FAQ are INR-locked. No bank thresholds are stated.
- Words: 1,212 visible / 999 body
- Sources: no legal facts are used. Sources list cites the DSCR calculator engine and the /methodology page.

| Number | Origin |
|---|---|
| Ex 1 PAT 6,00,000; depreciation 2,00,000; interest 4,00,000; principal 6,00,000 | [input] |
| Ex 1 available 12,00,000; debt service 10,00,000; DSCR 1.20 | [engine] `calcDSCR(1200000, 1000000)` |
| Ex 2 loan 50,00,000; 10% on opening balance; 5 × 10,00,000 principal; depreciation 3,00,000; PAT 6/8/10/11/12 lakh | [input] |
| Interest 5,00,000 / 4,00,000 / 3,00,000 / 2,00,000 / 1,00,000 | [arith] 10% × opening balance |
| Available 14 / 15 / 16 / 16 / 16 lakh; debt service 15 / 14 / 13 / 12 / 11 lakh | [arith] |
| Yearly DSCR 0.93 / 1.07 / 1.23 / 1.33 / 1.45 | [engine] `calcDSCR` per year |
| Average DSCR 1.18 (77,00,000 ÷ 65,00,000) | [engine] `calcDSCR(7700000, 6500000)` |
| Moratorium what-if DSCR 2.80 | [engine] `calcDSCR(1400000, 500000)` |

## 4. Break-even point solved example

- URL: https://calcumetrics.com/blog/break-even-point-solved-example-class-12
- Market: Global. Amounts are in `$` (swapped by the site's currency display); no ₹, lakh, crore or rupee wording; no India-rule terms.
- Words: 1,145 visible / 988 body
- Sources: no legal facts. Cites the break-even calculator engine and /methodology.

| Number | Origin |
|---|---|
| Price $50, variable $30, fixed $100,000, target profit $40,000, 10% price cut, budget 8,000 units | [input] |
| Contribution $20; P/V 40%; BEP 5,000 units / $250,000 | [engine] `calcBreakEven(100000, 50, 30)` |
| Target profit 7,000 units / $350,000 | [engine] `calcBreakEven(140000, 50, 30)` |
| New price $45; contribution $15; P/V 33.33%; BEP 6,666.67 → 6,667 units; $300,000 | [engine] `calcBreakEven(100000, 45, 30)` (rounded up for units) |
| Budget sales $360,000; margin of safety $60,000 (16.67%) | [arith] on engine output |
| Sensitivity table at $50 / $45 / $40 | [engine] |

## 5. Advance tax due dates and calculation

- URL: https://calcumetrics.com/blog/advance-tax-due-dates-calculation-example
- Market: India-Only
- Words: 1,249 visible / 1,030 body
- Year: FY 2025-26 under the 1961 Act. The post says the Income-tax Act 2025 applies from 1 April 2026 and that the corresponding provisions were not checked.
- Sources opened:
  - https://www.incometaxindia.gov.in/w/who-is-liable-to-pay-advance-tax- (s.208, ₹10,000 or more after TDS; salary-only exemption)
  - https://www.incometaxindia.gov.in/w/interest-and-fees (15/45/75/100%; 44AD/44ADA by 15 March; 12%/36% thresholds; assessed-tax meaning; 234B 1%/90%; rounding to ₹100 / ₹10)
  - https://www.incometaxindia.gov.in/w/how-to-calculate-interest-under-section-234c- (3 months / 1 month; base 15/45/75/100%)

| Number | Origin |
|---|---|
| Due dates, percentages, ₹10,000, 12%/36%, 1% a month, periods, rounding | [official] |
| Liability ₹1,20,000; payments nil / 54,000 / 80,000 / 1,20,000 | [input] |
| Cumulative 18,000 / 54,000 / 90,000 / 1,20,000; instalments 18,000 / 36,000 / 36,000 / 30,000 | [engine] `calcAdvanceTax(120000)` |
| 12% and 36% thresholds ₹14,400 / ₹43,200 | [arith] |
| June interest ₹540; December interest ₹300 | [engine] `calcSimpleInterest(18000, 12, 3/12)`, `calcSimpleInterest(10000, 12, 3/12)` |
| Total 234C interest ₹840 | [arith] sum of engine outputs |

Engine note: `calcAdvanceTax` sets `required` when liability is **> ₹10,000**, while the official FAQ says **₹10,000 or more**. The example (₹1,20,000) is unaffected, but the engine is wrong at exactly ₹10,000. Not fixed (out of scope).

## 6. EOQ with carrying cost percentage

- URL: https://calcumetrics.com/blog/eoq-carrying-cost-percentage-solved-example
- Market: Global (`$` amounts, no INR wording)
- Words: 1,166 visible / 955 body
- Sources: no legal facts. Cites the EOQ calculator engine and /methodology.

| Number | Origin |
|---|---|
| Ex 1 demand 20,000; order cost $250; price $50; 20% | [input] |
| C = $10 | [arith] price × % |
| EOQ 1,000; 20 orders; 18.25 days; ordering $5,000; carrying $5,000; total $10,000 | [engine] `calcEOQ(20000, 250, 10)` |
| Ex 2 demand 14,400; order cost $150; price $80; 15% | [input] |
| C = $12 | [arith] |
| EOQ 600; 24 orders; 15.21 days; $3,600 + $3,600 = $7,200 | [engine] `calcEOQ(14400, 150, 12)` |

## 7. HRA exemption: least of three

- URL: https://calcumetrics.com/blog/hra-exemption-least-of-three-solved-example
- Market: India-Only
- Words: 1,156 visible / 946 body
- Year: FY 2025-26, s.10(13A) read with Rule 2A, 1961 Act. The post notes that from tax year 2026-27 the 2025 Act applies.
- Sources opened: https://www.incometaxindia.gov.in/w/income-from-salary (three limits; four cities; salary = basic + DA if retirement benefit + turnover commission; own-house note; landlord PAN above ₹1,00,000)

| Number | Origin |
|---|---|
| 40% / 50%, 10% of salary, four cities, ₹1,00,000 PAN note | [official] |
| Ex 1 basic 40,000; DA 10,000 (retirement); HRA 18,000; rent 22,000 a month; Bengaluru | [input] |
| Salary ₹6,00,000; rent ₹2,64,000; 10% ₹60,000 | [arith] |
| Limits 2,16,000 / 2,04,000 / 2,40,000; exempt 2,04,000; taxable 12,000 | [engine] `calcHRA(600000, 216000, 264000, false)` |
| What-if rent 25,000 a month: limit 2 = 2,40,000; exempt 2,16,000; taxable 0 | [engine] `calcHRA(600000, 216000, 300000, false)` |
| Ex 2 basic 50,000; DA 5,000 (not retirement); HRA 30,000; rent 25,000; Mumbai | [input] |
| Limits 3,60,000 / 2,40,000 / 3,00,000; exempt 2,40,000; taxable 1,20,000 | [engine] `calcHRA(600000, 360000, 300000, true)` |

## 8. PPF interest: deposit before the 5th

- URL: https://calcumetrics.com/blog/ppf-interest-before-5th-rule-example
- Market: India-Only
- Words: 1,268 visible / 1,003 body
- Sources opened:
  - https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=169 (PPF Scheme 2019 para 7: 7.1% from 1 April 2020; lowest balance from close of 5th to month end; credited at end of each year)
  - https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=55 (₹500 min, ₹1,50,000 max per FY). The site's TLS chain is incomplete; the page was fetched with certificate verification off.
  - https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=132 (PPF 7.1% for each listed quarter, Apr 2025 to Sep 2026)
  - Also read: https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=79 (PPF Scheme 1968 text with the same 5th-day rule). Not cited.

| Number | Origin |
|---|---|
| 7.1%, 5th-day rule, year-end credit, ₹500 / ₹1,50,000 | [official] |
| ₹1,50,000 on 4 vs 6 April; ₹12,500 a month | [input] |
| Year-1 interest ₹10,650.00 (on time) | [engine] `calcPPF(150000, 7.1, 1)` |
| Year-1 interest ₹9,762.50 (late) | [engine] `calcPPF(150000, 7.1×11/12, 1)`. Valid only for one deposit in one year; explained in a code comment |
| Difference ₹887.50 | [arith] |
| 15-year maturity ₹40,68,209 on ₹22,50,000 (on time) | [engine] `calcPPF(150000, 7.1, 15)` |
| 15-year maturity ₹40,45,735 (late every year) | [engine] `calcPPF(150000×(1 − (0.071/12)/1.071), 7.1, 15)`. This equivalent-deposit form matches a direct year-by-year recurrence to within ₹0.01 (checked in scratch) |
| Gap ₹22,474 | [arith] difference of rounded engine maturities |
| Monthly: per-deposit interest; totals ₹5,768.75 / ₹4,881.25; difference ₹887.50 | [engine] `calcSimpleInterest(12500, 7.1, months/12)` per month, summed |

---

## Other changes

- `src/data/blog/solved-example-markup.ts`: shared Tailwind markup (h2, formula block, solved-example box, table) for the series.
- `src/data/blog/posts.test.ts`: post count 45 → 53; market counts Global 20→22, India-Only 18→22, Both 7→9.
- `public/og/articles/<slug>.png` generated for the 8 posts with `scripts/generate-og-images.ts`. The script also re-rendered every existing card with byte differences; those were reverted, so only the 8 new PNGs are added.
- Blog index and `sitemap-pages.xml` pick up the posts automatically from `BLOG_POSTS` (verified in `dist/`).

## Overlap with existing posts

Several topics sit next to existing guides: `ppf-interest-calculation-5th-day-rule`, `how-to-calculate-break-even-point`, `economic-order-quantity-eoq-guide`, `dscr-ratio-for-business-loans`, `advance-tax-guide`, `straight-line-vs-reducing-balance-depreciation`. The new posts target the "solved example / numerical" query and link to the older guide both ways. The PPF pair is the closest match, so it is the one most likely to compete in search.

## Verification

- `npm test`: 46 files, 1,136 tests passed.
- `TZ=UTC LANG=en_US.UTF-8 npm test`: 46 files, 1,136 tests passed.
- `npm run build`: completed with no errors. The `seo-meta-limits` integration reports all titles ≤ 60 and descriptions ≤ 160.
- Rendered pages checked in `dist/blog/*.html`: key figures present, no `NaN`/`undefined`/`Infinity`, three schema types present, INR lock sections present on Both posts.
