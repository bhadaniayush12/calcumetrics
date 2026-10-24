# Structure & freshness audit — branch `seo/structure-freshness`

Date: 2026-10-24. Branched from `origin/main` at b90be83. Not merged, not deployed.

Commits: step 1 `4c12582`, step 2 `ea784db`, step 3 `65382fd`, step 4 `87afaf8`, plus this report.

## Verification

- `npm run build`: 0 errors, 129 pages; `[seo-meta-limits] All indexable titles ≤ 60 and descriptions ≤ 160 chars`.
- `npm test`: 48 files, 1201 tests passed. `TZ=UTC LANG=en_US.UTF-8 npm test`: 48 files, 1201 tests passed. This includes `currency-locking-pages.test.ts`, which rebuilds the site and checks every INR lock byte for byte.
- URLs and canonicals: the only new route is `/everyday-math`. No route was removed or renamed, and every built page's canonical is unchanged. The legacy root redirects such as `/ppf-calculator.html` still point to `/in/`, as before.

---

## Step 1 — TDS, HRA and advance tax moved to tax year 2026-27 (Income-tax Act, 2025)

### Sources used (all official)

| Source | Used for |
|---|---|
| [Income-tax Act, 2025 as amended by Finance Act 2026 (PDF)](https://www.incometaxindia.gov.in/documents/d/guest/income_tax_act_2025_as_amended_by_fa_act_2026-pdf), the same file cited in `advance-tax-due-dates-calculation-example.ts` | s.202(2)(a)(i) new-regime exclusions, s.11, s.22(1)(b) |
| [Section 393 page](https://www.incometaxindia.gov.in/w/section-393-6) (text carries the Act No. 4 of 2026 footnotes) | Every TDS row: rate and threshold, s.393(1)/(3)/(4) Tables |
| [Section 392 page](https://www.incometaxindia.gov.in/w/section-392-6) | Salary; s.392(7) PF accumulated balance 10% where ₹50,000 or more |
| [Section 397 page](https://www.incometaxindia.gov.in/w/section-397-6) | s.397(2)(b): 20% (5% for Sl. 8(ii)/8(v)) without PAN |
| [Finance Act 2026, First Schedule Part II](https://www.incometaxindia.gov.in/w/first-schedule-104) | "Rates in force": interest 10%, lottery/horse race 30%, insurance commission 2% |
| [CBDT TDS rates for tax year 2026-27](https://www.incometaxindia.gov.in/w/tds-rates) | Cross-check of the table numbers |
| [Schedule III page](https://www.incometaxindia.gov.in/w/schedule-iii-6) | HRA = Table Sl. No. 11 |
| [Income-tax Rules, 2026 — rule 279](https://www.incometaxindia.gov.in/w/rule-279-1) | HRA least-of-three and the 50% city list |
| [CBDT FAQs on interplay and transition](https://www.incometaxindia.gov.in/documents/81799/11848482/Updated-FQAs-on-Interplay%26Transitions.pdf/e10ad2b6-9495-de90-58d3-20606d8954ae?t=1775128640970) (same file as the advance-tax post) | s.202 = new regime (old 115BAC); payments up to 31 March 2026 stay under the 1961 Act |

### TDS: old → new section, with rate and threshold checked against the Act

The calculator UI offers the first 7 rows. The other 9 are in the engine and data table, and were checked too.

| Old (1961) | New (2025 Act) | Rate | Threshold (TY 2026-27) | Result |
|---|---|---|---|---|
| 194J | s.393(1) Table Sl. 6(iii) | 10% (2% FTS / film royalty / call centre) | ₹50,000 | unchanged |
| 194C | s.393(1) Sl. 6(i) | 1% ind/HUF, 2% others | ₹30,000 single / ₹1,00,000 aggregate | unchanged |
| 194-I | s.393(1) Sl. 2(ii) | 10% land/building, 2% plant | ₹50,000 a month | unchanged |
| 194A | s.393(1) Sl. 5(ii) | 10% (rate in force) | ₹50,000; ₹1,00,000 senior | unchanged |
| 194H | s.393(1) Sl. 1(ii) | 2% | ₹20,000 | unchanged |
| 194 | s.393(1) Sl. 7 + s.393(4) Sl. 10(f) | 10% | no TDS up to ₹10,000 (non-cash) | unchanged |
| 194Q | s.393(1) Sl. 8(ii), Note 1(b) | 0.1% | **on the sum above ₹50 lakh** | **maths fixed** (see below) |
| 192 | s.392(1) | slab (average rate) | — | unchanged |
| 192A | s.392(7) | 10% | ₹50,000 or more | unchanged |
| 193 | s.393(1) Sl. 5(i) | 10% (rate in force) | ₹10,000 | unchanged |
| 194B | s.393(3) Sl. 1 | 30% | ₹10,000 single transaction | unchanged |
| 194BB | s.393(3) Sl. 3 | 30% | ₹10,000 single transaction | unchanged |
| 194D | s.393(1) Sl. 1(i) | 2% (FA 2026 Part II) | ₹20,000 | unchanged |
| 194LA | s.393(1) Sl. 3(iii) | 10% | ₹5,00,000 | unchanged |
| 194N | s.393(3) Sl. 5 | 2% | **₹1 crore (₹3 crore co-op)** | **threshold changed** from ₹20 lakh |
| 194-O | s.393(1) Sl. 8(v) + s.393(4) Sl. 11 | 0.1% | none for an ind/HUF participant with PAN/Aadhaar and sales up to ₹5,00,000 | unchanged |
| 206AA | s.397(2)(b) | 20% (5% for 8(ii)/8(v)) | — | text only |

Data and tests: `tds/current.json` is now `taxYear: TY 2026-27`, `governingFramework: Income-tax Act, 2025`, with official sources only (the ClearTax sources were removed) and an `act2025` reference per section. New `TDS_ACT_2025_REF` in `india.ts`. New tests: 194N ₹1 crore, 194Q excess-only, refs match JSON. The validation test now expects the 2025 framework.

Page: H1 "TDS Calculator: Tax Year 2026-27". Dropdown labels read `s.393(1) Sl. 6(iii) [old 194J] — …`. The body, FAQs and JSON-LD now use the new sections. The source line says FY 2025-26 stays under the 1961 Act. Dropdown values stay as the old keys, so shared `#` links keep working.

**Things to check (I did not guess):**

1. **Insurance commission rate conflict.** The CBDT [TDS rates page](https://www.incometaxindia.gov.in/w/tds-rates) lists **5%** for a person other than a company. The statute that sets the rate, Finance Act 2026 First Schedule Part II item 1(a)(v), says **2%**. The calculator keeps 2%, following the statute. 194D is not offered in the UI.
2. **194Q maths change.** The engine used to apply 0.1% to the whole purchase once it passed ₹50 lakh. s.393(1) Sl. 8(ii) Note 1(b) says "tax shall be deducted on the sum exceeding fifty lakh rupees", and the old 194Q said the same, so this was an existing bug. Example: ₹70 lakh → ₹2,000 (was ₹7,000).
3. **192A at exactly ₹50,000.** The Act says "₹50,000 or more", but the engine deducts only above ₹50,000. 192A is not in the UI; left unchanged.
4. **Rent (old 194-I).** The calculator models the "specified person" row (10%). Individuals/HUFs not liable to audit fall under Sl. 2(i), at 2% above ₹50,000 a month (old 194-IB). This is existing scope, unchanged.

### HRA: old → new

| Old (1961) | New |
|---|---|
| s.10(13A) | s.11 read with Schedule III, Table Sl. No. 11 |
| Rule 2A | rule 279, Income-tax Rules, 2026 |
| s.115BAC (new regime, no HRA) | s.202(2)(a)(i) excludes Schedule III Sl. 11 |
| s.24(b) / s.80C (FAQ) | s.22(1)(b) / s.123 |

**Official change found:** rule 279 gives the 50% limit to **Mumbai, Kolkata, Delhi, Chennai, Hyderabad, Pune, Ahmedabad and Bengaluru**; Rule 2A had four cities. The formula is unchanged (least of HRA received, rent − 10% of salary, 50%/40% of salary). Only the city list behind the "50%" option changed: the dropdown label, `METRO_CITIES` and the new `hra/TY-2026-27.json`. The FY 2025-26 four-city list is kept as `METRO_CITIES_FY_2025_26`. Tests were updated; Pune is no longer the non-metro example.

Page: H1 "HRA Exemption Calculator: Tax Year 2026-27", plus the body, FAQs and JSON-LD description. The page states once that FY 2025-26 stays under the 1961 Act with four cities.

Also corrected: the FY 2025-26 HRA solved-example post's FAQ "Is Bengaluru a metro city for HRA?" now adds the tax-year 2026-27 change, so it no longer contradicts the calculator.

### Advance tax

H1 changed from "FY 2026-27 / AY 2027-28" to "Tax Year 2026-27", and two body/FAQ phrases now say "tax year 2026-27". Wording only.

### Left as is (outside the brief; flagging)

- The HRA meta title still says "Section 10(13A)". The H1, body and JSON-LD changed, but titles were left alone for CTR.
- The FD/RD tax notes still cite "Section 194A" (the threshold is still correct under s.393(1) Sl. 5(ii)).
- The salary CTC page is explicitly FY 2025-26 (1961 Act). The income tax page footer still says "(FY 2026-27 / AY 2027-28)".
- The landlord-PAN ₹1,00,000 point on the HRA page comes from a 1961-era CBDT circular; I did not check it against Rules 2026.

---

## Step 2 — Internal linking

Method: `audit-reports/scripts/count-inlinks.py` parses every built page in `dist/`. Indexable means no `noindex`. A link counts if it is internal, not `nofollow`, not a self-link, and comes from an indexable page; a source counts once per target. "Contextual" excludes header, footer and nav, but counts breadcrumb trails, which are in-content navigation. With nav and footer counted, almost every page already had 117 links, so the contextual column is the meaningful one.

Changes: 44 related-guide links between closely related posts, each with its own anchor and summary (13 post files). Body-text cross-links on about, terms, privacy, disclaimer and the blog index. No footer or nav links were added. Anchor check: none of the links added in step 2 uses the same anchor more than twice per target. The remaining exact-title repeats come from links that already existed (calculator pages and the blog index), plus structural breadcrumb and "More in <hub>" anchors.

| Page | Contextual before | After step 2 | Final (after steps 3–4) | All dofollow before | Final |
|---|---:|---:|---:|---:|---:|
| `/disclaimer` | 0 | 3 | 3 | 117 | 118 |
| `/privacy-policy` | 0 | 3 | 3 | 117 | 118 |
| `/terms` | 0 | 3 | 3 | 117 | 118 |
| `/blog/dhanteras-2026-gold-vs-sip` | 1 | 3 | 4 | 1 | 4 |
| `/blog/itr-due-date-21-november-2026-late-fee-interest` | 1 | 3 | 4 | 1 | 4 |
| `/blog/jio-platforms-ipo-listing-gains-tax` | 1 | 3 | 4 | 1 | 4 |
| `/blog/mortgage-rates-7-4-percent-buy-or-wait` | 1 | 4 | 5 | 1 | 5 |
| `/blog/rbi-repo-rate-5-50-fd-returns-october-2026` | 1 | 4 | 5 | 1 | 5 |
| `/blog/section-87a-marginal-relief-new-regime-example` | 1 | 4 | 5 | 1 | 5 |
| `/blog/small-savings-rates-october-december-2026` | 1 | 3 | 4 | 1 | 4 |
| `/blog/upi-mdr-above-2000-merchant-charges` | 1 | 3 | 4 | 1 | 4 |
| `/contact` | 1 | 5 | 5 | 117 | 118 |
| `/blog/advance-tax-due-dates-calculation-example` | 2 | 4 | 5 | 2 | 5 |
| `/blog/break-even-point-solved-example-class-12` | 2 | 4 | 5 | 2 | 5 |
| `/blog/current-ratio-vs-quick-ratio` | 2 | 4 | 5 | 2 | 5 |
| `/blog/debt-avalanche-vs-snowball` | 2 | 4 | 5 | 2 | 5 |
| `/blog/debt-to-income-ratio-uk` | 2 | 4 | 5 | 2 | 5 |
| `/blog/dscr-calculation-bank-loan-example` | 2 | 4 | 5 | 2 | 5 |
| `/blog/eoq-carrying-cost-percentage-solved-example` | 2 | 4 | 5 | 2 | 5 |
| `/blog/fd-rates-after-rbi-hike-lock-now-or-wait` | 2 | 4 | 5 | 2 | 5 |
| `/blog/gst-input-tax-credit-rules` | 2 | 3 | 4 | 2 | 4 |
| `/blog/hra-exemption-least-of-three-solved-example` | 2 | 4 | 5 | 2 | 5 |
| `/blog/sbi-home-loan-rate-hike-october-2026-emi` | 2 | 4 | 5 | 2 | 5 |
| `/blog/traditional-vs-roth-401k` | 2 | 4 | 5 | 2 | 5 |
| `/blog/wdv-depreciation-numerical-with-solution` | 2 | 4 | 5 | 2 | 5 |
| `/calculators` | 2 | 4 | 4 | 117 | 118 |
| `/everyday-math` (new in step 3) | — | — | 4 | — | 118 |

Indexable pages: 118 before, 119 after. Pages under 3 contextual inlinks: 26 before, 0 after. Minimum contextual inlinks after: 3.


---

## Step 3 — Topic hubs

All six hubs render from `src/data/hubs.ts` through `src/components/HubPage.astro`. Each hub has a 150–250 word intro, grouped calculators and guides, 4 FAQs with FAQPage JSON-LD, BreadcrumbList, ItemList, CollectionPage (with `dateModified`), and a noindex rule below 4 tools. The five existing hub URLs were reused; only `/everyday-math` is new, because no existing hub fitted. Corporate Finance stays at its URL as a sub-hub, and its calculators and guides are also listed under Business & Accounting.

Links into hubs: header nav dropdown (desktop and mobile), homepage "Browse by topic" (6 cards), a "Browse by topic" strip on `/calculators`, and `sitemap-hubs.xml` (all 6 hubs; lastmod includes the hub's own update date). Links back: every calculator through its breadcrumb (`categoryHref` = hub, checked by test), and every post through a "More in <hub>" line.

Currency: the Tax (India) hub is inside `data-currency-lock="INR"`. On other hubs, `/in/` tools and India-only posts are locked one by one. Non-India hub intros and FAQs contain no ₹ (tested).

Also fixed while rewriting: `/loans` had two `<h1>` elements, and the old tax hub banner said "FY 2026-27 / AY 2027-28".

Tests: `src/data/hubs.test.ts` checks the target set, word counts, 4 FAQs and meta lengths. It also checks that every published calculator (50) and post (52) sits in at least one hub, including its category hub, and that the back-links exist.


### Loans — `/loans` (existing URL reused)

10 calculators, 12 guides.

- **EMI and loan repayment** — calculators: EMI Calculator, Home Loan Calculator, Car Loan Calculator, Loan Amortization Calculator, Loan Prepayment Calculator, Interest Rate Calculator; guides: `how-loan-amortization-works`, `flat-vs-reducing-interest-rate`, `fixed-vs-floating-rate-loans`, `home-loan-prepayment-vs-sip`, `increase-emi-or-extend-tenure-after-rate-hike`, `rbi-repo-rate-hike-emi-impact`, `sbi-home-loan-rate-hike-october-2026-emi`
- **Mortgages and borrowing limits** — calculators: Mortgage Calculator, Loan Affordability Calculator, Debt-to-Income Ratio Calculator; guides: `debt-to-income-ratio-for-mortgage`, `debt-to-income-ratio-uk`, `how-mortgage-amortization-works`, `mortgage-rates-7-4-percent-buy-or-wait`
- **Paying off debt** — calculators: Credit Card Payoff Calculator; guides: `debt-avalanche-vs-snowball`

### Investing — `/investments` (existing URL reused)

12 calculators, 11 guides.

- **SIPs and market investments** — calculators: SIP Calculator, Lump Sum Calculator, CAGR Calculator, XIRR Calculator; guides: `cagr-vs-xirr`, `rd-vs-sip`, `dhanteras-2026-gold-vs-sip`, `diwali-bonus-2026-lump-sum-sip-or-prepay`
- **Deposits and small savings** — calculators: Fixed Deposit (FD) Calculator, Recurring Deposit (RD) Calculator, PPF Calculator; guides: `fd-rates-after-rbi-hike-lock-now-or-wait`, `rbi-repo-rate-5-50-fd-returns-october-2026`, `small-savings-rates-october-december-2026`, `ppf-interest-calculation-5th-day-rule`
- **Growth, inflation and goals** — calculators: Compound Interest Calculator, Simple Interest Calculator, Inflation Calculator, Savings Goal Calculator; guides: `real-rate-of-return`, `apr-vs-apy-compounding-frequency`
- **Retirement (US)** — calculators: 401(k) Calculator; guides: `traditional-vs-roth-401k`

### Tax (India) — `/taxes` (existing URL reused)

7 calculators, 12 guides. Whole page inside `data-currency-lock="INR"`.

- **Income tax and salary** — calculators: Income Tax Calculator, Salary / CTC Calculator, HRA Calculator; guides: `old-vs-new-tax-regime`, `section-87a-marginal-relief-new-regime-example`, `new-income-tax-act-2025-salaried-guide`, `ctc-vs-in-hand-salary`, `hra-exemption-least-of-three-solved-example`, `itr-due-date-21-november-2026-late-fee-interest`
- **Advance tax and TDS** — calculators: Advance Tax Calculator, TDS Calculator; guides: `advance-tax-guide`, `advance-tax-due-dates-calculation-example`, `tds-vs-advance-tax-difference`
- **Capital gains** — calculators: Capital Gains Tax Calculator; guides: `capital-gains-tax-rules`, `jio-platforms-ipo-listing-gains-tax`
- **GST** — calculators: GST Calculator; guides: `gst-input-tax-credit-rules`

### Business & Accounting — `/business` (existing URL reused)

19 calculators, 17 guides.

- **Pricing and profitability** — calculators: Break-even Calculator, Profit Margin Calculator, Markup vs Margin Calculator, Cost of Goods Sold (COGS), ROI Calculator; guides: `how-to-calculate-break-even-point`, `break-even-point-solved-example-class-12`, `markup-vs-margin`, `cogs-vs-opex-accounting`
- **Working capital and inventory** — calculators: Working Capital Calculator, Cash Conversion Cycle Calculator, Inventory Turnover & Days (DSI), Economic Order Quantity (EOQ); guides: `cash-conversion-cycle`, `economic-order-quantity-eoq-guide`, `eoq-carrying-cost-percentage-solved-example`
- **Ratios and business credit** — calculators: Liquidity Ratios Suite, Debt Service Coverage Ratio (DSCR) Calculator; guides: `current-ratio-vs-quick-ratio`, `dscr-ratio-for-business-loans`, `dscr-calculation-bank-loan-example`
- **Depreciation** — calculators: Depreciation Calculator; guides: `straight-line-vs-reducing-balance-depreciation`, `wdv-depreciation-numerical-with-solution`
- **Payments in India** — calculators: UPI MDR Calculator; guides: `upi-mdr-above-2000-merchant-charges`
- **Corporate finance and valuation** — calculators: NPV Calculator, IRR Calculator, Payback Period Calculator, Discounted Payback Period Calculator, WACC Calculator, DCF Calculator; guides: `npv-vs-irr`, `how-to-calculate-wacc`, `dcf-valuation-terminal-value-guide`, `payback-period-vs-discounted-payback`

### Corporate Finance — `/corporate-finance` (existing URL reused)

8 calculators, 4 guides. Sub-hub of Business & Accounting.

- **Capital budgeting** — calculators: NPV Calculator, IRR Calculator, Payback Period Calculator, Discounted Payback Period Calculator; guides: `npv-vs-irr`, `payback-period-vs-discounted-payback`
- **Valuation and cost of capital** — calculators: WACC Calculator, DCF Calculator, Present Value Calculator, Future Value Calculator; guides: `how-to-calculate-wacc`, `dcf-valuation-terminal-value-guide`

### Everyday Math — `/everyday-math` (new)

10 calculators, 5 guides.

- **Interest basics** — calculators: Simple Interest Calculator, Compound Interest Calculator, Interest Rate Calculator; guides: `apr-vs-apy-compounding-frequency`, `flat-vs-reducing-interest-rate`
- **Money over time** — calculators: Inflation Calculator, Future Value Calculator, Present Value Calculator, Savings Goal Calculator; guides: `real-rate-of-return`, `cagr-vs-xirr`
- **Percentages in buying and selling** — calculators: Profit Margin Calculator, Markup vs Margin Calculator, ROI Calculator; guides: `markup-vs-margin`


---

## Step 4 — "Last reviewed" system

`src/data/page-freshness.ts` is the single source. `FreshnessNote.astro` renders "Last reviewed: <date> — <what changed>" under the breadcrumb on every calculator that has an entry (via `CalculatorLayout`) and under the H1 on `/methodology`. Each page's JSON-LD `dateModified` reads the same entry. Lines that quote ₹ are INR-locked. The tools sitemap lastmod uses the later of the registry date and the freshness date.

Dating rule: today for pages changed in this PR, which are TDS, HRA and advance tax. For every other page, the date of the last commit that changed its rates or rules. I found those commits with `git log`/`-G` on the page, data and engine files, and skipped commits that only touched titles or styling; the commit is stored with each entry. Only pages I reviewed have entries.

Removed because they contradicted the new dates: the hardcoded "Last verified: 24 Sept 2026" badges on 8 pages and "Last updated: 11 October 2026" on methodology. The "Last updated: September 2026" footers on FD and income tax now show the freshness date. Note that `IndiaTaxSourceNotice` still shows its separate "Verified <date>" for the underlying data record. That is a different date by design (data last checked vs page last reviewed).

Tests (`src/data/page-freshness.test.ts`): every `/in/*` page has an entry; entries have valid dates, one-line summaries and commits; each page reads `dateModified` from the entry with no hardcoded date left. Against the build, the visible `<time datetime>` and text equal JSON-LD `dateModified` on all 14 pages.

| Page | Last reviewed | What changed | Commit |
|---|---|---|---|
| `/in/income-tax-calculator` | 2026-10-17 | Surcharge with marginal relief added, and 4% cess now applied to tax plus surcharge. | `2cdc592` |
| `/in/gst-calculator` | 2026-10-19 | Rate guidance, invoice examples and the GST Council source link updated. | `a8c5167` |
| `/in/hra-calculator` | 2026-10-24 | Moved to tax year 2026-27: rule 279 of the Income-tax Rules, 2026 gives the 50% limit to eight cities. | `4c12582` |
| `/in/tds-calculator` | 2026-10-24 | Moved to sections 392–393 of the Income-tax Act, 2025; cash withdrawal threshold now ₹1 crore. | `4c12582` |
| `/in/advance-tax-calculator` | 2026-10-24 | Heading and text now say tax year 2026-27 under the Income-tax Act, 2025. | `4c12582` |
| `/in/capital-gains-tax-calculator` | 2026-10-17 | Section 50AA treatment now applied by acquisition date. | `e71a968` |
| `/in/salary-ctc-calculator` | 2026-10-17 | Year label set to FY 2025-26 to match the tax data the calculator uses. | `d2cf889` |
| `/in/ppf-calculator` | 2026-09-23 | 7.1% rate and ₹500–₹1,50,000 yearly deposit limits recorded with the Ministry of Finance source. | `c62c964` |
| `/in/upi-mdr-calculator` | 2026-10-19 | Answers on the deferred MDR rollout and the ₹2,000 PPI interchange rule rewritten. | `69a91a4` |
| `/fd-calculator` | 2026-10-17 | Tax note: TDS on interest applies above ₹50,000 a year (₹1,00,000 for senior citizens). | `d93ea7a` |
| `/rd-calculator` | 2026-10-17 | Tax note: TDS on interest applies above ₹50,000 a year (₹1,00,000 for senior citizens). | `d93ea7a` |
| `/home-loan-calculator` | 2026-09-23 | India tax note on principal and interest deductions added. | `70bc886` |
| `/us/401k-calculator` | 2026-10-17 | Contributions capped at the 2026 IRS elective deferral limit of $24,500. | `fd394c9` |
| `/methodology` | 2026-09-24 | Statutory tax sections revised: slabs, rebate and GST rates. | `bd1d72a` |
