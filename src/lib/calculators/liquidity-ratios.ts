/** Liquidity Ratios Suite (Current, Quick, Cash Ratios)
 */

export interface LiquidityRatiosResult {
  currentRatio: number;
  quickRatio: number;
  cashRatio: number;
  netWorkingCapital: number;
  currentRatioStatus: 'Optimal' | 'Caution' | 'Deficit';
  quickRatioStatus: 'Optimal' | 'Caution' | 'Deficit';
  cashRatioStatus: 'Optimal' | 'Caution' | 'Deficit';
}

export function calcLiquidityRatios(
  cash: number = 0,
  marketableSecurities: number = 0,
  receivables: number = 0,
  inventory: number = 0,
  prepaidExpenses: number = 0,
  currentLiabilities: number = 0
): LiquidityRatiosResult {
  const c = Math.max(0, cash);
  const ms = Math.max(0, marketableSecurities);
  const ar = Math.max(0, receivables);
  const inv = Math.max(0, inventory);
  const prep = Math.max(0, prepaidExpenses);
  const cl = Math.max(0, currentLiabilities);

  const totalCurrentAssets = c + ms + ar + inv + prep;
  const quickAssets = c + ms + ar;
  const cashAssets = c + ms;

  const currentRatio = cl > 0 ? totalCurrentAssets / cl : totalCurrentAssets > 0 ? 99 : 0;
  const quickRatio = cl > 0 ? quickAssets / cl : quickAssets > 0 ? 99 : 0;
  const cashRatio = cl > 0 ? cashAssets / cl : cashAssets > 0 ? 99 : 0;
  const netWorkingCapital = totalCurrentAssets - cl;

  const currentRatioStatus: 'Optimal' | 'Caution' | 'Deficit' =
    currentRatio >= 1.5 ? 'Optimal' : currentRatio >= 1.0 ? 'Caution' : 'Deficit';
  const quickRatioStatus: 'Optimal' | 'Caution' | 'Deficit' =
    quickRatio >= 1.0 ? 'Optimal' : quickRatio >= 0.8 ? 'Caution' : 'Deficit';
  const cashRatioStatus: 'Optimal' | 'Caution' | 'Deficit' =
    cashRatio >= 0.5 ? 'Optimal' : cashRatio >= 0.2 ? 'Caution' : 'Deficit';

  return {
    currentRatio,
    quickRatio,
    cashRatio,
    netWorkingCapital,
    currentRatioStatus,
    quickRatioStatus,
    cashRatioStatus,
  };
}
