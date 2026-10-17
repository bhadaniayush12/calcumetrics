import type { BlogPost } from './types';
import { calcCapitalGains } from '../../lib/tax/india';

const money = (n: number) => `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
const lot = 12;
const cost = lot * 1119;
const scenarios = [1000, 1119, 1250, 1400].map(price => ({ price, ...calcCapitalGains(price * lot, cost, 1, 'equity') }));
const longTerm = calcCapitalGains(1400 * lot, cost, 13, 'equity');
const example = scenarios[3];

export const JIO_IPO_POST: BlogPost = {
  slug: 'jio-platforms-ipo-listing-gains-tax',
  title: 'Jio Platforms IPO: Listing Gains Tax and One-Lot Examples',
  seoTitle: 'Jio Platforms IPO: Listing Gains Tax Explained',
  description: 'Check Jio IPO dates, price band and lot size, then calculate listing gains tax, cess and the difference between short-term and long-term gains.',
  category: 'Taxes', market: 'India-Only', publishDate: '2026-10-17', dateModified: '2026-10-17',
  readTime: '8 min read', author: 'Calcumetrics Editorial Team', type: 'Trending',
  quickAnswer: 'Jio Platforms’ IPO is scheduled for 21–23 October 2026, with a ₹1,065–₹1,119 band and 12-share lot. Eligible listed-equity gains on sales within 12 months attract 20% base tax; after 12 months, 12.5% applies above the shared ₹1.25 lakh annual LTCG exemption. Cess and any surcharge are additional.',
  summary: 'A calculation-led guide to the tax on a possible Jio IPO sale, separating the issue price, hypothetical sale price, taxable gain and cash left after tax.',
  sources: [
    { name: 'Business Standard', citation: 'Jio Platforms Ltd IPO: dates, price band and minimum bid lot; checked 17 October 2026', url: 'https://www.business-standard.com/markets/ipo/jio-platforms-ltd-ipo-78953' },
    { name: 'Income Tax Department', citation: 'FAQs on the capital gains taxation regime, questions 3–7', url: 'https://www.incometaxindia.gov.in/documents/20117/14614766/FAQs%2B-New-Capital-Gains-Taxation-regime.pdf/ad59d362-7bce-f0aa-e483-ce0f61ac13d6?t=1767816817352' },
    { name: 'Income Tax Department', citation: 'Income-tax Act, 2025 as amended by Finance Act, 2026; sections 196 and 198', url: 'https://www.incometaxindia.gov.in/documents/d/guest/income_tax_act_2025_as_amended_by_fa_act_2026-pdf' },
    { name: 'Income Tax Department', citation: 'Capital Gain: computation, holding periods and tax treatment', url: 'https://www.incometaxindia.gov.in/w/capital-gain' },
  ],
  relatedCalculators: [
    { name: 'Capital Gains Tax Calculator', path: '/in/capital-gains-tax-calculator', description: 'Estimate equity gains, base tax and cess.', badge: 'Most Relevant' },
    { name: 'Income Tax Calculator', path: '/in/income-tax-calculator', description: 'Review ordinary income separately from special-rate capital gains.' },
  ],
  relatedArticles: [{ slug: 'capital-gains-tax-rules', title: 'Capital Gains Tax Rules', description: 'Compare the wider rules across asset types.' }],
  faqs: [
    { question: 'How much capital gains tax will apply to one Jio IPO lot?', answer: `It depends on the actual sale price. At an assumed ₹1,119 allotment price and hypothetical ₹1,400 sale price, the engine gives ${money(example.gain)} gain and ${money(example.totalTax)} tax including cess, before surcharge or individual adjustments.` },
    { question: 'Is the ₹1.25 lakh exemption available on listing-day gains?', answer: 'No. That annual exemption belongs to eligible long-term equity gains. A listing-day sale of IPO-allotted shares is short-term.' },
    { question: 'Does the calculator predict Jio’s listing price?', answer: 'No. Every sale price in the example table is a hypothetical input. The calculator estimates tax on the inputs; it does not forecast prices, allotment or returns.' },
    { question: 'Is the exemption separate for every IPO?', answer: 'No. Eligible long-term gains share the annual exemption across the relevant equity investments. Do not claim the full allowance independently for each sale.' },
  ],
  content: `
<p>Jio Platforms’ IPO is scheduled to open on <strong>21 October 2026</strong> and close on <strong>23 October 2026</strong>. Business Standard’s issue page lists a price band of <strong>₹1,065–₹1,119 per share</strong> and a minimum lot of <strong>12 shares</strong>. Those details describe the offer. They do not tell you what the shares will sell for once trading begins.</p>
<p>For someone thinking through the arithmetic, the useful question is how much of a possible gain remains after tax. A headline percentage return leaves that out. This guide uses one lot and several hypothetical sale prices to make the distinction visible. It does not assess whether Jio is a suitable investment or recommend applying for the issue.</p>
<h2>What price should you enter as your purchase cost?</h2>
<p>Use the actual amount paid for the shares you receive. For the examples below, we assume allotment at the upper end of the band, ₹1,119, without a category-specific discount. One 12-share lot therefore has an assumed cost of <strong>${money(cost)}</strong>. If the final allotment price or your applicable purchase cost differs, replace that input before relying on the result.</p>
<p>The lower end of a price band is not automatically the price an investor pays. Equally, an amount blocked during an application is not proof that shares have been allotted. Keep the allotment record and the eventual sale contract note together: they provide the inputs needed for a gain calculation.</p>
<p>The issue dates, band and lot size were checked on the linked Business Standard page on 17 October. Any later official revision would take priority. No grey-market premium has been used as a forecast, and none of the sale prices in this article is a target price.</p>
<h2>Short-term versus long-term capital gains on equity</h2>
<p>For eligible listed equity sold through a transaction subject to the relevant securities transaction tax conditions, the short-term capital gains tax rate is <strong>20%</strong>. A holding period of 12 months or less is short-term. More than 12 months is long-term, with <strong>12.5%</strong> base tax on eligible annual long-term gains exceeding <strong>₹1.25 lakh</strong>.</p>
<p>The Income Tax Department’s capital-gains FAQ explains the rate changes. For tax years governed by the Income-tax Act, 2025, the corresponding listed-equity provisions are sections 196 and 198. Older explanations refer to sections 111A and 112A. The familiar rate labels and the current statutory section labels should not be confused.</p>
<p>These are base rates, not a promise that everyone pays exactly that percentage of their profit. Cess and, where applicable, surcharge affect the bill. The examples assume a resident individual whose basic exemption is already used, no surcharge, no loss adjustments and no transaction costs. They are isolated-sale estimates rather than complete return calculations.</p>
<h2>One lot at four hypothetical sale prices</h2>
<p>Each row below uses Calcumetrics’ capital-gains engine with the equity setting and a one-month holding-period input to represent the short-term category. The sale value is the assumed share price multiplied by the lot size. Tax includes the engine’s health and education cess calculation. Figures retain paise so that the columns can be reconciled.</p>
<div class="overflow-x-auto"><table><caption>One 12-share lot, assumed allotment price ₹1,119; hypothetical short-term sale</caption><thead><tr><th>Sale price per share</th><th>Sale proceeds</th><th>Gain / loss</th><th>Base tax</th><th>Tax with cess</th><th>Gain / loss after tax</th></tr></thead><tbody>
${scenarios.map(r => `<tr><td>${money(r.price)}</td><td>${money(r.salePrice)}</td><td>${money(r.gain)}</td><td>${money(r.taxAmount)}</td><td>${money(r.totalTax)}</td><td>${money(r.netGain)}</td></tr>`).join('')}
</tbody></table></div>
<p>Read the last column as profit or loss after the modelled tax, not as the total cash received on sale. Your original capital is separate. The broker’s eventual settlement amount can also reflect transaction charges, so it need not equal a simple sale-proceeds-minus-tax estimate.</p>
<p>The loss row matters as much as the profitable rows. The engine shows no positive capital-gains tax when sale proceeds fall below cost, but that does not recover the money lost. It also does not decide how a loss interacts with other transactions in your return. Avoid treating a zero in the tax column as a favourable investment outcome.</p>
<h2>Walk through the ₹1,400 scenario</h2>
<p>At a hypothetical ₹1,400 sale price, proceeds are ${money(example.salePrice)}. Against the assumed purchase cost of ${money(cost)}, the engine calculates a gain of ${money(example.gain)}. Base tax is ${money(example.taxAmount)}, cess is ${money(example.cess)}, and total modelled tax is ${money(example.totalTax)}. That leaves ${money(example.netGain)} of the gain before trading costs.</p>
<p>This calculation answers a narrow question: what is the estimated tax if those inputs become true? It says nothing about the likelihood of that price. A different execution price changes the gain immediately. Someone selling part of a holding should enter only the shares actually sold and their relevant acquisition cost, rather than treating the whole allotted holding as one completed sale.</p>
<h2>What changes if the shares are held longer?</h2>
<p>To isolate the tax category, keep the same purchase and hypothetical sale values but change the holding input to 13 months. With the full annual exemption still available, the engine gives <strong>${money(longTerm.totalTax)}</strong> tax on this isolated example. That is a conditional result, not a forecast of a future sale or future tax legislation.</p>
<p>The exemption is shared across eligible long-term gains during the year. It is not a fresh allowance for each company, each broker account or each IPO. If other eligible sales have already absorbed it, a standalone result that assumes the whole allowance remains will understate your position. Review the annual portfolio total before estimating what remains available.</p>
<p>Waiting for a different tax category also leaves the investment exposed to market movements. Comparing a lower tax percentage with a higher one is insufficient when the eventual sale price is unknown. A tax saving cannot be evaluated independently of a possible change in the value of the holding.</p>
<h2>Use the calculator with records, not remembered prices</h2>
<p>Open the <a href="/in/capital-gains-tax-calculator">capital gains tax calculator</a>, select equity, and enter purchase value, sale value and holding period. Keep the source documents alongside it. A quoted market price, a limit order that never executed and the price on the executed contract note are different things; the completed transaction is the useful starting point.</p>
<p>Check the output labels before copying a number into a personal spreadsheet. Gross gain, taxable gain, tax and net gain answer different questions. If a result looks unexpectedly small, inspect the holding-period input and exemption assumption first. Re-running the same transaction with a mistaken category can produce a precise-looking but inappropriate answer.</p>
<p>For salary and other ordinary income, the <a href="/in/income-tax-calculator">income tax calculator</a> offers a separate view. Do not assume a salary rebate estimate automatically settles the tax on special-rate gains. A combined return requires attention to the interaction between income categories and your personal circumstances.</p>
<h2>Before treating the estimate as money available to spend</h2>
<p>Keep a record of the allotment, actual sale, costs and the estimate you used. If the money is earmarked for a bill, allow for the fact that the calculator is not your broker’s settlement statement or a tax filing service. Revisiting the calculation after execution is more useful than saving a speculative profit figure before the issue opens.</p>
<p>Our broader <a href="/blog/capital-gains-tax-rules">capital gains tax rules guide</a> covers other assets. This article stays with the IPO equity example because importing a property or debt-fund rule would change the answer. Non-resident treatment, business trading income, surcharge and portfolio loss adjustments are outside these worked examples.</p>
<p><strong>Educational information only; not financial advice.</strong> This article does not recommend buying, applying for, holding or selling any security. Check the final offer documents and obtain qualified tax advice for your own return.</p>
`,
};
