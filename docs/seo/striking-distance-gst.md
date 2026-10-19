# Striking-distance review: gst

Reviewed 19 October 2026.

Research limitation: the browsing tool could not access direct Google search URLs; a direct HTTP fetch returned a JavaScript redirect without readable results. The competitors below were returned by the available live web search, not certified Google rankings. FAQ topics are grounded in accessible search-result pages and official Q&A; their appearance in Google People also ask could not be verified. Do not label them verified PAA.

## Page and metadata
- URL: `/in/gst-calculator`; GSC baseline: 47.
- Old title: GST Calculator India: 0%, 5%, 18% & 40% Slabs | Calcumetrics
- New title: GST Calculator: Add or Remove GST & Check Tax Split
- H1: GST Calculator (GST 2.0) → GST Calculator India.

## Search-result pages reviewed
- [TracEasy](https://traceasy.in/tools/gst-calculator): rate comparison and add/remove guidance. Added a paired forward/reverse example and comparison table.
- [TaxGamma](https://www.taxgamma.com/gst-calculator/): invoices, rate-wise summary, taxable value and rounding. Added one-rate-at-a-time invoice guidance and rounding limits.
- [RCInsights](https://www.rcinsights.org/tools/finance/gst-calculator), third result: fetch failed. Supplemented with [ClearTax](https://cleartax.in/s/gst-calculator) and [Zoho](https://www.zoho.com/in/books/free-gst-calculator/), which explain inclusive/exclusive amounts and tax heads.
- Added a direct answer, engine-derived forward/reverse example, supply-split table and invoice/rate guidance. Reworked six FAQs with shared FAQPage data. Removed sweeping registration thresholds and unsupported item mappings; neutralized rate preset labels without changing values.

## Sources and FAQs
- [GST Council 56th meeting recommendations](https://gstcouncil.gov.in/sites/default/files/2025-09/press_release_press_information_bureau_0.pdf): broad rate reform; presented as guidance, not an exhaustive classification or a 2026 reform date.
- [IGST Act sections 7 and 8](https://cbic-gst.gov.in/hindi/IGST-bill-e.html): place of supply and exceptions; section 5 explains reverse charge.
- [ClearTax GST calculator](https://cleartax.in/s/gst-calculator): forward/reverse formulas and invoice checks.
- FAQ topics observed in ClearTax/Zoho and reviewed tools: calculation, inclusive price, 18% example, tax components and invoices. Reverse calculation versus reverse charge follows the Act. PAA status unverified.

## Internal links added
- `/blog/gst-input-tax-credit-rules` → “GST calculator for inclusive and exclusive invoice amounts”.
- `/blog/upi-mdr-above-2000-merchant-charges` → “GST calculator to add or remove tax from a fee”.
- `/taxes` → “GST calculator for inclusive prices and CGST/SGST/IGST splits”.

## Arithmetic
Forward, reverse and inter-state examples all call `calcGST`. All displayed tax/base/total values come from those results. The selected 18% is explicitly an example. No engine, selectable value, or browser script changed.

## Validation
- `npm run build`: passed; 118 pages built, including the global title ≤60 / description ≤160 gate.
- `npm test`: 43 test files, 1,102 tests passed.
- Target HTML checked for one H1, 4–6 visible FAQs matching FAQPage answers, and valid metadata lengths.
- Calculator engines, browser scripts, shared components, layouts and styles are unchanged. Related blog and hub edits only add contextual links.
