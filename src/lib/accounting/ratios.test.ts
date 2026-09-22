import { describe, it, expect } from 'vitest';
import {
  calcWorkingCapital,
  calcLiquidityRatios,
  calcCOGS,
  calcInventoryTurnover,
  calcCCC,
  calcDSCR,
} from '../../lib/accounting/ratios';

describe('calcWorkingCapital', () => {
  it('computes NWC = currentAssets - currentLiabilities', () => {
    const res = calcWorkingCapital(500000, 200000, 100000, 50000);
    expect(res.nwc).toBe(300000);
  });

  it('current ratio = assets / liabilities', () => {
    const res = calcWorkingCapital(500000, 200000, 100000, 50000);
    expect(res.currentRatio).toBeCloseTo(2.5, 4);
  });

  it('quick ratio excludes inventory', () => {
    // (500000 - 100000) / 200000 = 2.0
    const res = calcWorkingCapital(500000, 200000, 100000, 50000);
    expect(res.quickRatio).toBeCloseTo(2.0, 4);
  });

  it('cash ratio = cash / liabilities', () => {
    const res = calcWorkingCapital(500000, 200000, 100000, 50000);
    expect(res.cashRatio).toBeCloseTo(0.25, 4);
  });

  it('returns Infinity ratios when liabilities = 0', () => {
    const res = calcWorkingCapital(500000, 0, 100000, 50000);
    expect(res.currentRatio).toBe(Infinity);
    expect(res.quickRatio).toBe(Infinity);
    expect(res.cashRatio).toBe(Infinity);
  });
});

describe('calcLiquidityRatios', () => {
  it('current ratio consistent with calcWorkingCapital', () => {
    // cash=50, receivables=100, inventory=100, other=250, liabilities=200
    const liq = calcLiquidityRatios(50000, 100000, 100000, 250000, 200000);
    const wc = calcWorkingCapital(500000, 200000, 100000, 50000);
    expect(liq.currentRatio).toBeCloseTo(wc.currentRatio, 4);
  });

  it('quick ratio = (cash + receivables) / liabilities', () => {
    const res = calcLiquidityRatios(50000, 100000, 80000, 70000, 200000);
    // (50000+100000) / 200000 = 0.75
    expect(res.quickRatio).toBeCloseTo(0.75, 4);
  });

  it('assessments are non-empty strings', () => {
    const res = calcLiquidityRatios(50000, 100000, 80000, 70000, 200000);
    expect(res.currentRatioAssessment).toBeTruthy();
    expect(res.quickRatioAssessment).toBeTruthy();
  });
});

describe('calcCOGS', () => {
  it('COGS = opening + purchases - closing', () => {
    // 100000 + 400000 - 80000 = 420000
    const res = calcCOGS(100000, 400000, 80000, 600000);
    expect(res.cogs).toBe(420000);
  });

  it('gross profit = revenue - COGS', () => {
    const res = calcCOGS(100000, 400000, 80000, 600000);
    expect(res.grossProfit).toBeCloseTo(600000 - 420000, 2);
  });

  it('gross margin pct = gross profit / revenue × 100', () => {
    const res = calcCOGS(100000, 400000, 80000, 600000);
    expect(res.grossMarginPct).toBeCloseTo(30, 4); // 180000/600000 = 30%
  });

  it('goodsAvailableForSale = opening + purchases', () => {
    const res = calcCOGS(100000, 400000, 80000, 600000);
    expect(res.goodsAvailableForSale).toBe(500000);
  });
});

describe('calcInventoryTurnover', () => {
  it('turnover = COGS / averageInventory', () => {
    // avg inventory = (100000+80000)/2 = 90000, COGS = 420000 → 4.67
    const res = calcInventoryTurnover(420000, 100000, 80000);
    expect(res.averageInventory).toBe(90000);
    expect(res.inventoryTurnover).toBeCloseTo(420000 / 90000, 4);
  });

  it('DSI = 365 / turnover', () => {
    const res = calcInventoryTurnover(420000, 100000, 80000);
    expect(res.dsi).toBeCloseTo(365 / res.inventoryTurnover, 4);
  });

  it('returns 0 turnover when average inventory is 0', () => {
    const res = calcInventoryTurnover(420000, 0, 0);
    expect(res.inventoryTurnover).toBe(0);
    expect(res.dsi).toBe(Infinity);
  });

  it('supports custom days in period', () => {
    const res = calcInventoryTurnover(420000, 100000, 80000, 30);
    expect(res.dsi).toBeCloseTo(30 / res.inventoryTurnover, 4);
  });
});

describe('calcCCC', () => {
  it('CCC = DSO + DSI - DPO', () => {
    // revenue=600000, AR=50000, inventory=90000, COGS=420000, AP=60000
    const res = calcCCC(50000, 600000, 90000, 420000, 60000);
    const dso = (50000 / 600000) * 365;
    const dsi = (90000 / 420000) * 365;
    const dpo = (60000 / 420000) * 365;
    expect(res.ccc).toBeCloseTo(dso + dsi - dpo, 4);
  });

  it('negative CCC has correct assessment', () => {
    // Large AP relative to COGS means high DPO → negative CCC possible
    const res = calcCCC(10000, 600000, 10000, 600000, 500000);
    if (res.ccc < 0) {
      expect(res.assessment).toContain('Negative');
    }
  });

  it('DSO, DSI, DPO are all non-negative', () => {
    const res = calcCCC(50000, 600000, 90000, 420000, 60000);
    expect(res.dso).toBeGreaterThanOrEqual(0);
    expect(res.dsi).toBeGreaterThanOrEqual(0);
    expect(res.dpo).toBeGreaterThanOrEqual(0);
  });
});

describe('calcDSCR', () => {
  it('DSCR = NOI / debt service', () => {
    const res = calcDSCR(500000, 250000);
    expect(res.dscr).toBeCloseTo(2, 4);
    expect(res.assessment).toContain('Strong');
  });

  it('DSCR < 1 is insufficient', () => {
    const res = calcDSCR(80000, 100000);
    expect(res.dscr).toBeCloseTo(0.8, 4);
    expect(res.assessment).toContain('Insufficient');
  });

  it('returns Infinity when debt service is 0', () => {
    const res = calcDSCR(500000, 0);
    expect(res.dscr).toBe(Infinity);
  });

  it('DSCR ≥ 1.25 is good', () => {
    const res = calcDSCR(150000, 100000);
    expect(res.dscr).toBeCloseTo(1.5, 4);
    expect(res.assessment).toContain('Good');
  });
});
