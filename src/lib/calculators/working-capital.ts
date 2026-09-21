/** Working Capital & Net Working Capital Calculator
 * NWC = Current Assets - Current Liabilities
 */

export interface WorkingCapitalResult {
  totalCurrentAssets: number;
  totalCurrentLiabilities: number;
  netWorkingCapital: number;
  currentRatio: number;
  quickRatio: number;
  status: 'Strong' | 'Adequate' | 'Deficit';
}

export function calcWorkingCapital(
  cash: number = 0,
  receivables: number = 0,
  inventory: number = 0,
  otherAssets: number = 0,
  payables: number = 0,
  shortTermDebt: number = 0,
  otherLiabilities: number = 0
): WorkingCapitalResult {
  const totalCurrentAssets = Math.max(0, cash) + Math.max(0, receivables) + Math.max(0, inventory) + Math.max(0, otherAssets);
  const totalCurrentLiabilities = Math.max(0, payables) + Math.max(0, shortTermDebt) + Math.max(0, otherLiabilities);

  const netWorkingCapital = totalCurrentAssets - totalCurrentLiabilities;
  const currentRatio = totalCurrentLiabilities > 0 ? totalCurrentAssets / totalCurrentLiabilities : totalCurrentAssets > 0 ? 99 : 0;
  const quickAssets = totalCurrentAssets - Math.max(0, inventory);
  const quickRatio = totalCurrentLiabilities > 0 ? quickAssets / totalCurrentLiabilities : quickAssets > 0 ? 99 : 0;

  let status: 'Strong' | 'Adequate' | 'Deficit' = 'Adequate';
  if (currentRatio >= 1.5 && netWorkingCapital > 0) {
    status = 'Strong';
  } else if (netWorkingCapital < 0 || currentRatio < 1.0) {
    status = 'Deficit';
  }

  return {
    totalCurrentAssets,
    totalCurrentLiabilities,
    netWorkingCapital,
    currentRatio,
    quickRatio,
    status,
  };
}
