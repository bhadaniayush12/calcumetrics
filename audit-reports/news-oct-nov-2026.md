# October–November 2026 news content audit

Checked: 23 October 2026. Branch: `content/news-oct-nov-2026`, created from local `main` at `34253fb`. Updated per review: remove the incomplete issue roundup, compare equal investment budgets, rebase onto GitHub main and push the branch only. No merge or deployment is authorised. Existing untracked `audit-reports/` and `scratch/` material was left untouched; only this report and the requested Fed draft are staged from those directories.

## Delivery status

Three articles remain in the blog index and generated sitemap, with author Dev, the existing Tailwind classes and shared Article + FAQPage + BreadcrumbList schema. Each has a direct answer, calculator links, a worked example, linked sources, four FAQs and a literal last-updated line. No shared page layout or calculator formula was changed. The incomplete issue roundup and its OpenGraph image have been removed with `git rm`.

The Dhanteras comparison now uses exactly ₹50,000 for each option and a common endpoint five years from today. The SIP contributes evenly over the first twelve months only, then remains invested for four further years. Both options use monthly compounding with the same nominal rate input. Pending cash earns nothing; outputs exclude costs and tax.

The source rule is applied to factual claims. User-specified example amounts, explicitly hypothetical inputs, arithmetic outputs and editorial metadata are separately identified below; they are not falsely attributed to an official announcement. The Dhanteras date uses the user’s explicit panchang-source exception. Income Tax Department statutory text is hosted on its official `incometaxindia.gov.in` portal, alongside circulars, FAQs and validation documents on `incometax.gov.in`; this domain distinction is disclosed rather than treating the statutory portal as an e-filing URL.

## Verification

- Final build and test results: pending verification after the requested rebase.
- Rendered-output audit: PASS for all three articles. Parsed JSON-LD includes Article, FAQPage with four entries and BreadcrumbList; Article author is Dev. All three URLs appear in the built blog index and `sitemap-pages.xml`. Related calculators and posts are present in rendered HTML. Each title and SEO title is at most 60 characters, each description at most 155 characters, and each article has three to five calculators and one to two related posts.
- Word counts below count rendered HTML text with tags removed and whitespace split. “Body” includes table text and the last-updated line. “Article” adds the direct answer and FAQ questions/answers, excluding shared navigation, author box, sources and related-link cards. Both counts meet the requested range.
- Calculations are imported directly from the same engine modules used by the calculators; no copied finance formula or manually computed result is embedded in article prose.
- UK tax/budget calculator: **No.** Checked the published tool registry, page routes and calculator modules. Currency support and a general country-rules component mention the UK, but there is no UK tax or budget calculator.
- Fed draft: `audit-reports/drafts/fed-october-2026-mortgage-payment.md`. Prepared only, excluded from BLOG_POSTS and sitemap. `[FED RATE AFTER 28 OCT]` and all mortgage quote/payment outputs remain placeholders. The existing `calcAmortization` engine is wired in a non-invoked code example. The Fed policy range is kept separate from mortgage-rate inputs.

## Shared numerical provenance

- `23 October 2026` / `2026-10-23`: editorial creation/verification date from the session date, used for publication and last-updated metadata; not an externally announced statistic.
- `7 min read`: editorial reading-time label matching existing post metadata, not a sourced market fact.
- FAQ counts, title lengths, word counts, test totals, build page totals and commit identifiers in this report are measured repository/build metadata.
- Numbers inside URLs, document titles, section labels and calculator source paths are identifiers, with their linked document as provenance.

## 1. rbi-repo-rate-5-50-fd-returns-october-2026

URL: [https://calcumetrics.com/blog/rbi-repo-rate-5-50-fd-returns-october-2026](https://calcumetrics.com/blog/rbi-repo-rate-5-50-fd-returns-october-2026)

Words: **982 body / 1125 article**. Title: 52 characters. Meta description: 142 characters. Local commit: `f5cf56e`.

Sources opened and linked:

- [Reserve Bank of India: Governor’s statement, 7 October 2026; policy decision](https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63744)
- [Reserve Bank of India: Deposit directions FAQ: reinvestment and premature withdrawal](https://www.rbi.org.in/commonman/Upload/English/FAQs/PDFs/FAQIRD01042025.pdf)

Calculators linked:

- [FD Calculator](/fd-calculator)
- [Compound Interest Calculator](/compound-interest-calculator)
- [CAGR Calculator](/cagr-calculator)
- [Income Tax Calculator](/in/income-tax-calculator)

Related posts:

- [SBI home-loan EMI guide](/blog/sbi-home-loan-rate-hike-october-2026-emi)
- [Diwali bonus planning](/blog/diwali-bonus-2026-lump-sum-sip-or-prepay)

Numerical provenance:

- **Official facts:** repo **5.50%**, increase **25 basis points**, announcement **7 October 2026**: RBI Governor’s statement linked above. No bank FD rate is asserted.
- **Example inputs:** **₹1 lakh / ₹1,00,000**, **₹5 lakh / ₹5,00,000** and **1, 3, 5 years**: requested by the user, explicitly examples. **5.25% and 5.50%**: explicitly assumed FD inputs mirroring the policy levels, not observed deposit offers. Quarterly compounding is a model assumption. The second RBI source supports reinvestment at the contracted rate and bank premature-withdrawal policies, not a numerical FD offer.
- **Outputs:** every rupee in the following table comes from `calcFD(principal, rate, years, 'quarterly')`. Extra maturity uses the existing `calcCAGR(before.maturity, after.maturity, years).absoluteReturn` engine output to avoid duplicating a finance computation. Display rounding only.

| Example principal | Years | At assumed 5.25% | At assumed 5.50% | Extra maturity |
| --- | --- | --- | --- | --- |
| ₹100,000 | 1 | ₹105,354 | ₹105,614 | ₹260 |
| ₹100,000 | 3 | ₹116,938 | ₹117,807 | ₹869 |
| ₹100,000 | 5 | ₹129,796 | ₹131,407 | ₹1,611 |
| ₹500,000 | 1 | ₹526,771 | ₹528,072 | ₹1,301 |
| ₹500,000 | 3 | ₹584,691 | ₹589,034 | ₹4,343 |
| ₹500,000 | 5 | ₹648,979 | ₹657,033 | ₹8,054 |

Rendered numerical token inventory (repeated tokens deduplicated; trailing punctuation retained by extraction):

`5.50%`, `7`, `2026,`, `2026`, `25`, `₹1`, `₹5`, `1,`, `3`, `5`, `5.25%`, `₹1,00,000`, `1`, `₹1,05,354`, `₹1,05,614`, `₹260`, `₹1,16,938`, `₹1,17,807`, `₹869`, `₹1,29,796`, `₹1,31,407`, `₹1,611`, `₹5,00,000`, `₹5,26,771`, `₹5,28,072`, `₹1,301`, `₹5,84,691`, `₹5,89,034`, `₹4,343`, `₹6,48,979`, `₹6,57,033`, `₹8,054`, `23`.

## 2. itr-due-date-21-november-2026-late-fee-interest

URL: [https://calcumetrics.com/blog/itr-due-date-21-november-2026-late-fee-interest](https://calcumetrics.com/blog/itr-due-date-21-november-2026-late-fee-interest)

Words: **977 body / 1134 article**. Title: 58 characters. Meta description: 151 characters. Local commit: `580bf50`.

Sources opened and linked:

- [CBDT: Circular 7/2026, 28 September 2026: extension and covered category](https://www.incometax.gov.in/iec/foportal/sites/default/files/2026-09/Circular-7-2026.pdf)
- [Income Tax Department: AY 2026–27 filing and late-fee FAQs](https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/%20income%20tax%20returns-faq)
- [Income Tax Department: Section 234A: rate, period and tax-base reductions](https://www.incometaxindia.gov.in/w/section-234a-36)

Calculators linked:

- [Simple Interest Calculator](/simple-interest-calculator)
- [Income Tax Calculator](/in/income-tax-calculator)
- [Advance Tax Calculator](/in/advance-tax-calculator)

Related posts:

- [Income-tax Act transition guide](/blog/new-income-tax-act-2025-salaried-guide)

Numerical provenance:

- **Official extension:** **Circular 7/2026**, dated **28 September 2026**, **AY 2026–27**, the covered category in **section 139(1)**, ITR deadline **31 October → 21 November 2026**, audit-report deadline **30 September → 21 October 2026**: opened CBDT circular linked above.
- **Official fee:** **section 234F**, **₹1,000** where total income does not exceed **₹5,00,000**, otherwise **₹5,000**: opened Department return FAQs. Fee is presented subject to the return-filing obligation, not as a function of unpaid tax.
- **Official interest:** **section 234A**, **1% per month or part** and prescribed base reductions: opened Department statutory section linked above.
- **Hypothetical inputs:** **₹50,000** unchanged unpaid base, **1 or 2 chargeable months**, income above the fee threshold: explicitly selected Example assumptions. **12% nominal annual equivalent** and **months / 12** are unit conversions for the existing annual simple-interest engine, not separate statutory rates or calendar-day approximations.
- **Outputs:** **₹500** and **₹1,000** interest from `calcSimpleInterest(50000, 12, months / 12).interest`. The **₹5,000** fee shown alongside is sourced law, not a new calculation. No combined fee-plus-interest total is hand-calculated. The site has no dedicated legal late-filing calculator, which the article expressly states.

Rendered numerical token inventory (repeated tokens deduplicated; trailing punctuation retained by extraction):

`21`, `2026`, `2026–27`, `234F`, `234A`, `28`, `31`, `139`, `1`, `30`, `₹1,000`, `₹5,00,000,`, `₹5,000`, `1%`, `₹50,000`, `2`, `12%`, `12`, `₹500`, `23`.

## 3. dhanteras-2026-gold-vs-sip

URL: [https://calcumetrics.com/blog/dhanteras-2026-gold-vs-sip](https://calcumetrics.com/blog/dhanteras-2026-gold-vs-sip)

Words: pending recount after correction. Title: 56 characters. Meta description: 148 characters. Local commit: `1db5323`.

Sources opened and linked:

- [MyPanchang: Dhanteras date for the Indian location displayed; timings vary by city](https://www.mypanchang.com/newsite/dhanteras.php)
- [SEBI: Mutual fund investor guidance: risk and non-guaranteed returns](https://investor.sebi.gov.in/pdf/reference-material/MFunds.pdf)

Calculators linked:

- [Lump Sum Calculator](/lump-sum-calculator)
- [SIP Calculator](/sip-calculator)
- [CAGR Calculator](/cagr-calculator)
- [XIRR Calculator](/xirr-calculator)

Related posts:

- [Diwali bonus guide](/blog/diwali-bonus-2026-lump-sum-sip-or-prepay)

Numerical provenance:

- **Festival date:** **6 November 2026** from the opened MyPanchang page for its displayed Indian location. No local puja time is quoted, and the article explains that local timings vary.
- **Hypothetical inputs:** **₹50,000** for both options and a **5-year** endpoint; the SIP spreads that exact budget over **12** beginning-of-month contributions, then remains invested for **4** further years with no new contributions. **₹4,167/month** is rounded for display only; the engine receives **50000 / 12**, approximately **₹4,166.67**, without rounding each contribution. **0%, 5%, 10%** are assumed nominal annual rates with monthly compounding for both options. They are not forecasts or historical/product-return claims.
- **Outputs:** `calcSIP(50000 / 12, rate, 1).invested` confirms exactly **₹50,000** contributed. Its first-year maturity is carried through `calcLumpSum(firstYear.maturity, rate, 4, 'monthly')`. The immediate lump sum is `calcLumpSum(50000, rate, 5, 'monthly')`. `calcCAGR(50000, lump.maturity, 5)` gives effective lump-sum CAGRs of **0.00%, 5.12%, 10.47%**, rounded for display; this is not a SIP cash-flow return. SEBI supports the risk discussion, not the hypothetical rates.

| Assumed rate | Lump-sum maturity | SIP maturity | Lump-sum CAGR |
| --- | --- | --- | --- |
| 0% | ₹50,000 | ₹50,000 | 0.00% |
| 5% | ₹64,168 | ₹62,724 | 5.12% |
| 10% | ₹82,265 | ₹78,627 | 10.47% |

Rendered numerical token inventory (repeated tokens deduplicated; trailing punctuation retained by extraction):

Numerical inventory will be regenerated after verification.

## Fed draft numerical provenance and remaining release work

The official [Federal Reserve calendar](https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm), opened 23 October 2026, schedules **27–28 October 2026**; no statement was linked for that meeting at this check. **$300,000** is the user-requested hypothetical principal, not a reported mortgage. All post-meeting policy rates, mortgage quotes, terms, payment outputs and total-interest outputs remain placeholders. Code guard constants are validation boundaries, not claimed financial outcomes. The draft does not invoke the calculator.

