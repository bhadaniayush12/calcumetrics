import type { BlogPost } from './types';
import { calcIncomeTax } from '../../lib/calculators/income-tax';
import { h2, p, link, formulaBlock, bullets, table, solvedExample, lastUpdated } from './solved-example-markup';

const money = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

// Salaried resident individuals, new regime, no other income. calcIncomeTax applies
// the ₹75,000 standard deduction before the 87A rebate and marginal relief.
export const example1 = calcIncomeTax(1290000).newRegime;
export const example2 = calcIncomeTax(1350000).newRegime;
const comparisonRows = [1275000, 1290000, 1320000, 1350000].map((gross) => {
  const r = calcIncomeTax(gross).newRegime;
  return [money(gross), money(r.taxableIncome), money(r.baseTax), money(r.rebate87A), money(r.totalTax)];
});
const excess1 = example1.taxableIncome - 1200000;
const excess2 = example2.taxableIncome - 1200000;

const INCOME_TAX_FAQ_87A = 'https://www.incometaxindia.gov.in/w/what-is-rebate-under-section-87a-for-f.y-2025-26-and-who-can-claim-it-';
const SALARIED_AY_2026_27 = 'https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1';
const SALARY_INCOME_PAGE = 'https://www.incometaxindia.gov.in/w/income-from-salary';
const BUDGET_BRIEF = 'https://www.incometaxindia.gov.in/w/brief-on-budget';

export const SECTION_87A_MARGINAL_RELIEF_POST: BlogPost = {
  slug: 'section-87a-marginal-relief-new-regime-example',
  title: 'Section 87A Marginal Relief: New Regime Solved Example',
  seoTitle: 'Section 87A Marginal Relief: New Regime Solved Example',
  description:
    'Section 87A marginal relief calculation with example for the new tax regime, FY 2025-26: formula, two solved numericals and the ₹12 lakh limit.',
  category: 'Taxes',
  market: 'India-Only',
  publishDate: '2026-10-23',
  dateModified: '2026-10-23',
  readTime: '7 min read',
  author: 'Dev',
  type: 'Evergreen',
  quickAnswer: `Under the new regime for FY 2025-26 (AY 2026-27), a resident individual with total income up to ₹12,00,000 gets a section 87A rebate of up to ₹60,000. Just above ₹12,00,000, marginal relief caps the tax at the income earned above ₹12,00,000. For a salary of ₹12,90,000, tax before cess falls from ${money(example1.baseTax)} to ${money(example1.taxAfterRebate)}.`,
  summary: `Under the new regime for FY 2025-26 (AY 2026-27), a resident individual with total income up to ₹12,00,000 gets a section 87A rebate of up to ₹60,000. Just above ₹12,00,000, marginal relief caps the tax at the income earned above ₹12,00,000. For a salary of ₹12,90,000, tax before cess falls from ${money(example1.baseTax)} to ${money(example1.taxAfterRebate)}.`,
  sources: [
    { name: 'Income Tax Department', url: INCOME_TAX_FAQ_87A, citation: 'FAQ: rebate under section 87A for FY 2025-26, including marginal relief above ₹12,00,000' },
    { name: 'Income Tax Department e-filing portal', url: SALARIED_AY_2026_27, citation: 'Salaried individuals for AY 2026-27: section 115BAC slab rates, 87A limits, 4% cess' },
    { name: 'Income Tax Department', url: SALARY_INCOME_PAGE, citation: 'Income from salary: ₹75,000 standard deduction under section 115BAC(1A)(ii)' },
    { name: 'Income Tax Department', url: BUDGET_BRIEF, citation: 'Brief on Budget: 87A threshold raised to ₹12 lakh; special-rate income excluded from the rebate' },
  ],
  relatedCalculators: [
    { name: 'Income Tax Calculator (India)', path: '/in/income-tax-calculator', description: 'Applies the 87A rebate and marginal relief to your own salary figure.', badge: 'Most Relevant' },
    { name: 'Advance Tax Calculator', path: '/in/advance-tax-calculator', description: 'Split any tax left after the rebate into advance-tax instalments.' },
    { name: 'HRA Exemption Calculator', path: '/in/hra-calculator', description: 'Work out the least-of-three HRA exemption for old-regime comparisons.' },
  ],
  relatedArticles: [
    { slug: 'old-vs-new-tax-regime', title: 'Old vs New Tax Regime', description: 'Compare both regimes before relying on the new-regime rebate.' },
    { slug: 'new-income-tax-act-2025-salaried-guide', title: 'Income-tax Act 2025 guide for salaried taxpayers', description: 'How the rebate is renumbered under the new Act from tax year 2026-27.' },
  ],
  faqs: [
    {
      question: 'What is marginal relief under section 87A in the new tax regime?',
      answer: 'Where total income is a little above ₹12,00,000 and the tax on it is more than the income above ₹12,00,000, the rebate is extended so that tax payable equals that excess income. The Income Tax Department FAQ for FY 2025-26 describes this as rebate with marginal relief.',
    },
    {
      question: 'Is health and education cess charged after marginal relief?',
      answer: `Yes. The 4% cess is charged on income tax plus any surcharge, so it applies to the tax left after the rebate. In Example 1 the cess is ${money(example1.cess)} on ${money(example1.taxAfterRebate)}.`,
    },
    {
      question: 'Up to what income does marginal relief help a salaried person?',
      answer: `Using the slab rates for FY 2025-26, relief stops being useful at total income of about ₹12,70,588, which is a salary of about ₹13,45,588 after the ₹75,000 standard deduction. At a salary of ₹13,50,000 our calculator shows no rebate.`,
    },
    {
      question: 'Does the rebate cover capital gains taxed at special rates?',
      answer: 'No. The Department’s Budget brief says income chargeable at special rates, for example under sections 111A and 112, is excluded when calculating the section 87A rebate under the new regime.',
    },
  ],
  content: `
${p(`The ₹12 lakh limit is the easy part of section 87A. The marginal relief calculation just above it is where answers go wrong. This post works through the calculation the way a tax exam answer would: formula first, then two solved numericals for FY 2025-26 (AY 2026-27) under the Income-tax Act, 1961. The examples use salaried individuals because our ${link('/in/income-tax-calculator', 'India income tax calculator')} models salary income with the standard deduction.`)}

${h2('The rule in plain words')}
${p(`The ${link(INCOME_TAX_FAQ_87A, 'Income Tax Department’s FAQ on section 87A for FY 2025-26')} says a resident individual taxed under section 115BAC(1A) gets a rebate of up to ₹60,000 where total income does not exceed ₹12,00,000. It adds that where total income exceeds ₹12,00,000 and the tax payable exceeds the difference between total income and ₹12,00,000, the person can claim a rebate with marginal relief. The relief is the difference between the tax payable and that excess income.`)}
${p(`In practice, someone who earns ₹15,000 above the limit should not pay ₹62,250 of tax on it. Marginal relief limits the tax to the ₹15,000 earned above ₹12,00,000. As income rises, the slab tax grows more slowly than the excess income, and at some point the relief disappears.`)}
${p(`The slab rates come from the ${link(SALARIED_AY_2026_27, 'e-filing portal page for salaried individuals, AY 2026-27')}: nil up to ₹4,00,000, 5% to ₹8,00,000, 10% to ₹12,00,000, 15% to ₹16,00,000, 20% to ₹20,00,000, 25% to ₹24,00,000 and 30% above that. The same page says the 4% health and education cess is charged on income tax plus surcharge. The ₹75,000 standard deduction for salary under the new regime is listed on the Department’s ${link(SALARY_INCOME_PAGE, 'income from salary page')}.`)}

${h2('Section 87A marginal relief formula')}
${p('Work out the normal slab tax first. Then compare it with the income above ₹12,00,000. The smaller of the two is the tax before cess.')}
${formulaBlock('Marginal relief under section 87A (new regime, FY 2025-26)', 'Tax before cess = MIN( Slab tax on total income , Total income − ₹12,00,000 )<br/>Rebate with marginal relief = Slab tax − Tax before cess')}
${p('If total income is ₹12,00,000 or less, the rebate simply equals the slab tax, up to ₹60,000, and tax before cess is nil.')}

${h2('Solved examples')}
${solvedExample(
  'Example 1: salary just above the ₹12 lakh limit',
  'Mr A, a resident individual aged 35, earns a gross salary of ₹12,90,000 in FY 2025-26 and has no other income. He stays in the new tax regime. Calculate his tax liability after section 87A marginal relief.',
  [
    `Total income = Gross salary − Standard deduction = ₹12,90,000 − ₹75,000 = <strong>${money(example1.taxableIncome)}</strong>.`,
    `Slab tax: ₹0 on the first ₹4,00,000 + ₹20,000 (5% of ₹4,00,000) + ₹40,000 (10% of ₹4,00,000) + ₹2,250 (15% of ₹15,000) = <strong>${money(example1.baseTax)}</strong>.`,
    `Income above ₹12,00,000 = ${money(example1.taxableIncome)} − ₹12,00,000 = <strong>${money(excess1)}</strong>.`,
    `Slab tax (${money(example1.baseTax)}) is more than the excess income (${money(excess1)}), so marginal relief applies. Rebate = ${money(example1.baseTax)} − ${money(excess1)} = <strong>${money(example1.rebate87A)}</strong>.`,
    `Tax after rebate = <strong>${money(example1.taxAfterRebate)}</strong>. Cess at 4% = ${money(example1.cess)}.`,
  ],
  `Total tax payable = ${money(example1.taxAfterRebate)} + ${money(example1.cess)} = <strong>${money(example1.totalTax)}</strong>. Without marginal relief it would have been ${money(example1.baseTax * 1.04)}.`
)}
${solvedExample(
  'Example 2: salary where marginal relief no longer helps',
  'Ms B, a resident individual, earns a gross salary of ₹13,50,000 in FY 2025-26, has no other income and is taxed under the new regime. Does she get any section 87A rebate? Calculate her tax.',
  [
    `Total income = ₹13,50,000 − ₹75,000 = <strong>${money(example2.taxableIncome)}</strong>. This is above ₹12,00,000, so the full rebate is not available.`,
    `Slab tax = ₹20,000 + ₹40,000 + 15% of ₹75,000 (₹11,250) = <strong>${money(example2.baseTax)}</strong>.`,
    `Income above ₹12,00,000 = <strong>${money(excess2)}</strong>.`,
    `Slab tax (${money(example2.baseTax)}) is less than the excess income (${money(excess2)}), so marginal relief does not apply. Rebate = <strong>${money(example2.rebate87A)}</strong>.`,
    `Cess at 4% on ${money(example2.taxAfterRebate)} = ${money(example2.cess)}.`,
  ],
  `Total tax payable = <strong>${money(example2.totalTax)}</strong>, with no section 87A rebate.`
)}

${h2('Where the relief starts and stops')}
${p('The table below runs four salaries through the same calculator engine. Look at how tax jumps between ₹12,75,000 and ₹12,90,000 even with relief, then follows the normal slabs again by ₹13,50,000.')}
${table('Example — new regime, FY 2025-26, salary only, ₹75,000 standard deduction', ['Gross salary', 'Total income', 'Slab tax', '87A rebate', 'Total tax incl. cess'], comparisonRows)}
${p('Relief ends where the slab tax equals the income above ₹12,00,000. Between ₹12,00,000 and ₹16,00,000, slab tax is ₹60,000 plus 15% of the excess. Setting that equal to the excess gives an excess of about ₹70,588, so total income of about ₹12,70,588. Above that point the normal slab tax is already lower than the excess.')}
${p(`One detail surprises students. Marginal relief caps the income tax, not the cess. In Example 1, Mr A earns ${money(excess1)} above the limit and pays ${money(example1.totalTax)} in total, so the cess of ${money(example1.cess)} takes his bill slightly above the extra income. Write the cess as a separate line after the rebate so the examiner can see the cap was applied first.`)}
${p('A four-line layout works for any question in this band: total income, slab tax, excess over ₹12,00,000, and the lower of the two. Add cess last. If the excess is the larger figure, write “marginal relief not available” and continue with normal slab tax.')}

${h2('Common mistakes students make')}
${bullets([
  'Applying the ₹12,00,000 test to gross salary instead of total income after the ₹75,000 standard deduction.',
  'Treating the rebate as all-or-nothing and charging full slab tax at ₹12,15,000 of income, ignoring marginal relief.',
  'Calculating cess on the slab tax before the rebate. Cess is charged on the tax left after it.',
  'Using the old-regime figures (₹5,00,000 limit, ₹12,500 rebate) in a new-regime question.',
  'Including capital gains taxed at special rates in the rebate calculation, which the Department’s Budget brief says should be excluded.',
])}

${h2('Check your own figure')}
${p(`Enter your gross salary in the ${link('/in/income-tax-calculator', 'income tax calculator')} to see the slab tax, the rebate and cess for both regimes. It handles the marginal relief band automatically, but it assumes salary income only, so add other income before relying on the result. Before choosing a regime, read our ${link('/blog/old-vs-new-tax-regime', 'old vs new tax regime comparison')}. From tax year 2026-27 the Income-tax Act, 2025 applies, and our ${link('/blog/new-income-tax-act-2025-salaried-guide', 'guide to the new Act')} shows how the rebate section is renumbered.`)}
${p('This is an educational example for FY 2025-26 and not tax advice. Your return, the Department’s utility and any notice issued to you are the final word on your liability.')}
${lastUpdated('23 October 2026')}
`,
};
