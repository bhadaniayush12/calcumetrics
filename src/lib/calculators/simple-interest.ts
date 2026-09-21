/** Simple Interest Calculator
 * Formula: I = (P * R * T) / 100, Total = P + I
 */

export interface SimpleInterestResult {
  interest: number;
  totalAmount: number;
  compoundInterestAmount: number;
  compoundingAdvantage: number;
}

export function calcSimpleInterest(principal: number, rate: number, years: number): SimpleInterestResult {
  if (principal <= 0 || rate <= 0 || years <= 0) {
    return { interest: 0, totalAmount: 0, compoundInterestAmount: 0, compoundingAdvantage: 0 };
  }
  const interest = (principal * rate * years) / 100;
  const totalAmount = principal + interest;
  const compoundInterestAmount = principal * Math.pow(1 + rate / 100, years);
  const compoundingAdvantage = compoundInterestAmount - totalAmount;

  return {
    interest,
    totalAmount,
    compoundInterestAmount,
    compoundingAdvantage,
  };
}
