# Striking-distance review: compound

Reviewed 19 October 2026.

Research limitation: the browsing tool could not access direct Google search URLs; a direct HTTP fetch returned a JavaScript redirect without readable results. The competitors below were returned by the available live web search, not certified Google rankings. FAQ topics are grounded in accessible search-result pages and official Q&A; their appearance in Google People also ask could not be verified. Do not label them verified PAA.

## Page and metadata
- URL: `/compound-interest-calculator`; GSC baseline: 20.5.
- Old title: Compound Interest Calculator: Daily & Annual | Calcumetrics
- New title: Compound Interest Calculator: Daily, Monthly & Yearly
- H1: Compound Interest Calculator (retained).

## Three search-result pages reviewed
- [Investor.gov](https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator): separates starting principal, monthly deposits, rate range and frequency. Our page lacked an explanation of recurring contributions; added a clear limitation and links to existing appropriate tools.
- [DQYDJ](https://dqydj.com/compound-interest-calculator/): periodic additions, formula and worked example. Replaced typed example outputs with engine values.
- [The Calculator Site](https://www.thecalculatorsite.com/finance/calculators/compoundinterestcalculator.php): frequencies, deposit timing and growth tables. Added a four-frequency comparison table.

## Sections and sources
- Direct answer, clarified formula (including daily n=365), engine-derived worked example, frequency table, monthly-contribution guidance, assumptions and five synchronized FAQs.
- [SEC Investor.gov compound-interest explanation](https://www.investor.gov/additional-resources/information/youth/teachers-classroom-resources/what-compound-interest) supports interest-on-interest and the Rule of 72; [Investor.gov calculator](https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator) supports distinguishing initial capital from contributions.
- FAQ topics reflect the reviewed pages: meaning/formula, frequency, contributions and doubling. PAA status unverified. Example 8% is explicitly hypothetical.

## Internal links added
- `/blog/apr-vs-apy-compounding-frequency` → “compound interest calculator with daily and monthly compounding”.
- `/blog/real-rate-of-return` → “compound interest calculator for nominal growth”.
- `/investments` → “compound interest calculator for daily, monthly and annual growth”.

## Arithmetic
Every balance, gain, example growth factor and comparison comes from `calcLumpSum`. Currency examples display two decimals; the interactive calculator logic is unchanged.

## Validation
- `npm run build`: passed; 118 pages built, including the global title ≤60 / description ≤160 gate.
- `npm test`: 43 test files, 1,102 tests passed.
- Target HTML checked for one H1, 4–6 visible FAQs matching FAQPage answers, and valid metadata lengths.
- Calculator engines, browser scripts, shared components, layouts and styles are unchanged. Related blog and hub edits only add contextual links.
