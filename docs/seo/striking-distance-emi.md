# Striking-distance review: emi

Reviewed 19 October 2026.

Research limitation: the browsing tool could not access direct Google search URLs; a direct HTTP fetch returned a JavaScript redirect without readable results. The competitors below were returned by the available live web search, not certified Google rankings. FAQ topics are grounded in accessible search-result pages and official Q&A; their appearance in Google People also ask could not be verified. Do not label them verified PAA.

## Page and metadata
- URL: `/emi-calculator`; GSC baseline: 39.5.
- Old title: EMI Calculator: Home, Car & Personal Loan EMI | Calcumetrics
- New title: EMI Calculator: Monthly Payments & Total Interest
- H1: EMI Calculator (retained).

## Three search-result pages reviewed
- [DigiToolkit](https://digitoolkit.in/calculators/emi-calculator/): input definitions, formula and processing-fee FAQ; added clearer scope and quote guidance.
- [Gizmoop](https://gizmoop.com/emi-calculator): tenure, prepayment and different loan types; added a personal-loan tenure comparison.
- [EMICalculator.io](https://emicalculator.io/): prepayment impact and amortization; retained the existing schedule and linked to the existing prepayment tool.
- The main example and amortization schedule already used the engine. Added a general direct answer, 5-lakh personal-loan example with 2/3/5-year table, scoped fee/APR guidance and six synchronized FAQs. Removed generic live interest-rate ranges, blanket prepayment rules and unsupported DTI recommendations.

## Sources and FAQs
- [RBI KFS circular](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12663&Mode=0): definition of EMI, APR including charges and lender amortization disclosure.
- FAQ topics observed across DigiToolkit/Gizmoop/BankBazaar: meaning, formula, tenure, prepayment, processing fees. Flat versus reducing balance is also in the project’s supporting keyword map. PAA status unverified.
- 8.5% and 12% examples are assumptions, not current lender rates.

## Internal links added
- `/blog/how-loan-amortization-works` → “EMI calculator with a year-by-year repayment schedule”.
- `/blog/increase-emi-or-extend-tenure-after-rate-hike` → “EMI calculator to compare repayment terms”.
- `/loans` → “EMI calculator to compare monthly payments and total interest”.

## Arithmetic
Both worked examples and every comparison row call `calcEMI`; the existing schedule calls `calcEMIAmortization`. Browser scripts, form controls and engines are unchanged.

## Validation
- `npm run build`: passed; 118 pages built, including the global title ≤60 / description ≤160 gate.
- `npm test`: 43 test files, 1,102 tests passed.
- Target HTML checked for one H1, 4–6 visible FAQs matching FAQPage answers, and valid metadata lengths.
- Calculator engines, browser scripts, shared components, layouts and styles are unchanged. Related blog and hub edits only add contextual links.
