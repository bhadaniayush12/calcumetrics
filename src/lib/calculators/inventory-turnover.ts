/** Inventory Turnover & Days Sales of Inventory (DSI / DIO) Calculator
 * Inventory Turnover = COGS / Average Inventory
 * DSI = 365 / Inventory Turnover
 */

export interface InventoryTurnoverResult {
  averageInventory: number;
  inventoryTurnoverRatio: number;
  daysSalesInventory: number;
  efficiencyRating: 'High Velocity' | 'Balanced' | 'Slow-Moving';
}

export function calcInventoryTurnover(
  cogs: number,
  beginningInventory: number,
  endingInventory: number
): InventoryTurnoverResult {
  const bInv = Math.max(0, beginningInventory);
  const eInv = Math.max(0, endingInventory);
  const cost = Math.max(0, cogs);

  const averageInventory = (bInv + eInv) / 2;
  const inventoryTurnoverRatio = averageInventory > 0 ? cost / averageInventory : 0;
  const daysSalesInventory = inventoryTurnoverRatio > 0 ? 365 / inventoryTurnoverRatio : 0;

  let efficiencyRating: 'High Velocity' | 'Balanced' | 'Slow-Moving' = 'Balanced';
  if (daysSalesInventory > 0 && daysSalesInventory <= 30) {
    efficiencyRating = 'High Velocity';
  } else if (daysSalesInventory > 90) {
    efficiencyRating = 'Slow-Moving';
  }

  return {
    averageInventory,
    inventoryTurnoverRatio,
    daysSalesInventory,
    efficiencyRating,
  };
}
