# CTR titles, advance-tax renumbering, income-tax FAQ parity

Branch `seo/ctr-and-consistency` from `origin/main` (5d55aa3). Not merged, not deployed. 2026-10-23.

## 1. CTR titles and meta descriptions

All 8 paths exist (`src/pages/<path>.astro`). Titles are emitted as written (the layout adds no suffix). Each new title puts the target keyword first, and each claim was checked against the page's actual inputs and outputs.

Two old claims were removed because the tools don't do them:
- **/home-loan-calculator:** the old title and description promised an "Amortization Schedule". The page has no schedule table, only an EMI / principal / interest breakdown.
- **/in/ppf-calculator:** the old description promised a "15-year growth table". The page has a composition bar and a worked example, but no table.
- **/debt-to-income-ratio-calculator:** the old description promised "front-end and back-end DTI". The tool takes a single total-debt input, so the new copy doesn't mention it.

Year policy:
- **PPF:** shows FY 2026-27. The page already says FY 2026-27 and 7.1% (last verified 24 Sept 2026).
- **TDS and HRA:** no year in the title. The TDS H1 says "FY 2025-26" and the body cites the 1961 Act. HRA uses Rule 2A (four metros) under s.10(13A) of the 1961 Act. Labelling either page "FY 2026-27" would claim something the page doesn't support yet (see open items).
- **Maths pages:** no year.

### /profit-margin-calculator

| | Old | New |
|---|---|---|
| Title | Profit Margin Calculator: Gross & Net Margins | Calcumetrics (60) | Profit Margin Calculator: Gross & Net Margin, Free (50) |
| Description | Free profit margin calculator. Calculate gross profit margin and net profit margin formula results from revenue, COGS, and operating expenses. (142) | Profit margin calculator: enter revenue, COGS and expenses to get gross margin, operating profit and net margin % instantly. Formula shown. Free. (145) |

### /in/ppf-calculator

| | Old | New |
|---|---|---|
| Title | PPF Calculator 2026: Maturity Value at 7.1% | Calcumetrics (58) | PPF Calculator FY 2026-27: Maturity Value at 7.1% (49) |
| Description | Calculate PPF maturity value at 7.1% p.a. with Section 80C EEE tax-free returns for FY 2026-27. View 15-year growth table instantly. (132) | PPF calculator and PPF maturity calculator for FY 2026-27: see maturity value and total interest at 7.1% p.a. for 15 to 30 years. Free, no sign-up. (147) |

### /in/tds-calculator

| | Old | New |
|---|---|---|
| Title | TDS Calculator India: Tax Deducted at Source | Calcumetrics (59) | TDS Calculator India: TDS & Net Payment by Section (50) |
| Description | Free TDS calculator India. Calculate TDS deduction, net payment, and statutory Section 194 thresholds under the Indian Income-tax Act instantly. (144) | TDS calculator for India: pick the TDS section, enter the payment and see TDS deducted, net payout and threshold instantly. Free, no sign-up. (141) |

### /in/hra-calculator

| | Old | New |
|---|---|---|
| Title | HRA Calculator: House Rent Allowance Exemption (46) | HRA Calculator: HRA Exemption under Section 10(13A) (51) |
| Description | Free HRA calculator India. Calculate hra deduction under Section 10(13A) — use the hra exemption calculator to compare metro and non-metro limits instantly. (156) | HRA calculator and HRA exemption calculator: enter basic, HRA and rent to see exempt and taxable HRA by the least-of-three rule. Free, instant. (143) |

### /wacc-calculator

| | Old | New |
|---|---|---|
| Title | WACC Calculator: Weighted Average Cost of Capital (49) | WACC Calculator: Weighted Average Cost of Capital (Free) (56) |
| Description | Free WACC calculator. Apply the wacc formula to calculate weighted average cost of capital from equity, debt, hurdle rates, and corporate tax shields. (150) | WACC calculator: enter equity, debt, cost of equity, cost of debt and tax rate to get weighted average cost of capital instantly. Formula and Excel shown. (154) |

### /home-loan-calculator

| | Old | New |
|---|---|---|
| Title | Home Loan Calculator: EMI & Amortization Schedule (49) | Home Loan Calculator: EMI, Interest & Down Payment (50) |
| Description | Free home loan calculator. Compute monthly home loan emi, down payment, total interest, and amortization schedule. Fast, accurate, and 100% free. (145) | Home loan calculator: enter property value, down payment, interest rate and tenure to see monthly EMI, loan amount and total interest. Free, instant. (149) |

### /debt-to-income-ratio-calculator

| | Old | New |
|---|---|---|
| Title | Debt to Income Ratio Calculator: DTI Formula | Calcumetrics (59) | Debt to Income Ratio Calculator: Free DTI Check (47) |
| Description | Free debt to income ratio calculator. Calculate debt to income ratio using the front-end and back-end DTI formula for mortgage underwriting approval. (149) | Debt to income ratio calculator: enter monthly debt payments and gross income to get your DTI % instantly, with lender benchmarks and formula. Free. (148) |

### /irr-calculator

| | Old | New |
|---|---|---|
| Title | IRR Calculator: Internal Rate of Return | Calcumetrics (54) | IRR Calculator: Internal Rate of Return, Free (45) |
| Description | Free IRR calculator — an irr solver to calculate Internal Rate of Return from cash flows. Compare against your hurdle rate for capital budgeting decisions. (155) | IRR calculator: enter an initial investment and 4 yearly cash flows to get the internal rate of return instantly and compare it with your hurdle rate. (150) |

Visible H1s are unchanged, and each one still matches its title's topic: Profit Margin Calculator · PPF Calculator · TDS Calculator: FY 2025-26 · HRA Tax Exemption Calculator · WACC Calculator · Home Loan EMI Calculator · Debt-to-Income (DTI) Calculator · IRR Calculator.

## 2. /in/advance-tax-calculator: Income-tax Act 2025 numbering

The sources are the three URLs already verified in `src/data/blog/advance-tax-due-dates-calculation-example.ts`:
- the Income-tax Act 2025 as amended by FA 2026 (PDF)
- the e-filing tax payments FAQ
- the CBDT interplay and transition FAQs

They now replace the generic incometax.gov.in link in the "Statutory source" line.

- **Intro paragraph:** gives the mapping once: s.404 (old 208), s.405 computation, s.408 (old 211), s.424 and s.425 (old 234B and 234C). It adds one sentence saying FY 2025-26 (AY 2026-27) stays under the 1961 Act.
- **Everywhere else on the page** (formula box, table header, interest cards, FAQ JSON-LD, which also renders the visible FAQ, meta description): the new numbers. Presumptive taxation now cites s.58 and s.408(2), and s.424 interest runs "from 1 April following the tax year".
- **Removed section numbers I could not verify against the 2025 Act:**
  - s.207(2), the senior-citizen exemption. The rule is still described, without a number.
  - s.192, TDS on salary.
  - the capital-gains/dividend proviso to 234C. The relief is still described, without a number.
- **Calculator script and maths:** unchanged. The diff touches only content and meta.
- **Old numbers left on purpose:** the link text of the existing blog post title "…Section 234B & 234C…". That is the post's real title.

## 3. /in/income-tax-calculator: FAQ / JSON-LD parity

The audit listed 3 wording differences. A full comparison found 5:
- the slab, old-regime and cess answers (the 3 listed)
- the 87A question, which was worded differently
- the question sets: the schema had a separate "marginal relief" question, and the visible FAQ had "switch regimes every year" instead

**Fix:** a single `FAQS` array in the page frontmatter now feeds both the visible `<details>` list and the FAQPage JSON-LD. They can't drift apart again. In the built HTML, all 6 schema Q/A pairs match the visible text exactly.

**Fact check of the visible text:**
- **Correct:** slabs, ₹75,000 standard deduction, 87A ₹60,000 rebate up to ₹12L / ₹12.75L salaried, the Chapter VI-A / 24(b) self-occupied / HRA old-regime-only answer, 4% cess on tax plus surcharge, and salaried taxpayers switching regimes every year.
- **Incorrect:** the old-regime break-even ("₹3.75–4.25 lakh"). The page's own engine (`calcIncomeTax`, with the ₹50,000 old-regime standard deduction applied) puts the break-even at about ₹5.1 lakh (₹13.5L gross) up to about ₹8 lakh (₹25L+ gross) for salaried income of ₹13–50L. The answer now says "roughly ₹5 lakh to ₹8 lakh of deductions on top of the ₹50,000 standard deduction". The old schema figure (₹4.5–5L) was also too low.

## Verification

- `npm run build`: exit 0, `[seo-meta-limits] All indexable titles ≤ 60 and descriptions ≤ 160 chars`
- `npm test`: 46 files, 1139 tests passed
- `TZ=UTC LANG=en_US.UTF-8 npm test`: 46 files, 1139 tests passed

## Open items (not changed)

- **TDS page:** the H1 and body are FY 2025-26 / 1961 Act. For FY 2026-27, TDS falls under the 2025 Act (consolidated section). The page needs a renumbering pass like the advance-tax page before "FY 2026-27" can go in its title.
- **HRA page:** cites s.10(13A) and Rule 2A. The Income-tax Rules 2026 equivalent, including whether the metro list changed, has not been verified, so the title has no year.
- **Advance-tax H1:** says "AY 2027-28". The 2025 Act uses "tax year 2026-27", and a wording update is worth considering. The 2025 Act equivalents of old s.207(2) and of the 234C capital-gains proviso still need verifying, after which their numbers can go back in.
- **JSON-LD `WebApplication.description` strings:** these differ from the new meta descriptions. That is not a policy problem, but they could be aligned later.
