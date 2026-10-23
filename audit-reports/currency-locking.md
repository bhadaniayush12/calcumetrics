# Currency locking audit

Branch: `fix/currency-locking`. Base: `c730d66005a2613cb8b44863246c8a5528704d4e` (latest fetched `origin/main`). No merge or deployment.

## Root cause and implementation

The educational-text formatter changes currency symbols and grouping without FX conversion. It had no content-level `data-currency-lock` contract and did not use the blog market metadata, so Indian statutory amounts could become dollar/euro/pound amounts. This changes the meaning of a legal threshold even though the numerical value is preserved.

Every ancestor carrying `data-currency-lock` is now excluded: direct text processing, initial indexing, cached token updates, and Header currency prefixes respect it. The value `INR` documents the factual currency; the engine treats any such attribute as a lock. Existing legacy exclusions remain supported. The fetched baseline already had legacy exclusions on methodology's GST/income-tax articles and two statutory proof rows; these now also carry the explicit contract, with additional uncovered sections protected.

India-only articles use the exact badge condition, `post.market === 'India-Only'`, on the outer article. This includes breadcrumbs, title, summary, body, tables, visible FAQs, references and related visible text. Mixed articles have explicit locks in their content plus typed FAQ/summary metadata; their outer article stays unlocked. No slug list drives runtime locking. Blog-list cards use each post's market. Related-article excerpts and source citations retain their factual text. Indian calculator cards use their existing `/in/` destination.

The entire 45-post corpus was reviewed, including content and FAQs. Every fetched post already had an explicit market; the new own-property/value assertion prevents omissions. The depreciation guide was changed from Global to Both because its FAQ cites India's Section 32 WDV rules. Foreign-only guides retain the existing Global/non-India taxonomy; no new enum value or misleading India badge was introduced for US/UK guides.

## Blog market inventory

| Post | Market |
| --- | --- |
| /blog/dhanteras-2026-gold-vs-sip | India-Only |
| /blog/itr-due-date-21-november-2026-late-fee-interest | India-Only |
| /blog/rbi-repo-rate-5-50-fd-returns-october-2026 | India-Only |
| /blog/new-income-tax-act-2025-salaried-guide | India-Only |
| /blog/diwali-bonus-2026-lump-sum-sip-or-prepay | India-Only |
| /blog/small-savings-rates-october-december-2026 | India-Only |
| /blog/sbi-home-loan-rate-hike-october-2026-emi | India-Only |
| /blog/jio-platforms-ipo-listing-gains-tax | India-Only |
| /blog/cagr-vs-xirr | Global |
| /blog/home-loan-prepayment-vs-sip | Both |
| /blog/old-vs-new-tax-regime | India-Only |
| /blog/capital-gains-tax-rules | India-Only |
| /blog/markup-vs-margin | Global |
| /blog/npv-vs-irr | Global |
| /blog/flat-vs-reducing-interest-rate | Both |
| /blog/cash-conversion-cycle | Global |
| /blog/advance-tax-guide | India-Only |
| /blog/real-rate-of-return | Both |
| /blog/ppf-interest-calculation-5th-day-rule | India-Only |
| /blog/traditional-vs-roth-401k | Global |
| /blog/apr-vs-apy-compounding-frequency | Global |
| /blog/rd-vs-sip | Both |
| /blog/debt-to-income-ratio-for-mortgage | Global |
| /blog/debt-avalanche-vs-snowball | Global |
| /blog/how-loan-amortization-works | Global |
| /blog/fixed-vs-floating-rate-loans | Both |
| /blog/ctc-vs-in-hand-salary | India-Only |
| /blog/gst-input-tax-credit-rules | India-Only |
| /blog/tds-vs-advance-tax-difference | India-Only |
| /blog/how-to-calculate-break-even-point | Global |
| /blog/economic-order-quantity-eoq-guide | Global |
| /blog/straight-line-vs-reducing-balance-depreciation | Both |
| /blog/dscr-ratio-for-business-loans | Global |
| /blog/current-ratio-vs-quick-ratio | Global |
| /blog/cogs-vs-opex-accounting | Global |
| /blog/how-to-calculate-wacc | Global |
| /blog/dcf-valuation-terminal-value-guide | Global |
| /blog/payback-period-vs-discounted-payback | Global |
| /blog/debt-to-income-ratio-uk | Global |
| /blog/how-mortgage-amortization-works | Global |
| /blog/rbi-repo-rate-hike-emi-impact | India-Only |
| /blog/increase-emi-or-extend-tenure-after-rate-hike | Both |
| /blog/mortgage-rates-7-4-percent-buy-or-wait | Global |
| /blog/fd-rates-after-rbi-hike-lock-now-or-wait | India-Only |
| /blog/upi-mdr-above-2000-merchant-charges | India-Only |

Totals: 18 India-Only, 7 Both, 20 Global.

## Mixed-post locks

| Post | Locked portions (remaining general content stays unlocked) |
| --- | --- |
| home-loan-prepayment-vs-sip | Summary; section 1 tax shields/24(b)/80C/115BAC; section 2 Indian worked comparison and post-tax table/verdict; New Regime and Indian prepayment-penalty FAQs. The cross-country tax paragraph keeps its original, explicitly US-denominated example. |
| flat-vs-reducing-interest-rate | Section 5 RBI Key Facts Statement mandate; corresponding RBI FAQ. The numerical car-loan example remains general. |
| real-rate-of-return | Section 3 Indian deposit tax/inflation matrix; Indian deposit case within section 4 (global bond case stays unlocked); section 5 Indian equity/SGB/PPF/EPF products and rates; Indian FD tax, RBI and tax-exempt-product FAQs. |
| rd-vs-sip | Section 1 structural/tax comparison; section 2 post-tax worked model; DICGC/FDIC insurance comparison and RD/SIP taxation FAQs. The original foreign insurance limit remains explicitly foreign. |
| fixed-vs-floating-rate-loans | Section 1 structural comparison including prepayment rules; section 3 regulatory prepayment protection; Indian reset and RBI penalty FAQs. |
| increase-emi-or-extend-tenure-after-rate-hike | Summary; Indian worked intro; sections 1 RBI reset rules, 2 Indian worked amounts, 6 NACH instructions, 7 Indian worked conclusion; Indian example paragraph in section 3; NACH and Indian extra-interest FAQs. General amortization/risk discussion and the US section remain unlocked. |
| straight-line-vs-reducing-balance-depreciation | The FAQ comparing shareholder accounts with statutory returns, including Indian Section 32 WDV blocks. Pure depreciation maths stays unlocked. |

All article source-citation sections and related-article excerpt sections also preserve their factual original text. On /blog, the featured card and each India-Only/Both card are locked using the existing market field. The home page's editorial previews are locked because they include the Indian tax-regime worked guide.

## Other non-jurisdiction pages and sections locked

The following inventory is taken from the built HTML and lists every root route with a rendered lock. Nested locks are represented by their outer protected section. All India-only calculator cards also receive the lock in shared hub, index and related-tool rendering, including future cards using those loops.

| Route | Protected sections/cards |
| --- | --- |
| / | Editorial blog previews, including the Indian tax-regime guide. |
| /about | Section 115BAC/87A/₹75k standard-deduction test fixture; entire Public Statutory Corrections Log (rebate thresholds, GST slabs, income-tax slabs, Indian equity LTCG/STCG). |
| /business | India UPI MDR tool card. |
| /calculators | Introduction naming Indian GST/tax regimes; India quick-access cards; all India catalog cards, including PPF 7.1% and income-tax/GST/HRA/TDS/capital-gains/advance-tax/salary/UPI facts; RBI/CBDT/CBIC explanation; Indian-numbering note. |
| /car-loan-calculator | How-to section citing RBI KFS; worked example captioned “whole rupees”; interpretation section citing KFS. |
| /cogs-calculator | Inventory valuation limitation citing Indian AS 2 / LIFO prohibition. |
| /credit-card-payoff-calculator | GST taxes/fees exclusion; shared India country-rules box (FOIR, CIBIL, 18% GST). |
| /debt-to-income-ratio-calculator | Shared India country-rules box (FOIR, CIBIL, 18% GST). |
| /depreciation-calculator | Tax-vs-book Alert; Companies Act/Income-tax Act result note; Section 32 block WDV rates; Companies Act Schedule II rule. |
| /disclaimer | Entire visible disclaimer, including Indian statutory tax provisions and limits. |
| /emi-calculator | Personal-loan “5 lakh” / “whole rupees” worked example; RBI KFS guide; FAQ section including RBI disclosure requirements. |
| /fd-calculator | Section 194A / ₹50,000 / ₹1,00,000 TDS notice; Indian banking/tax FAQ section; PPF related-tool card. |
| /future-value-calculator | Crore/lakh inflation illustration whose wording explicitly names Indian units. |
| /home-loan-calculator | RBI/EBLR fixed-rate caveat; Section 24(b)/80C deduction caveat; FAQ section containing Indian tax/prepayment rules. |
| /interest-rate-calculator | Processing-fee example with Indian GST applied to the lender's fee. |
| /inventory-turnover-calculator | FIFO/weighted-average limitation citing Indian AS 2 / LIFO prohibition. |
| /investments | PPF tool card; hub guidance on Indian PPF tax-free returns. |
| /liquidity-ratios-calculator | RBI/Tandon/Chore/MPBF 1.33x lending-norm statement. |
| /loan-affordability-calculator | Shared India country-rules box (FOIR, CIBIL, 18% GST). |
| /loan-prepayment-calculator | RBI prepayment-penalty box; Section 24(b) ₹2,00,000 tax-shield paragraph; Indian guide callout; FAQ section containing RBI rules. |
| /lump-sum-calculator | Entire worked example ending “nearest rupee”; Indian LTCG/STCG tax-exclusion caveat. |
| /markup-vs-margin-calculator | Pre-tax transaction-modeling caveat mentioning GST. |
| /methodology | Continuous statutory audit note; EMI/RBI article; GST article; income-tax/115BAC/87A article; income-tax and GST worked-proof rows; Indian bank quarterly-compounding explanation; LTCG ₹1.25 Lakh limitation; official regulatory-source section. |
| /mortgage-calculator | Indian home-loan / rupee / lakh-crore explanation and link. |
| /privacy-policy | India DPDP Act section, including grievance/response rules. |
| /rd-calculator | IBA quarterly-compounding Alert; IBA how-to paragraph; entire interpretation section including ₹5,00,000 DICGC insurance and Indian interest taxation; IBA quarterly assumption; TDS assumption; Indian RD FAQ section. |
| /savings-goal-calculator | LTCG/STCG/FD tax-drag caveat. |
| /sip-calculator | Indian AMC installment-timing explanation; Budget 2024 / 12.5% LTCG / ₹1.25 Lakh limitation; entire Indian SIP/tax FAQ section. |
| /taxes | Entire visible Indian tax hub, including ₹10,000 advance-tax trigger and income-tax/GST/HRA/TDS guidance/cards. |
| /terms | Entire visible terms, including statutory tax and government-rate terms. |
| /working-capital-calculator | Indian MPBF financing box with 25% borrower margin and 1.33× current ratio. |

The /taxes, /disclaimer and /terms visible containers are protected as a whole. Specific additional coverage includes RD's ₹5,00,000 DICGC limit and IBA compounding notes; prepayment's ₹2,00,000 Section 24(b) limit; depreciation's Section 32 WDV and Companies Act notes; the shared CountryRules India box on credit-card-payoff, debt-to-income and loan-affordability; and the working-capital MPBF/25%/1.33× lending block. Mentions of tools, founder biographies and generic jurisdiction references without monetary/statutory claims do not need additional locks.

## Notices and currency wording

Client-only notices are inserted once and use the native `hidden` property when INR is selected:

- India-only article: “Amounts are in Indian rupees (₹) because this guide covers Indian rules.”
- A general/mixed page with indexed example amounts: “Example amounts are shown in your selected currency and are not converted at exchange rates.”

The India article notice is the single notice at the top of its article. General notices are at the top of main. Repeated switches neither duplicate notices nor wrap them as currency content. Notices do not appear in SSR HTML or JSON-LD.

Attached ₹ Lakh/Crore tokens still change to neutral k/M notation on general examples. Blocks whose wording independently names rupees/lakh/crore are kept in INR: EMI's “5 lakh”/“whole rupees” example, the car-loan “whole rupees” example, future-value's crore/lakh inflation illustration, the lump-sum “nearest rupee” worked example and mortgage's India-format explanation. Their SSR wording is retained.

## DSCR and FAQ parity

DSCR's server text and actual client recalculation now describe “1.50× the operating income” needed for payments. The shortfall branch similarly uses “0.75× the amount” needed, with no currency symbol. The DSCR formula and all other calculator maths are unchanged. Tests execute the calculator's real bundled script, change inputs and dispatch INR/USD/EUR/GBP events, covering both surplus and shortfall branches.

Visible FAQ/schema differences on CAGR, simple-interest, present-value, future-value and SIP were removed by rendering the visible FAQ from the existing JSON-LD question/answer objects. The existing schema strings remain unchanged, including INR amounts. India-law FAQs on general calculators are locked. Mixed-blog FAQs use the exact original FAQ objects for visible text and schema, with locks on the jurisdiction-specific answers.

The automated parity audit covers all non-jurisdiction root pages and every blog. An additional read-only audit found three pre-existing wording differences on /in/income-tax-calculator (slab explanation, old-regime deduction comparison, cess explanation). These are outside the requested non-/in/ changes and were left untouched under the explicit /in/ preservation constraint.

## Performance

The old Header called the full-main text-node scan on every selection, then updated every token twice (once at the end of that scan, again on its currency-change event). Each pass queried the DOM and parsed token JSON again. No MutationObserver or observer feedback loop exists in this path, and the reported freeze was not reproduced in the DOM benchmark; a specific browser-freeze root cause is therefore not claimed.

The new engine indexes each mounted main/root once in a WeakMap, rejects excluded subtrees, retains its token list and parsed data, avoids unchanged text writes, and remembers the applied code. Each change performs one O(n) pass over indexed tokens. The Header's own subsequent event is an O(1) no-op, while calculator-local currency events still work. A replaced main gets a fresh index. There is no observer and no repeated wrapping/full-page walk during switches.

Longest rendered blog by visible article word count: /blog/rbi-repo-rate-hike-emi-impact, 2,088 words including article header/FAQs/references/related text. Timings use the actual old/new formatter code on rendered main HTML under happy-dom 21.0.4, Node v26.7.0; 20 warmup changes, 200 measured changes cycling USD/EUR/GBP/INR. HTML parsing is excluded; indexing is reported separately. “Unlocked” removes lock metadata from the same fixture to isolate the engine improvement. The baseline simulates both old Header passes.

| Metric | Before | After, factual locks | After, same content without locks |
| --- | ---: | ---: | ---: |
| Initial indexing | 4.7954 ms | 0.5889 ms | 3.4913 ms |
| Median currency switch | 0.8541 ms | 0.0013 ms | 0.0990 ms |
| Maximum measured switch | 4.9072 ms | 0.0143 ms | 3.9943 ms |
| Indexed tokens | 30 | 0 | 30 |

The production locked case improves the median by about 99.85%; the engine-only comparison improves it by about 88.4%. These are DOM timings, not browser rendering/paint measurements. Headless Brave stalled in this environment even with a page-load timeout; those runs were stopped and no browser timings are represented as successful measurements.

Reproduce after building: `node scripts/benchmark-currency-locking.mjs c730d66005a2613cb8b44863246c8a5528704d4e --dom`. This also writes an optional Chromium benchmark HTML file under /tmp.

## Validation and preservation

- `npm run build`: success, 121 pages, zero errors; SEO length checks pass.
- `npm test`: 46 files, 1,135 tests pass.
- Real built-route regressions: ITR retains ₹1,000 and ₹5,00,000; RBI FD retains ₹1,31,407; neither article contains a dollar sign after USD selection.
- Unit coverage: USD/EUR/GBP locks; unlocked example swapping; INR restoration; both notices show/hide; one notice only; one tree walk only; no nested spans; late-added locks; /in/, /us/, /uk/ guards.
- Corpus coverage: explicit market on every post; no Indian legal/product rules in Global content/FAQs; every India badge article locked; mixed articles partially locked; every built root-page lock unchanged; paragraph audit of Indian legal amounts; FAQ parity; live DSCR surplus/shortfall under all four currencies.
- Read-only comparison against a separately built archive of the base commit: all 133 generated HTML files have identical title, meta, canonical and JSON-LD tags. Calculator maths, jurisdiction routes, URLs and SEO data are unchanged. SSR amounts retain their original INR HTML. Intentional visible SSR copy changes are the DSCR correction, FAQ parity from existing schema and the reviewed depreciation market badge; lock attributes/section wrappers add no translated amounts. Notices are client-only.
- `git diff --check`: clean. Unrelated pre-existing untracked audit/scratch files are excluded from commits.
