import type { BlogPost } from './types';
import { calcAdvanceTax } from '../../lib/tax/india';
import { calcSimpleInterest } from '../../lib/calculators/simple-interest';
import { h2, p, link, formulaBlock, bullets, table, solvedExample, lastUpdated } from './solved-example-markup';

const money = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

const LIABILITY = 120000;
export const schedule = calcAdvanceTax(LIABILITY);
const [june, sept, dec, march] = schedule.instalments;

// Due dates for tax year 2026-27 (FY 2026-27), in the engine's instalment order.
const YEARS = ['2026', '2026', '2026', '2027'];
const dated = (i: number) => `${schedule.instalments[i].dueDate} ${YEARS[i]}`;

// Example 2: cumulative tax actually paid by each due date.
const paid = { june: 0, sept: 54000, dec: 80000, march: 120000 };
// Section 425 charges 3% of the shortfall for the first three dates (1% for 15 March);
// the simple-interest engine takes the annual equivalent (12%) and the period in years (3/12).
export const juneInterest = calcSimpleInterest(june.cumulativeAmount - paid.june, 12, 3 / 12).interest;
export const decInterest = calcSimpleInterest(dec.cumulativeAmount - paid.dec, 12, 3 / 12).interest;
export const totalInterest = juneInterest + decInterest;

const scheduleRows = schedule.instalments.map((i, idx) => [
  `On or before ${dated(idx)}`, `${i.cumulativePct}%`, money(i.cumulativeAmount), money(i.instalment),
]);

const ACT_2025 = 'https://www.incometaxindia.gov.in/documents/d/guest/income_tax_act_2025_as_amended_by_fa_act_2026-pdf';
const TAX_PAYMENTS_FAQ = 'https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/tax-payments';
const TRANSITION_FAQ = 'https://www.incometaxindia.gov.in/documents/81799/11848482/Updated-FQAs-on-Interplay%26Transitions.pdf/e10ad2b6-9495-de90-58d3-20606d8954ae?t=1775128640970';

export const ADVANCE_TAX_EXAMPLE_POST: BlogPost = {
  slug: 'advance-tax-due-dates-calculation-example',
  title: 'Advance Tax Due Dates FY 2026-27: Solved Example',
  seoTitle: 'Advance Tax Due Dates FY 2026-27: Solved Example',
  description:
    'Advance tax for FY 2026-27 under the Income-tax Act, 2025: 15%, 45%, 75% and 100% due dates and section 425 interest (old 234C) worked out.',
  category: 'Taxes',
  market: 'India-Only',
  publishDate: '2026-10-23',
  dateModified: '2026-10-23',
  readTime: '7 min read',
  author: 'Dev',
  type: 'Evergreen',
  quickAnswer: `For tax year 2026-27 (FY 2026-27), section 408 of the Income-tax Act, 2025 requires advance tax in four instalments: at least 15% by 15 June 2026, 45% by 15 September 2026, 75% by 15 December 2026 and 100% by 15 March 2027. For an estimated liability of ${money(LIABILITY)}, the cumulative targets are ${money(june.cumulativeAmount)}, ${money(sept.cumulativeAmount)}, ${money(dec.cumulativeAmount)} and ${money(march.cumulativeAmount)}.`,
  summary: `For tax year 2026-27 (FY 2026-27), section 408 of the Income-tax Act, 2025 requires advance tax in four instalments: at least 15% by 15 June 2026, 45% by 15 September 2026, 75% by 15 December 2026 and 100% by 15 March 2027. For an estimated liability of ${money(LIABILITY)}, the cumulative targets are ${money(june.cumulativeAmount)}, ${money(sept.cumulativeAmount)}, ${money(dec.cumulativeAmount)} and ${money(march.cumulativeAmount)}.`,
  sources: [
    { name: 'Income Tax Department', url: ACT_2025, citation: 'Income-tax Act, 2025 as amended by Finance Act, 2026: sections 404 (₹10,000 threshold), 405 (computation), 408 (instalments and due dates), 424 and 425 (interest)' },
    { name: 'Income Tax Department e-filing portal', url: TAX_PAYMENTS_FAQ, citation: 'Tax payments FAQ: section 404 threshold, section 408(2) for presumptive taxpayers, sections 424 and 425 corresponding to 234B and 234C' },
    { name: 'Income Tax Department', url: TRANSITION_FAQ, citation: 'FAQs on interplay and transitions, Q2.14–Q2.21: advance tax for tax year 2026-27 is paid under the new Act; FY 2025-26 stays under the 1961 Act' },
  ],
  relatedCalculators: [
    { name: 'Advance Tax Calculator', path: '/in/advance-tax-calculator', description: 'Instalment schedule for your estimated tax.', badge: 'Most Relevant' },
    { name: 'Income Tax Calculator (India)', path: '/in/income-tax-calculator', description: 'Estimate the year’s tax before splitting it into instalments.' },
    { name: 'Simple Interest Calculator', path: '/simple-interest-calculator', description: 'Reproduce the section 425 interest arithmetic.' },
  ],
  relatedArticles: [
    { slug: 'advance-tax-guide', title: 'Advance tax in India', description: 'The quarterly calendar and sections 234B and 234C.' },
    { slug: 'tds-vs-advance-tax-difference', title: 'TDS vs advance tax', description: 'Who pays which, and how TDS reduces advance tax.' },
  ],
  faqs: [
    {
      question: 'Who has to pay advance tax for FY 2026-27?',
      answer: 'Under section 404 of the Income-tax Act, 2025, advance tax is payable where the tax for the year, computed under the advance tax provisions, is ₹10,000 or more. Section 405 computes that tax after deducting TDS and TCS, so a salaried employee whose employer withholds the full tax usually has nothing left to pay.',
    },
    {
      question: 'What are the due dates for presumptive taxpayers?',
      answer: 'Taxpayers who declare income under the presumptive scheme of section 58 pay the whole of their advance tax by 15 March, under section 408(2). For tax year 2026-27 that is 15 March 2027.',
    },
    {
      question: 'Is there any margin before section 425 interest applies?',
      answer: 'Yes, for the first two instalments. Section 425(2) says no interest is payable if at least 12% is paid by 15 June or at least 36% by 15 September. If interest does apply, it is calculated on the shortfall from 15% or 45%.',
    },
    {
      question: 'Which Act applies to advance tax for FY 2025-26?',
      answer: 'The Income-tax Act, 1961. The Department’s transition FAQs say advance tax for FY 2025-26 (AY 2026-27), and interest on any shortfall in it, is governed by sections 208, 211, 234B and 234C of the old Act, even if the interest is levied after 1 April 2026.',
    },
  ],
  content: `
${p(`This post works through advance tax due dates and interest for FY 2026-27 with two exam-style examples of the kind set for CA Foundation students, and the same sums apply to freelancers paying real instalments this year. From 1 April 2026 the Income-tax Act, 2025 applies, and the Department’s ${link(TRANSITION_FAQ, 'transition FAQs')} confirm that advance tax for tax year 2026-27 is paid under the new Act. The schedule comes from our ${link('/in/advance-tax-calculator', 'advance tax calculator')} and the interest from our simple-interest engine.`)}
${p('The provisions have new numbers. Section 404 (old section 208) sets who pays, section 405 computes the amount, section 408 (old section 211) sets the instalments, and sections 424 and 425 (old sections 234B and 234C) charge interest. The Department says there is no policy change: the threshold, dates, percentages and interest rates are the same as before.')}

${h2('Who pays and when')}
${p(`Under section 404 of the ${link(ACT_2025, 'Income-tax Act, 2025')}, advance tax is payable during a financial year where the tax payable for that year, as computed under the advance tax provisions, is ₹10,000 or more. Section 405 computes it as tax on the estimated income less the TDS and TCS expected for the year, so a salaried employee whose employer withholds the full tax usually has nothing left to pay.`)}
${p(`Section 408(1) sets four instalments: not less than 15% by 15 June, 45% by 15 September, 75% by 15 December and the whole amount by 15 March, each reduced by what has already been paid. For FY 2026-27 the remaining dates are 15 December 2026 and 15 March 2027. Taxpayers who declare income under the presumptive scheme of section 58 pay everything by 15 March instead, under section 408(2), as the e-filing portal’s ${link(TAX_PAYMENTS_FAQ, 'tax payments FAQ')} also explains.`)}

${h2('Advance tax formula')}
${p('Estimate the tax for the year, take off TDS and TCS, and apply the cumulative percentage for each date. The instalment due on a date is the cumulative target less what has already been paid.')}
${formulaBlock('Advance tax instalments and section 425 interest', 'Advance tax (s.405) = Tax on estimated income − TDS/TCS for the year<br/>Cumulative target = Advance tax × 15% / 45% / 75% / 100%<br/>Instalment due = Cumulative target − Advance tax already paid<br/>Section 425 interest = Shortfall × 3% (1% for 15 March)')}
${p('Section 425 (old section 234C) has a margin on the first two dates. Its table charges 3% of the shortfall for 15 June, 15 September and 15 December, and 1% for 15 March, but section 425(2) says no interest is payable if at least 12% is paid by 15 June or at least 36% by 15 September. Once interest applies, it is charged on the shortfall from 15%, 45%, 75% or 100% of the tax due on returned income, not from 12% or 36%. The 3% is the same charge as the old Act’s 1% a month for three months.')}

${h2('Solved examples')}
${solvedExample(
  'Example 1: instalment schedule for a freelancer',
  `Ms C, a freelance designer, is not under a presumptive scheme. She estimates her tax for tax year 2026-27 (FY 2026-27), after TDS, at ${money(LIABILITY)}. Prepare her advance tax schedule.`,
  [
    `Tax after TDS = ${money(LIABILITY)}, which is ₹10,000 or more, so advance tax is payable under section 404.`,
    `By ${dated(0)}: 15% × ${money(LIABILITY)} = <strong>${money(june.cumulativeAmount)}</strong>.`,
    `By ${dated(1)}: 45% × ${money(LIABILITY)} = ${money(sept.cumulativeAmount)} cumulative, so the instalment is ${money(sept.cumulativeAmount)} − ${money(june.cumulativeAmount)} = <strong>${money(sept.instalment)}</strong>.`,
    `By ${dated(2)}: 75% = ${money(dec.cumulativeAmount)} cumulative; instalment = <strong>${money(dec.instalment)}</strong>.`,
    `By ${dated(3)}: 100% = ${money(march.cumulativeAmount)} cumulative; instalment = <strong>${money(march.instalment)}</strong>.`,
  ],
  `Pay ${money(june.instalment)}, ${money(sept.instalment)}, ${money(dec.instalment)} and ${money(march.instalment)} on or before ${dated(0)}, ${dated(1)}, ${dated(2)} and ${dated(3)}.`
)}
${table(`Example 1 — estimated tax after TDS ${money(LIABILITY)}, FY 2026-27`, ['Due date', 'Cumulative %', 'Cumulative amount', 'Instalment'], scheduleRows)}
${solvedExample(
  'Example 2: section 425 interest on late instalments',
  `Ms C’s tax on returned income for tax year 2026-27, after TDS, turns out to be exactly ${money(LIABILITY)}. Her cumulative advance tax payments were: nil by ${dated(0)}, ${money(paid.sept)} by ${dated(1)}, ${money(paid.dec)} by ${dated(2)} and ${money(paid.march)} by ${dated(3)}. Calculate interest under section 425 (old section 234C).`,
  [
    `${dated(0)}: paid nil, which is less than 12% (${money(LIABILITY * 0.12)}). Shortfall from 15% = ${money(june.cumulativeAmount)} − ₹0 = ${money(june.cumulativeAmount)}. Interest = ${money(june.cumulativeAmount)} × 3% = <strong>${money(juneInterest)}</strong>.`,
    `${dated(1)}: paid ${money(paid.sept)}, which is at least 36% (${money(LIABILITY * 0.36)}). No interest.`,
    `${dated(2)}: paid ${money(paid.dec)}, less than 75% (${money(dec.cumulativeAmount)}). Shortfall = ${money(dec.cumulativeAmount - paid.dec)}. Interest = ${money(dec.cumulativeAmount - paid.dec)} × 3% = <strong>${money(decInterest)}</strong>.`,
    `${dated(3)}: paid ${money(paid.march)}, which is 100%. No interest.`,
  ],
  `Total interest under section 425 = ${money(juneInterest)} + ${money(decInterest)} = <strong>${money(totalInterest)}</strong>.`
)}
${p(`Notice the September result. Ms C had paid ${money(paid.sept)}, which happens to be the full 45%. Even a payment of ₹45,000 would have avoided interest for that date, because it clears the 36% threshold of ${money(LIABILITY * 0.36)}. December has no such margin, so a ${money(dec.cumulativeAmount - paid.dec)} gap there costs 3% of the shortfall.`)}

${h2('Tax due on returned income and section 424')}
${p('Section 425 interest is measured against the “tax due on returned income”. Section 425(5) defines it as the tax on the total income declared in the return, reduced by TDS and TCS and certain reliefs and credits. That is why Example 2 starts from tax after TDS rather than gross tax.')}
${p('Section 425 is not the only charge. Section 424 (old section 234B) charges simple interest of 1% for every month or part of a month from 1 April following the tax year if the advance tax paid is less than 90% of assessed tax. Ms C paid 100% by 15 March 2027, so section 424 does not apply to her. A taxpayer who stopped paying after December would face both: section 425 on the missed March instalment and section 424 from 1 April 2027.')}
${p('Estimating the year’s income is the hard part for freelancers, because receipts are uneven. If income rises later in the year, increase the remaining instalments as soon as the new estimate is clear. The examples above assume the estimate made in June turned out to be right.')}

${h2('Common mistakes students make')}
${bullets([
  'Treating 15%, 45%, 75% and 100% as separate instalments instead of cumulative targets.',
  'Calculating interest on the shortfall from 12% or 36% instead of from 15% or 45%.',
  'Charging 3% on the 15 March shortfall, when the rate for that date is 1%.',
  'Forgetting to deduct TDS before applying the percentages.',
  'Applying the four-instalment schedule to a presumptive taxpayer under section 58, who can pay everything by 15 March.',
  'Quoting section 208 or 234C for FY 2026-27, when the new Act’s sections 404 and 425 now apply.',
])}

${h2('Plan your own instalments')}
${p(`Estimate the year’s tax with the ${link('/in/income-tax-calculator', 'income tax calculator')}, take off TDS, then enter the balance in the ${link('/in/advance-tax-calculator', 'advance tax calculator')} for the four dates. Our ${link('/blog/advance-tax-guide', 'advance tax guide')} covers the old section 234B as well, and ${link('/blog/tds-vs-advance-tax-difference', 'TDS vs advance tax')} explains how the two fit together.`)}
${p('Advance tax for FY 2025-26 (AY 2026-27), and interest on any shortfall in it, stays under sections 208, 211, 234B and 234C of the Income-tax Act, 1961, according to the Department’s transition FAQs. The arithmetic is the same.')}
${lastUpdated('23 October 2026')}
`,
};
