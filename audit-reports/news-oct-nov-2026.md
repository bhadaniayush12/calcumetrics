# October–November 2026 news content audit

Checked: 23 October 2026. Branch: `content/news-oct-nov-2026`, created from local `main` at `34253fb`. No push or deployment performed. Existing untracked `audit-reports/` and `scratch/` material was left untouched; only this report and the requested Fed draft are staged from those directories.

## Delivery status and evidence limitation

Four articles are registered in the blog index and generated sitemap, with author Dev, the existing Tailwind classes and shared Article + FAQPage + BreadcrumbList schema. Each has a direct answer, calculator links, a worked example, linked sources, four FAQs and a literal last-updated line. No shared page layout or calculator formula was changed. Article cards use the repository’s existing SVG-to-PNG OpenGraph renderer.

**The IPO numerical issue catalogue is incomplete.** No candidate met both price-band and lot-size verification from opened primary sources. The article explicitly shows no verified entries, rather than presenting secondary-source lots as confirmed facts. It contains a complete hypothetical capital-gains example. This is a known shortfall against the requested populated price-band/lot/minimum-investment table; it must not be described as a completed issue roundup.

NSE’s opened [upcoming-issues JSON](https://www.nseindia.com/api/all-upcoming-issues?category=ipo) supplies dates and price bands for BLS Polymers, SFC Environmental Technologies and EAAA India Alternatives (Edelweiss Alternatives), but no lot size. Wiscon was not confirmed there. The opened [BLS SEBI abridged prospectus](https://www.sebi.gov.in/sebi_data/commondocs/oct-2026/BLS%20Polymers%20Limited_p.pdf) and [SFC SEBI abridged prospectus](https://www.sebi.gov.in/sebi_data/commondocs/oct-2026/SFC%20Environmental%20Technologies%20Ltd.%20%20-%20Abridged%20Prospectus_p.pdf) do not confirm usable minimum lots. The [full SFC RHP](https://sfcenvironment.com/wp-content/uploads/2026/10/SFC-Environmental-Technologies-Ltd_RHP-1-1.pdf) was downloaded from the issuer and opened with PDFKit; its definitions leave the band blank and say the minimum bid lot will be announced separately. The RHP therefore does not establish the advertised lot. NSE’s individual issue-information/detail endpoints were inaccessible. No secondary-source price or lot was imported into an article. A source URL was requested; the reply was “sure” with no URL, so the omission remains.

The source rule is applied to factual claims. User-specified example amounts, explicitly hypothetical inputs, arithmetic outputs and editorial metadata are separately identified below; they are not falsely attributed to an official announcement. The Dhanteras date uses the user’s explicit panchang-source exception. Income Tax Department statutory text is hosted on its official `incometaxindia.gov.in` portal, alongside circulars, FAQs and validation documents on `incometax.gov.in`; this domain distinction is disclosed rather than treating the statutory portal as an e-filing URL.

## Verification

- `npm run build`: PASS, zero errors; 122 pages built. Build-time metadata check passed.
- `npm test`: PASS, 43 test files and 1,102 tests. Baseline before edits also passed all 1,102 tests.
- Rendered-output audit: PASS for all four articles. Parsed JSON-LD includes Article, FAQPage with four entries and BreadcrumbList; Article author is Dev. All four URLs appear in the built blog index and `sitemap-pages.xml`. Related calculators and posts are present in rendered HTML. Each title and SEO title is at most 60 characters, each description at most 155 characters, and each article has three to five calculators and one to two related posts.
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

## 2. ipo-oct-nov-2026-lot-size-money-needed-tax

URL: [https://calcumetrics.com/blog/ipo-oct-nov-2026-lot-size-money-needed-tax](https://calcumetrics.com/blog/ipo-oct-nov-2026-lot-size-money-needed-tax)

Words: **965 body / 1129 article**. Title: 53 characters. Meta description: 150 characters. Local commit: `d1f2ca5`.

Sources opened and linked:

- [NSE: Upcoming issues feed: primary dates and price bands; does not supply verified lots here](https://www.nseindia.com/api/all-upcoming-issues?category=ipo)
- [Income Tax Department: Income-tax Act, 2025 as amended by Finance Act, 2026: section 196](https://www.incometaxindia.gov.in/documents/d/guest/income_tax_act_2025_as_amended_by_fa_act_2026-pdf)
- [Income Tax Department: Return-validation rules: special-rate equity gains and cess](https://www.incometax.gov.in/iec/foportal/sites/default/files/2026-06/CBDT_e-filing_ITR-3_Validation%20Rules_V1.0_AY%2026-27.pdf)

Calculators linked:

- [Capital Gains Tax Calculator](/in/capital-gains-tax-calculator)
- [Income Tax Calculator](/in/income-tax-calculator)
- [Advance Tax Calculator](/in/advance-tax-calculator)

Related posts:

- [Jio IPO listing-gains tax guide](/blog/jio-platforms-ipo-listing-gains-tax)
- [Capital gains rules](/blog/capital-gains-tax-rules)

Numerical provenance:

- **Official facts / legal labels:** **20%** qualifying short-term equity base rate and **section 196**: opened Income-tax Act, 2025, as amended by Finance Act, 2026, statutory section. **111A**: historical label retained by the engine, identified as such; also documented in the opened return-validation rules. **4%** health and education cess: opened Department return-validation rules. **2025** in the Act title and **2026** in its amendment title identify the source statute.
- **Hypothetical inputs:** **₹15,000** acquisition cost, **₹18,000** sale proceeds and **1 month** used to select the short-term equity category are author-selected Example inputs. No real person or IPO is represented. Assumes basic exemption used, no surcharge, no losses and no transaction-cost adjustments.
- **Outputs:** gain **₹3,000**, base tax **₹600**, cess **₹24**, total tax **₹624**, gain after this tax estimate **₹2,376** are direct `calcCapitalGains(18000, 15000, 1, 'equity')` outputs. No price band, lot or minimum-investment number is published for an unverified IPO.

Rendered numerical token inventory (repeated tokens deduplicated; trailing punctuation retained by extraction):

`2025,`, `20%`, `196`, `111A`, `4%`, `₹15,000,`, `₹18,000`, `1`, `₹15,000`, `₹3,000`, `₹600`, `₹24`, `₹624`, `₹2,376`, `23`, `2026`.

## 3. itr-due-date-21-november-2026-late-fee-interest

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

## 4. dhanteras-2026-gold-vs-sip

URL: [https://calcumetrics.com/blog/dhanteras-2026-gold-vs-sip](https://calcumetrics.com/blog/dhanteras-2026-gold-vs-sip)

Words: **1001 body / 1141 article**. Title: 56 characters. Meta description: 148 characters. Local commit: `1db5323`.

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
- **Hypothetical inputs:** **₹50,000** initial cash comes from the user’s requested example; **5 years**, **0%, 5%, 10%** assumed growth and annual compounding are explicitly chosen scenario inputs, not gold-price forecasts, historical returns or product quotations. The SIP separately assumes **₹1,000 at the start of each month for 5 years** from future income, rather than claiming to invest the same original cash.
- **Outputs:** SIP total contributions **₹60,000** come from `calcSIP(...).invested`. Every maturity and CAGR in the table below comes directly from `calcLumpSum`, `calcSIP` and `calcCAGR`; the annual/monthly conventions differ and are disclosed. CAGRs displayed as **0.00%, 5.00%, 10.00%** are computed from each lump-sum endpoint. SEBI supports the discussion of risk and non-guaranteed returns; it is not the source of the assumed numerical returns.

| Assumed rate | Lump-sum maturity | SIP maturity | Lump-sum CAGR |
| --- | --- | --- | --- |
| 0% | ₹50,000 | ₹60,000 | 0.00% |
| 5% | ₹63,814 | ₹68,289 | 5.00% |
| 10% | ₹80,526 | ₹78,082 | 10.00% |

Rendered numerical token inventory (repeated tokens deduplicated; trailing punctuation retained by extraction):

`2026`, `₹50,000`, `6`, `5`, `0%`, `5%`, `10%`, `₹1,000`, `₹60,000`, `0.00%`, `₹63,814`, `₹68,289`, `5.00%`, `₹80,526`, `₹78,082`, `10.00%`, `23`.

## Fed draft numerical provenance and remaining release work

The official [Federal Reserve calendar](https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm), opened 23 October 2026, schedules **27–28 October 2026**; no statement was linked for that meeting at this check. **$300,000** is the user-requested hypothetical principal, not a reported mortgage. All post-meeting policy rates, mortgage quotes, terms, payment outputs and total-interest outputs remain placeholders. Code guard constants are validation boundaries, not claimed financial outcomes. The draft does not invoke the calculator.

Before completing the IPO issue catalogue, obtain an opened official NSE/BSE or eligible issuer notice containing the minimum bid lot for at least one candidate; confirm the band and dates against that same issue, calculate application values using an appropriate site engine, update the article and rerun build/tests. Do not silently fill the missing rows from a broker/news page.
