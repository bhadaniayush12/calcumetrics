import type { BlogPost } from './types';
import { calcBreakEven } from '../../lib/calculators/breakeven';
import { h2, p, link, formulaBlock, bullets, table, solvedExample, lastUpdated } from './solved-example-markup';

const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;
const units = (n: number) => Math.ceil(n - 1e-9).toLocaleString('en-US');
const pct = (n: number) => `${(n * 100).toFixed(2).replace(/\.00$/, '')}` + '%';

const FIXED = 100000;
const PRICE = 50;
const VARIABLE = 30;
const TARGET_PROFIT = 40000;
export const example1 = calcBreakEven(FIXED, PRICE, VARIABLE);
// Sales needed for a target profit = break-even on (fixed costs + target profit).
export const example1Target = calcBreakEven(FIXED + TARGET_PROFIT, PRICE, VARIABLE);
const NEW_PRICE = PRICE * 0.9;
export const example2 = calcBreakEven(FIXED, NEW_PRICE, VARIABLE);
const BUDGET_UNITS = 8000;
const budgetSales = BUDGET_UNITS * NEW_PRICE;
export const marginOfSafety = budgetSales - example2.revenueBreakEven;

const sensitivityRows = [50, 45, 40].map((price) => {
  const r = calcBreakEven(FIXED, price, VARIABLE);
  return [usd(price), usd(r.contributionMargin), pct(r.contributionMarginRatio), units(r.unitsBreakEven), usd(r.revenueBreakEven)];
});

export const BREAK_EVEN_SOLVED_EXAMPLE_POST: BlogPost = {
  slug: 'break-even-point-solved-example-class-12',
  title: 'Break-Even Point Formula and Solved Example (Class 12)',
  seoTitle: 'Break-Even Point Formula and Solved Example (Class 12)',
  description:
    'Break even point formula and solved example numerical for Class 12 and B.Com: contribution, P/V ratio, BEP in units and sales, and target profit.',
  category: 'Business',
  market: 'Global',
  publishDate: '2026-10-23',
  dateModified: '2026-10-23',
  readTime: '7 min read',
  author: 'Dev',
  type: 'Evergreen',
  quickAnswer: `Break-even point (units) = Fixed costs ÷ Contribution per unit, and break-even sales = Fixed costs ÷ P/V ratio. With a selling price of ${usd(PRICE)}, variable cost of ${usd(VARIABLE)} and fixed costs of ${usd(FIXED)}, the business breaks even at ${units(example1.unitsBreakEven)} units, or ${usd(example1.revenueBreakEven)} of sales.`,
  summary: `Break-even point (units) = Fixed costs ÷ Contribution per unit, and break-even sales = Fixed costs ÷ P/V ratio. With a selling price of ${usd(PRICE)}, variable cost of ${usd(VARIABLE)} and fixed costs of ${usd(FIXED)}, the business breaks even at ${units(example1.unitsBreakEven)} units, or ${usd(example1.revenueBreakEven)} of sales.`,
  sources: [
    { name: 'Calcumetrics Break-Even Calculator', url: 'https://calcumetrics.com/break-even-calculator', citation: 'calcBreakEven engine: contribution margin, P/V ratio, break-even units and revenue used for every answer here' },
    { name: 'Calcumetrics methodology', url: 'https://calcumetrics.com/methodology', citation: 'How calculator outputs are produced and rounded' },
  ],
  relatedCalculators: [
    { name: 'Break-Even Calculator', path: '/break-even-calculator', description: 'Break-even units and sales from price, variable cost and fixed costs.', badge: 'Most Relevant' },
    { name: 'Profit Margin Calculator', path: '/profit-margin-calculator', description: 'Check gross and net margin once you are past break-even.' },
    { name: 'Markup vs Margin Calculator', path: '/markup-vs-margin-calculator', description: 'Convert a pricing markup into the margin it produces.' },
  ],
  relatedArticles: [
    { slug: 'how-to-calculate-break-even-point', title: 'How to calculate break-even point', description: 'Margin of safety, multi-product mixes and sensitivity tests.' },
    { slug: 'cogs-vs-opex-accounting', title: 'COGS vs OpEx', description: 'Sorting costs into variable and fixed before you start.' },
  ],
  faqs: [
    {
      question: 'What is the formula for break-even point in units?',
      answer: 'Break-even point (units) = Fixed costs ÷ (Selling price per unit − Variable cost per unit). The denominator is the contribution per unit.',
    },
    {
      question: 'How do you find break-even sales using the P/V ratio?',
      answer: 'Divide fixed costs by the P/V ratio, where P/V ratio = Contribution ÷ Sales. In Example 1, $100,000 ÷ 40% = $250,000.',
    },
    {
      question: 'How many units must be sold to earn a target profit?',
      answer: 'Add the target profit to fixed costs and divide by contribution per unit. In Example 1, ($100,000 + $40,000) ÷ $20 = 7,000 units.',
    },
    {
      question: 'Should break-even units be rounded up or down?',
      answer: 'Round up. Selling one unit fewer than the exact figure leaves a small loss, so 6,666.67 becomes 6,667 units.',
    },
  ],
  content: `
${p(`Textbook break-even questions for Class 12 and B.Com cost accounting follow a familiar pattern: find contribution, find the P/V ratio, then the break-even point in units and in sales, and finally answer a “what if” part. This post covers the break-even point formula and solved example numericals in that order. Each answer was produced by our ${link('/break-even-calculator', 'break-even calculator')} engine.`)}

${h2('Key terms before the formula')}
${p('<strong>Contribution</strong> is what each unit sold adds towards fixed costs and profit: selling price minus variable cost. <strong>Fixed costs</strong> such as rent and salaries stay the same within the normal range of output. <strong>Variable costs</strong> such as materials rise in step with units produced. The <strong>break-even point</strong> is the output at which total contribution equals fixed costs, so there is neither profit nor loss.')}
${p('Sorting costs correctly is half the question. If a cost appears in both lists, check whether it changes with each unit. Our article on ' + link('/blog/cogs-vs-opex-accounting', 'COGS vs OpEx') + ' explains which costs usually move with volume.')}

${h2('Break-even point formula')}
${p('Work through the four lines in order. Each one uses the result before it.')}
${formulaBlock('Marginal costing formulas', 'Contribution per unit = Selling price − Variable cost<br/>P/V ratio = Contribution ÷ Sales × 100<br/>BEP (units) = Fixed costs ÷ Contribution per unit<br/>BEP (sales) = Fixed costs ÷ P/V ratio')}
${p('For a target profit, replace fixed costs with fixed costs plus target profit in the last two lines. Margin of safety is actual or budgeted sales minus break-even sales.')}

${h2('Solved numericals')}
${solvedExample(
  'Example 1: BEP and sales for a target profit',
  `A company sells a product at ${usd(PRICE)} per unit. Variable cost is ${usd(VARIABLE)} per unit and fixed overheads are ${usd(FIXED)} a year. Calculate (a) P/V ratio, (b) break-even point in units and sales, and (c) sales required to earn a profit of ${usd(TARGET_PROFIT)}.`,
  [
    `Contribution per unit = ${usd(PRICE)} − ${usd(VARIABLE)} = <strong>${usd(example1.contributionMargin)}</strong>.`,
    `P/V ratio = ${usd(example1.contributionMargin)} ÷ ${usd(PRICE)} × 100 = <strong>${pct(example1.contributionMarginRatio)}</strong>.`,
    `BEP (units) = ${usd(FIXED)} ÷ ${usd(example1.contributionMargin)} = <strong>${units(example1.unitsBreakEven)} units</strong>.`,
    `BEP (sales) = ${usd(FIXED)} ÷ ${pct(example1.contributionMarginRatio)} = <strong>${usd(example1.revenueBreakEven)}</strong>. Check: ${units(example1.unitsBreakEven)} × ${usd(PRICE)} = ${usd(example1.revenueBreakEven)}.`,
    `Units for target profit = (${usd(FIXED)} + ${usd(TARGET_PROFIT)}) ÷ ${usd(example1.contributionMargin)} = <strong>${units(example1Target.unitsBreakEven)} units</strong>.`,
    `Sales for target profit = ${units(example1Target.unitsBreakEven)} × ${usd(PRICE)} = <strong>${usd(example1Target.revenueBreakEven)}</strong>.`,
  ],
  `(a) P/V ratio ${pct(example1.contributionMarginRatio)}; (b) BEP ${units(example1.unitsBreakEven)} units or ${usd(example1.revenueBreakEven)}; (c) required sales ${usd(example1Target.revenueBreakEven)} (${units(example1Target.unitsBreakEven)} units).`
)}
${solvedExample(
  'Example 2: effect of a 10% price cut and margin of safety',
  `Using the data in Example 1, the selling price is reduced by 10%. Calculate the new break-even point in units and sales. If budgeted sales are ${BUDGET_UNITS.toLocaleString('en-US')} units at the new price, calculate the margin of safety.`,
  [
    `New selling price = ${usd(PRICE)} − 10% = <strong>${usd(NEW_PRICE)}</strong>.`,
    `New contribution per unit = ${usd(NEW_PRICE)} − ${usd(VARIABLE)} = <strong>${usd(example2.contributionMargin)}</strong>.`,
    `New P/V ratio = ${usd(example2.contributionMargin)} ÷ ${usd(NEW_PRICE)} × 100 = <strong>${pct(example2.contributionMarginRatio)}</strong>.`,
    `New BEP (units) = ${usd(FIXED)} ÷ ${usd(example2.contributionMargin)} = ${example2.unitsBreakEven.toFixed(2)}, rounded up to <strong>${units(example2.unitsBreakEven)} units</strong>.`,
    `New BEP (sales) = ${usd(FIXED)} ÷ ${pct(example2.contributionMarginRatio)} = <strong>${usd(example2.revenueBreakEven)}</strong>.`,
    `Budgeted sales = ${BUDGET_UNITS.toLocaleString('en-US')} × ${usd(NEW_PRICE)} = ${usd(budgetSales)}. Margin of safety = ${usd(budgetSales)} − ${usd(example2.revenueBreakEven)} = <strong>${usd(marginOfSafety)}</strong>, or ${pct(marginOfSafety / budgetSales)} of budgeted sales.`,
  ],
  `New BEP = <strong>${units(example2.unitsBreakEven)} units</strong> (${usd(example2.revenueBreakEven)}). Margin of safety = <strong>${usd(marginOfSafety)}</strong>.`
)}
${p('A 10% fall in price cut contribution per unit by a quarter, from $20 to $15, so the break-even volume rose by a third. Price changes hit contribution harder than they hit sales value, which is why examiners like this follow-up question.')}
${table('Example — fixed costs $100,000, variable cost $30 per unit', ['Selling price', 'Contribution', 'P/V ratio', 'BEP (units)', 'BEP (sales)'], sensitivityRows)}

${h2('Finding the P/V ratio without unit data')}
${p('Some questions give sales and profit for two periods instead of a price and variable cost. Fixed costs are the same in both periods, so any change in profit comes from the change in contribution. That gives a second formula for the P/V ratio: change in profit divided by change in sales, multiplied by 100. Once you have the P/V ratio, fixed costs follow from either period as contribution (sales × P/V ratio) minus profit, and break-even sales is fixed costs divided by the P/V ratio as before.')}
${p('Write the formula you are using before substituting numbers. If a question gives both unit data and period data, check that the two P/V ratios agree; a mismatch usually means a cost has been classified wrongly.')}

${h2('Assumptions behind the answer')}
${p('Break-even analysis rests on a few simplifications that examiners sometimes ask you to list. Selling price per unit stays the same at every volume. Variable cost per unit stays the same, so total variable cost rises in a straight line. Fixed costs do not change within the range of output being considered. Everything produced is sold, so there is no change in stock. Where there is more than one product, the sales mix stays constant.')}
${p('When any of these breaks down, for example a bulk discount on materials above a certain volume or an extra shift that adds fixed cost, the single break-even figure no longer holds and the calculation has to be split into ranges.')}

${h2('Reading a break-even chart')}
${p('On a break-even chart, the total cost line starts at the fixed-cost level and rises with variable cost. The sales line starts at zero and rises with price. They cross at the break-even point. The angle between the two lines after that point is the angle of incidence: a wider angle means profit grows faster with each extra unit. The distance from break-even to actual sales along the horizontal axis is the margin of safety.')}

${h2('Common mistakes students make')}
${bullets([
  'Dividing fixed costs by selling price instead of contribution per unit.',
  'Writing the P/V ratio as 40 instead of 40% or 0.40 and then dividing fixed costs by 40.',
  'Rounding break-even units down, which leaves the business just short of covering fixed costs.',
  'Forgetting to recalculate the P/V ratio after a price change and reusing the old one.',
  'Adding target profit to sales instead of to fixed costs.',
])}

${h2('Check your answers')}
${p(`Enter fixed costs, price and variable cost in the ${link('/break-even-calculator', 'break-even calculator')} to confirm each part, then change the price to test “what if” questions. For margin of safety with more than one product, see our ${link('/blog/how-to-calculate-break-even-point', 'full break-even guide')}.`)}
${lastUpdated('23 October 2026')}
`,
};
