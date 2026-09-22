# Phase 11: Market-Researched Blog & Calculator Internal Linking — Progress Tracker

- **STATUS:** IN_PROGRESS
- **PHASE:** 11
- **LAST_UPDATED:** 2026-09-23T05:12:00+05:30
- **TARGET_ARTICLES:** 10
- **COMPLETED_ARTICLES:** 1
- **IN_PROGRESS:** 002. home-loan-prepayment-vs-sip
- **NEXT:** 003. old-vs-new-tax-regime
- **BLOCKER:** NONE
- **LAST_COMPLETED_ARTICLE:** cagr-vs-xirr
- **LAST_COMMIT:** 4d3e6ed
- **TEST_STATUS:** PASS (389/389 tests)
- **BUILD_STATUS:** PASS (67 pages)
- **BROWSER_QA_STATUS:** PENDING

---

## Target Articles Checklist (10 Evidenced Articles)

- [x] 001. cagr-vs-xirr — DONE (Evergreen)
- [ ] 002. home-loan-prepayment-vs-sip — IN PROGRESS (Hybrid)
- [ ] 003. old-vs-new-tax-regime — PENDING (Trending/Hybrid)
- [ ] 004. capital-gains-tax-rules — PENDING (Trending/Hybrid)
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
- **article → calculator:** In design (every article mapped to 2–4 published calculators)
- **calculator → article:** Pending article publication
- **article → article:** Mapped in cluster architecture
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

