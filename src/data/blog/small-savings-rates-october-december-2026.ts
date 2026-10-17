import type { BlogPost } from './types';
import { calcPPF } from '../../lib/calculators/ppf';
import { calcRD } from '../../lib/calculators/rd';
const money = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const ppf = calcPPF(100000, 7.1, 15);
const rd = calcRD(5000, 6.7, 5);
export const SMALL_SAVINGS_POST: BlogPost = {
  slug: 'small-savings-rates-october-december-2026',
  title: 'Small Savings Rates: October–December 2026 (Q3 FY27)',
  seoTitle: 'Small Savings Rates: October–December 2026',
  description: 'See the Oct–Dec 2026 rates for PPF, NSC, SCSS, SSY, KVP, Post Office TD, RD and MIS, with calculator examples and clear compounding assumptions.',
  category: 'Investments', market: 'India-Only', publishDate: '2026-10-17', dateModified: '2026-10-17', readTime: '8 min read', author: 'Calcumetrics Editorial Team', type: 'Trending',
  quickAnswer: 'Small-savings rates are unchanged for 1 October–31 December 2026 under the 30 September memorandum: PPF 7.1%, NSC 7.7%, SCSS and SSY 8.2%, KVP 7.5%, RD 6.7%, MIS 7.4%, and Post Office time deposits 6.9%–7.5% depending on term. These are annual rates.',
  summary: 'The Q3 FY 2026-27 rate table, a PPF projection and a Post Office RD estimate, with an explanation of payout versus compounding and what a quarterly announcement can establish.',
  sources: [
    { name: 'Ministry of Finance / Department of Posts', citation: '30 September 2026 memorandum, reproduced in SB Order 12/2026; PDF page 2', url: 'https://utilities.cept.gov.in/dop/pdfbind.ashx?id=15533' },
    { name: 'Indian Bank', citation: 'Official small-savings table for 1 October–31 December 2026', url: 'https://indianbank.bank.in/en/interest-rates-for-small-savings-schemes' },
    { name: 'Economic Times', citation: 'Quarterly rates table including five-year RD, 30 September 2026, updated 1 October', url: 'https://economictimes.indiatimes.com/wealth/save/has-government-increased-small-savings-scheme-ppf-scss-nsc-ssa-kvp-fd-mis-interest-rates-for-october-december-2026-quarter/articleshow/134583960.cms' },
    { name: 'State Bank of India', citation: 'PPF scheme: annual deposit limits, duration and interest calculation', url: 'https://sbi.bank.in/web/personal-banking/investments-deposits/govt-schemes/ppf' },
  ],
  relatedCalculators: [
    { name: 'PPF Calculator', path: '/in/ppf-calculator', description: 'Project annual contributions with explicit rate assumptions.', badge: 'Most Relevant' },
    { name: 'Recurring Deposit Calculator', path: '/rd-calculator', description: 'Estimate monthly deposits using quarterly compounding.' },
    { name: 'FD Calculator', path: '/fd-calculator', description: 'Explore deposit compounding and maturity estimates.' },
  ],
  relatedArticles: [
    { slug: 'ppf-interest-calculation-5th-day-rule', title: 'PPF Interest and the Fifth-Day Rule', description: 'Understand how deposit timing affects interest.' },
    { slug: 'fd-rates-after-rbi-hike-lock-now-or-wait', title: 'FD Rates After the RBI Hike', description: 'Read the separate discussion of bank-deposit timing.' },
  ],
  faqs: [
    { question: 'Did PPF rates increase for October–December 2026?', answer: 'No. PPF remains at 7.1% a year for this quarter. The 30 September 2026 memorandum leaves small-savings rates unchanged from the preceding quarter.' },
    { question: 'How is recurring deposit interest calculated?', answer: 'The site’s engine compounds each monthly deposit for its own remaining time using quarterly compounding and fractional quarters. Later instalments earn for less time than earlier ones. Its output is an estimate, not an official Post Office maturity quote.' },
    { question: 'Does a PPF calculator guarantee the maturity amount?', answer: 'No. The example holds the current rate constant for the projection and assumes each annual contribution earns a full year of interest. Actual rates and deposit dates can change the result.' },
    { question: 'How do I use an FD calculator for a time deposit?', answer: 'Enter the relevant annual rate, principal and term, then check whether the product pays interest out or retains it. A cumulative maturity calculation must not be mistaken for a payout product’s actual closing balance.' },
  ],
  content: `
<p><strong>Small-savings rates are unchanged for October–December 2026, the third quarter of FY 2026-27.</strong> The Ministry of Finance memorandum dated 30 September keeps the previous quarter’s rates in place from 1 October to 31 December. PPF remains at 7.1% a year; SCSS and Sukanya Samriddhi remain at 8.2%.</p>
<p>For a saver, “unchanged” answers only the first question. You still need to know whether money goes in monthly or once, whether interest is paid out or retained, and when you will need access to the deposit. A higher annual percentage does not make two schemes interchangeable.</p>
<h2>The October–December 2026 rate table</h2>
<p>The memorandum is reproduced in the Department of Posts order linked below. Indian Bank’s official table supplies the scheme rates, with the five-year RD rate cross-checked in Economic Times’ quarterly table. The figures here are annual interest rates, even where a product distributes interest monthly or quarterly.</p>
<div class="overflow-x-auto"><table><caption>Q3 FY 2026-27: annual rates applicable from 1 October to 31 December 2026</caption><thead><tr><th>Scheme</th><th>Annual rate</th><th>How to read it</th></tr></thead><tbody>
<tr><td>Public Provident Fund (PPF)</td><td>7.1%</td><td>Annual interest credit; future rates can change</td></tr>
<tr><td>National Savings Certificate (NSC)</td><td>7.7%</td><td>Annual compounding</td></tr>
<tr><td>Senior Citizens Savings Scheme (SCSS)</td><td>8.2%</td><td>Quarterly interest payout</td></tr>
<tr><td>Sukanya Samriddhi (SSY / SSA)</td><td>8.2%</td><td>Annual compounding</td></tr>
<tr><td>Kisan Vikas Patra (KVP)</td><td>7.5%</td><td>Notified maturity: 115 months</td></tr>
<tr><td>Post Office time deposit: 1 year</td><td>6.9%</td><td>Quarterly interest calculation</td></tr>
<tr><td>Post Office time deposit: 2 years</td><td>7.0%</td><td>Quarterly interest calculation</td></tr>
<tr><td>Post Office time deposit: 3 years</td><td>7.1%</td><td>Quarterly interest calculation</td></tr>
<tr><td>Post Office time deposit: 5 years</td><td>7.5%</td><td>Quarterly interest calculation</td></tr>
<tr><td>Post Office recurring deposit: 5 years</td><td>6.7%</td><td>Monthly contributions; quarterly compounding</td></tr>
<tr><td>Monthly Income Scheme (MIS)</td><td>7.4%</td><td>Monthly payout, not monthly compounding</td></tr>
</tbody></table></div>
<p>Indian Bank specifies that its listed SCSS, KVP, NSC, time-deposit and MIS rates apply to accounts opened during this quarter. Do not overwrite the rate on an older certificate simply because a current table has a different date. Match the scheme, opening date and account terms before calculating.</p>
<h2>What the notification does not promise</h2>
<p>The government has confirmed this quarter’s rates. It has not promised that a long-term PPF projection will earn today’s rate throughout its life. Nor does the notification tell us what the next quarterly review will decide. A calculator needs a rate input to produce a scenario; that necessary assumption should remain visible beside the answer.</p>
<p>Keep that distinction in mind when comparing a maturity quote with a projection. A quote tied to a particular deposit’s terms and an illustration that extends the current rate into future years are different documents. Saving the assumptions with the result makes it easier to revisit the plan when new rates are announced.</p>
<h2>A PPF example with annual contributions</h2>
<p>Assume ₹1,00,000 is deposited at the beginning of every modelled year for 15 years, with the rate held at 7.1%. Calcumetrics’ <strong>calcPPF</strong> function adds each annual contribution before calculating that year’s interest. The <a href="/in/ppf-calculator">PPF calculator</a> therefore projects the following:</p>
<table><caption>PPF illustration: constant rate and full-year interest on each annual deposit</caption><tbody>
<tr><th>Total contributions</th><td>${money(ppf.invested)}</td></tr>
<tr><th>Projected interest</th><td>${money(ppf.interest)}</td></tr>
<tr><th>Projected balance</th><td>${money(ppf.maturity)}</td></tr>
</tbody></table>
<p>This is a simplified 15-year contribution model, not a precise account-opening-to-closure calendar. SBI describes the scheme duration as 15 years, with account rules governing the actual maturity date. If you start partway through a financial year, the first period and the calendar maturity need separate attention.</p>
<p>Deposit timing also matters. The engine’s annual assumption gives every contribution a full year of interest. Money contributed later does not earn as though it had been present all year. Our <a href="/blog/ppf-interest-calculation-5th-day-rule">PPF interest timing guide</a> explains the monthly balance rule; use the account statement when reconciling actual interest.</p>
<p>SBI lists an annual PPF deposit range of ₹500 to ₹1,50,000. The example is a chosen contribution within that range, not a recommendation to maximise it. A PPF maturity calculator helps estimate a goal, but it cannot decide how much of your available cash should be committed to a long-term account.</p>
<h2>A Post Office RD example for monthly saving</h2>
<p>Now assume ₹5,000 is deposited every month for five years at 6.7%. Using <strong>calcRD(5000, 6.7, 5)</strong>, the <a href="/rd-calculator">recurring deposit calculator</a> gives total deposits of <strong>${money(rd.invested)}</strong>, estimated interest of <strong>${money(rd.interest)}</strong>, and an estimated maturity value of <strong>${money(rd.maturity)}</strong>.</p>
<p>The engine grows each instalment for its remaining months using quarterly compounding, including fractional quarters. It assumes regular beginning-of-period contributions. It does not reproduce every operational detail of the Post Office’s maturity tables, late-payment treatment or rounding. Confirm the official maturity quote before treating this estimate as a promised payment.</p>
<p>Notice why multiplying the final total deposits by the annual rate and the full term would be wrong. Most of that money was not present on the first day. Each later instalment has less time to earn interest. The recurring-deposit interest calculator tracks that difference rather than treating all contributions as one opening lump sum.</p>
<h2>Income paid out is different from growth left inside</h2>
<p>MIS provides a monthly payout, while SCSS pays interest quarterly. If that income is spent, it does not remain in the account to generate additional returns. A compound-growth illustration that assumes reinvestment would describe a separate action by the saver, not the payout product alone.</p>
<p>This is also why a search for “bank FD interest payout quarterly versus monthly” needs more than a rate comparison. Ask where the interest goes, how often it is credited and whether a quoted maturity includes reinvestment. A cumulative FD maturity amount calculator answers a different question from a household income schedule.</p>
<p>The <a href="/fd-calculator">FD calculator</a> is useful for exploring compounding assumptions. When using it alongside a Post Office time deposit, confirm the product’s payment rules first. Do not infer that a quarterly calculation frequency necessarily means all interest remains invested until maturity.</p>
<h2>Choose the cash-flow pattern before comparing percentages</h2>
<p>Start with the date the money is needed. If it funds an upcoming expense, access conditions deserve attention before the interest rate. If the goal is building a balance from salary, a regular contribution model may be easier to maintain than a large annual deposit. If the aim is income, a payout schedule needs to match the household budget.</p>
<p>Eligibility is another filter. SCSS and SSY are designed around particular beneficiaries; a rate table is not confirmation that every reader can open either account. Check the relevant scheme’s eligibility, ownership and withdrawal conditions with the bank or Post Office. This article intentionally does not reproduce limits that have not been independently checked for each scheme.</p>
<p>Tax should be reviewed separately as well. A contribution deduction, the tax treatment of interest and the tax treatment of withdrawal are distinct questions. Do not assume every small-savings scheme shares PPF’s treatment, or that an old-regime deduction remains available under the new regime. Keep any expected tax benefit out of a comparison until you have established eligibility.</p>
<h2>Keep the projection useful after this quarter</h2>
<p>Record the rate, contribution amount, deposit timing and calculation date alongside a saved result. When reviewing the plan later, update the inputs that actually changed. This makes a long-term projection a working estimate instead of a number detached from its assumptions.</p>
<p>For bank-deposit timing, see the separate <a href="/blog/fd-rates-after-rbi-hike-lock-now-or-wait">FD rates after the RBI hike</a> discussion. <strong>Educational information only; not financial advice.</strong> The rate table covers this quarter; the worked maturity figures are calculator estimates, not official account quotations.</p>
`,
};
