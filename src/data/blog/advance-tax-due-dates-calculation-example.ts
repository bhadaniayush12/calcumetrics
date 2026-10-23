import type { BlogPost } from './types';
import { calcAdvanceTax } from '../../lib/tax/india';
import { calcSimpleInterest } from '../../lib/calculators/simple-interest';
import { h2, p, link, formulaBlock, bullets, table, solvedExample, lastUpdated } from './solved-example-markup';

const money = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

const LIABILITY = 120000;
export const schedule = calcAdvanceTax(LIABILITY);
const [june, sept, dec, march] = schedule.instalments;

// Example 2: cumulative tax actually paid by each due date.
const paid = { june: 0, sept: 54000, dec: 80000, march: 120000 };
// Section 234C charges 1% a month; the simple-interest engine takes the annual
// equivalent (12%) and the period in years (3/12 for the first three instalments).
export const juneInterest = calcSimpleInterest(june.cumulativeAmount - paid.june, 12, 3 / 12).interest;
export const decInterest = calcSimpleInterest(dec.cumulativeAmount - paid.dec, 12, 3 / 12).interest;
export const totalInterest = juneInterest + decInterest;

const scheduleRows = schedule.instalments.map((i) => [
  `On or before ${i.dueDate}`, `${i.cumulativePct}%`, money(i.cumulativeAmount), money(i.instalment),
]);

const WHO_IS_LIABLE = 'https://www.incometaxindia.gov.in/w/who-is-liable-to-pay-advance-tax-';
const INTEREST_AND_FEES = 'https://www.incometaxindia.gov.in/w/interest-and-fees';
const HOW_TO_234C = 'https://www.incometaxindia.gov.in/w/how-to-calculate-interest-under-section-234c-';

export const ADVANCE_TAX_EXAMPLE_POST: BlogPost = {
  slug: 'advance-tax-due-dates-calculation-example',
  title: 'Advance Tax Calculation and Due Dates: Solved Example',
  seoTitle: 'Advance Tax Calculation and Due Dates: Solved Example',
  description:
    'Advance tax calculation formula and due dates with example for CA Foundation: 15%, 45%, 75%, 100% instalments and section 234C interest worked out.',
  category: 'Taxes',
  market: 'India-Only',
  publishDate: '2026-10-23',
  dateModified: '2026-10-23',
  readTime: '7 min read',
  author: 'Dev',
  type: 'Evergreen',
  quickAnswer: `Advance tax is paid in four instalments: at least 15% of the year's tax by 15 June, 45% by 15 September, 75% by 15 December and 100% by 15 March. For an estimated liability of ${money(LIABILITY)}, the cumulative targets are ${money(june.cumulativeAmount)}, ${money(sept.cumulativeAmount)}, ${money(dec.cumulativeAmount)} and ${money(march.cumulativeAmount)}.`,
  summary: `Advance tax is paid in four instalments: at least 15% of the year's tax by 15 June, 45% by 15 September, 75% by 15 December and 100% by 15 March. For an estimated liability of ${money(LIABILITY)}, the cumulative targets are ${money(june.cumulativeAmount)}, ${money(sept.cumulativeAmount)}, ${money(dec.cumulativeAmount)} and ${money(march.cumulativeAmount)}.`,
  sources: [
    { name: 'Income Tax Department', url: WHO_IS_LIABLE, citation: 'FAQ on advance tax: section 208, liability of ₹10,000 or more after TDS; salary-only individuals' },
    { name: 'Income Tax Department', url: INTEREST_AND_FEES, citation: 'Interest and fees: instalment dates and percentages, 12%/36% thresholds, 44AD/44ADA, rounding rules' },
    { name: 'Income Tax Department', url: HOW_TO_234C, citation: 'How to calculate interest under section 234C: period and amount for each instalment' },
  ],
  relatedCalculators: [
    { name: 'Advance Tax Calculator', path: '/in/advance-tax-calculator', description: 'Instalment schedule for your estimated tax.', badge: 'Most Relevant' },
    { name: 'Income Tax Calculator (India)', path: '/in/income-tax-calculator', description: 'Estimate the year’s tax before splitting it into instalments.' },
    { name: 'Simple Interest Calculator', path: '/simple-interest-calculator', description: 'Reproduce the 1%-a-month section 234C arithmetic.' },
  ],
  relatedArticles: [
    { slug: 'advance-tax-guide', title: 'Advance tax in India', description: 'The quarterly calendar and sections 234B and 234C.' },
    { slug: 'tds-vs-advance-tax-difference', title: 'TDS vs advance tax', description: 'Who pays which, and how TDS reduces advance tax.' },
  ],
  faqs: [
    {
      question: 'Who has to pay advance tax?',
      answer: 'Under section 208, as the Income Tax Department’s FAQ explains, every person whose estimated tax for the year after TDS is ₹10,000 or more pays it in instalments during the same financial year. Individuals with only salary income are not required to, because the employer deducts TDS.',
    },
    {
      question: 'What are the due dates for presumptive taxpayers?',
      answer: 'Taxpayers under sections 44AD and 44ADA can pay 100% of their advance tax by 15 March of the financial year, according to the Department’s page on interest and fees.',
    },
    {
      question: 'Is there any margin before section 234C interest applies?',
      answer: 'Yes, for the first two instalments. Interest applies if less than 12% is paid by 15 June or less than 36% by 15 September. If interest does apply, it is calculated on the shortfall from 15% or 45%.',
    },
    {
      question: 'How is section 234C interest rounded?',
      answer: 'The Department’s page says the amount on which interest is calculated is rounded down to the nearest multiple of ₹100, and the interest is rounded to the nearest multiple of ₹10.',
    },
  ],
  content: `
${p(`This post works through the advance tax calculation formula and due dates with two exam-style examples of the kind set for CA Foundation students, and the same sums apply to freelancers paying real instalments. The rules follow the Income Tax Department’s pages on sections 208 and 234C of the Income-tax Act, 1961, as they apply to FY 2025-26 (AY 2026-27). The schedule comes from our ${link('/in/advance-tax-calculator', 'advance tax calculator')} and the interest from our simple-interest engine.`)}

${h2('Who pays and when')}
${p(`The Department’s ${link(WHO_IS_LIABLE, 'FAQ on advance tax')} says that under section 208, every person whose estimated tax liability for the year, after TDS, is ₹10,000 or more must pay it in advance during the same financial year, in instalments. Individuals with only salary income are not required to pay advance tax, because the employer deducts tax at source.`)}
${p(`The ${link(INTEREST_AND_FEES, 'Department’s page on interest and fees')} lists the due dates: at least 15% by 15 June, 45% by 15 September, 75% by 15 December and 100% by 15 March. Taxpayers using the presumptive schemes of sections 44AD and 44ADA can pay 100% by 15 March instead.`)}

${h2('Advance tax formula')}
${p('Estimate the tax for the year, take off TDS, and apply the cumulative percentage for each date. The instalment due on a date is the cumulative target less what has already been paid.')}
${formulaBlock('Advance tax instalments and section 234C', 'Cumulative target = (Estimated tax − TDS) × 15% / 45% / 75% / 100%<br/>Instalment due = Cumulative target − Advance tax already paid<br/>234C interest = Shortfall × 1% × 3 months (1 month for 15 March)')}
${p(`Section 234C has a margin on the first two dates. According to the Department’s ${link(HOW_TO_234C, 'explanation of section 234C')}, interest is charged for 3 months if less than 12% is paid by 15 June, less than 36% by 15 September or less than 75% by 15 December, and for 1 month if less than 100% is paid by 15 March. Once interest applies, it is charged on the shortfall from 15%, 45%, 75% or 100% of assessed tax, not from 12% or 36%.`)}

${h2('Solved examples')}
${solvedExample(
  'Example 1: instalment schedule for a freelancer',
  `Ms C, a freelance designer, is not under a presumptive scheme. She estimates her tax liability for FY 2025-26, after TDS, at ${money(LIABILITY)}. Prepare her advance tax schedule.`,
  [
    `Liability after TDS = ${money(LIABILITY)}, which is ₹10,000 or more, so advance tax is payable.`,
    `By 15 June: 15% × ${money(LIABILITY)} = <strong>${money(june.cumulativeAmount)}</strong>.`,
    `By 15 September: 45% × ${money(LIABILITY)} = ${money(sept.cumulativeAmount)} cumulative, so the instalment is ${money(sept.cumulativeAmount)} − ${money(june.cumulativeAmount)} = <strong>${money(sept.instalment)}</strong>.`,
    `By 15 December: 75% = ${money(dec.cumulativeAmount)} cumulative; instalment = <strong>${money(dec.instalment)}</strong>.`,
    `By 15 March: 100% = ${money(march.cumulativeAmount)} cumulative; instalment = <strong>${money(march.instalment)}</strong>.`,
  ],
  `Pay ${money(june.instalment)}, ${money(sept.instalment)}, ${money(dec.instalment)} and ${money(march.instalment)} on or before 15 June, 15 September, 15 December and 15 March.`
)}
${table(`Example 1 — estimated tax after TDS ${money(LIABILITY)}, FY 2025-26`, ['Due date', 'Cumulative %', 'Cumulative amount', 'Instalment'], scheduleRows)}
${solvedExample(
  'Example 2: section 234C interest on late instalments',
  `Ms C’s tax on returned income, after TDS, turns out to be exactly ${money(LIABILITY)}. Her cumulative advance tax payments were: nil by 15 June, ${money(paid.sept)} by 15 September, ${money(paid.dec)} by 15 December and ${money(paid.march)} by 15 March. Calculate interest under section 234C.`,
  [
    `15 June: paid nil, which is less than 12% (${money(LIABILITY * 0.12)}). Shortfall from 15% = ${money(june.cumulativeAmount)} − ₹0 = ${money(june.cumulativeAmount)}. Interest = ${money(june.cumulativeAmount)} × 1% × 3 = <strong>${money(juneInterest)}</strong>.`,
    `15 September: paid ${money(paid.sept)}, which is at least 36% (${money(LIABILITY * 0.36)}). No interest.`,
    `15 December: paid ${money(paid.dec)}, less than 75% (${money(dec.cumulativeAmount)}). Shortfall = ${money(dec.cumulativeAmount - paid.dec)}. Interest = ${money(dec.cumulativeAmount - paid.dec)} × 1% × 3 = <strong>${money(decInterest)}</strong>.`,
    `15 March: paid ${money(paid.march)}, which is 100%. No interest.`,
    `Both shortfalls are already multiples of ₹100 and both interest figures are multiples of ₹10, so no rounding adjustment is needed.`,
  ],
  `Total interest under section 234C = ${money(juneInterest)} + ${money(decInterest)} = <strong>${money(totalInterest)}</strong>.`
)}
${p(`Notice the September result. Ms C had paid ${money(paid.sept)}, which happens to be the full 45%. Even a payment of ₹45,000 would have avoided interest for that date, because it clears the 36% threshold of ${money(LIABILITY * 0.36)}. December has no such margin, so a ${money(dec.cumulativeAmount - paid.dec)} gap there costs three months of interest.`)}

${h2('Assessed tax and section 234B')}
${p(`Section 234C interest is measured against “assessed tax”. The Department’s ${link(INTEREST_AND_FEES, 'interest and fees page')} describes this as the tax on total income declared in the return, reduced by TDS and TCS and certain credits and reliefs. That is why Example 2 starts from tax after TDS rather than gross tax.`)}
${p('Section 234C is not the only charge. The same page explains that section 234B charges 1% a month on unpaid tax from 1 April if the advance tax paid is less than 90% of assessed tax. Ms C paid 100% by 15 March, so section 234B does not apply to her. A taxpayer who stopped paying after December would face both: section 234C on the missed March instalment and section 234B from 1 April until the balance is paid.')}
${p('Estimating the year’s income is the hard part for freelancers, because receipts are uneven. If income rises later in the year, increase the remaining instalments as soon as the new estimate is clear. The examples above assume the estimate made in June turned out to be right.')}

${h2('Common mistakes students make')}
${bullets([
  'Treating 15%, 45%, 75% and 100% as separate instalments instead of cumulative targets.',
  'Calculating interest on the shortfall from 12% or 36% instead of from 15% or 45%.',
  'Charging three months of interest on the 15 March shortfall, when the period for that date is one month.',
  'Forgetting to deduct TDS before applying the percentages.',
  'Applying the four-instalment schedule to a section 44AD or 44ADA taxpayer, who can pay everything by 15 March.',
])}

${h2('Plan your own instalments')}
${p(`Estimate the year’s tax with the ${link('/in/income-tax-calculator', 'income tax calculator')}, take off TDS, then enter the balance in the ${link('/in/advance-tax-calculator', 'advance tax calculator')} for the four dates. Our ${link('/blog/advance-tax-guide', 'advance tax guide')} covers section 234B as well, and ${link('/blog/tds-vs-advance-tax-difference', 'TDS vs advance tax')} explains how the two fit together.`)}
${p('From 1 April 2026 the Income-tax Act, 2025 governs the tax year. This example is for FY 2025-26 under the 1961 Act; check the Department’s current guidance for the corresponding provisions before planning payments for a later year.')}
${lastUpdated('23 October 2026')}
`,
};
