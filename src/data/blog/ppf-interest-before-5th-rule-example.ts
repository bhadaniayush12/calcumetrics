import type { BlogPost } from './types';
import { calcPPF } from '../../lib/calculators/ppf';
import { calcSimpleInterest } from '../../lib/calculators/simple-interest';
import { h2, p, link, formulaBlock, bullets, table, solvedExample, lastUpdated } from './solved-example-markup';

const money = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const money2 = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const RATE = 7.1;
const DEPOSIT = 150000;

// Example 1(a): a single ₹1,50,000 deposit in a new account. On 4 April it earns
// interest for 12 months; on 6 April, April's lowest balance is nil, so it earns 11.
// For one deposit in one year, 11 months at 7.1% equals one year at 7.1% × 11/12.
export const onTimeYear1 = calcPPF(DEPOSIT, RATE, 1).interest;
export const lateYear1 = calcPPF(DEPOSIT, (RATE * 11) / 12, 1).interest;

// Example 1(b): the same timing repeated for 15 years. Losing April's interest on each
// new deposit, D × r/12, is equivalent to an on-time deposit of D × (1 − (r/12)/(1 + r)).
export const onTime15 = calcPPF(DEPOSIT, RATE, 15);
const r = RATE / 100;
export const late15 = calcPPF(DEPOSIT * (1 - r / 12 / (1 + r)), RATE, 15);
export const gap15 = Math.round(onTime15.maturity) - Math.round(late15.maturity);

// Example 2: ₹12,500 every month. A deposit made by the 5th counts in that month's
// lowest balance; one made after the 5th first counts the following month.
const MONTHLY = 12500;
const MONTHS = ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'];
export const monthlyRows = MONTHS.map((month, i) => {
  const early = calcSimpleInterest(MONTHLY, RATE, (12 - i) / 12).interest;
  const late = calcSimpleInterest(MONTHLY, RATE, (11 - i) / 12).interest;
  return { month, earlyMonths: 12 - i, lateMonths: 11 - i, early, late };
});
export const monthlyEarly = monthlyRows.reduce((s, m) => s + m.early, 0);
export const monthlyLate = monthlyRows.reduce((s, m) => s + m.late, 0);

const PPF_SCHEME_2019 = 'https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=169';
const PPF_OVERVIEW = 'https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=55';
const NSI_RATES = 'https://www.nsiindia.gov.in/InternalPage.aspx?Id_Pk=132';

export const PPF_BEFORE_5TH_EXAMPLE_POST: BlogPost = {
  slug: 'ppf-interest-before-5th-rule-example',
  title: 'PPF Interest Calculation: Deposit Before 5th Example',
  seoTitle: 'PPF Interest Calculation: Deposit Before 5th Example',
  description:
    'PPF interest calculation formula for monthly deposits before the 5th, with examples: the lowest-balance rule, one-year and 15-year cost of depositing late.',
  category: 'Investments',
  market: 'India-Only',
  publishDate: '2026-10-23',
  dateModified: '2026-10-23',
  readTime: '7 min read',
  author: 'Dev',
  type: 'Evergreen',
  quickAnswer: `PPF interest is worked out for each calendar month on the lowest balance between the close of the 5th and the end of the month, and credited at the end of the year. A deposit made on or before the 5th earns interest for that month; one made on the 6th does not. At ${RATE}%, ${money(DEPOSIT)} deposited on 4 April earns ${money(onTimeYear1)} in the first year, against ${money2(lateYear1)} if deposited on 6 April.`,
  summary: `PPF interest is worked out for each calendar month on the lowest balance between the close of the 5th and the end of the month, and credited at the end of the year. A deposit made on or before the 5th earns interest for that month; one made on the 6th does not. At ${RATE}%, ${money(DEPOSIT)} deposited on 4 April earns ${money(onTimeYear1)} in the first year, against ${money2(lateYear1)} if deposited on 6 April.`,
  sources: [
    { name: 'National Savings Institute (Ministry of Finance, DEA)', url: PPF_SCHEME_2019, citation: 'Public Provident Fund Scheme, 2019, paragraph 7: 7.1% rate, lowest balance between the close of the fifth day and month end, credit at year end' },
    { name: 'National Savings Institute (Ministry of Finance, DEA)', url: PPF_OVERVIEW, citation: 'Public Provident Fund Account: minimum ₹500 and maximum ₹1,50,000 in a financial year' },
    { name: 'National Savings Institute (Ministry of Finance, DEA)', url: NSI_RATES, citation: 'Interest rates on national savings schemes: PPF 7.1% for each quarter listed from April 2025 to September 2026' },
  ],
  relatedCalculators: [
    { name: 'PPF Calculator', path: '/in/ppf-calculator', description: 'Maturity value for yearly deposits made by 5 April.', badge: 'Most Relevant' },
    { name: 'Simple Interest Calculator', path: '/simple-interest-calculator', description: 'Reproduce the month-by-month interest on each deposit.' },
    { name: 'Compound Interest Calculator', path: '/compound-interest-calculator', description: 'Compare PPF with other compounding options.' },
  ],
  relatedArticles: [
    { slug: 'ppf-interest-calculation-5th-day-rule', title: 'PPF interest and the 5th-day rule', description: 'Monthly ledger simulations and the case for early April deposits.' },
  ],
  faqs: [
    {
      question: 'Why does a PPF deposit have to be made before the 5th?',
      answer: 'Interest for a month is calculated on the lowest balance between the close of the 5th and the end of that month. A deposit made by the 5th is part of that lowest balance; one made later is not counted until the next month.',
    },
    {
      question: 'When is PPF interest credited to the account?',
      answer: 'Interest is calculated monthly but credited at the end of each year, under paragraph 7 of the Public Provident Fund Scheme, 2019. It therefore compounds once a year, not every month.',
    },
    {
      question: 'Is it better to deposit once in April or every month?',
      answer: `At the same yearly total, one deposit made by 5 April earns more because all of it earns interest for 12 months. In these examples, ${money(DEPOSIT)} on 4 April earns ${money(onTimeYear1)} in year 1, while twelve deposits of ${money(MONTHLY)} by the 5th earn ${money2(monthlyEarly)}.`,
    },
    {
      question: 'What is the current PPF interest rate?',
      answer: `The National Savings Institute’s table shows ${RATE}% for each quarter it lists from April 2025 to September 2026. The government notifies the rate every quarter, so check the latest figure before relying on these examples.`,
    },
  ],
  content: `
${p(`The PPF interest calculation formula for monthly deposits before the 5th comes down to one rule: each month earns interest only on the lowest balance after the 5th. This post sets out that rule from the scheme text, turns it into a formula and solves two examples, one for a yearly lump sum and one for monthly deposits. Figures come from our ${link('/in/ppf-calculator', 'PPF calculator')} and simple-interest engines.`)}

${h2('The rule in the scheme')}
${p(`Paragraph 7 of the ${link(PPF_SCHEME_2019, 'Public Provident Fund Scheme, 2019')}, as published by the National Savings Institute, says deposits made on or after 1 April 2020 and the balance in the account bear interest at 7.1% per annum. It says the lowest balance at the credit of an account between the close of the fifth day and the end of the month is eligible for interest, and that interest is credited to the account at the end of each year.`)}
${p(`The ${link(NSI_RATES, 'NSI interest rate table')} lists ${RATE}% for PPF in every quarter from April–June 2025 to July–September 2026. The rate is notified quarterly, so treat ${RATE}% in the examples as the rate in force for those quarters. The ${link(PPF_OVERVIEW, 'NSI PPF page')} sets the minimum deposit at ₹500 and the maximum at ₹1,50,000 in a financial year.`)}

${h2('PPF interest formula')}
${p('Work out the lowest balance from the close of the 5th to the month end for each of the twelve months, add them up and apply one-twelfth of the annual rate. The total is credited on 31 March and becomes part of next year’s opening balance.')}
${formulaBlock('PPF interest for a financial year', 'Monthly interest = Lowest balance (close of 5th to month end) × Annual rate ÷ 12<br/>Interest credited on 31 March = Sum of the 12 monthly amounts')}
${p('Interest is credited once a year, so within a year it behaves like simple interest on each deposit for the months it is counted. Across years, the credited interest earns interest too.')}

${h2('Solved examples')}
${solvedExample(
  'Example 1: ₹1,50,000 deposited on 4 April vs 6 April',
  `Two savers open PPF accounts in the same financial year. Saver F deposits ${money(DEPOSIT)} on 4 April; Saver G deposits ${money(DEPOSIT)} on 6 April. Neither deposits again that year. Using ${RATE}% per annum, calculate (a) the first-year interest for each, and (b) the maturity values if each repeats the same deposit date for 15 years.`,
  [
    `Saver F: the deposit is in the account by the close of 5 April, so it is the lowest balance for all 12 months. Interest = ${money(DEPOSIT)} × ${RATE}% × 12/12 = <strong>${money2(onTimeYear1)}</strong>.`,
    `Saver G: April’s lowest balance after the 5th is ₹0, so April earns nothing. The deposit earns for May to March, 11 months. Interest = ${money(DEPOSIT)} × ${RATE}% × 11/12 = <strong>${money2(lateYear1)}</strong>.`,
    `First-year difference = ${money2(onTimeYear1)} − ${money2(lateYear1)} = <strong>${money2(onTimeYear1 - lateYear1)}</strong>, one month of interest.`,
    `Over 15 years, Saver F deposits by the 5th every April. Maturity = <strong>${money(onTime15.maturity)}</strong> on ${money(onTime15.invested)} invested.`,
    `Saver G loses April’s interest on each new deposit every year, and the lost interest also misses out on later compounding. Maturity = <strong>${money(late15.maturity)}</strong> on the same ${money(onTime15.invested)}.`,
  ],
  `(a) Year-1 interest: Saver F ${money2(onTimeYear1)}, Saver G ${money2(lateYear1)}. (b) After 15 years: Saver F ${money(onTime15.maturity)}, Saver G ${money(late15.maturity)}, a gap of <strong>${money(gap15)}</strong> from a two-day difference in the deposit date.`
)}
${solvedExample(
  'Example 2: monthly deposits before and after the 5th',
  `Saver H opens a PPF account and deposits ${money(MONTHLY)} every month from April to March (${money(MONTHLY * 12)} in the year). Calculate the year’s interest at ${RATE}% if (a) every deposit is made on or before the 5th, and (b) every deposit is made after the 5th.`,
  [
    `(a) April’s deposit counts from April, so it earns 12 months; May’s earns 11; and so on to March’s, which earns 1 month.`,
    `Interest on April’s deposit = ${money(MONTHLY)} × ${RATE}% × 12/12 = ${money2(monthlyRows[0].early)}; March’s = ${money(MONTHLY)} × ${RATE}% × 1/12 = ${money2(monthlyRows[11].early)}.`,
    `Adding all twelve deposits gives total interest of <strong>${money2(monthlyEarly)}</strong>.`,
    `(b) Each deposit misses its own month. April’s deposit earns 11 months, May’s 10, and March’s earns nothing this year.`,
    `Adding all twelve gives total interest of <strong>${money2(monthlyLate)}</strong>.`,
  ],
  `Interest for the year: (a) <strong>${money2(monthlyEarly)}</strong> if deposits are made by the 5th; (b) <strong>${money2(monthlyLate)}</strong> if made after the 5th. The difference is ${money2(monthlyEarly - monthlyLate)}.`
)}
${table(`Example 2 — ${money(MONTHLY)} a month at ${RATE}%, months counted per deposit`, ['Deposit month', 'Months (by 5th)', 'Interest (by 5th)', 'Months (after 5th)', 'Interest (after 5th)'], monthlyRows.map((m) => [m.month, m.earlyMonths, money2(m.early), m.lateMonths, money2(m.late)]))}
${p(`The difference in Example 2 is the same ${money2(onTimeYear1 - lateYear1)} as in Example 1. Depositing after the 5th costs one month of interest on each deposit, and the deposits add up to ${money(DEPOSIT)} either way.`)}

${h2('Common mistakes students make')}
${bullets([
  'Calculating interest on the month-end balance instead of the lowest balance after the 5th.',
  'Assuming PPF compounds monthly. Interest is calculated monthly but credited once, at the end of the year.',
  'Counting a deposit made on the 5th as late. Deposits made by the close of the 5th are included.',
  'Using a past rate without checking the rate notified for the quarter in question.',
  'Including a deposit above ₹1,50,000 in a financial year in the interest calculation.',
])}

${h2('Check your own deposits')}
${p(`The ${link('/in/ppf-calculator', 'PPF calculator')} assumes one deposit each year made by 5 April, which matches Saver F. For monthly deposits, use the ${link('/simple-interest-calculator', 'simple interest calculator')} on each deposit with the number of months it is counted, as in the table. For a month-by-month ledger over several years, see our guide to ${link('/blog/ppf-interest-calculation-5th-day-rule', 'PPF interest and the 5th-day rule')}.`)}
${p('If the 5th falls on a holiday or you pay online, allow time for the deposit to reach the account by the close of the 5th, because that is the balance the rule looks at. Figures here are before any rounding the account office applies and assume the rate stays at 7.1% for the whole period.')}
${lastUpdated('23 October 2026')}
`,
};
