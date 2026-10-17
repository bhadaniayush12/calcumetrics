# Audit round 1 — verification record

Checked 17 October 2026. Branch: `fix/audit-round-1`.

## Changes

Part A was completed, built, tested, committed and pushed before Part B began. Dividend section 194 now uses ₹10,000 and section 194LA ₹5,00,000, effective 1 April 2025. Boundary tests cover both. The requested stale TDS figures were not present in the blog contexts searched; unrelated numerical examples were preserved. Incorrect FY 2025–27 labels were corrected to FY 2025–26. The UK affordability example now uses £239,484 and 3.33 times annual income, from `calcAffordability(1400, 5, 25)`.

`public/ads.txt` contains the requested publisher line. Its built copy was checked byte-for-byte; `/ads.txt` is excluded from Functions routing and has no blocking middleware rule. No deployment or live-host validation was performed.

## Files changed

- `public/ads.txt`
- `public/_routes.json`
- `src/lib/tax/india.ts`
- `src/lib/tax/india.test.ts`
- `src/data/tax/india/tds/current.json`
- `src/data/blog/batch2.ts`
- `src/data/blog/batch3.ts`
- `src/data/blog/batch5.ts`
- `src/data/blog/posts-phase11.ts`
- `src/data/blog/posts.ts`
- `src/data/blog/posts.test.ts`
- `src/data/blog/jio-platforms-ipo-listing-gains-tax.ts`
- `public/og/articles/jio-platforms-ipo-listing-gains-tax.png`
- `src/data/blog/sbi-home-loan-rate-hike-october-2026-emi.ts`
- `public/og/articles/sbi-home-loan-rate-hike-october-2026-emi.png`
- `src/data/blog/small-savings-rates-october-december-2026.ts`
- `public/og/articles/small-savings-rates-october-december-2026.png`
- `src/data/blog/diwali-bonus-2026-lump-sum-sip-or-prepay.ts`
- `public/og/articles/diwali-bonus-2026-lump-sum-sip-or-prepay.png`
- `src/data/blog/new-income-tax-act-2025-salaried-guide.ts`
- `public/og/articles/new-income-tax-act-2025-salaried-guide.png`
- `docs/audit-round-1-verification.md`

## Posts and validation

| Slug | Body words |
| --- | ---: |
| jio-platforms-ipo-listing-gains-tax | 1239 |
| sbi-home-loan-rate-hike-october-2026-emi | 1220 |
| small-savings-rates-october-december-2026 | 1207 |
| diwali-bonus-2026-lump-sum-sip-or-prepay | 1238 |
| new-income-tax-act-2025-salaried-guide | 1278 |

All five have quick answers, FAQs, exact source links, related articles and calculators, disclaimers and OG images. SEO titles are at most 60 characters and descriptions at most 160. Registration uses the existing BLOG_POSTS collection; the index and sitemap derive from it. All five generated HTML pages, blog-index entries, sitemap entries and calculator destinations were checked in dist. No undefined or NaN calculation output was found.

Final validation: `npm run build` followed by `npm test`; 43 test files and 1,102 tests passed. `git diff --check` passed. Generated dist files are not committed.

## Source URLs used

### Part A

- [ClearTax: TDS/TCS changes from April 2025](https://cleartax.in/s/tds-and-tcs-changes-from-april-2025)

### jio-platforms-ipo-listing-gains-tax

- [Business Standard: Jio Platforms Ltd IPO: dates, price band and minimum bid lot; checked 17 October 2026](https://www.business-standard.com/markets/ipo/jio-platforms-ltd-ipo-78953)
- [Income Tax Department: FAQs on the capital gains taxation regime, questions 3–7](https://www.incometaxindia.gov.in/documents/20117/14614766/FAQs%2B-New-Capital-Gains-Taxation-regime.pdf/ad59d362-7bce-f0aa-e483-ce0f61ac13d6?t=1767816817352)
- [Income Tax Department: Income-tax Act, 2025 as amended by Finance Act, 2026; sections 196 and 198](https://www.incometaxindia.gov.in/documents/d/guest/income_tax_act_2025_as_amended_by_fa_act_2026-pdf)
- [Income Tax Department: Capital Gain: computation, holding periods and tax treatment](https://www.incometaxindia.gov.in/w/capital-gain)

### sbi-home-loan-rate-hike-october-2026-emi

- [State Bank of India: Home Loans Interest Rates (Current): starting rate effective 15 October 2026](https://sbi.bank.in/web/interest-rates/interest-rates/loan-schemes-interest-rates/home-loans-interest-rates-current)
- [Economic Times: SBI revises EBLR and RLLR, 15 October 2026](https://economictimes.indiatimes.com/wealth/borrow/higher-emis-ahead-on-sbi-loans-state-bank-of-india-revises-lending-interest-rates-check-latest-eblr-rllr-and-mclr-rates/articleshow/134959634.cms)
- [Moneycontrol: Repo hike on 7 October and prevailing SBI range reported 8 October 2026](https://www.moneycontrol.com/news/business/personal-finance/home-loan-interest-rates-check-lowest-rates-for-rs-30-lakh-75-lakh-loans-after-rbi-repo-rate-hike-14047473.html)
- [Reserve Bank of India: Reset of Floating Interest Rate on EMI-based Personal Loans, as amended](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12529)

### small-savings-rates-october-december-2026

- [Ministry of Finance / Department of Posts: 30 September 2026 memorandum, reproduced in SB Order 12/2026; PDF page 2](https://utilities.cept.gov.in/dop/pdfbind.ashx?id=15533)
- [Indian Bank: Official small-savings table for 1 October–31 December 2026](https://indianbank.bank.in/en/interest-rates-for-small-savings-schemes)
- [Economic Times: Quarterly rates table including five-year RD, 30 September 2026, updated 1 October](https://economictimes.indiatimes.com/wealth/save/has-government-increased-small-savings-scheme-ppf-scss-nsc-ssa-kvp-fd-mis-interest-rates-for-october-december-2026-quarter/articleshow/134583960.cms)
- [State Bank of India: PPF scheme: annual deposit limits, duration and interest calculation](https://sbi.bank.in/web/personal-banking/investments-deposits/govt-schemes/ppf)

### diwali-bonus-2026-lump-sum-sip-or-prepay

- [Economic Times: November 2026 holiday calendar: Diwali, Sunday 8 November](https://economictimes.indiatimes.com/wealth/bankholidays/november)
- [India Post: Official 2026 holiday list: Diwali (Deepavali), 8 November](https://www.indiapost.gov.in/holidays-list)
- [Reserve Bank of India: Reset of Floating Interest Rate on EMI-based Personal Loans: repayment options and disclosures](https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx?id=12529)

### new-income-tax-act-2025-salaried-guide

- [Income Tax Department: Income-tax Act, 2025, as amended by Finance Act, 2026: sections 1, 11, 19, 123, 124, 126, 129, 156, 202 and 392; Schedules III and XV](https://www.incometaxindia.gov.in/documents/d/guest/income_tax_act_2025_as_amended_by_fa_act_2026-pdf)
- [Income Tax Department: Updated FAQs on interplay and transitions: tax year and salary TDS transition](https://www.incometaxindia.gov.in/documents/81799/11848482/Updated-FQAs-on-Interplay%26Transitions.pdf/e10ad2b6-9495-de90-58d3-20606d8954ae?t=1775128640970)
- [Income Tax Department: Income from salary: legacy HRA and leave travel references](https://www.incometaxindia.gov.in/w/income-from-salary)
- [Income Tax Department: Deductions allowable to taxpayer: legacy salary deductions, Chapter VI-A and section 87A](https://www.incometaxindia.gov.in/w/deductions-allowable-to-tax-payer)
- [Business Standard: 2 February 2026: Budget leaves FY 2026–27 income-tax slabs unchanged](https://www.business-standard.com/finance/personal-finance/tax-slabs-fy27-unchanged-experts-on-which-tax-regime-saves-you-more-now-126020200669_1.html)

### Additional verification and implementation documentation

- [Income Tax Department: tax rates, rebate and 4% health and education cess](https://www.incometax.gov.in/iec/foportal/help/individual-business-profession)
- [Astro content collections documentation](https://docs.astro.build/en/guides/content-collections/)

## Calculation methods and limits

- Jio: `calcCapitalGains`, one 12-share lot at assumed ₹1,119 acquisition price; hypothetical sales at ₹1,000, ₹1,119, ₹1,250 and ₹1,400. IPO details were verified on Business Standard rather than a separately obtained RHP. No listing-date forecast, grey-market premium, allotment promise or application recommendation is included. Cess follows the engine; no surcharge, unused basic exemption, costs or portfolio loss offsets are modelled.
- SBI: `calcEMI`, ₹30 lakh and ₹50 lakh, 20 years, 7.25% versus 7.50%. These are starting-rate illustrations, not a universal borrower offer. Individual credit spreads, contractual reset dates and future rates cannot be established for an unspecified borrower.
- Small savings: `calcPPF(100000, 7.1, 15)` and `calcRD(5000, 6.7, 5)`. The Ministry memorandum was accessed through India Post’s official PDF host; direct NSI access was unavailable. PPF assumes a constant rate and beginning-of-year deposits. The generic quarterly-compounding RD model is labelled as an estimate, not an official Post Office maturity quotation. No unverified account limits were added.
- Diwali: `calcLumpSum`, `calcSIP`, `calcEMIAmortization` and `calcLoanPrepayment`. Investments use a common one-year horizon and nominal 12% monthly compounding; prepayment is immediately after 24 EMIs. Lifetime interest savings are not presented as one-year returns. Fees, tax effects and changing future rates are excluded explicitly.
- New Act: `calcIncomeTax(1275000)` for a resident salary-only example. Ten old/new section mappings were checked. New filing forms, filing deadlines and unusual individual tax cases were left out.

No requested core topic was omitted. No security is recommended. Existing audit-reports/ and scratch/ folders remain uncommitted. No merge, main-branch commit or deployment was performed.
