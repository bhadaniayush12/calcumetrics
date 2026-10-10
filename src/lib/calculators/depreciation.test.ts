import { describe, expect, it } from 'vitest';
import { calcDepreciation } from './depreciation';

describe('calcDepreciation WDV', () => {
  it('with zero salvage, keeps the 5% residual instead of spiking the final year', () => {
    const res = calcDepreciation(100000, 0, 5, 'WDV');
    const deps = res.schedule.map((r) => r.depreciation);
    // Charges decline every year, including the last.
    for (let i = 1; i < deps.length; i++) expect(deps[i]).toBeLessThan(deps[i - 1]);
    expect(res.salvageValue).toBe(5000);
    expect(res.schedule.at(-1)!.closingValue).toBe(5000);
    expect(res.totalDepreciation).toBe(95000);
  });

  it('with explicit salvage, ends exactly at salvage with a declining schedule', () => {
    const res = calcDepreciation(500000, 50000, 5, 'WDV');
    const deps = res.schedule.map((r) => r.depreciation);
    for (let i = 1; i < deps.length; i++) expect(deps[i]).toBeLessThan(deps[i - 1]);
    expect(res.schedule.at(-1)!.closingValue).toBe(50000);
    expect(res.totalDepreciation).toBe(450000);
  });
});
