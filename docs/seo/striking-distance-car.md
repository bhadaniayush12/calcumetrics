# Striking-distance review: car

Reviewed 19 October 2026.

Research limitation: the browsing tool could not access direct Google search URLs; a direct HTTP fetch returned a JavaScript redirect without readable results. The competitors below were returned by the available live web search, not certified Google rankings. FAQ topics are grounded in accessible search-result pages and official Q&A; their appearance in Google People also ask could not be verified. Do not label them verified PAA.

## Page and metadata
- URL: `/car-loan-calculator`; GSC baseline: 38.7.
- Old title: Car Loan Calculator: Payments & Interest | Calcumetrics
- New title: Car Loan Calculator: EMI, Interest & Down Payment
- H1: Car Loan EMI Calculator → Car Loan Calculator (exact target phrase now contiguous).

## Search-result pages reviewed
- [TransUnion](https://www.transunion.com/tools/auto-loan-calculator): down payment, trade-in, financing fees and repayment breakdown. Added clearer price/fee inputs and a down-payment table; no new calculator features.
- [Calculator.net](https://www.calculator.net/auto-loan-calculator.html): total costs, trade-ins and alternative financing. Added transparent exclusions and a schedule link.
- [UpnixTools](https://upnixtools.com/tools/car-loan-calculator.php), third returned result: direct fetch failed. Supplemented with [BankBazaar](https://emicalculator.bankbazaar.com/car-loan/emi-calculator.html), which covers tenure and borrowing costs.
- Added a direct answer, engine-rendered example, down-payment comparison and used-car/fee guidance. Retained and clarified formula and flat-rate comparison. Replaced generic depreciation, lender-finance, penalty and down-payment percentages with scoped statements.

## Sources and FAQs
- [RBI KFS circular](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12663&Mode=0): APR includes charges, loan disclosure and amortization schedule.
- [CFPB down-payment Q&A](https://www.consumerfinance.gov/ask-cfpb/how-does-a-down-payment-affect-my-auto-loan-en-773/) and [auto-loan glossary](https://www.consumerfinance.gov/consumer-tools/auto-loans/answers/key-terms/): financed amount, term and negative equity.
- Five FAQ topics from the reviewed calculator pages and CFPB Q&A: calculation, down payment, tenure, used cars and fees. PAA status unverified. Rates in illustrations are explicitly assumed.

## Internal links added
- `/blog/flat-vs-reducing-interest-rate` → “car loan calculator with a down payment”.
- `/blog/fixed-vs-floating-rate-loans` → “car loan EMI and interest calculator”.
- `/loans` → “car loan calculator with down-payment comparisons”.

## Arithmetic
Example and comparison rows use `calcEMI`. Existing flat-rate conversion uses `calcImpliedRate`; the explanation now distinguishes its nominal result from APR including fees. No engine or browser behavior was changed.

## Validation
- `npm run build`: passed; 118 pages built, including the global title ≤60 / description ≤160 gate.
- `npm test`: 43 test files, 1,102 tests passed.
- Target HTML checked for one H1, 4–6 visible FAQs matching FAQPage answers, and valid metadata lengths.
- Calculator engines, browser scripts, shared components, layouts and styles are unchanged. Related blog and hub edits only add contextual links.
