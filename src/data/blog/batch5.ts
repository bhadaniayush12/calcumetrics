import type { BlogPost } from './types';

export const BATCH_5_POSTS: BlogPost[] = [
  {
    slug: 'debt-to-income-ratio-uk',
    title: 'Debt-to-Income Ratio in the UK: What Lenders Actually Look At (And How to Calculate Yours)',
    seoTitle: 'Debt-to-Income Ratio UK: Mortgage Rules & Calculator | Calcumetrics',
    description:
      'UK mortgage lenders use Loan-to-Income multiples and stress tests instead of DTI. Learn how affordability works and calculate your ratio under FCA rules.',
    category: 'Loans',
    publishDate: '2026-09-30',
    dateModified: '2026-09-30',
    readTime: '9 min read',
    market: 'Global',
    author: 'Dev',
    reviewer: 'Methodology reviewed by the Calcumetrics team',
    quickAnswer:
      'UK mortgage lenders primarily use a Loan-to-Income (LTI) multiple — typically capped at 4.5× annual income — rather than a US-style DTI percentage. However, lenders also run a full affordability assessment that functions similarly to DTI: monthly committed debt repayments ÷ monthly gross income. A ratio below 43% is the broad threshold most lenders are comfortable with.',
    type: 'Evergreen',
    summary:
      'In the UK, the term "debt-to-income ratio" is rarely used by mortgage lenders in the way US lenders use it. Instead, the FCA and PRA govern lending through two overlapping frameworks: an LTI cap (most lenders cannot grant more than 15% of new mortgage volume at over 4.5× income) and a granular monthly affordability assessment. Understanding both is essential for UK borrowers seeking mortgage approval.',
    sources: [
      {
        name: 'Financial Conduct Authority (FCA)',
        citation: 'Mortgage Credit Directive, MCOB 11: Responsible Lending — UK Mortgage Affordability Rules',
        url: 'https://www.fca.org.uk',
      },
      {
        name: 'Bank of England / Prudential Regulation Authority (PRA)',
        citation: 'PRA Supervisory Statement SS13/16: Underwriting Standards for Buy-to-Let Mortgage Contracts',
        url: 'https://www.bankofengland.co.uk',
      },
      {
        name: 'Money and Pensions Service (MaPS)',
        citation: 'UK Mortgage Affordability Guidance — MoneyHelper',
        url: 'https://www.moneyhelper.org.uk',
      },
    ],
    relatedCalculators: [
      {
        name: 'Debt-to-Income Ratio Calculator',
        path: '/debt-to-income-ratio-calculator',
        description: 'Calculate your monthly DTI ratio across all committed debt obligations.',
        badge: 'Most Relevant',
      },
      {
        name: 'Mortgage Calculator',
        path: '/mortgage-calculator',
        description: 'Estimate monthly mortgage payment, down payment impact, and total interest.',
      },
      {
        name: 'Loan Affordability Calculator',
        path: '/loan-affordability-calculator',
        description: 'Calculate the maximum loan you can borrow based on your income and expenses.',
      },
    ],
    relatedArticles: [
      {
        slug: 'debt-to-income-ratio-for-mortgage',
        title: 'Debt-to-Income (DTI) Ratio for Mortgage Approval: Front-End vs. Back-End Limits',
        description: 'Learn the US-style front-end and back-end DTI rules and how lenders use them to set borrowing limits.',
      },
      {
        slug: 'how-mortgage-amortization-works',
        title: 'How Mortgage Amortization Works: Every Payment Explained (With the Exact Math)',
        description: 'Understand exactly how each mortgage payment splits between principal and interest.',
      },
    ],
    faqs: [
      {
        question: 'Do UK mortgage lenders use a debt-to-income ratio?',
        answer:
          "UK lenders do not typically use the term 'DTI ratio' the way US lenders do. Instead, they assess affordability through two FCA-mandated lenses: a Loan-to-Income (LTI) multiple and a detailed monthly income-minus-expenditure affordability test. The outcome of the affordability test is functionally equivalent to a back-end DTI calculation.",
      },
      {
        question: 'What is the UK mortgage income multiple?',
        answer:
          "Most high-street UK lenders offer a maximum of 4 to 4.5 times your gross annual income. The Bank of England imposes a regulatory limit: no more than 15% of a lender's new mortgage volume may exceed a 4.5x LTI multiple. Some specialist lenders can go to 5x or 5.5x for high earners, typically those earning above £75,000.",
      },
      {
        question: 'What counts as committed expenditure in a UK affordability assessment?',
        answer:
          'UK lenders count: existing personal loan and car finance repayments, credit card minimum payments, student loan deductions (Plan 1 or Plan 2), child maintenance obligations, ground rent and service charges (for leasehold properties), and any other regular debt payments appearing on bank statements.',
      },
      {
        question: 'How does the FCA stress test affect how much I can borrow?',
        answer:
          "The FCA's 2014 Mortgage Market Review (MMR) requires lenders to stress-test your affordability at a rate that is typically 2–3 percentage points above the initial rate. This means if you apply at 5%, the lender checks whether you could still afford payments at 7–8%. The stress test effectively reduces maximum borrowing power compared to what the headline LTI multiple alone would suggest.",
      },
      {
        question: 'What is a good debt-to-income ratio for a UK mortgage?',
        answer:
          "Using the US-style DTI framework as a reference: below 36% is considered strong, and most lenders prefer total committed debt repayments (including the new mortgage) to stay under 43% of gross monthly income. In UK lender terms, the equivalent signal is that your residual disposable income after all committed expenditure should comfortably exceed the lender's minimum threshold — typically £600–£900 per month for a single applicant after all bills.",
      },
    ],
    content: `
      <p class="lead text-base sm:text-lg text-text-primary leading-relaxed font-normal mb-6">
        If you have searched "debt to income ratio UK" expecting a simple calculation like the US version — 28% front-end, 43% back-end, done — you are about to discover that UK mortgage underwriting works quite differently. Not worse. Just built on a different regulatory architecture.
      </p>

      <p class="text-sm text-text-muted leading-relaxed mb-6">
        The fundamental question every mortgage lender asks is the same everywhere: <em>"Can this borrower comfortably repay the loan without financial distress?"</em> The UK has a specific legal framework for how that question gets answered, introduced after the 2007–08 financial crisis exposed the consequences of lax affordability checks.
      </p>

      <div class="my-8 p-5 bg-surface border border-border rounded-card">
        <h3 class="text-xs uppercase tracking-wider font-semibold text-text-muted mb-2">Calculate Your Ratio Now</h3>
        <p class="text-xs text-text-muted mb-3">Enter your monthly income and all committed debt repayments to see your DTI percentage and where it stands:</p>
        <div class="flex flex-wrap gap-2">
          <a href="/debt-to-income-ratio-calculator" class="inline-flex items-center px-3 py-1.5 rounded-control text-xs font-semibold bg-canvas border border-border hover:border-accent text-text-primary hover:text-accent transition-standard">DTI Calculator &rarr;</a>
          <a href="/loan-affordability-calculator" class="inline-flex items-center px-3 py-1.5 rounded-control text-xs font-semibold bg-canvas border border-border hover:border-accent text-text-primary hover:text-accent transition-standard">Affordability Calculator &rarr;</a>
        </div>
      </div>

      <h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">1. Why UK Lenders Use LTI, Not DTI</h2>
      <p class="text-sm text-text-muted leading-relaxed mb-4">
        After the global financial crisis, the Bank of England's Financial Policy Committee identified a specific risk: when house prices rise faster than incomes, borrowers take on ever-larger multiples of their salary as debt. To contain this, the FCA and Bank of England introduced <strong>Loan-to-Income (LTI) limits</strong> as a blunt but effective macro-prudential cap.
      </p>
      <p class="text-sm text-text-muted leading-relaxed mb-6">
        The rule is straightforward: lenders cannot extend more than <strong>15% of their new mortgage volume at LTI multiples above 4.5&times;</strong>. In practice, most high-street lenders set their internal cap at exactly 4.5&times; for most applicants, regardless of their actual DTI ratio.
      </p>

      <div class="overflow-x-auto mb-6">
        <table class="w-full text-xs text-left border border-border rounded-card overflow-hidden">
          <thead class="bg-surface text-text-primary font-semibold border-b border-border">
            <tr>
              <th class="p-3">Framework</th>
              <th class="p-3">Metric</th>
              <th class="p-3">Typical UK Limit</th>
              <th class="p-3">Who Sets It</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border text-text-muted">
            <tr>
              <td class="p-3 font-medium text-text-primary">LTI Cap</td>
              <td class="p-3 font-mono">Loan Amount &divide; Gross Annual Income</td>
              <td class="p-3 font-mono text-accent font-semibold">&le; 4.5&times; (regulatory)</td>
              <td class="p-3">Bank of England / PRA</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-text-primary">Affordability Assessment</td>
              <td class="p-3 font-mono">Monthly committed debt &divide; gross monthly income</td>
              <td class="p-3 font-mono">No fixed % — lender discretion</td>
              <td class="p-3">FCA (MCOB 11)</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-text-primary">Stress Test</td>
              <td class="p-3 font-mono">Can borrower afford payment at rate +2–3%?</td>
              <td class="p-3 font-mono">Must pass</td>
              <td class="p-3">FCA Mortgage Market Review (MMR)</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-text-primary">Residual Income</td>
              <td class="p-3 font-mono">Net income after all committed payments</td>
              <td class="p-3 font-mono">Typically &ge; £600–900/mo</td>
              <td class="p-3">Individual lender policy</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">2. How to Calculate Your UK-Equivalent DTI</h2>
      <p class="text-sm text-text-muted leading-relaxed mb-4">
        Even though UK lenders do not formally call it DTI, you can calculate an equivalent ratio yourself. It is a useful pre-application sanity check before you sit down with a broker or lender.
      </p>

      <div class="p-5 bg-surface border border-border rounded-card mb-6">
        <h3 class="text-sm font-bold text-text-primary mb-3">Step-by-step calculation</h3>
        <p class="text-xs font-mono text-text-primary bg-canvas/60 p-3 rounded border border-border mb-4">
          Monthly DTI (%) = (Total Monthly Committed Debt Payments &divide; Gross Monthly Income) &times; 100
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-muted">
          <div>
            <p class="font-semibold text-text-primary mb-2">Include in "committed debt payments":</p>
            <ul class="space-y-1 list-disc pl-4 leading-relaxed">
              <li>New mortgage monthly payment (proposed)</li>
              <li>Existing personal loan instalments</li>
              <li>Car finance / PCP monthly payment</li>
              <li>Credit card minimum payments</li>
              <li>Student loan deductions (Plan 1 or Plan 2)</li>
              <li>Child maintenance payments (court-ordered)</li>
              <li>Ground rent and service charges (leasehold)</li>
            </ul>
          </div>
          <div>
            <p class="font-semibold text-text-primary mb-2">Use gross (pre-tax) income:</p>
            <ul class="space-y-1 list-disc pl-4 leading-relaxed">
              <li>Employed: gross salary on payslip</li>
              <li>Self-employed: average of 2–3 years' net profit (SA302)</li>
              <li>Bonus / overtime: 50–100% depending on lender and consistency</li>
              <li>Rental income: typically 70–80% of gross rent recognised</li>
              <li>Investment income: lender-specific — some exclude it entirely</li>
            </ul>
          </div>
        </div>
      </div>

      <h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">3. A Worked UK Example</h2>
      <p class="text-sm text-text-muted leading-relaxed mb-4">
        Consider a couple applying for a joint mortgage in England:
      </p>

      <div class="overflow-x-auto mb-6">
        <table class="w-full text-xs text-left border border-border rounded-card overflow-hidden">
          <thead class="bg-surface text-text-primary font-semibold border-b border-border">
            <tr>
              <th class="p-3">Item</th>
              <th class="p-3">Monthly Amount</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border text-text-muted">
            <tr><td class="p-3 font-medium text-text-primary">Combined gross monthly income</td><td class="p-3 font-mono font-bold text-text-primary">£6,000</td></tr>
            <tr><td class="p-3">Proposed mortgage payment</td><td class="p-3 font-mono">£1,400</td></tr>
            <tr><td class="p-3">Car finance (joint)</td><td class="p-3 font-mono">£350</td></tr>
            <tr><td class="p-3">Personal loan (Partner 1)</td><td class="p-3 font-mono">£180</td></tr>
            <tr><td class="p-3">Credit card minimums</td><td class="p-3 font-mono">£75</td></tr>
            <tr><td class="p-3">Plan 2 student loan (Partner 2)</td><td class="p-3 font-mono">£95</td></tr>
            <tr class="bg-canvas font-semibold text-text-primary">
              <td class="p-3">Total committed payments</td>
              <td class="p-3 font-mono">£2,100</td>
            </tr>
            <tr class="bg-surface font-bold text-text-primary">
              <td class="p-3 text-accent">DTI Ratio</td>
              <td class="p-3 font-mono text-accent">£2,100 &divide; £6,000 = <strong>35.0%</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-sm text-text-muted leading-relaxed mb-4">
        A 35% ratio is healthy. Most lenders would be comfortable here, assuming the couple also clears the LTI test: combined salary of £72,000 per year, a mortgage of £1,400/month at 5% over 25 years implies a loan of roughly £247,000 — an LTI of 3.43&times;, well inside the 4.5&times; cap.
      </p>

      <h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">4. The FCA Stress Test: The Hidden Limit</h2>
      <p class="text-sm text-text-muted leading-relaxed mb-4">
        LTI and DTI are not the only gates. UK lenders must also confirm the borrower can handle repayments if interest rates rise materially. This stress test has a real effect on maximum loan sizes.
      </p>
      <p class="text-sm text-text-muted leading-relaxed mb-6">
        If a lender's standard variable rate (SVR) is 6.5%, the affordability calculation is often done at 9–9.5%. That gap between the actual initial rate and the stress rate can reduce maximum borrowing capacity by 10–20% compared to what the headline LTI multiple alone would permit. Some brokers frame it this way: <em>"The LTI cap is what the regulator allows in theory. The stress test is what the market allows in practice."</em>
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div class="p-4 bg-surface border border-border rounded-card">
          <h3 class="text-sm font-bold text-text-primary mb-2">Good DTI signals for UK lenders</h3>
          <ul class="text-xs text-text-muted space-y-1.5 list-disc pl-4 leading-relaxed">
            <li>DTI equivalent below 36% with stable, verifiable income</li>
            <li>LTI multiple at or below 4.0&times; (leaves headroom)</li>
            <li>No missed payments or CCJs in the last 3 years</li>
            <li>Deposit of 10–20%+ (lower LTV also reduces risk weighting)</li>
            <li>Residual income clearly above the lender's minimum floor</li>
          </ul>
        </div>
        <div class="p-4 bg-surface border border-border rounded-card">
          <h3 class="text-sm font-bold text-text-primary mb-2">Common reasons UK affordability fails</h3>
          <ul class="text-xs text-text-muted space-y-1.5 list-disc pl-4 leading-relaxed">
            <li>High credit card balances (minimum payments inflate DTI)</li>
            <li>Multiple car finance agreements</li>
            <li>Self-employed income averaged during a low-profit year</li>
            <li>Student loan deductions on high income reducing net pay</li>
            <li>Failing the stress test at the projected SVR — even when current payments are comfortable</li>
          </ul>
        </div>
      </div>

      <h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">5. One Important Difference from the US DTI Model</h2>
      <p class="text-sm text-text-muted leading-relaxed mb-4">
        US mortgage guidelines (Fannie Mae, FHA) publish clear DTI cutoffs: 28% front-end, 36–43% back-end. UK lenders are not legally required to disclose their specific DTI or residual-income thresholds. They are only required by the FCA to document that a <em>reasonable and proportionate</em> assessment was done.
      </p>
      <p class="text-sm text-text-muted leading-relaxed mb-6">
        This opacity is not accidental. The FCA deliberately avoided prescribing a single DTI number because what counts as "affordable" varies by income level. A £200/month debt repayment means something very different to someone earning £18,000 versus £80,000. UK lenders therefore run lender-specific models — which is why two lenders can give meaningfully different maximum loan offers to the same applicant.
      </p>

      <div class="p-4 bg-surface border border-accent/30 rounded-card my-6 text-xs text-text-muted">
        <strong class="text-text-primary text-sm block mb-1">Related: US-Style DTI Explained</strong>
        If you are also dealing with a US mortgage application, our <a href="/blog/debt-to-income-ratio-for-mortgage" class="text-accent font-medium hover:underline">DTI for Mortgage Approval guide</a> covers the front-end and back-end thresholds US lenders use.
      </div>
    `,
  },

  {
    slug: 'how-mortgage-amortization-works',
    title: 'How Mortgage Amortization Works: Every Payment Explained (With the Exact Math)',
    seoTitle: 'How Mortgage Amortization Works: Schedule & Formula Explained | Calcumetrics',
    description:
      'See how mortgage payments split between principal and interest, why early payments are interest-heavy, and how extra payments cut your loan payoff date.',
    category: 'Loans',
    publishDate: '2026-09-30',
    dateModified: '2026-09-30',
    readTime: '10 min read',
    market: 'Global',
    author: 'Dev',
    reviewer: 'Methodology reviewed by the Calcumetrics team',
    quickAnswer:
      'Mortgage amortization spreads repayment of a fixed loan across equal monthly payments. Early payments are heavily weighted toward interest because the outstanding balance is high. As the principal slowly decreases, each subsequent payment carries less interest and more principal — until the final payment closes out the loan. The monthly payment never changes (on a fixed-rate mortgage); only the internal split shifts.',
    type: 'Evergreen',
    summary:
      'On a 30-year fixed mortgage, your first payment might direct 85–90% of its value toward interest and only 10–15% toward reducing what you actually owe. That proportion flips gradually over decades. Understanding why this happens — and how extra payments can dramatically change the trajectory — is one of the most financially valuable things a homeowner can learn. This guide walks through the full amortization formula, builds a partial schedule from scratch, and explains the mechanics that drive slow equity accumulation in early years.',
    sources: [
      {
        name: 'Consumer Financial Protection Bureau (CFPB)',
        citation: 'Loan Estimate & Amortization Schedule Disclosure Requirements under TILA-RESPA',
        url: 'https://www.consumerfinance.gov',
      },
      {
        name: 'Freddie Mac',
        citation: 'Fixed-Rate Mortgage Product Documentation — Amortization Methodology',
        url: 'https://www.freddiemac.com',
      },
      {
        name: 'Financial Conduct Authority (FCA)',
        citation: 'MCOB 10: Annual Percentage Rate — Reducing-Balance Amortization Standard',
        url: 'https://www.fca.org.uk',
      },
    ],
    relatedCalculators: [
      {
        name: 'Mortgage Calculator',
        path: '/mortgage-calculator',
        description: 'Estimate your monthly payment on a 15 or 30-year fixed-rate US mortgage.',
        badge: 'Most Relevant',
      },
      {
        name: 'Loan Amortization Calculator',
        path: '/loan-amortization-calculator',
        description: 'Generate a full month-by-month amortization schedule for any loan.',
      },
      {
        name: 'Loan Prepayment Calculator',
        path: '/loan-prepayment-calculator',
        description: 'See how extra principal payments cut your payoff date and total interest.',
      },
      {
        name: 'Home Loan EMI Calculator',
        path: '/home-loan-calculator',
        description: 'Calculate home loan EMI, total interest, and amortization for Indian borrowers.',
      },
    ],
    relatedArticles: [
      {
        slug: 'debt-to-income-ratio-for-mortgage',
        title: 'Debt-to-Income (DTI) Ratio for Mortgage Approval: Front-End vs. Back-End Limits',
        description: 'Understand how lenders evaluate your debt load before approving a home loan.',
      },
      {
        slug: 'flat-vs-reducing-interest-rate',
        title: 'Flat Rate vs. Reducing Balance Interest: Why the Same Rate Can Cost Very Differently',
        description: 'Learn why the reducing-balance method (used in mortgages) costs less than flat-rate interest.',
      },
      {
        slug: 'debt-to-income-ratio-uk',
        title: 'Debt-to-Income Ratio in the UK: What Lenders Actually Look At',
        description: 'UK-specific guide to mortgage affordability using LTI multiples and FCA stress tests.',
      },
    ],
    faqs: [
      {
        question: 'What does "amortization" mean in a mortgage?',
        answer:
          'Amortization refers to the process of paying off a debt through a series of fixed, scheduled payments. In a mortgage, each payment covers the interest that accrued since the last payment plus a portion of the outstanding principal. A fully amortizing loan reaches a zero balance at the end of the term, with no balloon payment due.',
      },
      {
        question: 'Why do I pay mostly interest at the beginning of my mortgage?',
        answer:
          "Because interest is calculated on the outstanding balance. At the start of a 30-year mortgage, the balance is at its highest — so interest accrual is at its highest. As you pay down principal over time, the balance falls, which means the interest portion of each payment also falls. Since the total monthly payment stays fixed, the difference gets redirected to principal. It's a geometric decay, not a linear one.",
      },
      {
        question: 'What is the amortization formula?',
        answer:
          'Monthly Payment (M) = P x [r(1+r)^n] / [(1+r)^n minus 1], where P is the loan principal, r is the monthly interest rate (annual rate divided by 12 divided by 100), and n is the total number of monthly payments (years x 12). This is the standard reducing-balance formula used by virtually all fixed-rate residential lenders.',
      },
      {
        question: 'How much do extra payments save on a mortgage?',
        answer:
          'Making one extra monthly payment per year on a 30-year mortgage typically cuts the loan term by 4–5 years and saves tens of thousands of dollars in interest, depending on the rate and balance. The savings are largest early in the loan when the outstanding balance is highest. Even small regular overpayments — say, an extra $100 or £100 per month — compound significantly over a 25–30 year term.',
      },
      {
        question: 'What is the difference between amortization and depreciation?',
        answer:
          'Both spread a cost over time, but they apply to different things. Amortization applies to intangible assets and debt repayment (including mortgages). Depreciation applies to tangible physical assets like equipment or vehicles. In a mortgage context, "amortization" always refers to the systematic repayment of loan principal through scheduled payments.',
      },
      {
        question: 'Does overpaying a mortgage change the monthly payment or the term?',
        answer:
          "It depends on the lender. Most lenders apply overpayments directly to principal but keep the monthly payment the same — which shortens the loan term. Some allow you to formally request a payment recalculation after overpaying, which would lower the monthly payment instead while keeping the original end date. Check your mortgage agreement or ask your lender which treatment applies.",
      },
    ],
    content: `
      <p class="lead text-base sm:text-lg text-text-primary leading-relaxed font-normal mb-6">
        Most homeowners know they have a mortgage payment due each month. Far fewer know what is actually happening inside that payment — why so much of it goes to interest for years before meaningfully reducing what they owe. That is not a flaw in the system. It is just arithmetic. And once you see the arithmetic clearly, some things that seemed abstract become very practical.
      </p>

      <p class="text-sm text-text-muted leading-relaxed mb-6">
        This guide explains how mortgage amortization works — not in abstract terms, but by building a real schedule from scratch and tracing exactly where each dollar or pound goes.
      </p>

      <div class="my-8 p-5 bg-surface border border-border rounded-card">
        <h3 class="text-xs uppercase tracking-wider font-semibold text-text-muted mb-2">Run Your Own Numbers</h3>
        <p class="text-xs text-text-muted mb-3">See your full amortization schedule month by month — or model savings from extra payments:</p>
        <div class="flex flex-wrap gap-2">
          <a href="/loan-amortization-calculator" class="inline-flex items-center px-3 py-1.5 rounded-control text-xs font-semibold bg-canvas border border-border hover:border-accent text-text-primary hover:text-accent transition-standard">Amortization Schedule &rarr;</a>
          <a href="/mortgage-calculator" class="inline-flex items-center px-3 py-1.5 rounded-control text-xs font-semibold bg-canvas border border-border hover:border-accent text-text-primary hover:text-accent transition-standard">Mortgage Calculator &rarr;</a>
          <a href="/loan-prepayment-calculator" class="inline-flex items-center px-3 py-1.5 rounded-control text-xs font-semibold bg-canvas border border-border hover:border-accent text-text-primary hover:text-accent transition-standard">Prepayment Savings &rarr;</a>
        </div>
      </div>

      <h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">1. The Core Principle: Fixed Payment, Shifting Split</h2>
      <p class="text-sm text-text-muted leading-relaxed mb-4">
        A fixed-rate mortgage has one defining feature: the monthly payment amount never changes. What does change — every single month — is how that payment divides between interest and principal.
      </p>
      <p class="text-sm text-text-muted leading-relaxed mb-6">
        Interest is always calculated on the <strong>current outstanding balance</strong>. Start with a large balance and you owe a lot of interest that month. Pay some of it off, the balance drops, and next month's interest charge is slightly lower. Because the total payment stays the same and interest fell by a few dollars, a few extra dollars go to principal. Repeat 360 times for a 30-year mortgage.
      </p>

      <div class="p-5 bg-surface border border-border rounded-card mb-8">
        <h3 class="text-sm font-bold text-text-primary mb-3">The Amortization Formula</h3>
        <p class="text-xs font-mono text-text-primary bg-canvas/60 p-3 rounded border border-border mb-4">
          M = P &times; [r &times; (1 + r)^n] &divide; [(1 + r)^n &minus; 1]
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-text-muted">
          <div><span class="font-mono font-semibold text-text-primary">M</span> = Monthly payment (fixed for the life of the loan)</div>
          <div><span class="font-mono font-semibold text-text-primary">P</span> = Principal borrowed (loan amount after down payment)</div>
          <div><span class="font-mono font-semibold text-text-primary">r</span> = Monthly interest rate = Annual rate &divide; 12 &divide; 100</div>
          <div><span class="font-mono font-semibold text-text-primary">n</span> = Total payments = Loan term in years &times; 12</div>
        </div>
      </div>

      <h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">2. A Full Worked Example: $320,000 at 6.75% for 30 Years</h2>
      <p class="text-sm text-text-muted leading-relaxed mb-4">
        Using the same loan as our <a href="/mortgage-calculator" class="text-accent hover:underline">Mortgage Calculator</a> default: a $400,000 home, 20% down, $320,000 borrowed at 6.75% for 30 years.
      </p>

      <div class="p-4 bg-surface border border-border rounded-card mb-3 text-xs text-text-muted">
        <strong class="text-text-primary block mb-2">Step 1: Monthly rate</strong>
        r = 6.75 &divide; 12 &divide; 100 = <span class="font-mono text-text-primary">0.005625</span> (0.5625% per month)
      </div>
      <div class="p-4 bg-surface border border-border rounded-card mb-3 text-xs text-text-muted">
        <strong class="text-text-primary block mb-2">Step 2: Total payment periods</strong>
        n = 30 &times; 12 = <span class="font-mono text-text-primary">360 months</span>
      </div>
      <div class="p-4 bg-surface border border-border rounded-card mb-6 text-xs text-text-muted">
        <strong class="text-text-primary block mb-2">Step 3: Apply the formula</strong>
        (1.005625)^360 &asymp; 7.6935<br/>
        M = 320,000 &times; (0.005625 &times; 7.6935) &divide; (7.6935 &minus; 1)<br/>
        M = 320,000 &times; 0.04328 &divide; 6.6935 = <span class="font-mono font-bold text-accent">$2,069 / month</span>
      </div>

      <h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">3. The First 6 Months of Your Schedule</h2>
      <p class="text-sm text-text-muted leading-relaxed mb-4">
        Watch what happens inside each of those $2,069 payments:
      </p>

      <div class="overflow-x-auto mb-6">
        <table class="w-full text-xs text-left border border-border rounded-card overflow-hidden">
          <thead class="bg-surface text-text-primary font-semibold border-b border-border">
            <tr>
              <th class="p-3">Month</th>
              <th class="p-3">Opening Balance</th>
              <th class="p-3">Interest (0.5625%)</th>
              <th class="p-3">Principal</th>
              <th class="p-3">Closing Balance</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border text-text-muted">
            <tr>
              <td class="p-3 font-medium text-text-primary">1</td>
              <td class="p-3 font-mono">$320,000</td>
              <td class="p-3 font-mono text-red-400">$1,800</td>
              <td class="p-3 font-mono text-emerald-400">$269</td>
              <td class="p-3 font-mono">$319,731</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-text-primary">2</td>
              <td class="p-3 font-mono">$319,731</td>
              <td class="p-3 font-mono text-red-400">$1,798</td>
              <td class="p-3 font-mono text-emerald-400">$271</td>
              <td class="p-3 font-mono">$319,460</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-text-primary">3</td>
              <td class="p-3 font-mono">$319,460</td>
              <td class="p-3 font-mono text-red-400">$1,797</td>
              <td class="p-3 font-mono text-emerald-400">$272</td>
              <td class="p-3 font-mono">$319,188</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-text-primary">6</td>
              <td class="p-3 font-mono">$318,377</td>
              <td class="p-3 font-mono text-red-400">$1,791</td>
              <td class="p-3 font-mono text-emerald-400">$278</td>
              <td class="p-3 font-mono">$318,099</td>
            </tr>
            <tr>
              <td class="p-3 font-medium text-text-primary">12</td>
              <td class="p-3 font-mono">$316,341</td>
              <td class="p-3 font-mono text-red-400">$1,779</td>
              <td class="p-3 font-mono text-emerald-400">$290</td>
              <td class="p-3 font-mono">$316,051</td>
            </tr>
            <tr class="bg-surface font-semibold">
              <td class="p-3 text-text-primary">Year 1 Total</td>
              <td class="p-3 font-mono">—</td>
              <td class="p-3 font-mono text-red-400">$21,514</td>
              <td class="p-3 font-mono text-emerald-400">$3,314</td>
              <td class="p-3 font-mono text-text-primary">$316,686</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-sm text-text-muted leading-relaxed mb-6">
        After 12 payments totalling $24,828, your balance has only dropped by $3,314. That is not a scam or a trick. It is simply how interest on a large balance works: 87% of year one's payments went to interest. The ratio steadily improves from here — just slowly.
      </p>

      <h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">4. The Crossover Point — When Principal Overtakes Interest</h2>
      <p class="text-sm text-text-muted leading-relaxed mb-4">
        On this example, the month when the principal portion of your payment finally exceeds the interest portion arrives around <strong>Month 238 — approximately Year 19.8</strong>. For roughly the first two-thirds of a 30-year mortgage, interest is the dominant cost in each payment.
      </p>

      <div class="overflow-x-auto mb-6">
        <table class="w-full text-xs text-left border border-border rounded-card overflow-hidden">
          <thead class="bg-surface text-text-primary font-semibold border-b border-border">
            <tr>
              <th class="p-3">Year</th>
              <th class="p-3">Approx. Balance Remaining</th>
              <th class="p-3">Monthly Interest Portion</th>
              <th class="p-3">Monthly Principal Portion</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border text-text-muted">
            <tr><td class="p-3 text-text-primary font-medium">Year 1</td><td class="p-3 font-mono">~$317,000</td><td class="p-3 font-mono text-red-400">~$1,800</td><td class="p-3 font-mono text-emerald-400">~$270</td></tr>
            <tr><td class="p-3 text-text-primary font-medium">Year 5</td><td class="p-3 font-mono">~$305,000</td><td class="p-3 font-mono text-red-400">~$1,716</td><td class="p-3 font-mono text-emerald-400">~$353</td></tr>
            <tr><td class="p-3 text-text-primary font-medium">Year 10</td><td class="p-3 font-mono">~$284,000</td><td class="p-3 font-mono text-red-400">~$1,598</td><td class="p-3 font-mono text-emerald-400">~$471</td></tr>
            <tr><td class="p-3 text-text-primary font-medium">Year 19 (crossover)</td><td class="p-3 font-mono">~$193,000</td><td class="p-3 font-mono text-red-400">~$1,085</td><td class="p-3 font-mono text-emerald-400">~$984</td></tr>
            <tr><td class="p-3 text-text-primary font-medium">Year 25</td><td class="p-3 font-mono">~$115,000</td><td class="p-3 font-mono text-red-400">~$647</td><td class="p-3 font-mono text-emerald-400">~$1,422</td></tr>
            <tr class="bg-surface font-semibold text-text-primary"><td class="p-3">Year 30 (final)</td><td class="p-3 font-mono">~$2,000</td><td class="p-3 font-mono text-red-400">~$11</td><td class="p-3 font-mono text-emerald-400">~$2,058</td></tr>
          </tbody>
        </table>
      </div>

      <h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">5. What Extra Payments Actually Do</h2>
      <p class="text-sm text-text-muted leading-relaxed mb-4">
        Every extra dollar you pay beyond the scheduled amount goes <em>entirely</em> to principal — no interest portion. This matters because it has a compounding benefit: reduce the principal today, and every future month's interest calculation starts from a lower base.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div class="p-4 bg-surface border border-border rounded-card">
          <h3 class="text-sm font-bold text-text-primary mb-2">$200/month extra</h3>
          <ul class="text-xs text-text-muted space-y-1.5 list-disc pl-4 leading-relaxed">
            <li>Reduces 30-year term to approximately <strong>24.5 years</strong></li>
            <li>Saves roughly <strong>$74,000 in total interest</strong></li>
            <li>No change to required monthly payment — you simply stop early</li>
          </ul>
        </div>
        <div class="p-4 bg-surface border border-border rounded-card">
          <h3 class="text-sm font-bold text-text-primary mb-2">One extra full payment per year</h3>
          <ul class="text-xs text-text-muted space-y-1.5 list-disc pl-4 leading-relaxed">
            <li>Reduces 30-year term to approximately <strong>25.5–26 years</strong></li>
            <li>Saves roughly <strong>$60,000–$70,000 in total interest</strong></li>
            <li>Practical trick: divide your monthly payment by 12, add that amount each month</li>
          </ul>
        </div>
      </div>

      <p class="text-sm text-text-muted leading-relaxed mb-4">
        One caveat: some mortgage agreements, particularly in the UK and some European markets, include early repayment charges (ERCs) during fixed-rate periods — typically 1–5% of the amount overpaid beyond an annual allowance. Always check the terms before making large lump-sum overpayments.
      </p>

      <h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">6. Amortization vs. Interest-Only Mortgages</h2>
      <p class="text-sm text-text-muted leading-relaxed mb-4">
        Interest-only mortgages — common in the UK buy-to-let market and historically popular before the 2008 crisis — require only the interest payment each month. The principal never decreases during the term and is repaid in full at the end, typically from the sale of the property.
      </p>
      <p class="text-sm text-text-muted leading-relaxed mb-6">
        The monthly payment is lower on an interest-only basis, but the total cost is dramatically higher because interest accrues on the original full balance throughout. On the same $320,000 / 6.75% example: an interest-only mortgage costs $1,800/month indefinitely, with $320,000 still owed at the end. A fully amortizing mortgage costs $2,069/month and arrives at zero.
      </p>

      <div class="p-4 bg-surface border border-accent/30 rounded-card my-6 text-xs text-text-muted">
        <strong class="text-text-primary text-sm block mb-1">Apply This to Your Actual Mortgage</strong>
        Our <a href="/loan-amortization-calculator" class="text-accent font-medium hover:underline">Loan Amortization Calculator</a> generates your full schedule — enter your loan amount, rate, and term to see every payment broken down. Or use the <a href="/loan-prepayment-calculator" class="text-accent font-medium hover:underline">Prepayment Calculator</a> to model exactly how much you would save with extra payments.
      </div>
    `,
  },
];
