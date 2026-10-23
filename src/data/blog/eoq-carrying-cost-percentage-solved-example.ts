import type { BlogPost } from './types';
import { calcEOQ } from '../../lib/calculators/eoq';
import { h2, p, link, formulaBlock, bullets, solvedExample, lastUpdated } from './solved-example-markup';

const usd = (n: number) => `$${(Math.round(n * 100) / 100).toLocaleString('en-US')}`;
const num = (n: number) => Math.round(n).toLocaleString('en-US');

// Carrying cost is given as a percentage of purchase price, so C = price × rate
// before it goes into the engine as the annual holding cost per unit.
const ex1 = { demand: 20000, orderCost: 250, price: 50, carryingPct: 20 };
const ex1Carrying = ex1.price * (ex1.carryingPct / 100);
export const example1 = calcEOQ(ex1.demand, ex1.orderCost, ex1Carrying);

const ex2 = { demand: 14400, orderCost: 150, price: 80, carryingPct: 15 };
const ex2Carrying = ex2.price * (ex2.carryingPct / 100);
export const example2 = calcEOQ(ex2.demand, ex2.orderCost, ex2Carrying);

export const EOQ_CARRYING_COST_EXAMPLE_POST: BlogPost = {
  slug: 'eoq-carrying-cost-percentage-solved-example',
  title: 'EOQ Formula with Carrying Cost %: Solved Example',
  seoTitle: 'EOQ Formula with Carrying Cost %: Solved Example',
  description:
    'EOQ formula with carrying cost percentage solved example for B.Com: convert the % into a cost per unit, then find EOQ, orders a year and total cost.',
  category: 'Business',
  market: 'Global',
  publishDate: '2026-10-23',
  dateModified: '2026-10-23',
  readTime: '6 min read',
  author: 'Dev',
  type: 'Evergreen',
  quickAnswer: `When carrying cost is given as a percentage, first convert it into an amount per unit: C = Purchase price × Carrying cost %. Then EOQ = √(2AO ÷ C). With annual demand of ${num(ex1.demand)} units, ordering cost of ${usd(ex1.orderCost)}, price of ${usd(ex1.price)} and carrying cost of ${ex1.carryingPct}%, C = ${usd(ex1Carrying)} and EOQ = ${num(example1.eoq)} units.`,
  summary: `When carrying cost is given as a percentage, first convert it into an amount per unit: C = Purchase price × Carrying cost %. Then EOQ = √(2AO ÷ C). With annual demand of ${num(ex1.demand)} units, ordering cost of ${usd(ex1.orderCost)}, price of ${usd(ex1.price)} and carrying cost of ${ex1.carryingPct}%, C = ${usd(ex1Carrying)} and EOQ = ${num(example1.eoq)} units.`,
  sources: [
    { name: 'Calcumetrics EOQ Calculator', url: 'https://calcumetrics.com/eoq-calculator', citation: 'calcEOQ engine: EOQ, orders per year, ordering, holding and total inventory cost used for every answer here' },
    { name: 'Calcumetrics methodology', url: 'https://calcumetrics.com/methodology', citation: 'How calculator outputs are produced and rounded' },
  ],
  relatedCalculators: [
    { name: 'EOQ Calculator', path: '/eoq-calculator', description: 'EOQ, order frequency and total inventory cost.', badge: 'Most Relevant' },
    { name: 'Inventory Turnover Calculator', path: '/inventory-turnover-calculator', description: 'See how fast stock moves once you order at EOQ.' },
    { name: 'Working Capital Calculator', path: '/working-capital-calculator', description: 'Check the cash tied up in average inventory.' },
  ],
  relatedArticles: [
    { slug: 'economic-order-quantity-eoq-guide', title: 'Economic order quantity guide', description: 'Holding cost components, reorder points and quantity discounts.' },
  ],
  faqs: [
    {
      question: 'What is the EOQ formula when carrying cost is a percentage?',
      answer: 'EOQ = √(2AO ÷ (P × i)), where A is annual demand in units, O is the cost per order, P is purchase price per unit and i is the carrying cost percentage per year written as a decimal.',
    },
    {
      question: 'Why are ordering cost and carrying cost equal at EOQ?',
      answer: 'Annual ordering cost falls as order size rises and annual carrying cost rises with it. The total is lowest where the two lines cross, which is the point where they are equal.',
    },
    {
      question: 'Is carrying cost charged on the full order or on average stock?',
      answer: 'On average stock. With steady demand and no safety stock, average inventory is half the order quantity, so annual carrying cost = (EOQ ÷ 2) × C.',
    },
    {
      question: 'Do I round EOQ to a whole number?',
      answer: 'Show the exact square root in your working, then round to whole units in the final answer unless the question says otherwise. Both examples here give exact whole numbers.',
    },
  ],
  content: `
${p(`Some EOQ questions give carrying cost as a flat amount per unit. Others say something like “carrying cost is 15% per annum of purchase price”. This post walks through the EOQ formula with carrying cost percentage in two solved examples in B.Com style, starting with the extra step most mistakes come from. Each answer comes from our ${link('/eoq-calculator', 'EOQ calculator')} engine.`)}

${h2('What EOQ balances')}
${p('Economic order quantity is the order size that keeps the yearly cost of placing orders plus the yearly cost of holding stock as low as possible. Large orders mean fewer orders but more stock sitting in the warehouse. Small orders mean less stock but more ordering cost. EOQ is the point between the two where the total is lowest.')}
${p('Carrying cost covers the cost of capital tied up in stock, storage, insurance and the risk of damage or obsolescence. Because most of these scale with the value of the stock, textbooks often express carrying cost as a percentage of the item’s purchase price. Our ' + link('/blog/economic-order-quantity-eoq-guide', 'EOQ guide') + ' covers these components in more detail.')}

${h2('EOQ formula with carrying cost percentage')}
${p('Convert the percentage into an amount per unit per year first. Then use the usual Wilson formula.')}
${formulaBlock('Economic order quantity', 'C = Purchase price per unit × Carrying cost % per year<br/>EOQ = √( 2 × A × O ÷ C )')}
${p('Here A is annual demand in units and O is the cost of placing one order. Once you have EOQ, the number of orders a year is A ÷ EOQ, annual ordering cost is (A ÷ EOQ) × O, annual carrying cost is (EOQ ÷ 2) × C, and the time between orders is 365 ÷ number of orders.')}

${h2('Where the formula comes from')}
${p('If each order is for Q units, the firm places A ÷ Q orders a year, so annual ordering cost is (A ÷ Q) × O. Stock falls steadily from Q to zero between deliveries, so average stock is Q ÷ 2 and annual carrying cost is (Q ÷ 2) × C. Total cost is the sum of the two.')}
${p('Ordering cost falls as Q rises and carrying cost rises with Q. Total cost is lowest where the two are equal: (A ÷ Q) × O = (Q ÷ 2) × C. Rearranging gives Q² = 2AO ÷ C, and taking the square root gives the EOQ formula. That is why the equal-costs check in the examples below works.')}
${p('The formula assumes demand is known and steady through the year, each order arrives in full, the price does not change with order size and there is no safety stock. If a supplier offers a discount for larger orders, EOQ is only the starting point: compare total cost, including the purchase price, at EOQ and at each discount quantity.')}

${h2('Solved numericals')}
${solvedExample(
  'Example 1: carrying cost at 20% of purchase price',
  `A firm uses ${num(ex1.demand)} units of a component a year. Each order costs ${usd(ex1.orderCost)} to place. The purchase price is ${usd(ex1.price)} per unit and carrying cost is ${ex1.carryingPct}% per annum of inventory value. Calculate (a) EOQ, (b) number of orders per year and (c) total annual inventory cost at EOQ.`,
  [
    `Carrying cost per unit per year, C = ${usd(ex1.price)} × ${ex1.carryingPct}% = <strong>${usd(ex1Carrying)}</strong>.`,
    `EOQ = √(2 × ${num(ex1.demand)} × ${usd(ex1.orderCost)} ÷ ${usd(ex1Carrying)}) = √${num((2 * ex1.demand * ex1.orderCost) / ex1Carrying)} = <strong>${num(example1.eoq)} units</strong>.`,
    `Number of orders = ${num(ex1.demand)} ÷ ${num(example1.eoq)} = <strong>${num(example1.ordersPerYear)}</strong> a year, about every ${example1.daysBetweenOrders.toFixed(2)} days.`,
    `Annual ordering cost = ${num(example1.ordersPerYear)} × ${usd(ex1.orderCost)} = <strong>${usd(example1.annualOrderingCost)}</strong>.`,
    `Annual carrying cost = (${num(example1.eoq)} ÷ 2) × ${usd(ex1Carrying)} = <strong>${usd(example1.annualHoldingCost)}</strong>.`,
  ],
  `(a) EOQ = ${num(example1.eoq)} units; (b) ${num(example1.ordersPerYear)} orders a year; (c) total inventory cost = ${usd(example1.annualOrderingCost)} + ${usd(example1.annualHoldingCost)} = <strong>${usd(example1.totalInventoryCost)}</strong>.`
)}
${solvedExample(
  'Example 2: carrying cost at 15% of a higher unit price',
  `Annual demand for a raw material is ${num(ex2.demand)} units. Ordering cost is ${usd(ex2.orderCost)} per order, the purchase price is ${usd(ex2.price)} per unit and carrying cost is ${ex2.carryingPct}% per annum of purchase price. Find EOQ, the number of orders, the time between orders and the total cost of ordering and carrying.`,
  [
    `C = ${usd(ex2.price)} × ${ex2.carryingPct}% = <strong>${usd(ex2Carrying)}</strong> per unit per year.`,
    `EOQ = √(2 × ${num(ex2.demand)} × ${usd(ex2.orderCost)} ÷ ${usd(ex2Carrying)}) = √${num((2 * ex2.demand * ex2.orderCost) / ex2Carrying)} = <strong>${num(example2.eoq)} units</strong>.`,
    `Number of orders = ${num(ex2.demand)} ÷ ${num(example2.eoq)} = <strong>${num(example2.ordersPerYear)}</strong>. Time between orders = 365 ÷ ${num(example2.ordersPerYear)} = <strong>${example2.daysBetweenOrders.toFixed(2)} days</strong>.`,
    `Annual ordering cost = ${num(example2.ordersPerYear)} × ${usd(ex2.orderCost)} = ${usd(example2.annualOrderingCost)}.`,
    `Annual carrying cost = (${num(example2.eoq)} ÷ 2) × ${usd(ex2Carrying)} = ${usd(example2.annualHoldingCost)}.`,
  ],
  `EOQ = <strong>${num(example2.eoq)} units</strong>, ${num(example2.ordersPerYear)} orders a year (about every ${example2.daysBetweenOrders.toFixed(2)} days), total ordering and carrying cost = <strong>${usd(example2.totalInventoryCost)}</strong>.`
)}
${p(`In both examples, annual ordering cost equals annual carrying cost at EOQ. That is a quick check on your arithmetic: if the two figures differ by more than rounding, recheck C. A common slip is to use the percentage itself (20 or 15) as C, which gives an EOQ that is far too small.`)}
${p(`Notice also how price feeds into the answer. In Example 2 the unit is more expensive, so each unit costs more to hold, which pushes EOQ down relative to demand. If the supplier raised the price with no change in the carrying percentage, C would rise and EOQ would fall. That is the mechanism behind the “what happens if price rises” part some questions add at the end.`)}

${h2('Common mistakes students make')}
${bullets([
  'Putting the carrying percentage straight into the formula instead of converting it to an amount per unit first.',
  'Using monthly demand with an annual carrying cost, or the other way round. Both must cover the same period.',
  'Charging carrying cost on the full EOQ instead of on average stock of EOQ ÷ 2.',
  'Adding the purchase cost of the goods to “total inventory cost” when the question asks only for ordering and carrying cost.',
  'Forgetting the square root after working out 2AO ÷ C.',
])}

${h2('Check your answer')}
${p(`Enter annual demand, ordering cost and the carrying cost per unit (price × percentage) in the ${link('/eoq-calculator', 'EOQ calculator')}. It shows EOQ, orders per year, the cost split and the days between orders, so you can match each line of your working. To see how quickly stock moves at that order size, try the ${link('/inventory-turnover-calculator', 'inventory turnover calculator')}.`)}
${lastUpdated('23 October 2026')}
`,
};
