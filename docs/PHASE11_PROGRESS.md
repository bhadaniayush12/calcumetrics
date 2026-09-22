# Phase 11: Market-Researched Blog & Calculator Internal Linking — Progress Tracker

- **STATUS:** IN_PROGRESS
- **PHASE:** 11
- **LAST_UPDATED:** 2026-09-23T05:18:00+05:30
- **TARGET_ARTICLES:** 10
- **COMPLETED_ARTICLES:** 3
- **IN_PROGRESS:** 004. capital-gains-tax-rules
- **NEXT:** 005. markup-vs-margin
- **BLOCKER:** NONE
- **LAST_COMPLETED_ARTICLE:** old-vs-new-tax-regime
- **LAST_COMMIT:** d626e07
- **TEST_STATUS:** PASS (389/389 tests)
- **BUILD_STATUS:** PASS (68 pages)
- **BROWSER_QA_STATUS:** PENDING

---

## Target Articles Checklist (10 Evidenced Articles)

- [x] 001. cagr-vs-xirr — DONE (Evergreen)
- [x] 002. home-loan-prepayment-vs-sip — DONE (Hybrid)
- [x] 003. old-vs-new-tax-regime — DONE (Trending/Hybrid)
- [ ] 004. capital-gains-tax-rules — IN PROGRESS (Trending/Hybrid)
- [ ] 005. markup-vs-margin — PENDING (Evergreen)
- [ ] 006. npv-vs-irr — PENDING (Evergreen)
- [ ] 007. flat-vs-reducing-interest-rate — PENDING (Evergreen)
- [ ] 008. cash-conversion-cycle — PENDING (Evergreen)
- [ ] 009. advance-tax-guide — PENDING (Evergreen/Statutory)
- [ ] 010. real-rate-of-return — PENDING (Evergreen)

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

