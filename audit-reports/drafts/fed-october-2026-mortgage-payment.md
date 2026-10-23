# Fed decision: a $300,000 mortgage payment comparison

Status: PREPARE ONLY. Not registered in BLOG_POSTS, generated routes or sitemap. Do not publish before opening the Federal Reserve’s official statement after the October meeting. No post-decision rate or payment has been filled in or calculated.

- Planned slug: `fed-october-2026-mortgage-payment`
- Author: Dev
- Market: Global; USD
- Title: Fed decision: a $300,000 mortgage payment comparison
- Meta description: Fed decision and mortgage payments: compare a hypothetical $300,000 loan using verified mortgage quotes, with the policy decision sourced separately.
- Published / last updated: [OFFICIAL STATEMENT DATE] / [EDITORIAL UPDATE DATE]

## Direct answer — fill only after the statement

The Federal Reserve’s official statement sets the target range at [FED RATE AFTER 28 OCT]. A hypothetical $300,000 mortgage’s payment depends on its separately entered mortgage rate, loan term and contract; the policy rate must not be used as its mortgage rate.

## What the official decision says

[FED RATE BEFORE 28 OCT] → [FED RATE AFTER 28 OCT]. Link [FED OFFICIAL STATEMENT URL] and record the target range, effective timing and the statement’s actual wording. Do not infer a decision from the meeting schedule or a news preview.

The [Federal Reserve meeting calendar](https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm), opened 23 October 2026, schedules the October meeting for 27–28 October. The statement was not linked there at this check. Reopen the calendar after the decision and follow its actual official statement link.

## Existing fixed loans, adjustable loans and new quotes

Explain separately that an existing fixed-rate loan’s principal-and-interest payment follows its contract. For an adjustable loan, consult its index, spread, reset date and caps. For a new loan or refinance, enter an actual lender quote or a clearly marked hypothetical mortgage rate. Do not assume mortgage rates change by the same amount or in the same direction as the Fed target range.

## Example table — leave all output cells unfilled

Example principal: $300,000, requested by the user; hypothetical loan balance, not an observed market statistic. The term remains an explicit input until the comparison is specified. Hold principal and term constant across the separately sourced mortgage quotes. Neither rate should be populated from the Fed-rate placeholder.

| Input / output | Before quote | After quote |
| --- | --- | --- |
| Hypothetical principal | $300,000 | $300,000 |
| Term | [MORTGAGE TERM YEARS] | [SAME MORTGAGE TERM YEARS] |
| Mortgage rate, not Fed rate | [MORTGAGE QUOTE BEFORE] | [MORTGAGE QUOTE AFTER] |
| Principal-and-interest payment | [ENGINE OUTPUT BEFORE] | [ENGINE OUTPUT AFTER] |
| Total interest | [ENGINE INTEREST BEFORE] | [ENGINE INTEREST AFTER] |

Exclude property taxes, insurance, association dues and mortgage insurance unless each is explicitly supplied and modelled. Do not describe the principal-and-interest payment as the full housing payment.

## Calculator wiring — prepared, not executed

The mortgage page already imports `calcAmortization` from `src/lib/finance/amortization.ts`. Use that same function; do not introduce a second payment formula.

```ts
import { calcAmortization } from '../../lib/finance/amortization';

// Call only after mortgage-rate inputs and their provenance have been supplied.
// Fed target-range strings are editorial source fields, never mortgage inputs.
function mortgageComparison(
  mortgageQuoteBefore: number,
  mortgageQuoteAfter: number,
  termYears: number,
) {
  if (![mortgageQuoteBefore, mortgageQuoteAfter, termYears].every(Number.isFinite)
      || mortgageQuoteBefore < 0 || mortgageQuoteAfter < 0 || termYears <= 0) {
    throw new Error('Supply valid mortgage quotes and a positive loan term.');
  }
  const principal = 300000; // Explicit hypothetical requested by the user.
  return {
    before: calcAmortization(principal, mortgageQuoteBefore, termYears),
    after: calcAmortization(principal, mortgageQuoteAfter, termYears),
  };
}
```

Render `.emi` and `.totalInterest` from the returned objects. Round only for display. No function invocation or sample payment is included here.

CTA: [Compare your mortgage payment](/mortgage-calculator). Additional calculator links: [Loan amortization](/loan-amortization-calculator), [Loan prepayment](/loan-prepayment-calculator). Confirm each route in the current tool registry when converting the draft.

Related posts: [How mortgage amortization works](/blog/how-mortgage-amortization-works), [Debt-to-income ratio for a mortgage](/blog/debt-to-income-ratio-for-mortgage).

## Four FAQs prepared for the shared template

- **Does a Fed decision automatically change my fixed mortgage payment?** A fixed-rate contract determines the scheduled principal-and-interest payment. Escrow charges may vary separately.
- **Can I enter the Fed rate in the mortgage calculator?** Enter the applicable mortgage rate. The policy target and a mortgage quote are different inputs.
- **What must I check on an adjustable mortgage?** Read its contractual index, spread, reset date and caps before estimating a changed payment.
- **Does this comparison include all housing costs?** The engine models principal and interest. Other housing costs require separate inputs.

## Sources and release checklist

- Opened: [Federal Reserve meeting calendar](https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm).
- Pending: [FED OFFICIAL STATEMENT URL], with the exact post-meeting target range.
- Pending: [PRIMARY MORTGAGE QUOTE SOURCE BEFORE] and [PRIMARY MORTGAGE QUOTE SOURCE AFTER], with comparable product, term, points, fees and borrower assumptions; otherwise explicitly label rates hypothetical.
- Add Article, FAQPage and BreadcrumbList through the existing `BlogPost` template after verification.
- Add a literal `Last updated: [EDITORIAL UPDATE DATE]` line, render the worked table from the engine, verify all numerical provenance, then register in the index and sitemap only after release.
