/** Comprehensive Depreciation Calculator (SLM & WDV)
 * Straight Line Method (SLM) & Written Down Value / Declining Balance (WDV)
 */

export interface DepreciationYear {
  year: number;
  openingValue: number;
  depreciation: number;
  accumulatedDepreciation: number;
  closingValue: number;
}

export interface DepreciationResult {
  method: 'SLM' | 'WDV';
  cost: number;
  salvageValue: number;
  usefulLife: number;
  annualDepreciation: number; // First year for WDV, constant for SLM
  depreciationRatePct: number;
  totalDepreciation: number;
  schedule: DepreciationYear[];
}

export function calcDepreciation(
  cost: number,
  salvageValue: number,
  usefulLife: number,
  method: 'SLM' | 'WDV' = 'SLM'
): DepreciationResult {
  if (cost <= 0 || usefulLife <= 0) {
    return {
      method,
      cost: 0,
      salvageValue: 0,
      usefulLife: 0,
      annualDepreciation: 0,
      depreciationRatePct: 0,
      totalDepreciation: 0,
      schedule: [],
    };
  }

  const salvage = Math.min(cost, Math.max(0, salvageValue));
  const depreciableAmount = cost - salvage;
  const schedule: DepreciationYear[] = [];

  if (method === 'SLM') {
    const annualDep = depreciableAmount / usefulLife;
    const ratePct = cost > 0 ? (annualDep / cost) * 100 : 0;
    let opening = cost;
    let accum = 0;

    for (let yr = 1; yr <= usefulLife; yr++) {
      const dep = Math.min(annualDep, Math.max(0, opening - salvage));
      accum += dep;
      const closing = Math.max(salvage, opening - dep);
      schedule.push({
        year: yr,
        openingValue: Math.round(opening),
        depreciation: Math.round(dep),
        accumulatedDepreciation: Math.round(accum),
        closingValue: Math.round(closing),
      });
      opening = closing;
    }

    return {
      method: 'SLM',
      cost,
      salvageValue: salvage,
      usefulLife,
      annualDepreciation: Math.round(annualDep),
      depreciationRatePct: ratePct,
      totalDepreciation: Math.round(accum),
      schedule,
    };
  } else {
    // WDV formula: r = 1 - (salvage / cost)^(1 / n)
    // If salvage is 0 or near 0, standard commercial benchmark uses 5% salvage rule:
    const effectiveSalvage = salvage > 0 ? salvage : Math.max(1, cost * 0.05);
    const rate = 1 - Math.pow(effectiveSalvage / cost, 1 / usefulLife);
    const ratePct = rate * 100;
    let opening = cost;
    let accum = 0;

    for (let yr = 1; yr <= usefulLife; yr++) {
      let dep = opening * rate;
      if (yr === usefulLife || opening - dep < salvage) {
        dep = Math.max(0, opening - salvage);
      }
      accum += dep;
      const closing = Math.max(salvage, opening - dep);
      schedule.push({
        year: yr,
        openingValue: Math.round(opening),
        depreciation: Math.round(dep),
        accumulatedDepreciation: Math.round(accum),
        closingValue: Math.round(closing),
      });
      opening = closing;
    }

    return {
      method: 'WDV',
      cost,
      salvageValue: salvage,
      usefulLife,
      annualDepreciation: schedule[0] ? schedule[0].depreciation : 0,
      depreciationRatePct: ratePct,
      totalDepreciation: Math.round(accum),
      schedule,
    };
  }
}
