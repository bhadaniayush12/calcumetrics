import type { BlogPost } from './types';
import { calcFD } from '../../lib/calculators/fd';
import { calcCAGR } from '../../lib/calculators/cagr';
const money = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
export const fdRows = [100000, 500000].flatMap(principal => [1, 3, 5].map(years => {
  const before = calcFD(principal, 5.25, years, 'quarterly');
  const after = calcFD(principal, 5.50, years, 'quarterly');
  // CAGR engine exposes the absolute difference without duplicating a finance formula.
  const extra = calcCAGR(before.maturity, after.maturity, years).absoluteReturn;
  return { principal, years, before, after, extra };
}));
export const RBI_FD_NEWS_POST: BlogPost = {
  "slug": "rbi-repo-rate-5-50-fd-returns-october-2026",
  "title": "RBI repo rate 5.50%: how much more can your FD earn?",
  "seoTitle": "RBI repo rate 5.50%: how much more can your FD earn?",
  "description": "RBI repo rate at 5.50%: compare illustrative FD maturity on ₹1 lakh and ₹5 lakh, check bank pricing and calculate the effect of a rate change.",
  "category": "Investments",
  "market": "India-Only",
  "publishDate": "2026-10-23",
  "dateModified": "2026-10-23",
  "readTime": "7 min read",
  "author": "Dev",
  "type": "Trending",
  "quickAnswer": "RBI raised the repo rate to 5.50% on 7 October 2026, but banks set their own FD rates. The worked table shows what an assumed FD-rate change could add to maturity value; it is not a bank rate announcement.",
  "summary": "Compare a policy signal with actual deposit terms and model the gross maturity difference using our FD engine.",
  "sources": [
    {
      "name": "Reserve Bank of India",
      "url": "https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63744",
      "citation": "Governor’s statement, 7 October 2026; policy decision"
    },
    {
      "name": "Reserve Bank of India",
      "url": "https://www.rbi.org.in/commonman/Upload/English/FAQs/PDFs/FAQIRD01042025.pdf",
      "citation": "Deposit directions FAQ: reinvestment and premature withdrawal"
    }
  ],
  "relatedCalculators": [
    {
      "name": "FD Calculator",
      "path": "/fd-calculator",
      "description": "Compare cumulative maturity at quoted bank rates."
    },
    {
      "name": "Compound Interest Calculator",
      "path": "/compound-interest-calculator",
      "description": "Compare reinvestment frequencies."
    },
    {
      "name": "CAGR Calculator",
      "path": "/cagr-calculator",
      "description": "Annualise a quoted maturity value."
    },
    {
      "name": "Income Tax Calculator",
      "path": "/in/income-tax-calculator",
      "description": "Review ordinary-income tax separately."
    }
  ],
  "relatedArticles": [
    {
      "slug": "sbi-home-loan-rate-hike-october-2026-emi",
      "title": "SBI home-loan EMI guide",
      "description": "Explore the loan side of rate transmission."
    },
    {
      "slug": "diwali-bonus-2026-lump-sum-sip-or-prepay",
      "title": "Diwali bonus planning",
      "description": "Compare uses for available cash."
    }
  ],
  "faqs": [
    {
      "question": "Will my FD automatically earn more after the repo hike?",
      "answer": "No. Banks set deposit rates, and your existing deposit follows its contract. Check a written quote for new or renewed deposits."
    },
    {
      "question": "Are the table rates actual bank offers?",
      "answer": "No. The assumed FD rates mirror the policy levels only to illustrate the change. They are not verified bank offers."
    },
    {
      "question": "Does the worked example include tax?",
      "answer": "No. It shows gross cumulative maturity before tax, fees or premature-withdrawal adjustments."
    },
    {
      "question": "Should I break my existing FD?",
      "answer": "Compare the bank’s actual closure proceeds and replacement offer against leaving the existing deposit to maturity, using the same comparison end date."
    }
  ],
  content: `
<h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">What the policy decision means for a deposit</h2>
<p class="text-sm text-text-muted leading-relaxed mb-4">The <a href="https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63744" class="text-accent font-medium hover:underline">RBI Governor’s statement of 7 October 2026</a> records a repo-rate increase of 25 basis points to 5.50%. That is the policy signal behind this comparison. It does not announce a matching increase for every fixed deposit, and it does not establish the rate available to an individual depositor. Banks price their own deposits according to their funding needs and product terms.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">The practical consequence is that you should compare actual written offers. A bank may change some maturities while leaving others alone. A promotional rate may have conditions, and a renewal quote may differ from the return on a deposit already running. Read the rate against the exact maturity date, deposit type and customer eligibility rather than treating the policy headline as a rate card.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">For someone with money ready to invest, the useful question is how a confirmed deposit-rate change affects maturity value. For someone with an existing FD, it is whether the benefit of switching exceeds the cost of withdrawing early. Those are separate decisions and need different inputs.</p>
<h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">Example: maturity before and after an illustrative rate change</h2>
<p class="text-sm text-text-muted leading-relaxed mb-4">The table uses ₹1 lakh and ₹5 lakh for 1, 3 and 5 years, as requested for this comparison. The assumed FD rates are 5.25% and 5.50%, deliberately matching the policy-rate levels only to illustrate the size of the change. These are <strong>not verified bank FD offers</strong>. Replace them with the rates your bank actually quotes before deciding.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">Both scenarios assume a cumulative deposit with quarterly compounding, reinvested interest and no withdrawals. Every maturity amount comes directly from our FD calculator engine. Figures are rounded to whole rupees for display; the engine retains precision. Tax and premature-withdrawal charges are excluded. The difference therefore shows extra gross maturity value, rather than extra spendable income.</p>
<div class="overflow-x-auto mb-6"><table class="w-full text-xs text-left border border-border rounded-card overflow-hidden"><caption class="text-xs text-text-muted text-left p-3 bg-surface border-b border-border">Example — assumed FD rates only; quarterly compounding, before tax</caption><thead class="bg-surface text-text-primary font-semibold border-b border-border"><tr><th scope="col" class="p-3">Deposit</th><th scope="col" class="p-3">Years</th><th scope="col" class="p-3">At assumed 5.25%</th><th scope="col" class="p-3">At assumed 5.50%</th><th scope="col" class="p-3">Extra maturity</th></tr></thead><tbody class="divide-y divide-border text-text-muted">${fdRows.map(row => `<tr><td class="p-3 font-medium text-text-primary">${money(row.principal)}</td><td class="p-3">${row.years}</td><td class="p-3 font-mono">${money(row.before.maturity)}</td><td class="p-3 font-mono">${money(row.after.maturity)}</td><td class="p-3 font-mono text-accent">${money(row.extra)}</td></tr>`).join('')}</tbody></table></div>
<h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">Use the calculator with a real offer</h2>
<p class="text-sm text-text-muted leading-relaxed mb-4">Open the <a href="/fd-calculator" class="text-accent font-medium hover:underline">FD calculator</a> and enter the amount you intend to place, the bank’s annual rate and the intended term. Select the compounding frequency stated in the product information. Save that result, then change only the interest rate. This isolates the effect of the rate change and avoids mixing a longer commitment with a higher yield.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">The <a href="/compound-interest-calculator" class="text-accent font-medium hover:underline">compound interest calculator</a> helps compare different reinvestment frequencies. The <a href="/cagr-calculator" class="text-accent font-medium hover:underline">CAGR calculator</a> works in the other direction: enter the initial deposit, quoted maturity value and holding period to estimate the annualised growth implicit in that quote. Keep fees and tax treatment consistent when comparing results.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">A payout FD needs different treatment from this table. If interest is paid into your account and spent, it is not also sitting inside the deposit earning interest. Adding a cumulative maturity projection to all the cash payouts would count the same benefit twice. Ask the bank for the payout schedule and maturity proceeds together.</p>
<h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">Existing deposits: check the contract before switching</h2>
<p class="text-sm text-text-muted leading-relaxed mb-4">RBI’s <a href="https://www.rbi.org.in/commonman/Upload/English/FAQs/PDFs/FAQIRD01042025.pdf" class="text-accent font-medium hover:underline">deposit directions FAQ</a> describes reinvestment deposits as reinvesting interest at the contracted rate until maturity. The repo announcement therefore does not, by itself, rewrite the return on an existing contracted deposit. Check the terms on your deposit receipt and the bank’s renewal instructions.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">The same RBI FAQ explains that banks may impose premature-withdrawal penalties under their approved policy. Obtain the amount payable if you close today, rather than subtracting an advertised penalty from the original headline rate yourself. The applicable rate for the period actually completed can matter as well as the explicit charge.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">Then compare the proceeds available today with the return from leaving the deposit alone until its planned maturity. Keep the comparison end date consistent. A larger maturity amount on a fresh, longer deposit does not establish that switching improved the outcome over your original investment period.</p>
<h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">Match the maturity to the spending need</h2>
<p class="text-sm text-text-muted leading-relaxed mb-4">A higher quoted annual rate can look attractive while committing cash beyond the date you need it. Start with the payment you are saving for and work backwards to the deposit maturity. If the money is needed for an essential bill, the ability to receive it on time is part of the decision, alongside the interest earned.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">You can also discuss splitting money across maturities with your bank. That makes some cash available earlier, although it leaves later reinvestment rates uncertain. Do not assume that the rate available today will still be available when the shorter deposit matures. The calculator holds the entered rate constant because that is the scenario being modelled.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">Keep a separate cash buffer for unplanned expenses. Breaking a deposit to meet an urgent bill can change the realised return, so a projection for uninterrupted compounding should not be treated as a promise about every possible outcome. Record the withdrawal conditions when you compare the offers.</p>
<h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">Compare gross returns with the rest of your finances</h2>
<p class="text-sm text-text-muted leading-relaxed mb-4">Use the <a href="/in/income-tax-calculator" class="text-accent font-medium hover:underline">income tax calculator</a> to review ordinary-income tax alongside your wider position. The maturity table is before tax and does not infer your tax bracket. A deduction from an interest payment and the final liability on a return are different items; use the bank’s interest records when reconciling them.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">For the borrowing side of this policy change, read our <a href="/blog/sbi-home-loan-rate-hike-october-2026-emi" class="text-accent font-medium hover:underline">SBI home-loan EMI guide</a>. It covers the loan-payment decision separately. If you are comparing competing uses for festival cash, the <a href="/blog/diwali-bonus-2026-lump-sum-sip-or-prepay" class="text-accent font-medium hover:underline">Diwali bonus guide</a> provides a broader planning framework.</p>
<p class="text-sm text-text-muted leading-relaxed mb-4">Take the bank’s confirmed rate, maturity instructions and withdrawal terms into the final comparison. The policy statement explains why deposit pricing deserves attention; the product contract determines what your money earns. Educational information only; calculator outputs are scenarios, and this article does not recommend a bank or deposit product.</p>

<p class="text-xs text-text-muted mt-6">Last updated: 23 October 2026</p>
`,
};
