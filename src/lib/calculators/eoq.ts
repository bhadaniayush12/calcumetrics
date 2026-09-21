/** Economic Order Quantity (EOQ) Calculator
 * Formula: EOQ = sqrt((2 * D * S) / H)
 * D = Annual Demand, S = Order Cost, H = Annual Holding Cost per Unit
 */

export interface EOQResult {
  eoq: number;
  eoqRounded: number;
  ordersPerYear: number;
  annualOrderingCost: number;
  annualHoldingCost: number;
  totalInventoryCost: number;
  daysBetweenOrders: number;
}

export function calcEOQ(annualDemand: number, orderingCost: number, holdingCost: number): EOQResult {
  if (annualDemand <= 0 || orderingCost <= 0 || holdingCost <= 0) {
    return {
      eoq: 0,
      eoqRounded: 0,
      ordersPerYear: 0,
      annualOrderingCost: 0,
      annualHoldingCost: 0,
      totalInventoryCost: 0,
      daysBetweenOrders: 0,
    };
  }

  const eoq = Math.sqrt((2 * annualDemand * orderingCost) / holdingCost);
  const eoqRounded = Math.round(eoq);
  const ordersPerYear = annualDemand / eoq;
  const annualOrderingCost = ordersPerYear * orderingCost;
  const annualHoldingCost = (eoq / 2) * holdingCost;
  const totalInventoryCost = annualOrderingCost + annualHoldingCost;
  const daysBetweenOrders = ordersPerYear > 0 ? 365 / ordersPerYear : 0;

  return {
    eoq,
    eoqRounded,
    ordersPerYear,
    annualOrderingCost,
    annualHoldingCost,
    totalInventoryCost,
    daysBetweenOrders,
  };
}
