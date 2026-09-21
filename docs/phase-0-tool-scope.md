# Calcumetrics — Phase 0.1 Tool Scope Audit

Date: 2026-09-22
Branch: development
Status: 50-tool target locked; individual overlap candidates remain gated by keyword/intention research before page build.

## 1. Current repository inventory

Verified directly from `src/config/site.ts`.

Current registry count: **33 published tools, 0 draft tools**.

Category breakdown:
- Investments: 10
- Loans: 4
- Taxes: 3
- Business: 11
- Corporate Finance: 5

| # | Current tool | Slug | Route | Category | Region | Page | Engine |
|---:|---|---|---|---|---|---|---|
| 1 | SIP Calculator | sip-calculator | /sip-calculator | Investments | Global | yes | sip.ts |
| 2 | Lump Sum Calculator | lump-sum-calculator | /lump-sum-calculator | Investments | Global | yes | lumpsum.ts |
| 3 | Compound Interest Calculator | compound-interest-calculator | /compound-interest-calculator | Investments | Global | yes | lumpsum.ts |
| 4 | Simple Interest Calculator | simple-interest-calculator | /simple-interest-calculator | Investments | Global | yes | simple-interest.ts |
| 5 | CAGR Calculator | cagr-calculator | /cagr-calculator | Investments | Global | yes | cagr.ts |
| 6 | XIRR Calculator | xirr-calculator | /xirr-calculator | Investments | Global | yes | xirr.ts |
| 7 | Fixed Deposit (FD) Calculator | fd-calculator | /fd-calculator | Investments | Global | yes | fd.ts |
| 8 | Recurring Deposit (RD) Calculator | rd-calculator | /rd-calculator | Investments | Global | yes | rd.ts |
| 9 | PPF Calculator | ppf-calculator | /in/ppf-calculator | Investments | IN | yes | ppf.ts |
| 10 | 401(k) Calculator | 401k-calculator | /us/401k-calculator | Investments | US | yes | 401k.ts |
| 11 | EMI Calculator | emi-calculator | /emi-calculator | Loans | Global | yes | emi.ts |
| 12 | Home Loan Calculator | home-loan-calculator | /home-loan-calculator | Loans | Global | yes | emi.ts |
| 13 | Car Loan Calculator | car-loan-calculator | /car-loan-calculator | Loans | Global | yes | emi.ts |
| 14 | Loan Prepayment Calculator | loan-prepayment-calculator | /loan-prepayment-calculator | Loans | Global | yes | prepayment.ts |
| 15 | Income Tax Calculator | income-tax-calculator | /in/income-tax-calculator | Taxes | IN | yes | income-tax.ts |
| 16 | GST Calculator | gst-calculator | /in/gst-calculator | Taxes | IN | yes | taxes.ts |
| 17 | HRA Calculator | hra-calculator | /in/hra-calculator | Taxes | IN | yes | taxes.ts |
| 18 | UPI MDR Calculator | upi-mdr-calculator | /upi-mdr-calculator | Business | IN | yes | upi-mdr.ts |
| 19 | Break-even Calculator | break-even-calculator | /break-even-calculator | Business | Global | yes | breakeven.ts |
| 20 | Profit Margin Calculator | profit-margin-calculator | /profit-margin-calculator | Business | Global | yes | business.ts |
| 21 | Markup vs Margin Calculator | markup-vs-margin-calculator | /markup-vs-margin-calculator | Business | Global | yes | business.ts |
| 22 | ROI Calculator | roi-calculator | /roi-calculator | Business | Global | yes | business.ts |
| 23 | Economic Order Quantity (EOQ) | eoq-calculator | /eoq-calculator | Business | Global | yes | eoq.ts |
| 24 | Depreciation Calculator | depreciation-calculator | /depreciation-calculator | Business | Global | yes | depreciation.ts |
| 25 | Working Capital Calculator | working-capital-calculator | /working-capital-calculator | Business | Global | yes | working-capital.ts |
| 26 | Cost of Goods Sold (COGS) | cogs-calculator | /cogs-calculator | Business | Global | yes | cogs.ts |
| 27 | Inventory Turnover & Days (DSI) | inventory-turnover-calculator | /inventory-turnover-calculator | Business | Global | yes | inventory-turnover.ts |
| 28 | Liquidity Ratios Suite | liquidity-ratios-calculator | /liquidity-ratios-calculator | Business | Global | yes | liquidity-ratios.ts |
| 29 | WACC Calculator | wacc-calculator | /wacc-calculator | Corporate Finance | Global | yes | corporate.ts |
| 30 | NPV Calculator | npv-calculator | /npv-calculator | Corporate Finance | Global | yes | corporate.ts |
| 31 | IRR Calculator | irr-calculator | /irr-calculator | Corporate Finance | Global | yes | corporate.ts |
| 32 | Payback Period Calculator | payback-period-calculator | /payback-period-calculator | Corporate Finance | Global | yes | corporate.ts |
| 33 | DCF Calculator | dcf-calculator | /dcf-calculator | Corporate Finance | Global | yes | corporate.ts |

### Immediate registry inconsistencies found
- The UPI MDR tool is region=IN but its current route is root-level `/upi-mdr-calculator`; final scope should review whether it belongs under `/in/`.
- Current Profit Margin is one combined tool. Final 50 scope calls for separate Gross Profit & Margin and Net & Operating Profit Margin tools.
- Current Break-even tool must expand to include Target Profit and Contribution Margin.
- Current Income Tax copy/engine is tied to older tax-year assumptions and must be rebuilt before production publication.

## 2. Final 50-tool launch portfolio

### Investments & Savings — 12

| # | Tool | Proposed route | Region | Current? |
|---:|---|---|---|---|
| 1 | SIP Calculator | /sip-calculator | Global | yes |
| 2 | Compound Interest Calculator | /compound-interest-calculator | Global | yes |
| 3 | Simple Interest Calculator | /simple-interest-calculator | Global | yes |
| 4 | Fixed Deposit (FD) Calculator | /fd-calculator | Global* | yes |
| 5 | Recurring Deposit (RD) Calculator | /rd-calculator | IN candidate* | yes |
| 6 | Lump Sum Calculator | /lump-sum-calculator | Global | yes |
| 7 | CAGR Calculator | /cagr-calculator | Global | yes |
| 8 | XIRR Calculator | /xirr-calculator | Global | yes |
| 9 | PPF Calculator | /in/ppf-calculator | IN | yes |
| 10 | 401(k) Calculator | /us/401k-calculator | US | yes |
| 11 | Inflation Calculator | /inflation-calculator | Global | new |
| 12 | Savings Goal Calculator | /savings-goal-calculator | Global | new |

### Loans & Borrowing — 10

| # | Tool | Proposed route | Region | Current? |
|---:|---|---|---|---|
| 13 | EMI Calculator | /emi-calculator | Global | yes |
| 14 | Home Loan Calculator | /home-loan-calculator | Global | yes |
| 15 | Car Loan Calculator | /car-loan-calculator | Global | yes |
| 16 | Loan Prepayment Calculator | /loan-prepayment-calculator | Global | yes |
| 17 | Mortgage Calculator | /mortgage-calculator | Global candidate | new |
| 18 | Loan Affordability Calculator | /loan-affordability-calculator | Global | new |
| 19 | Debt-to-Income Ratio Calculator | /debt-to-income-ratio-calculator | Global | new |
| 20 | Credit Card Payoff Calculator | /credit-card-payoff-calculator | Global | new |
| 21 | Loan Amortization Calculator | /loan-amortization-calculator | Global | new |
| 22 | Interest Rate Calculator | /interest-rate-calculator | Global | new |

### Taxes & Salary — 8

| # | Tool | Proposed route | Region | Current? |
|---:|---|---|---|---|
| 23 | Income Tax Calculator | /in/income-tax-calculator | IN | yes |
| 24 | GST Calculator | /in/gst-calculator | IN | yes |
| 25 | HRA Exemption Calculator | /in/hra-calculator | IN | yes |
| 26 | TDS Calculator | /in/tds-calculator | IN | new |
| 27 | Capital Gains Tax Calculator | /in/capital-gains-tax-calculator | IN | new |
| 28 | Advance Tax Calculator | /in/advance-tax-calculator | IN | new |
| 29 | Salary / CTC Calculator | /in/salary-ctc-calculator | IN | new |
| 30 | UPI MDR Calculator | /in/upi-mdr-calculator | IN | yes; route review |

### Business & Accounting — 12

| # | Tool | Proposed route | Region | Current? |
|---:|---|---|---|---|
| 31 | Gross Profit & Margin Calculator | /gross-profit-margin-calculator | Global | split from current profit-margin |
| 32 | Net & Operating Profit Margin Calculator | /net-operating-profit-margin-calculator | Global | split from current profit-margin |
| 33 | Markup vs Margin Calculator | /markup-vs-margin-calculator | Global | yes |
| 34 | Break-Even, Target Profit & Contribution Margin Calculator | /break-even-calculator | Global | yes; expand |
| 35 | Cost of Goods Sold (COGS) Calculator | /cogs-calculator | Global | yes |
| 36 | Working Capital & Net Working Capital Calculator | /working-capital-calculator | Global | yes; rename |
| 37 | Liquidity Ratios Suite | /liquidity-ratios-calculator | Global | yes |
| 38 | Inventory Turnover & Days Calculator | /inventory-turnover-calculator | Global | yes; rename |
| 39 | Economic Order Quantity (EOQ) Calculator | /eoq-calculator | Global | yes; rename |
| 40 | ROI Calculator | /roi-calculator | Global | yes |
| 41 | Cash Conversion Cycle Calculator | /cash-conversion-cycle-calculator | Global | new |
| 42 | Debt Service Coverage Ratio (DSCR) Calculator | /dscr-calculator | Global | new |

### Corporate Finance — 8

| # | Tool | Proposed route | Region | Current? |
|---:|---|---|---|---|
| 43 | WACC Calculator | /wacc-calculator | Global | yes |
| 44 | NPV Calculator | /npv-calculator | Global | yes |
| 45 | IRR Calculator | /irr-calculator | Global | yes |
| 46 | Payback Period Calculator | /payback-period-calculator | Global | yes |
| 47 | DCF Calculator | /dcf-calculator | Global | yes |
| 48 | Discounted Payback Period Calculator | /discounted-payback-period-calculator | Global | new |
| 49 | Present Value Calculator | /present-value-calculator | Global | new |
| 50 | Future Value Calculator | /future-value-calculator | Global | new |

## 3. Overlap analysis / publication gates

The target count is fixed at 50. Overlap does not automatically remove a tool; it determines whether two tools can coexist as separate search intents.

### Home Loan vs Mortgage
Status: **NEEDS RESEARCH**
- Home Loan can serve a general “home loan EMI/interest” intent.
- Mortgage may serve a broader secured-home-loan concept and country-specific terminology.
- Require keyword/SERP research before final route/content split.

### EMI vs Loan Amortization
Status: **NEEDS RESEARCH**
- EMI focuses on monthly payment.
- Amortization focuses on principal/interest schedule and balance over time.
- Both can coexist only if their pages have materially different primary intent.

### ROI vs CAGR
Status: **KEEP, distinct intent**
- ROI = total/absolute return framing.
- CAGR = annualized growth over a multi-year interval.
- Explain differences and link between pages.

### NPV vs Present Value
Status: **NEEDS RESEARCH**
- NPV aggregates discounted cash flows relative to an investment/initial cash flow.
- Present Value is a broader single/future cash-flow discounting concept.
- Require SERP/intent validation to avoid near-duplicate pages.

### Simple Interest vs Interest Rate
Status: **KEEP, distinct intent**
- Simple Interest asks “how much interest?”
- Interest Rate Calculator should solve for the rate from principal/interest/time/payment inputs.
- Separate formulas and input/output goals.

### FD vs Compound Interest
Status: **KEEP, distinct intent**
- FD page should focus on deposit-product workflow and compounding conventions.
- Compound Interest is generic mathematical growth.
- Copy must prevent cannibalization.

### Profit Margin split
Status: **KEEP**
- Replace current combined page with two clearly defined intents, while preserving a useful bridge between gross/operating/net margin concepts.

### Break-even scope
Status: **KEEP + EXPAND**
- One page can legitimately cover break-even, contribution margin and target profit because these are directly connected calculations in one decision workflow.

## 4. Region rules

- **Global**: formula and explanatory content are generally applicable worldwide.
- **IN**: Indian law, Indian tax, Indian payment rails, or India-only financial products.
- **US**: US-specific products/rules such as 401(k).
- Jurisdiction-specific products should use jurisdiction-prefixed routes.
- A mathematical formula being universal is not enough to make the whole tool “Global” if the product/legal context is jurisdiction-specific.
- Current UPI MDR route requires correction to `/in/upi-mdr-calculator` unless a later research decision establishes a genuinely global version.

## 5. Scope decision

### LOCK 🔒
- **Final portfolio size: 50 tools.**
- Five primary categories remain:
  - Investments
  - Loans
  - Taxes
  - Business
  - Corporate Finance
- One primary category per tool.
- Future tools follow:
  Research → Approve → Draft → Build → Test → Publish.

### HOLD / RESEARCH GATE ⚠️
The following pairs need keyword/SERP research before final page-content separation:
- Home Loan vs Mortgage
- EMI vs Loan Amortization
- NPV vs Present Value

The 50-count remains fixed; if a research gate later proves two candidates are not distinct enough to warrant separate pages, the replacement must be another researched tool of equal strategic fit rather than changing the total target.

### New-tool market research rule 🔒
- The original 21–22 tools personally audited by the founder form the validated starting set.
- Any additional tool must **not** be added randomly just to reach the 50 count.
- Every new candidate must have documented demand/intent evidence before it can move from **planned** to **draft** or **published**.
- Default demand evidence for remaining additions: **Google data** (with keyword/SERP validation when the intent is ambiguous or overlapping).
- A tool with missing demand evidence stays `status: 'planned'` and is excluded from every production surface.
- Research evidence belongs in the registry metadata so the decision is traceable.


## 6. Recommended next micro-task

**Phase 0.2 — Registry architecture only.**

Refactor the single tool registry so that future 50-tool metadata can drive:
- header
- Tools dropdown
- directory
- category hubs
- footer
- search
- sitemap
- counts
- region tags

Do not build the new calculators in Phase 0.2.
Do not change visual UI in Phase 0.2.
Do not add tax logic in Phase 0.2.
