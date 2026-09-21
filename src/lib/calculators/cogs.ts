/** Cost of Goods Sold (COGS) Calculator
 * COGS = Beginning Inventory + Purchases + Direct Labor + Overhead - Ending Inventory
 */

export interface COGSResult {
  beginningInventory: number;
  totalAdditions: number;
  goodsAvailableForSale: number;
  endingInventory: number;
  cogs: number;
  grossProfit: number;
  grossMarginPct: number;
}

export function calcCOGS(
  beginningInventory: number = 0,
  purchases: number = 0,
  directLabor: number = 0,
  overhead: number = 0,
  endingInventory: number = 0,
  revenue: number = 0
): COGSResult {
  const bInv = Math.max(0, beginningInventory);
  const purch = Math.max(0, purchases);
  const labor = Math.max(0, directLabor);
  const ovh = Math.max(0, overhead);
  const eInv = Math.max(0, endingInventory);
  const rev = Math.max(0, revenue);

  const totalAdditions = purch + labor + ovh;
  const goodsAvailableForSale = bInv + totalAdditions;
  const cogs = Math.max(0, goodsAvailableForSale - eInv);
  const grossProfit = rev > 0 ? rev - cogs : 0;
  const grossMarginPct = rev > 0 ? (grossProfit / rev) * 100 : 0;

  return {
    beginningInventory: bInv,
    totalAdditions,
    goodsAvailableForSale,
    endingInventory: eInv,
    cogs,
    grossProfit,
    grossMarginPct,
  };
}
