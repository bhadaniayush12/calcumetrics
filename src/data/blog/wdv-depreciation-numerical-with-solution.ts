import type { BlogPost } from './types';
import { calcDepreciation } from '../../lib/calculators/depreciation';
import { h2, p, link, formulaBlock, bullets, table, solvedExample, lastUpdated } from './solved-example-markup';

const money = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

// The engine derives the WDV rate from residual value: r = 1 − (residual / cost)^(1/n).
// A residual of cost × 0.9^n therefore reproduces a textbook rate of exactly 10%.
export const example1 = calcDepreciation(200000, 200000 * 0.9 ** 3, 3, 'WDV');
// Example 2: the one-third sold, full years 1–2 at 10%, then six months (10% × 6/12 = 5%) in year 3.
export const soldFullYears = calcDepreciation(100000, 100000 * 0.9 ** 2, 2, 'WDV');
const soldOpeningY3 = soldFullYears.schedule[1].closingValue;
export const soldHalfYear = calcDepreciation(soldOpeningY3, soldOpeningY3 * 0.95, 1, 'WDV');
const bookValueAtSale = soldHalfYear.schedule[0].closingValue;
const salePrice = 75000;
export const lossOnSale = bookValueAtSale - salePrice;
const retainedY3 = example1.schedule[2];
export const totalDepY3 = retainedY3.depreciation + soldHalfYear.schedule[0].depreciation;

// Straight-line comparison: 10% of original cost each year.
export const slm = calcDepreciation(200000, 200000 * 0.7, 3, 'SLM');

const scheduleRows = example1.schedule.map((y) => [
  `Year ${y.year}`, money(y.openingValue), money(y.depreciation), money(y.closingValue),
]);

const DEDUCTIONS_PAGE = 'https://www.incometaxindia.gov.in/w/deductions-allowable-to-tax-payer';

export const WDV_DEPRECIATION_NUMERICAL_POST: BlogPost = {
  slug: 'wdv-depreciation-numerical-with-solution',
  title: 'WDV Depreciation Numerical with Solution (B.Com)',
  seoTitle: 'WDV Depreciation Numerical with Solution (B.Com)',
  description:
    'Written down value method depreciation numerical with solution for B.Com: formula, a 3-year schedule and a part-sale question with pro-rata depreciation.',
  category: 'Business',
  market: 'Both',
  publishDate: '2026-10-23',
  dateModified: '2026-10-23',
  readTime: '7 min read',
  author: 'Dev',
  type: 'Evergreen',
  quickAnswer: `Under the written down value (WDV) method, depreciation each year is a fixed percentage of the asset's opening book value, so the charge falls every year. A machine costing ${money(200000)} at 10% WDV is depreciated by ${money(example1.schedule[0].depreciation)}, ${money(example1.schedule[1].depreciation)} and ${money(example1.schedule[2].depreciation)} in its first three years.`,
  summary: `Under the written down value (WDV) method, depreciation each year is a fixed percentage of the asset's opening book value, so the charge falls every year. A machine costing ${money(200000)} at 10% WDV is depreciated by ${money(example1.schedule[0].depreciation)}, ${money(example1.schedule[1].depreciation)} and ${money(example1.schedule[2].depreciation)} in its first three years.`,
  sources: [
    { name: 'Income Tax Department', url: DEDUCTIONS_PAGE, citation: 'Deductions allowable: section 32(1)(ii) WDV on each block of assets; 50% restriction for assets used under 180 days' },
    { name: 'Calcumetrics Depreciation Calculator', url: 'https://calcumetrics.com/depreciation-calculator', citation: 'calcDepreciation engine (SLM and WDV schedules) used for every figure in the examples' },
  ],
  relatedCalculators: [
    { name: 'Depreciation Calculator', path: '/depreciation-calculator', description: 'Build SLM or WDV schedules year by year.', badge: 'Most Relevant' },
    { name: 'ROI Calculator', path: '/roi-calculator', description: 'Compare an asset’s return after depreciation.' },
    { name: 'Payback Period Calculator', path: '/payback-period-calculator', description: 'Check how long an asset takes to recover its cost.' },
  ],
  relatedArticles: [
    { slug: 'straight-line-vs-reducing-balance-depreciation', title: 'Straight-line vs reducing balance depreciation', description: 'When each method fits and how it changes reported profit.' },
  ],
  faqs: [
    {
      question: 'What is the formula for the written down value method?',
      answer: 'Depreciation for the year = Opening book value × Rate. Closing book value = Opening book value − Depreciation. The closing value becomes the next year’s opening value.',
    },
    {
      question: 'Why does a WDV asset never reach zero?',
      answer: 'Each year removes only a percentage of what is left, so the balance keeps shrinking but never hits zero. Students usually stop at the asset’s life or its sale.',
    },
    {
      question: 'How do I calculate depreciation for part of a year?',
      answer: 'Multiply the annual charge by the months the asset was held in that year divided by 12. In Example 2, six months at 10% on ₹81,000 gives ₹4,050.',
    },
    {
      currencyLock: 'INR',
      question: 'Is WDV depreciation in the books the same as depreciation under the Income-tax Act?',
      answer: 'Not necessarily. Under section 32(1)(ii), tax depreciation is calculated on the written down value of each block of assets at prescribed rates, and only 50% is allowed in the year of acquisition if the asset is used for under 180 days. Book depreciation follows the accounting policy instead.',
    },
  ],
  content: `
${p(`A written down value method depreciation numerical with solution usually has two parts: a schedule for a few years, then a sale of part of the asset during a year. Both are covered below, laid out the way B.Com and CA Foundation answer books set them out. Every figure comes from our ${link('/depreciation-calculator', 'depreciation calculator')} engine, so you can reproduce it there.`)}

${h2('What the WDV method does')}
${p('The written down value method, also called the diminishing or reducing balance method, charges depreciation as a fixed percentage of the asset’s book value at the start of each year. Because the book value falls each year, so does the charge. The early years carry the biggest charge, which fits assets that lose value fastest when new, such as machinery and vehicles.')}
${p('Compare this with the straight-line method, which charges the same amount every year on original cost. Our guide to ' + link('/blog/straight-line-vs-reducing-balance-depreciation', 'straight-line vs reducing balance depreciation') + ' covers when each method is used and how it changes reported profit.')}

${h2('WDV depreciation formula')}
${p('Apply the rate to the opening book value, not to the original cost. Carry the closing value forward as the next year’s opening value.')}
${formulaBlock('Written down value method', 'Depreciation = Opening WDV × Rate × (Months used ÷ 12)<br/>Closing WDV = Opening WDV − Depreciation')}
${p('If a question gives cost, residual value and life instead of a rate, the rate is 1 − (Residual value ÷ Cost)^(1 ÷ n). Our calculator works this way, so to get exactly 10% for three years you enter a residual value of Cost × 0.9³.')}

${h2('Solved numericals')}
${solvedExample(
  'Example 1: three-year WDV schedule',
  `On 1 April Year 1, a firm buys machinery for ${money(200000)}. It charges depreciation at 10% per annum on the written down value method and closes its books on 31 March each year. Prepare the depreciation schedule for three years.`,
  [
    `Year 1: ${money(200000)} × 10% = <strong>${money(example1.schedule[0].depreciation)}</strong>. Closing WDV = ${money(example1.schedule[0].closingValue)}.`,
    `Year 2: ${money(example1.schedule[1].openingValue)} × 10% = <strong>${money(example1.schedule[1].depreciation)}</strong>. Closing WDV = ${money(example1.schedule[1].closingValue)}.`,
    `Year 3: ${money(example1.schedule[2].openingValue)} × 10% = <strong>${money(example1.schedule[2].depreciation)}</strong>. Closing WDV = ${money(example1.schedule[2].closingValue)}.`,
    `Total depreciation over three years = ${money(example1.totalDepreciation)}.`,
  ],
  `Depreciation is ${money(example1.schedule[0].depreciation)}, ${money(example1.schedule[1].depreciation)} and ${money(example1.schedule[2].depreciation)}. Book value at the end of Year 3 is <strong>${money(retainedY3.closingValue)}</strong>.`
)}
${table('Example 1 — 10% WDV, purchased 1 April Year 1', ['Year', 'Opening WDV', 'Depreciation', 'Closing WDV'], scheduleRows)}
${solvedExample(
  'Example 2: part of the machine sold mid-year',
  `A firm buys machinery for ${money(300000)} on 1 April Year 1 and depreciates it at 10% per annum on the WDV method, closing its books on 31 March. On 30 September Year 3, one-third of the machinery (original cost ${money(100000)}) is sold for ${money(salePrice)}. Calculate the profit or loss on sale and total depreciation for Year 3.`,
  [
    `Separate the part sold: original cost = ${money(300000)} × 1/3 = ${money(100000)}.`,
    `Depreciation on the part sold, Year 1 = ${money(soldFullYears.schedule[0].depreciation)}; Year 2 = ${money(soldFullYears.schedule[1].depreciation)}. WDV on 1 April Year 3 = <strong>${money(soldOpeningY3)}</strong>.`,
    `Year 3 depreciation on the part sold for six months (1 April to 30 September) = ${money(soldOpeningY3)} × 10% × 6/12 = <strong>${money(soldHalfYear.schedule[0].depreciation)}</strong>.`,
    `Book value on the date of sale = ${money(soldOpeningY3)} − ${money(soldHalfYear.schedule[0].depreciation)} = <strong>${money(bookValueAtSale)}</strong>.`,
    `Loss on sale = Book value − Sale price = ${money(bookValueAtSale)} − ${money(salePrice)} = <strong>${money(lossOnSale)}</strong>.`,
    `The remaining two-thirds (cost ${money(200000)}) follows Example 1: Year 3 depreciation = ${money(retainedY3.depreciation)}, closing WDV = ${money(retainedY3.closingValue)}.`,
    `Total Year 3 depreciation = ${money(soldHalfYear.schedule[0].depreciation)} + ${money(retainedY3.depreciation)} = <strong>${money(totalDepY3)}</strong>.`,
  ],
  `Loss on sale of machinery = <strong>${money(lossOnSale)}</strong>, debited to Profit and Loss Account. Total depreciation for Year 3 = <strong>${money(totalDepY3)}</strong>, and the Machinery Account closes at ${money(retainedY3.closingValue)}.`
)}
${p('In the ledger, the Machinery Account is credited with depreciation on both parts, with the sale proceeds and with the loss on sale. The balance carried down is the closing WDV of the part still in use. Working notes for the part sold should show each year on a separate line, because examiners award marks for the working as well as the answer.')}

${p(`For comparison, the straight-line method at 10% of original cost would charge ${money(slm.schedule[0].depreciation)} in each of the three years, a total of ${money(slm.totalDepreciation)}, leaving a book value of ${money(slm.schedule[2].closingValue)}. The WDV method charges the same ${money(example1.schedule[0].depreciation)} in Year 1 but less afterwards, so its book value stays higher. A question that asks you to compare the two methods is testing exactly this difference.`)}

<section data-currency-lock="INR">
${h2('Indian tax depreciation follows different rules')}
${p(`The Income Tax Department’s ${link(DEDUCTIONS_PAGE, 'list of deductions allowable to taxpayers')} describes section 32(1)(ii): depreciation at prescribed percentages on the written down value of each block of assets, for all assessees engaged in business or profession. It also says that if an asset is acquired and put to use for less than 180 days during the previous year, the deduction is restricted to 50% of the depreciation computed.`)}
${p('That makes tax depreciation different from the book depreciation in the examples above. Tax depreciation works on blocks of assets rather than on individual machines, uses rates prescribed for each block and replaces month-by-month apportionment with the 180-day test in the year of acquisition. B.Com financial accounting questions use the rate and the time basis given in the question. Income tax questions use the block and prescribed-rate rules.')}
</section>

${h2('Common mistakes students make')}
${bullets([
  'Applying the rate to original cost every year, which turns WDV into the straight-line method.',
  'Charging a full year of depreciation on the part sold in the year of sale instead of only the months held.',
  'Forgetting to depreciate the remaining part of the asset for the full year when only part of it is sold.',
  'Finding profit or loss on sale by comparing sale price with original cost instead of book value on the sale date.',
  'Mixing the Income-tax Act block-of-assets rules into a financial accounting question that gives its own rate.',
])}

${h2('Check your answer')}
${p(`Open the ${link('/depreciation-calculator', 'depreciation calculator')}, choose WDV, enter the cost and life, and set the residual value to cost × (1 − rate)^years. The schedule should match the table above row for row. For partial years, take the opening value for that year from the schedule and apply the months held yourself, as in Example 2.`)}
${lastUpdated('23 October 2026')}
`,
};
