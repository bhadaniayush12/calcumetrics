import type { BlogPost } from './types';
import { calcHRA } from '../../lib/calculators/taxes';
import { h2, p, link, formulaBlock, bullets, table, solvedExample, lastUpdated } from './solved-example-markup';

const money = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

// "Salary" for HRA = Basic + DA forming part of retirement benefits (+ turnover-based
// commission). calcHRA's first argument receives that figure, not basic alone.
const ex1 = { basic: 40000, da: 10000, hra: 18000, rent: 22000 };
const ex1Salary = (ex1.basic + ex1.da) * 12;
export const example1 = calcHRA(ex1Salary, ex1.hra * 12, ex1.rent * 12, false);

const ex2 = { basic: 50000, daNotRetirement: 5000, hra: 30000, rent: 25000 };
const ex2Salary = ex2.basic * 12;
export const example2 = calcHRA(ex2Salary, ex2.hra * 12, ex2.rent * 12, true);

// What-if for Example 1: rent of ₹25,000 a month instead of ₹22,000.
export const example1HigherRent = calcHRA(ex1Salary, ex1.hra * 12, 25000 * 12, false);

const limitRows = (r: typeof example1, label: string) => [
  ['1. Actual HRA received', money(r.actualHRA)],
  ['2. Rent paid − 10% of salary', money(r.rentMinusTenPct)],
  [`3. ${label} of salary`, money(r.metroLimit)],
  ['Exempt HRA (least of 1–3)', money(r.exemption)],
  ['Taxable HRA', money(r.taxableHRA)],
];

const SALARY_PAGE = 'https://www.incometaxindia.gov.in/w/income-from-salary';

export const HRA_LEAST_OF_THREE_POST: BlogPost = {
  slug: 'hra-exemption-least-of-three-solved-example',
  title: 'HRA Exemption: Least of Three Limits Solved Numerical',
  seoTitle: 'HRA Exemption: Least of Three Limits Solved Numerical',
  description:
    'HRA exemption calculation formula with the least of three limits under Rule 2A: two solved numericals, metro and non-metro, with taxable HRA worked out.',
  category: 'Taxes',
  market: 'India-Only',
  publishDate: '2026-10-23',
  dateModified: '2026-10-23',
  readTime: '7 min read',
  author: 'Dev',
  type: 'Evergreen',
  quickAnswer: `Under section 10(13A) read with Rule 2A, the exempt HRA is the least of: actual HRA received; rent paid minus 10% of salary; and 50% of salary in Mumbai, Kolkata, Delhi or Chennai or 40% elsewhere. "Salary" means basic plus DA that forms part of retirement benefits plus turnover-based commission. In Example 1, the exemption is ${money(example1.exemption)} and ${money(example1.taxableHRA)} of HRA is taxable.`,
  summary: `Under section 10(13A) read with Rule 2A, the exempt HRA is the least of: actual HRA received; rent paid minus 10% of salary; and 50% of salary in Mumbai, Kolkata, Delhi or Chennai or 40% elsewhere. "Salary" means basic plus DA that forms part of retirement benefits plus turnover-based commission. In Example 1, the exemption is ${money(example1.exemption)} and ${money(example1.taxableHRA)} of HRA is taxable.`,
  sources: [
    { name: 'Income Tax Department', url: SALARY_PAGE, citation: 'Income from salary: section 10(13A) read with Rule 2A, the three limits, definition of salary, notes on own house and landlord PAN' },
    { name: 'Calcumetrics HRA Exemption Calculator', url: 'https://calcumetrics.com/in/hra-calculator', citation: 'calcHRA engine: three limits, exemption and taxable HRA used for every figure here' },
  ],
  relatedCalculators: [
    { name: 'HRA Exemption Calculator', path: '/in/hra-calculator', description: 'All three Rule 2A limits side by side.', badge: 'Most Relevant' },
    { name: 'Income Tax Calculator (India)', path: '/in/income-tax-calculator', description: 'See how the exemption changes your tax.' },
    { name: 'Salary CTC Calculator', path: '/in/salary-ctc-calculator', description: 'Break a CTC into basic, HRA and other components.' },
  ],
  relatedArticles: [
    { slug: 'old-vs-new-tax-regime', title: 'Old vs New Tax Regime', description: 'Check whether HRA-based savings make the old regime worth choosing.' },
  ],
  faqs: [
    {
      question: 'What are the three limits for HRA exemption?',
      answer: 'Actual HRA received; rent paid minus 10% of salary; and 50% of salary if the house is in Mumbai, Kolkata, Delhi or Chennai, or 40% elsewhere. The lowest of the three is exempt.',
    },
    {
      question: 'What does "salary" mean for the HRA calculation?',
      answer: 'The Income Tax Department’s salary page defines it as basic salary, plus dearness allowance if it forms part of retirement benefits, plus commission based on a fixed percentage of turnover.',
    },
    {
      question: 'Is Bengaluru a metro city for HRA?',
      answer: 'No. The 50% limit applies only to houses in Mumbai, Kolkata, Delhi and Chennai. Bengaluru, Hyderabad, Pune and every other city use the 40% limit.',
    },
    {
      question: 'Can I claim HRA exemption if I live in my own house?',
      answer: 'No. The Department’s page notes that HRA is fully taxable if the employee lives in their own house or does not pay any rent.',
    },
  ],
  content: `
${p(`An HRA exemption calculation is really three calculations and a comparison. The Income-tax Act lists three limits and only the lowest is exempt, so an exam answer has to show all three before picking one. This post covers the formula, the definition of salary that trips most students up, and two solved numericals for FY 2025-26 (AY 2026-27) under the Income-tax Act, 1961. The figures come from our ${link('/in/hra-calculator', 'HRA exemption calculator')}.`)}

${h2('The rule under section 10(13A) and Rule 2A')}
${p(`The Income Tax Department’s ${link(SALARY_PAGE, 'page on income from salary')} lists house rent allowance under section 10(13A) read with Rule 2A. The least of the following is exempt: actual HRA received; 40% of salary, or 50% if the house is in Mumbai, Calcutta (Kolkata), Delhi or Chennai; and rent paid minus 10% of salary.`)}
${p('The same page defines salary for this purpose as basic salary, plus dearness allowance if it forms part of retirement benefits, plus turnover-based commission. It adds two notes: HRA is fully taxable if the employee lives in their own house or pays no rent, and the employee must report the landlord’s PAN to the employer if rent paid is more than ₹1,00,000.')}
${p('In the examples below, rent is paid and HRA is received for the whole year, so annual figures are used throughout.')}

${h2('HRA exemption formula: least of three limits')}
${p('Calculate each limit for the year, then take the smallest. Whatever HRA is left over is added to taxable salary.')}
${formulaBlock('HRA exemption under Rule 2A', 'Exempt HRA = MIN( Actual HRA , Rent paid − 10% × Salary , 50% or 40% × Salary )<br/>Salary = Basic + DA (retirement benefits) + Turnover-based commission<br/>Taxable HRA = HRA received − Exempt HRA')}

${h2('Solved numericals')}
${solvedExample(
  'Example 1: non-metro city (Bengaluru)',
  `Mr D works in Bengaluru. His monthly pay is: basic ${money(ex1.basic)}, DA ${money(ex1.da)} (forming part of retirement benefits) and HRA ${money(ex1.hra)}. He pays rent of ${money(ex1.rent)} a month for the whole of FY 2025-26. Calculate his exempt and taxable HRA.`,
  [
    `Salary for HRA = (${money(ex1.basic)} + ${money(ex1.da)}) × 12 = <strong>${money(ex1Salary)}</strong>. DA counts because it forms part of retirement benefits.`,
    `Limit 1, actual HRA received = ${money(ex1.hra)} × 12 = <strong>${money(example1.actualHRA)}</strong>.`,
    `Limit 2, rent paid − 10% of salary = ${money(ex1.rent * 12)} − ${money(ex1Salary * 0.1)} = <strong>${money(example1.rentMinusTenPct)}</strong>.`,
    `Limit 3, Bengaluru is not one of the four cities, so 40% of salary = 40% × ${money(ex1Salary)} = <strong>${money(example1.metroLimit)}</strong>.`,
    `The least of the three is limit 2, ${money(example1.exemption)}.`,
  ],
  `Exempt HRA = <strong>${money(example1.exemption)}</strong>. Taxable HRA = ${money(example1.actualHRA)} − ${money(example1.exemption)} = <strong>${money(example1.taxableHRA)}</strong>.`
)}
${table('Example 1 — Bengaluru, FY 2025-26 (annual figures)', ['Limit', 'Amount'], limitRows(example1, '40%'))}
${solvedExample(
  'Example 2: metro city with DA outside retirement benefits',
  `Ms E lives and works in Mumbai. Her monthly pay is: basic ${money(ex2.basic)}, DA ${money(ex2.daNotRetirement)} (not forming part of retirement benefits) and HRA ${money(ex2.hra)}. Her rent is ${money(ex2.rent)} a month for the whole year. Calculate her exempt and taxable HRA for FY 2025-26.`,
  [
    `Salary for HRA = ${money(ex2.basic)} × 12 = <strong>${money(ex2Salary)}</strong>. Her DA does not form part of retirement benefits, so it is left out.`,
    `Limit 1, actual HRA received = ${money(ex2.hra)} × 12 = <strong>${money(example2.actualHRA)}</strong>.`,
    `Limit 2, rent paid − 10% of salary = ${money(ex2.rent * 12)} − ${money(ex2Salary * 0.1)} = <strong>${money(example2.rentMinusTenPct)}</strong>.`,
    `Limit 3, Mumbai is one of the four cities, so 50% of salary = <strong>${money(example2.metroLimit)}</strong>.`,
    `The least of the three is limit 2, ${money(example2.exemption)}.`,
  ],
  `Exempt HRA = <strong>${money(example2.exemption)}</strong>. Taxable HRA = ${money(example2.actualHRA)} − ${money(example2.exemption)} = <strong>${money(example2.taxableHRA)}</strong>.`
)}
${table('Example 2 — Mumbai, FY 2025-26 (annual figures)', ['Limit', 'Amount'], limitRows(example2, '50%'))}
${p(`In both examples the rent limit decides the answer. This happens whenever rent paid is low compared with the HRA the employer pays. In Example 2, Ms E would need to pay more rent, not receive more HRA, to raise her exemption: each extra rupee of rent raises limit 2 by a rupee until it reaches limit 3 at ${money(example2.metroLimit)}.`)}

${h2('What changes the answer')}
${p(`Go back to Mr D in Example 1 and raise his rent to ₹25,000 a month. Limit 2 becomes ${money(example1HigherRent.rentMinusTenPct)}, equal to limit 3, and both are now above his actual HRA of ${money(example1HigherRent.actualHRA)}. The least of the three is the HRA received, so the exemption becomes <strong>${money(example1HigherRent.exemption)}</strong> and taxable HRA falls to ${money(example1HigherRent.taxableHRA)}. Once actual HRA is the lowest limit, paying more rent does not increase the exemption.`)}
${p('A pay rise works the other way. A higher basic or qualifying DA increases 10% of salary, which reduces limit 2, while it raises limit 3. Whenever salary changes during an exam question, recalculate all three limits rather than adjusting only one.')}

${h2('Common mistakes students make')}
${bullets([
  'Using basic pay alone as salary when the question says DA forms part of retirement benefits.',
  'Including DA that does not form part of retirement benefits, which inflates limits 2 and 3.',
  'Treating Bengaluru, Hyderabad or Pune as metro cities and applying 50% instead of 40%.',
  'Deducting 10% of HRA, or 10% of rent, instead of 10% of salary in limit 2.',
  'Mixing monthly and annual figures across the three limits.',
])}

${h2('Check your answer')}
${p(`Enter annual salary (basic plus qualifying DA), HRA received and rent paid in the ${link('/in/hra-calculator', 'HRA calculator')}, and choose metro or non-metro. It shows each limit next to the exemption, which is the layout examiners expect. Whether the exemption is available also depends on the tax regime you file under, so check that before relying on the saving; our ${link('/blog/old-vs-new-tax-regime', 'old vs new tax regime comparison')} walks through that decision.`)}
${p('This is an educational example for FY 2025-26. From tax year 2026-27 the Income-tax Act, 2025 applies, and section and rule numbers may differ, so confirm the current provisions on the Income Tax Department’s website.')}
${lastUpdated('23 October 2026')}
`,
};
