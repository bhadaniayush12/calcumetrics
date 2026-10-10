import { describe, expect, it } from 'vitest';
import { calcLiquidityRatios } from './liquidity-ratios';
import { calcWorkingCapital } from './working-capital';
import { formatRatio } from '../formatters';

describe('ratios with zero current liabilities', () => {
  it('liquidity ratios are unbounded rather than a fake 99x', () => {
    const res = calcLiquidityRatios(1000, 0, 500, 200, 0, 0);
    expect(res.currentRatio).toBe(Infinity);
    expect(res.quickRatio).toBe(Infinity);
    expect(res.cashRatio).toBe(Infinity);
    expect(res.currentRatioStatus).toBe('Optimal');
    expect(formatRatio(res.currentRatio)).toBe('No liabilities');
  });

  it('working capital ratios are unbounded rather than a fake 99x', () => {
    const res = calcWorkingCapital(1000, 0, 0, 0, 0, 0, 0);
    expect(res.currentRatio).toBe(Infinity);
    expect(res.status).toBe('Strong');
  });

  it('no assets and no liabilities stays at 0', () => {
    expect(calcLiquidityRatios().currentRatio).toBe(0);
  });

  it('formats finite ratios as multiples', () => {
    expect(formatRatio(1.5)).toBe('1.50x');
  });
});
