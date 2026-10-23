import type { BlogPost } from './types';
import { calcDSCR } from '../../lib/accounting/ratios';
import { h2, p, link, formulaBlock, bullets, table, solvedExample, lastUpdated } from './solved-example-markup';

const money = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const ratio = (n: number) => n.toFixed(2);

// Example 1: one year of a project report.
const ex1 = { pat: 600000, depreciation: 200000, interest: 400000, principal: 600000 };
export const example1 = calcDSCR(ex1.pat + ex1.depreciation + ex1.interest, ex1.principal + ex1.interest);

// Example 2: ₹50,00,000 term loan, five equal principal instalments of ₹10,00,000,
// 10% interest on the opening balance, depreciation ₹3,00,000 a year.
const LOAN = 5000000;
const PRINCIPAL = 1000000;
const DEPRECIATION = 300000;
const PAT = [600000, 800000, 1000000, 1100000, 1200000];
export const years = PAT.map((pat, i) => {
  const interest = (LOAN - PRINCIPAL * i) * 0.1;
  const available = pat + DEPRECIATION + interest;
  const debtService = PRINCIPAL + interest;
  return { year: i + 1, pat, interest, available, debtService, dscr: calcDSCR(available, debtService).dscr };
});
const totalAvailable = years.reduce((s, y) => s + y.available, 0);
const totalDebtService = years.reduce((s, y) => s + y.debtService, 0);
export const averageDscr = calcDSCR(totalAvailable, totalDebtService).dscr;
const minYear = years.reduce((m, y) => (y.dscr < m.dscr ? y : m));
// What-if: principal deferred in Year 1, so debt service is interest only.
export const moratoriumY1 = calcDSCR(years[0].available, years[0].interest);

const yearRows = years.map((y) => [
  `Year ${y.year}`, money(y.pat), money(DEPRECIATION), money(y.interest), money(y.available), money(PRINCIPAL), money(y.debtService), ratio(y.dscr),
]);

export const DSCR_BANK_LOAN_EXAMPLE_POST: BlogPost = {
  slug: 'dscr-calculation-bank-loan-example',
  title: 'How to Calculate DSCR for a Bank Loan: Solved Example',
  seoTitle: 'How to Calculate DSCR for a Bank Loan: Solved Example',
  description:
    'How to calculate DSCR for a bank loan project report with example: formula, a one-year numerical and a five-year term loan schedule with average DSCR.',
  category: 'Business',
  market: 'Both',
  publishDate: '2026-10-23',
  dateModified: '2026-10-23',
  readTime: '7 min read',
  author: 'Dev',
  type: 'Evergreen',
  quickAnswer: `DSCR in a project report = (Net profit after tax + Depreciation + Interest on term loan) ÷ (Principal repayment + Interest on term loan). A business with ${money(1200000)} available for debt service and ${money(1000000)} due to the bank has a DSCR of ${ratio(example1.dscr)}, so it earns 1.20 times what it must repay that year.`,
  summary: `DSCR in a project report = (Net profit after tax + Depreciation + Interest on term loan) ÷ (Principal repayment + Interest on term loan). A business with ${money(1200000)} available for debt service and ${money(1000000)} due to the bank has a DSCR of ${ratio(example1.dscr)}, so it earns 1.20 times what it must repay that year.`,
  sources: [
    { name: 'Calcumetrics DSCR Calculator', url: 'https://calcumetrics.com/dscr-calculator', citation: 'calcDSCR engine: income available for debt service ÷ total debt service, used for every ratio in this post' },
    { name: 'Calcumetrics methodology', url: 'https://calcumetrics.com/methodology', citation: 'How calculator outputs are produced and rounded' },
  ],
  relatedCalculators: [
    { name: 'DSCR Calculator', path: '/dscr-calculator', description: 'Enter income available and debt service to get the ratio.', badge: 'Most Relevant' },
    { name: 'EMI Calculator', path: '/emi-calculator', description: 'Work out the instalment if the loan is repaid by equal EMIs instead.' },
    { name: 'Loan Amortization Calculator', path: '/loan-amortization-calculator', description: 'Split each year’s repayment into principal and interest.' },
  ],
  relatedArticles: [
    { slug: 'dscr-ratio-for-business-loans', title: 'DSCR for business loans', description: 'Benchmarks, covenant tests and how lenders read the ratio.' },
  ],
  faqs: [
    {
      question: 'Why is interest added back in the numerator?',
      answer: 'Net profit after tax is calculated after charging interest. Interest is also part of what must be paid to the lender, so it is added back to show the full amount available to service the loan before that payment.',
    },
    {
      question: 'Why is depreciation added back?',
      answer: 'Depreciation reduces profit but does not use cash in the year. Adding it back moves the numerator closer to the cash the business generates.',
    },
    {
      question: 'Should I average the yearly DSCRs or divide the totals?',
      answer: `Both appear in practice, and they give different answers. In Example 2 the totals method gives ${ratio(averageDscr)}. Use whichever method the lender’s format asks for and state it in the report.`,
    },
    {
      currencyLock: 'INR',
      question: 'What minimum DSCR do Indian banks require?',
      answer: 'There is no single figure that applies to every bank or loan. Each lender sets its own minimum in its credit policy, so ask the bank for the figure that applies to your loan before finalising the project report.',
    },
  ],
  content: `
${p(`If you are learning how to calculate DSCR for a bank loan project report with an example, start from the version of the formula used in term-loan appraisals. It adds back the non-cash and interest items to profit, then compares the result with what the loan demands that year. Below are the formula, a one-year numerical and a five-year schedule with an average DSCR, all computed with our ${link('/dscr-calculator', 'DSCR calculator')} engine.`)}

${h2('What DSCR measures')}
${p('The debt service coverage ratio compares the money a business has available to repay a loan with the repayment due. A DSCR of 1.00 means everything earned for debt service goes straight to the lender. Below 1.00, the business must find cash elsewhere. Above 1.00, there is a cushion.')}
${p('In corporate finance the numerator is often net operating income or EBITDA. Project reports for term loans usually build it from the profit and loss account instead, which is the version used here. For lender benchmarks and covenant tests, see our guide to ' + link('/blog/dscr-ratio-for-business-loans', 'DSCR for business loans') + '.')}

${h2('DSCR formula for a term-loan project report')}
${p('Calculate each year separately, because principal, interest and profit all change over the life of the loan.')}
${formulaBlock('Debt service coverage ratio', 'DSCR = (Net profit after tax + Depreciation + Interest on term loan) ÷ (Principal instalment + Interest on term loan)')}
${p('Use the same interest figure in the numerator and the denominator. Only include instalments and interest on the loans being serviced, and leave out working-capital interest unless the lender’s format asks for it.')}

${h2('Solved examples')}
${solvedExample(
  'Example 1: DSCR for a single year',
  `A manufacturing unit’s projected figures for Year 1 are: net profit after tax ${money(ex1.pat)}, depreciation ${money(ex1.depreciation)}, interest on term loan ${money(ex1.interest)} and principal instalment due ${money(ex1.principal)}. Calculate DSCR.`,
  [
    `Income available for debt service = ${money(ex1.pat)} + ${money(ex1.depreciation)} + ${money(ex1.interest)} = <strong>${money(example1.noi)}</strong>.`,
    `Debt service = ${money(ex1.principal)} + ${money(ex1.interest)} = <strong>${money(example1.totalDebtService)}</strong>.`,
    `DSCR = ${money(example1.noi)} ÷ ${money(example1.totalDebtService)} = <strong>${ratio(example1.dscr)}</strong>.`,
  ],
  `DSCR = <strong>${ratio(example1.dscr)} times</strong>. The unit earns ${money(example1.noi - example1.totalDebtService)} more than it needs to service the loan in Year 1.`
)}
${solvedExample(
  'Example 2: five-year term loan with average DSCR',
  `A business borrows ${money(LOAN)} as a term loan at 10% per annum. Principal is repaid in five equal annual instalments of ${money(PRINCIPAL)}, and interest is charged on the opening balance each year. Depreciation is ${money(DEPRECIATION)} a year. Projected net profit after tax is ${PAT.map(money).join(', ')} for Years 1 to 5. Calculate the DSCR for each year and the average DSCR.`,
  [
    `Interest each year = 10% of the opening loan balance: ${years.map((y) => money(y.interest)).join(', ')}.`,
    `Income available each year = PAT + ${money(DEPRECIATION)} + interest: ${years.map((y) => money(y.available)).join(', ')}.`,
    `Debt service each year = ${money(PRINCIPAL)} + interest: ${years.map((y) => money(y.debtService)).join(', ')}.`,
    `Yearly DSCR = available ÷ debt service: ${years.map((y) => ratio(y.dscr)).join(', ')}.`,
    `Average DSCR = Total available ÷ Total debt service = ${money(totalAvailable)} ÷ ${money(totalDebtService)} = <strong>${ratio(averageDscr)}</strong>.`,
  ],
  `Average DSCR = <strong>${ratio(averageDscr)}</strong>. The lowest year is Year ${minYear.year} at <strong>${ratio(minYear.dscr)}</strong>, below 1.00, so the projections show a cash shortfall in that year.`
)}
${table('Example 2 — ₹50,00,000 term loan, 10% interest, equal principal instalments', ['Year', 'PAT', 'Depreciation', 'Interest', 'Available', 'Principal', 'Debt service', 'DSCR'], yearRows)}
${p(`Example 2 shows why the yearly figures matter more than the average. The average of ${ratio(averageDscr)} looks comfortable, but Year ${minYear.year} does not cover its own repayment. A lender reading this report would ask how the Year 1 gap is funded, for example through a moratorium on principal, promoter contribution or a longer repayment period. Interest falls each year as principal is repaid, which is why DSCR improves even after profit stops growing.`)}

${h2('What a principal moratorium does to Year 1')}
${p(`Lenders sometimes defer principal repayment in the first year of a new project, so only interest is paid. Rework Year 1 of Example 2 on that basis: income available stays ${money(years[0].available)}, but debt service falls to the interest of ${money(years[0].interest)}. DSCR becomes ${ratio(moratoriumY1.dscr)}. The deferred principal does not disappear, though. It is added to later instalments, so recalculate every later year with the revised repayment schedule before quoting an average.`)}
${p('Also check which profit figure the projections use. DSCR should be built from projected profit after tax for the same year as the repayment, not from the previous year’s audited profit, and depreciation should match the fixed-asset schedule in the same report.')}

<section data-currency-lock="INR">
${h2('Preparing DSCR for an Indian bank project report')}
${p('In a project report for an Indian bank, show DSCR year by year next to the projected balance sheet and profit and loss account, with the average below the table. Each bank sets its own minimum DSCR and its own method for the average, so ask the branch or credit officer for the figure and format that apply to your loan, and keep the assumptions behind each year’s profit in the report so they can be checked.')}
${p('If the first-year DSCR is below 1.00 because the project is still ramping up, say so plainly and show how the gap will be met. Hiding the problem inside an average will not get past an appraisal.')}
</section>

${h2('Common mistakes students make')}
${bullets([
  'Using profit before tax in the numerator while also adding interest back, which double counts the tax that has to be paid.',
  'Leaving interest out of the denominator and dividing only by the principal instalment.',
  'Taking the simple average of yearly ratios when the question asks for total available divided by total debt service.',
  'Using the same interest figure every year even though the loan balance falls after each instalment.',
  'Adding back depreciation in the denominator as well as the numerator.',
])}

${h2('Run your own numbers')}
${p(`In the ${link('/dscr-calculator', 'DSCR calculator')}, enter income available for debt service (PAT + depreciation + interest) and total debt service (principal + interest) for each year. If the loan is repaid by equal EMIs instead of equal principal instalments, split each year’s EMIs into principal and interest with the ${link('/loan-amortization-calculator', 'loan amortization calculator')} first.`)}
${lastUpdated('23 October 2026')}
`,
};
