import type { BlogPost } from './types';
import { calcCapitalGains } from '../../lib/tax/india';
const money = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
export const ipoExample = calcCapitalGains(18000, 15000, 1, 'equity');
export const IPO_WEEK_NEWS_POST: BlogPost = {
  "slug": "ipo-oct-nov-2026-lot-size-money-needed-tax",
  "title": "IPOs this week: lot-size budget and listing-gains tax",
  "seoTitle": "IPOs this week: lot-size budget and listing-gains tax",
  "description": "IPOs this week: verify price bands and minimum lots before bidding, then use our capital gains calculator for a hypothetical listing-sale tax example.",
  "category": "Taxes",
  "market": "India-Only",
  "publishDate": "2026-10-23",
  "dateModified": "2026-10-23",
  "readTime": "7 min read",
  "author": "Dev",
  "type": "Trending",
  "quickAnswer": "The money needed for an IPO bid depends on its official price band, minimum lot and investor category; no issue is listed here without all required terms verified. A hypothetical short-term sale below shows how our capital-gains calculator estimates tax on a gain.",
  "summary": "A primary-source-first application checklist and an engine-backed hypothetical listing-gain tax calculation; issue amounts await lot-size verification.",
  "sources": [
    {
      "name": "NSE",
      "url": "https://www.nseindia.com/api/all-upcoming-issues?category=ipo",
      "citation": "Upcoming issues feed: primary dates and price bands; does not supply verified lots here"
    },
    {
      "name": "Income Tax Department",
      "url": "https://www.incometaxindia.gov.in/documents/d/guest/income_tax_act_2025_as_amended_by_fa_act_2026-pdf",
      "citation": "Income-tax Act, 2025 as amended by Finance Act, 2026: section 196"
    },
    {
      "name": "Income Tax Department",
      "url": "https://www.incometax.gov.in/iec/foportal/sites/default/files/2026-06/CBDT_e-filing_ITR-3_Validation%20Rules_V1.0_AY%2026-27.pdf",
      "citation": "Return-validation rules: special-rate equity gains and cess"
    }
  ],
  "relatedCalculators": [
    {
      "name": "Capital Gains Tax Calculator",
      "path": "/in/capital-gains-tax-calculator",
      "description": "Estimate isolated sale gains, base tax and cess."
    },
    {
      "name": "Income Tax Calculator",
      "path": "/in/income-tax-calculator",
      "description": "Review ordinary-income tax separately."
    },
    {
      "name": "Advance Tax Calculator",
      "path": "/in/advance-tax-calculator",
      "description": "Plan payments after establishing annual liability."
    }
  ],
  "relatedArticles": [
    {
      "slug": "jio-platforms-ipo-listing-gains-tax",
      "title": "Jio IPO listing-gains tax guide",
      "description": "Separate issue terms from hypothetical sale outcomes."
    },
    {
      "slug": "capital-gains-tax-rules",
      "title": "Capital gains rules",
      "description": "Explore treatment across asset classes."
    }
  ],
  "faqs": [
    {
      "question": "Why does the issue table have no entries?",
      "answer": "No candidate passed both price-band and minimum-lot verification from the opened primary sources. This does not mean no IPOs are scheduled."
    },
    {
      "question": "Does a successful bid guarantee listing gains?",
      "answer": "No. Allotment and a later sale outcome are separate from the application. Use the actual cost and executed sale record to calculate a gain."
    },
    {
      "question": "Is the worked sale tied to a real IPO?",
      "answer": "No. The purchase and sale amounts are hypothetical Example inputs. They are not company issue terms or a price forecast."
    },
    {
      "question": "Does the tax result cover every investor?",
      "answer": "No. The isolated-sale estimate assumes the basic exemption is used, with no loss adjustments, surcharge or transaction-cost changes. Personal tax circumstances can alter the result."
    }
  ],
  content: `
<h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">Check the minimum bid before earmarking money</h2>
<p class="text-sm text-text-muted leading-relaxed mb-4">Before applying for an IPO, confirm both the price band and minimum bid lot in an exchange notice or the offer documents. A price band alone cannot tell you the minimum application amount. The number of shares in a lot matters, and application requirements can differ between investor categories.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">The <a href="https://www.nseindia.com/api/all-upcoming-issues?category=ipo" class="text-accent font-medium hover:underline">NSE upcoming-issues feed</a> is a primary source for announced issue dates and price bands. For this update, no issue has passed the complete price-band-and-lot-size check required for inclusion below. The table therefore contains no application amounts. Do not infer a lot size from another company’s issue or from an older application.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">This page explains the application-budget and tax calculation while that issue-specific information remains unverified. Check the latest official notice before submitting an application. A confirmed minimum amount would still describe the cash required to bid, rather than a guarantee of allotment, listing gains or suitability.</p>
<div class="overflow-x-auto mb-6"><table class="w-full text-xs text-left border border-border rounded-card overflow-hidden"><caption class="text-xs text-text-muted text-left p-3 bg-surface border-b border-border">Verified issue terms — no issue included without a confirmed lot size</caption><thead class="bg-surface text-text-primary font-semibold border-b border-border"><tr><th scope="col" class="p-3">Issue</th><th scope="col" class="p-3">Price band</th><th scope="col" class="p-3">Lot size</th><th scope="col" class="p-3">Minimum investment</th></tr></thead><tbody class="divide-y divide-border text-text-muted"><tr><td class="p-3" colspan="4">No fully verified entries in this update. Confirm the official price-band and minimum-bid notice before applying.</td></tr></tbody></table></div>
<h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">Distinguish an application amount from an investment outcome</h2>
<p class="text-sm text-text-muted leading-relaxed mb-4">The price used for an application and the final allotment price are related but distinct. Read the category-specific bidding instructions, including the treatment of a cut-off bid where permitted. A headline minimum calculated at the lower end of a band does not necessarily show the funds needed for the bid you intend to submit.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">Keep the bid acknowledgement and later allotment record. The amount blocked for an application is not proof that the same amount became your acquisition cost. For a later sale, work from the shares actually allotted and the amount paid for them. A rejected or unallotted application cannot create a listing gain.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">Also keep the sale contract note. It supplies evidence of the disposal amount and transaction details. A price displayed on a market screen is not the same as the amount realised by your sale, especially if the executed price or quantity differs from the scenario you had saved.</p>
<h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">Tax is charged on eligible gains, not the entire sale value</h2>
<p class="text-sm text-text-muted leading-relaxed mb-4">The Department’s <a href="https://www.incometaxindia.gov.in/documents/d/guest/income_tax_act_2025_as_amended_by_fa_act_2026-pdf" class="text-accent font-medium hover:underline">Income-tax Act, 2025, as amended</a> sets a 20% base rate under section 196 for qualifying short-term equity gains where the relevant sale is chargeable to securities transaction tax. The calculator retains the familiar older section 111A label internally. Check the law applicable to the tax year rather than using the engine’s label as a current filing reference.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">The <a href="https://www.incometax.gov.in/iec/foportal/sites/default/files/2026-06/CBDT_e-filing_ITR-3_Validation%20Rules_V1.0_AY%2026-27.pdf" class="text-accent font-medium hover:underline">Department’s return-validation rules</a> also document the special short-term equity category and a 4% health and education cess calculation. Cess is applied to the relevant tax amount, with surcharge where applicable; it is not another percentage charged directly to all sale proceeds. The worked example below assumes no surcharge.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">The engine estimates an isolated gain. It does not establish residence, unused basic exemption, loss set-offs or the complete tax position on a return. A listing sale should be assessed using the actual allotment and sale records, with personal adjustments considered separately.</p>
<h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">Example: tax on a hypothetical listing sale</h2>
<p class="text-sm text-text-muted leading-relaxed mb-4">This Example is not an identified IPO or a forecast. Assume a total acquisition cost of ₹15,000, gross sale proceeds of ₹18,000 and a short-term equity sale meeting the relevant transaction conditions. The engine receives a 1-month holding-period input solely to select its short-term category; this is not a claim about any issue’s actual listing timetable.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">Assume the resident individual’s ordinary income already uses the basic exemption, with no eligible losses to offset, no surcharge and no transaction-cost adjustment. These assumptions make the arithmetic easy to reproduce. They do not describe a real person. All gain and tax outputs below are produced by the site’s capital-gains engine.</p>
<div class="overflow-x-auto mb-6"><table class="w-full text-xs text-left border border-border rounded-card overflow-hidden"><caption class="text-xs text-text-muted text-left p-3 bg-surface border-b border-border">Example — hypothetical short-term equity sale, no surcharge</caption><thead class="bg-surface text-text-primary font-semibold border-b border-border"><tr><th scope="col" class="p-3">Item</th><th scope="col" class="p-3">Amount</th></tr></thead><tbody class="divide-y divide-border text-text-muted"><tr><td class="p-3">Assumed acquisition cost</td><td class="p-3 font-mono">${money(ipoExample.purchasePrice)}</td></tr><tr><td class="p-3">Assumed sale proceeds</td><td class="p-3 font-mono">${money(ipoExample.salePrice)}</td></tr><tr><td class="p-3">Gain</td><td class="p-3 font-mono">${money(ipoExample.gain)}</td></tr><tr><td class="p-3">Base tax</td><td class="p-3 font-mono">${money(ipoExample.taxAmount)}</td></tr><tr><td class="p-3">Cess</td><td class="p-3 font-mono">${money(ipoExample.cess)}</td></tr><tr><td class="p-3">Total tax</td><td class="p-3 font-mono">${money(ipoExample.totalTax)}</td></tr><tr><td class="p-3">Gain after this tax estimate</td><td class="p-3 font-mono">${money(ipoExample.netGain)}</td></tr></tbody></table></div>
<h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">Use the calculators without treating the scenario as a tip</h2>
<p class="text-sm text-text-muted leading-relaxed mb-4">Open the <a href="/in/capital-gains-tax-calculator" class="text-accent font-medium hover:underline">capital gains tax calculator</a> and enter total purchase and sale amounts, the asset category and holding period. Replace the hypothetical inputs with your actual records after a transaction. The result explains tax arithmetic; it cannot predict the opening price or tell you whether to apply.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">The <a href="/in/income-tax-calculator" class="text-accent font-medium hover:underline">income tax calculator</a> helps review ordinary income separately, while the <a href="/in/advance-tax-calculator" class="text-accent font-medium hover:underline">advance tax calculator</a> supports payment planning after the relevant annual tax liability has been established. Do not assume that the isolated capital-gains result is a complete return computation.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">For a longer explanation of the distinction between issue terms and sale assumptions, read our <a href="/blog/jio-platforms-ipo-listing-gains-tax" class="text-accent font-medium hover:underline">Jio IPO listing-gains tax guide</a>. The numerical illustration on this page does not borrow Jio’s price band or lot size. For broader context across assets, see the <a href="/blog/capital-gains-tax-rules" class="text-accent font-medium hover:underline">capital-gains rules guide</a>.</p>
<h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">Make the decision before submitting the bid</h2>
<p class="text-sm text-text-muted leading-relaxed mb-4">Read the risk factors, use of proceeds and business disclosures in the final offer documents. Consider whether the investment suits your capacity to absorb a loss and whether the application money is needed for an essential payment. A convenient minimum application size does not establish that the underlying business is attractive.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">Save the official issue notice with your application records and check for amendments before bidding. If a required field cannot be confirmed, pause the application rather than filling the gap with a rumour. The same discipline applies after listing: use executed sale details when calculating a gain.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4"><strong>This is not investment advice.</strong> No issue on this page is recommended for application or avoidance, and the hypothetical sale is not a target price. The absence of verified entries is not a claim that no IPOs are scheduled; it means this update does not have enough confirmed issue terms to publish application amounts.</p>

<p class="text-xs text-text-muted mt-6">Last updated: 23 October 2026</p>
`,
};
