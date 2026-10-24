import type { BlogPost } from './types';
import { calcSimpleInterest } from '../../lib/calculators/simple-interest';
const money = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
export const interestRows = [1, 2].map(months => ({ months, interest: calcSimpleInterest(50000, 12, months / 12).interest }));
export const ITR_AUDIT_NEWS_POST: BlogPost = {
  "slug": "itr-due-date-21-november-2026-late-fee-interest",
  "title": "ITR due date 21 Nov 2026: audit-case late fee and interest",
  "seoTitle": "ITR due date 21 Nov 2026: audit-case late fee and interest",
  "description": "ITR due date is 21 November 2026 for specified audit cases. Check the CBDT extension, section 234F fees and an engine-calculated 234A interest example.",
  "category": "Taxes",
  "market": "India-Only",
  "publishDate": "2026-10-23",
  "dateModified": "2026-10-23",
  "readTime": "7 min read",
  "author": "Dev",
  "type": "Trending",
  "quickAnswer": "The ITR deadline for specified AY 2026–27 audit cases is 21 November 2026 under CBDT’s extension. Filing late can trigger section 234F fees and section 234A interest on the prescribed unpaid tax base; the audit-report deadline is separate.",
  "summary": "Identify the taxpayers covered by the extension and distinguish return-filing fees from interest on unpaid tax.",
  "sources": [
    {
      "name": "CBDT",
      "url": "https://www.incometax.gov.in/iec/foportal/sites/default/files/2026-09/Circular-7-2026.pdf",
      "citation": "Circular 7/2026, 28 September 2026: extension and covered category"
    },
    {
      "name": "Income Tax Department",
      "url": "https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/%20income%20tax%20returns-faq",
      "citation": "AY 2026–27 filing and late-fee FAQs"
    },
    {
      "name": "Income Tax Department",
      "url": "https://www.incometaxindia.gov.in/w/section-234a-36",
      "citation": "Section 234A: rate, period and tax-base reductions"
    }
  ],
  "relatedCalculators": [
    {
      "name": "Simple Interest Calculator",
      "path": "/simple-interest-calculator",
      "description": "Check arithmetic after establishing legal inputs."
    },
    {
      "name": "Income Tax Calculator",
      "path": "/in/income-tax-calculator",
      "description": "Estimate ordinary-income liability."
    },
    {
      "name": "Advance Tax Calculator",
      "path": "/in/advance-tax-calculator",
      "description": "Review payment planning separately."
    }
  ],
  "relatedArticles": [
    {
      "slug": "new-income-tax-act-2025-salaried-guide",
      "title": "Income-tax Act transition guide",
      "description": "Understand assessment-year terminology."
    },
    {
      "slug": "section-87a-marginal-relief-new-regime-example",
      "title": "Check your 87A rebate before filing",
      "description": "A solved example of the rebate and marginal relief for incomes just above ₹12 lakh."
    }
  ],
  "faqs": [
    {
      "question": "Is the extended deadline available to every taxpayer?",
      "answer": "No. The circular specifies the audit-case category covered. Check your applicable category before relying on the date."
    },
    {
      "question": "Is the audit report due on the same day as the return?",
      "answer": "No. The circular extends the audit-report date to 21 October 2026 and the covered return date to 21 November 2026."
    },
    {
      "question": "Does a small unpaid tax balance reduce the late-filing fee?",
      "answer": "The fee threshold depends on total income, not the unpaid tax balance. The interest calculation uses a separate prescribed tax base."
    },
    {
      "question": "Does Calcumetrics calculate statutory late-filing charges automatically?",
      "answer": "No. There is no dedicated statutory late-filing calculator. The simple-interest tool only checks arithmetic once the correct tax base and chargeable months are supplied."
    }
  ],
  content: `
<h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">Who gets the extended filing deadline?</h2>
<p class="text-sm text-text-muted leading-relaxed mb-4">The <a href="https://www.incometax.gov.in/iec/foportal/sites/default/files/2026-09/Circular-7-2026.pdf" class="text-accent font-medium hover:underline">CBDT circular dated 28 September 2026</a> extends the income-tax return deadline for AY 2026–27 from 31 October 2026 to 21 November 2026 for the persons specified in the audit-case category of section 139(1). The associated audit-report date moves from 30 September 2026 to 21 October 2026. These are different filings, so keep separate completion records.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">This is a category-specific extension. It does not establish a fresh deadline for everyone filing an income-tax return. Confirm the category applicable to the taxpayer before changing a calendar reminder. If you are unsure whether your case is covered, ask the person preparing the return to identify the provision and explain how it applies to your filing.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">Preparing a report, uploading it and completing the required acceptance or verification steps can be different stages. Review the portal status rather than relying only on a document saved locally. Keep the acknowledgement and any communication with the preparer so you can establish which stage was completed and when.</p>
<h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">Separate the filing fee from interest on unpaid tax</h2>
<p class="text-sm text-text-muted leading-relaxed mb-4">The <a href="https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/%20income%20tax%20returns-faq" class="text-accent font-medium hover:underline">Income Tax Department’s return FAQs</a> states that section 234F late-filing fees are ₹1,000 where total income does not exceed ₹5,00,000, and ₹5,000 otherwise. This concerns a return that was required to be furnished and is filed after its applicable deadline. The fee threshold is based on total income, not the balance of tax left to pay.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4"><a href="https://www.incometaxindia.gov.in/w/section-234a-36" class="text-accent font-medium hover:underline">Section 234A on the Department’s statutory website</a> provides simple interest at 1% for every month or part of a month of the relevant delay, on the prescribed outstanding tax base after applicable reductions. The starting point is the day after the applicable due date. It is not daily pro-rata interest and it is not a percentage of salary or turnover.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">Paying tax and filing the return address different obligations. A payment receipt does not prove that the return was submitted, and an uploaded return does not prove that all tax has been paid. Review both records together before deciding that a filing is complete.</p>
<h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">Example: a fixed unpaid balance and counted delay</h2>
<p class="text-sm text-text-muted leading-relaxed mb-4">This is a hypothetical Example, not a taxpayer’s case. Assume the return is required, total income exceeds ₹5,00,000, and the relevant unpaid tax base remains ₹50,000 throughout. Compare a delay assessed as 1 chargeable month with one assessed as 2 chargeable months. The table excludes other interest provisions, adjustments and any later change to the assessed tax base.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">The site has no dedicated section 234A or 234F calculator. Our simple-interest engine fits the arithmetic after the statutory tax base and chargeable months have been established: it receives the equivalent nominal annual rate of 12% and a duration of months divided by 12. That conversion implements the sourced monthly rate; it is not a separate tax rate. The engine does not determine filing eligibility or legal month counting.</p>
<div class="overflow-x-auto mb-6"><table class="w-full text-xs text-left border border-border rounded-card overflow-hidden"><caption class="text-xs text-text-muted text-left p-3 bg-surface border-b border-border">Example — ₹50,000 constant unpaid tax; fee shown separately</caption><thead class="bg-surface text-text-primary font-semibold border-b border-border"><tr><th scope="col" class="p-3">Chargeable months</th><th scope="col" class="p-3">Section 234A interest</th><th scope="col" class="p-3">Section 234F fee if applicable</th></tr></thead><tbody class="divide-y divide-border text-text-muted">${interestRows.map(row => `<tr><td class="p-3">${row.months}</td><td class="p-3 font-mono">${money(row.interest)}</td><td class="p-3 font-mono">₹5,000</td></tr>`).join('')}</tbody></table></div>
<h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">Use the tools for the part they actually calculate</h2>
<p class="text-sm text-text-muted leading-relaxed mb-4">The <a href="/simple-interest-calculator" class="text-accent font-medium hover:underline">simple interest calculator</a> can reproduce the interest arithmetic with the stated annual-rate conversion. It cannot read the circular, identify your return category or decide which tax credits reduce the base. Treat a calculated amount as a check on specified inputs, then reconcile it with the filing utility and supporting records.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">The <a href="/in/income-tax-calculator" class="text-accent font-medium hover:underline">income tax calculator</a> helps estimate ordinary-income liability under the available regimes. It is not a complete return for an audited business. Special-rate income, business adjustments, losses and taxpayer-specific rules may require separate treatment. Do not enter turnover as though it were taxable income.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">The <a href="/in/advance-tax-calculator" class="text-accent font-medium hover:underline">advance tax calculator</a> is useful for reviewing payment planning separately. An extension to the return-filing deadline should not be read as a blanket waiver of other payment obligations. This article’s table deliberately isolates late-filing interest and the filing fee instead of implying that they are the entire eventual demand.</p>
<h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">Reconcile credits before estimating the unpaid balance</h2>
<p class="text-sm text-text-muted leading-relaxed mb-4">Collect the tax computation, payment challans and the relevant tax-credit statements. Match payments to the correct taxpayer and assessment year, and investigate missing or duplicated credits. The balance visible in a working spreadsheet may differ from the amount that the filing utility ultimately accepts if a payment or withholding entry has not been reconciled.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">Where tax has been paid during the period of delay, a constant-balance illustration may no longer fit. Ask the preparer to show the base used and the treatment of each payment. Do not extend the example’s unchanged balance across dates when the underlying tax position has changed.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">Resolve the reason for a mismatch before changing an interest figure merely to agree with a preferred result. The useful audit trail is the computation supporting the figure, together with the payment and filing records. Keep those documents in the same folder as the final acknowledgement.</p>
<h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">Prepare the return before the last filing day</h2>
<p class="text-sm text-text-muted leading-relaxed mb-4">Use the time remaining to reconcile accounts, confirm the correct return form and review the audit-report status. Share unresolved questions with the preparer early enough for corrections to be made. Waiting until the deadline to discover that a portal step is incomplete can leave little room to investigate.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">For context on the change in statutory terminology, read our <a href="/blog/new-income-tax-act-2025-salaried-guide" class="text-accent font-medium hover:underline">Income-tax Act transition guide</a>. The Department’s FAQs distinguish AY 2026–27 returns under the older Act from returns for the new tax year. This post uses the section labels relevant to the assessment year named in the extension.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">After submission, check the required verification status and retain the acknowledgement. If the deadline has already been missed, establish the available filing route and the applicable charges promptly. Do not assume that another extension will be announced or that a preparer’s draft is equivalent to a submitted return. This is educational information; the circular and your applicable facts determine the filing obligation.</p>

<p class="text-xs text-text-muted mt-6">Last updated: 23 October 2026</p>
`,
};
