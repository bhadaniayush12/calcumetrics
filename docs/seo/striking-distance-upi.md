# Striking-distance review: upi

Reviewed 19 October 2026.

Research limitation: the browsing tool could not access direct Google search URLs; a direct HTTP fetch returned a JavaScript redirect without readable results. The competitors below were returned by the available live web search, not certified Google rankings. FAQ topics are grounded in accessible search-result pages and official Q&A; their appearance in Google People also ask could not be verified. Do not label them verified PAA.

## Page and metadata
- URL: `/in/upi-mdr-calculator`; GSC baseline: 8.5 (user-supplied last 28 days).
- Old title: UPI MDR Calculator: Charges & Net Settlement | Calcumetrics
- New title: UPI MDR Calculator: Estimate Fees & Settlement
- H1: UPI MDR Calculator (retained).

## Competitor coverage and gaps
- [UPIMDR.com](https://upimdr.com/): payment-category table, settlement and tax treatment; added a charge-type comparison without copying proposed rates into the model.
- [e309](https://www.e309.in/calculators/upi-mdr-calculator): threshold and commencement FAQs. Its October 15 effective-date claim conflicts with the later deferment report; do not copy it.
- Calcumetrics itself appeared among initial results; [BlinkMoney](https://blinkmoney.in/tools/upi-mdr-calculator) was reviewed as the third external comparator: separates customer payment from merchant fees. Added that distinction and an explanation of the model’s limitations.
- Added a direct answer, clarified formula, engine-rendered example, payment/fee comparison and six FAQs. Removed unsupported POS-rate averages, blanket ITC eligibility and universal PPI/RuPay threshold assertions.

## Sources and FAQ provenance
- [NPCI PPI clarification](https://www.npci.org.in/PDF/npci/press-releases/2023/UPI-is-free-fast-secure-and-seamless-Every-month-over-8-billion-transactions-are-processed-free-for-customers-and-merchants-using-bank-accounts.pdf): bank-account transfers and no charge to PPI customers; PDF text available in search, direct fetch rejected.
- [Akashvani](https://newsonair.gov.in/upi-mdr-to-be-implemented-after-diwali/) and [Times of India](https://timesofindia.indiatimes.com/business/india-business/proposed-fees-on-upi-merchant-transactions-above-rs-2k-postpone-to-after-festivals/articleshow/134912161.cms): deferred rollout and new date to be notified.
- [Razorpay fee explanation](https://razorpay.com/blog/razorpay-payment-gateway-pricing-explained) and [pricing](https://razorpay.com/pricing/): GST on fees and separate platform charges.
- FAQ topics observed in e309/BlinkMoney/UPIMDR and Razorpay Q&A: meaning of MDR, customer charges, normal UPI fees, fee GST, commencement and threshold. PAA status unverified.

## Internal links added
- `/blog/cash-conversion-cycle` → “UPI MDR and net settlement calculator”.
- `/blog/markup-vs-margin` → “UPI merchant fee calculator”.
- `/business` → “UPI MDR calculator for fees and net settlement”.

## Arithmetic and scope
Example uses `calcUPIMDR(DEFAULT...)` for every output. Existing calculator engine and browser script are unchanged. The average-ticket threshold is explicitly described as a model limitation; the page does not claim to implement the deferred framework.

## Validation
- `npm run build`: passed; 118 pages built, including the global title ≤60 / description ≤160 gate.
- `npm test`: 43 test files, 1,102 tests passed.
- Target HTML checked for one H1, 4–6 visible FAQs matching FAQPage answers, and valid metadata lengths.
- Calculator engines, browser scripts, shared components, layouts and styles are unchanged. Related blog and hub edits only add contextual links.
