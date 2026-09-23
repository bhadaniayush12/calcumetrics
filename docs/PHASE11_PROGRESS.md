# Phase 11: Market-Researched Blog & Calculator Internal Linking — Progress Tracker

- **STATUS:** IN_PROGRESS
- **PHASE:** 11
- **LAST_UPDATED:** 2026-09-23T05:40:00+05:30
- **TARGET_ARTICLES:** 10
- **COMPLETED_ARTICLES:** 9
- **IN_PROGRESS:** 010. real-rate-of-return
- **NEXT:** FINAL_PHASE_AUDIT
- **BLOCKER:** NONE
- **LAST_COMPLETED_ARTICLE:** advance-tax-guide
- **LAST_COMMIT:** e140fdf
- **TEST_STATUS:** PASS (389/389 tests)
- **BUILD_STATUS:** PASS (74 pages)
- **BROWSER_QA_STATUS:** PENDING

---

## Target Articles Checklist (10 Evidenced Articles)

- [x] 001. cagr-vs-xirr — DONE (Evergreen)
- [x] 002. home-loan-prepayment-vs-sip — DONE (Hybrid)
- [x] 003. old-vs-new-tax-regime — DONE (Trending/Hybrid)
- [x] 004. capital-gains-tax-rules — DONE (Trending/Hybrid)
- [x] 005. markup-vs-margin — DONE (Evergreen)
- [x] 006. npv-vs-irr — DONE (Evergreen)
- [x] 007. flat-vs-reducing-interest-rate — DONE (Evergreen)
- [x] 008. cash-conversion-cycle — DONE (Evergreen)
- [x] 009. advance-tax-guide — DONE (Evergreen/Statutory)
- [ ] 010. real-rate-of-return — IN PROGRESS (Evergreen)

---

## Research Status
- **topic research:** complete (documented in `docs/PHASE11_TOPIC_RESEARCH.md`)
- **evidence-backed topics selected:**
  1. `cagr-vs-xirr`: "CAGR vs. XIRR: How to Accurately Measure Your Investment Returns"
  2. `home-loan-prepayment-vs-sip`: "Home Loan Prepayment vs. SIP: Which Builds More Wealth?"
  3. `old-vs-new-tax-regime`: "Old vs. New Tax Regime After Budget 2024: The Exact Breakeven Deduction Formula"
  4. `capital-gains-tax-rules`: "Capital Gains Tax in India (Post-Budget 2024): Rates, Holding Periods, and the Real Estate Indexation Rule"
  5. `markup-vs-margin`: "Markup vs. Margin: The Math Mistake That Silently Erases Business Profits"
  6. `npv-vs-irr`: "NPV vs. IRR: How to Resolve Conflicting Signals in Capital Budgeting"
  7. `flat-vs-reducing-interest-rate`: "Flat vs. Reducing Interest Rate: Why a 10% Flat Loan Actually Costs 18% APR"
  8. `cash-conversion-cycle`: "The Cash Conversion Cycle: How Working Capital Velocity Drives Business Solvency"
  9. `advance-tax-guide`: "Advance Tax in India: The Quarterly Calendar and How to Avoid Section 234B & 234C Penal Interest"
  10. `real-rate-of-return`: "The Real Rate of Return: Why Your 7% Fixed Deposit (FD) Might Be Losing Money"
- **rejected topics:**
  - "What is financial planning and why is it important?" (Generic AI filler, lacks specific user intent or calculator hook)
  - "Top 10 cryptos to buy in 2026" (Speculative predictions, violates C7 & §8)
  - "Why the stock market crashed yesterday" (Short-lived news without durable evergreen educational value, violates §8)
  - "How to get rich with mutual funds" (Motivational filler, lacks mathematical rigor, violates §8)
  - "RBI Repo Rate Prediction for 2027" (Unsupported forecast, violates §8 & §23)

---

## Linking Status
- **article → calculator:** All published articles mapped to 2–4 published calculators with in-body contextual links
- **calculator → article:** Reciprocal educational callouts placed on `/cagr-calculator`, `/xirr-calculator`, `/loan-prepayment-calculator`, `/home-loan-calculator`
- **article → article:** Contextual cross-links between portfolio and debt guides
- **broken links:** 0
- **orphan articles:** 0

---

## Session-Safe Audit Log

- **001. cagr-vs-xirr (/blog/cagr-vs-xirr)**:
  - Title: CAGR vs. XIRR: How to Accurately Measure Your Investment Returns
  - Intent: Compare time-weighted geometric growth (CAGR) with money-weighted cash flow timing (XIRR) for SIPs, lump-sums, and portfolios.
  - Linked Calculators: `/cagr-calculator`, `/xirr-calculator`, `/sip-calculator`, `/lump-sum-calculator`.
  - Reciprocal Linking Added: Contextual educational callouts added to `/cagr-calculator` and `/xirr-calculator` pointing directly to the guide.
  - Key Content: Mathematical formulas (geometric root vs Newton-Raphson polynomial iteration), side-by-side 3-year worked example schedule (Investor A ₹1L lump sum = 16.96% CAGR/XIRR vs Investor B staggered SIP = 25.12% XIRR), metric comparison matrix, and 3 dangerous traps (short-tenure annualization distortion, benchmark comparison errors, polynomial multiple roots).
  - FAQs: 5 structured FAQs matching schema.org FAQPage JSON-LD.
  - Verification: `npm test` PASS (389/389), `npm run build` PASS (67 pages built), `git diff --check` PASS.

- **002. home-loan-prepayment-vs-sip (/blog/home-loan-prepayment-vs-sip)**:
  - Title: Home Loan Prepayment vs. SIP: Which Builds More Wealth?
  - Intent: Solve the debt payoff vs equity investing dilemma with exact mathematical trade-offs, interest rate arbitrage, post-tax comparisons, and life-cycle liquidity risks.
  - Linked Calculators: `/loan-prepayment-calculator`, `/home-loan-calculator`, `/sip-calculator`, `/emi-calculator`.
  - Reciprocal Linking Added: Contextual educational callouts added to `/loan-prepayment-calculator` and `/home-loan-calculator`.
  - Key Content: Arbitrage spread formula (`Spread = R_equity*(1 - T_equity) - R_debt`), comprehensive 20-year ₹50 Lakh loan @ 8.5% case study with ₹10,000 extra surplus showing Path A (prepay saves ₹23.19 Lakh interest, finishes in 12.3 yrs) vs Path B (SIP creates ₹99.91 Lakh gross / +₹40-45L net wealth advantage), 4 real-world non-mathematical risks (illiquidity trap, bear market sequence risk, front-loaded amortization schedule, discipline fallacy), and the practical 5-Year Hybrid Rule.
  - FAQs: 5 structured FAQs matching schema.org FAQPage JSON-LD.
  - Verification: `npm test` PASS (389/389), `npm run build` PASS (68 pages built), `git diff --check` PASS.

- **003. old-vs-new-tax-regime (/blog/old-vs-new-tax-regime)**:
  - Title: Old vs. New Tax Regime After Budget 2024: The Exact Breakeven Deduction Formula
  - Intent: Solve the tax declaration dilemma for salaried employees with exact mathematical breakeven formulas across salary bands, taking into account the enhanced ₹75,000 standard deduction, slab revisions, and Section 80CCD(2) employer NPS optimization.
  - Linked Calculators: `/in/income-tax-calculator`, `/in/hra-calculator`, `/in/salary-ctc-calculator`.
  - Reciprocal Linking Added: Contextual educational callouts added to `/in/income-tax-calculator` and `/in/hra-calculator`.
  - Key Content: Statutory comparison of slab rates under Finance (No. 2) Act 2024, mathematical breakeven deduction formula, Master Breakeven Deduction Lookup Table by salary band (₹7.75L to ₹50L), worked case study of two ₹15 Lakh earners (Employee A standard deductions vs Employee B high metro HRA), Section 80CCD(2) employer NPS superpower, and 4-step practical decision protocol.
  - FAQs: 5 structured FAQs matching schema.org FAQPage JSON-LD.
  - Verification: `npm test` PASS (389/389), `npm run build` PASS (69 pages built), `git diff --check` PASS.

- **004. capital-gains-tax-rules (/blog/capital-gains-tax-rules)**:
  - Title: Capital Gains Tax in India (Post-Budget 2024): Rates, Holding Periods, and the Real Estate Indexation Rule
  - Intent: Demystify the historic capital gains tax restructuring enacted by the Finance (No. 2) Act 2024, the unified 12.5% LTCG regime, and the critical August 2024 grandfathering amendment for real estate indexation.
  - Linked Calculators: `/in/capital-gains-tax-calculator`, `/in/advance-tax-calculator`, `/in/tds-calculator`.
  - Reciprocal Linking Added: Contextual educational callouts added to `/in/capital-gains-tax-calculator` and `/in/advance-tax-calculator`.
  - Key Content: Two-tier holding period classification (12m listed vs 24m all other), comprehensive asset-by-asset tax rate schedule (equity, unlisted shares, gold, debt funds), worked side-by-side legacy real estate case study showing ₹3.80 Lakh tax savings using the 20% indexed grandfathering option vs 12.5% unindexed, Section 54/54EC/54F exemption pathways, and Section 234C advance tax safe harbor rules.
  - FAQs: 5 structured FAQs matching schema.org FAQPage JSON-LD.
  - Verification: `npm test` PASS (389/389), `npm run build` PASS (70 pages built), `git diff --check` PASS.

- **005. markup-vs-margin (/blog/markup-vs-margin)**:
  - Title: Markup vs. Margin: The Math Mistake That Silently Erases Business Profits
  - Intent: Explain the mathematical distinction between cost markup and sales margin, prevent inadvertent negative net operating cash flow, provide algebraic conversion derivations, and guide retail and e-commerce pricing strategy.
  - Linked Calculators: `/markup-vs-margin-calculator`, `/profit-margin-calculator`, `/break-even-calculator`, `/cogs-calculator`.
  - Reciprocal Linking Added: Contextual educational callouts added to `/markup-vs-margin-calculator` and `/profit-margin-calculator`.
  - Header Nav Flag: `SHOW_BLOG_NAV = true` enabled in `src/config/site.ts` (milestone reached: 5 live articles).
  - Key Content: The ₹1,000 product pricing illusion, algebraic proofs for `Margin = Markup / (1 + Markup)` and `Markup = Margin / (1 - Margin)`, comprehensive Quick-Reference Conversion Matrix (10% to 900% markup), worked e-commerce overhead schedule (leather boot D2C brand: 35% markup on cost triggers ₹110 net loss per order vs 45% margin creating ₹545 net profit per order), Keystone pricing conventions, and 3 bulletproof commercial pricing rules.
  - FAQs: 5 structured FAQs matching schema.org FAQPage JSON-LD.
  - Verification: `npm test` PASS (389/389), `npm run build` PASS (71 pages built), `git diff --check` PASS.

- **006. npv-vs-irr (/blog/npv-vs-irr)**:
  - Title: NPV vs. IRR: How to Resolve Conflicting Signals in Capital Budgeting
  - Intent: Resolve capital budgeting conflicts between Net Present Value and Internal Rate of Return for corporate decision-makers, detailing the fatal reinvestment rate assumption flaw in IRR and Fisher's crossover rate methodology.
  - Linked Calculators: `/npv-calculator`, `/irr-calculator`, `/wacc-calculator`, `/dcf-calculator`.
  - Reciprocal Linking Added: Contextual educational callouts added to `/npv-calculator` and `/irr-calculator`.
  - Key Content: Mathematical definitions of NPV and IRR, the reinvestment rate assumption flaw (reinvesting at IRR vs WACC), scale disparity and cash flow timing traps, worked 3-year incremental cash flow schedule determining Fisher's crossover discount rate (14.5%) and showing how Project B ($NPV_B = ₹26,371$) creates more value than Project A ($NPV_A = ₹21,638$) despite Project A's higher IRR (24.0% vs 21.2%), Descartes' Rule of Signs multiple-root hazard for non-conventional cash flows, and 4-step executive decision protocol.
  - FAQs: 5 structured FAQs matching schema.org FAQPage JSON-LD.
  - Verification: `npm test` PASS (389/389), `npm run build` PASS (72 pages built), `git diff --check` PASS.

- **007. flat-vs-reducing-interest-rate (/blog/flat-vs-reducing-interest-rate)**:
  - Title: Flat vs. Reducing Interest Rate: Why a 10% Flat Loan Actually Costs 18% APR
  - Intent: Reveal the optical illusion of flat interest rates marketed by dealerships and NBFCs, provide exact conversion mechanics to true reducing APR, and explain RBI's Key Facts Statement (KFS) mandate.
  - Linked Calculators: `/interest-rate-calculator`, `/car-loan-calculator`, `/emi-calculator`, `/loan-amortization-calculator`.
  - Reciprocal Linking Added: Contextual educational callouts added to `/interest-rate-calculator` and `/car-loan-calculator`.
  - Key Content: Mechanics of flat interest calculation and why it ignores principal amortization, reducing balance formula and declining balance charge mechanics, analytical approximation formula `Reducing Rate ≈ Flat Rate × [2n / (n + 1)]`, multi-tenure conversion matrix (6% to 15% flat across 3-year and 5-year tenures), worked ₹10,00,000 5-year car loan case study comparing Dealership 8.5% flat (₹4.25L interest, 15.84% APR, ₹23,750 EMI) against Commercial Bank 14.0% reducing (₹3.96L interest, 14.00% APR, ₹23,268 EMI), and RBI Key Facts Statement (KFS) consumer protections.
  - FAQs: 5 structured FAQs matching schema.org FAQPage JSON-LD.
  - Verification: `npm test` PASS, `npm run build` PASS, `git diff --check` PASS.

- **008. cash-conversion-cycle (/blog/cash-conversion-cycle)**:
  - Title: The Cash Conversion Cycle: How Working Capital Velocity Drives Business Solvency
  - Intent: Explain why GAAP profit does not prevent operational insolvency, detail the working capital velocity formula `CCC = DIO + DSO - DPO`, illustrate negative float models (Apple/Amazon), and offer 5 balance sheet acceleration levers.
  - Linked Calculators: `/cash-conversion-cycle-calculator`, `/working-capital-calculator`, `/inventory-turnover-calculator`, `/dscr-calculator`.
  - Reciprocal Linking Added: Contextual educational callouts added to `/cash-conversion-cycle-calculator` and `/working-capital-calculator`.
  - Key Content: The profitable insolvency paradox, comparison between the Operating Cycle ($DIO + DSO$) and Cash Conversion Cycle ($DIO + DSO - DPO$), detailed breakdown of the 3 pillars (DIO, DSO, DPO), cross-sector industry benchmarks table (Amazon -32d, Walmart +2d, Apple -71d, Auto OEM +35d, Industrial Machinery +110d, B2B SaaS +15d), Apple's negative working capital float case study (holding cash for 71 days before supplier disbursement), and 5 practical operational interventions (2/10 Net 30 trade discounts, SKU culling, automated dunning, supplier terms negotiation, and milestone billing).
  - FAQs: 5 structured FAQs matching schema.org FAQPage JSON-LD.
  - Verification: `npm test` PASS, `npm run build` PASS, `git diff --check` PASS.

- **009. advance-tax-guide (/blog/advance-tax-guide)**:
  - Title: Advance Tax in India: The Quarterly Calendar and How to Avoid Section 234B & 234C Penal Interest
  - Intent: Provide a statutory walkthrough of Section 208 thresholds, quarterly installment due dates (June 15, Sept 15, Dec 15, March 15), safe-harbor rules (12% and 36%), Section 44AD/44ADA single March 15 deadline, and Section 234C windfall relief for capital gains.
  - Linked Calculators: `/in/advance-tax-calculator`, `/in/income-tax-calculator`, `/in/capital-gains-tax-calculator`, `/in/tds-calculator`.
  - Reciprocal Linking Added: Contextual educational callouts added to `/in/advance-tax-calculator` and `/in/tds-calculator`.
  - Key Content: Section 208 liability threshold (₹10,000 net tax), statutory quarterly installment calendar table, safe-harbor calculations, mathematical distinctions between Section 234C (deferment interest) and Section 234B (year-end shortfall interest), presumptive taxation rules under Sections 44AD and 44ADA (single March 15 installment), the Section 234C proviso protecting unexpected capital gains and dividend windfalls, Section 207 senior citizen exemption, and 4-step compliance action plan.
  - FAQs: 5 structured FAQs matching schema.org FAQPage JSON-LD.
  - Verification: `npm test` PASS, `npm run build` PASS, `git diff --check` PASS.
