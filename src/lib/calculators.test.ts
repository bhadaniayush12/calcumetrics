import { describe, it, expect } from 'vitest';
import { calcSIP } from './calculators/sip';
import { calcLumpSum } from './calculators/lumpsum';
import { calcCAGR } from './calculators/cagr';
import { calcFD } from './calculators/fd';
import { calcEMI } from './calculators/emi';
import { calcBreakEven } from './calculators/breakeven';
import { calcWACC, calcNPV, calcIRR } from './calculators/corporate';

describe('Section 12 Calculation Test Fixtures', () => {
  it('SIP: ₹25,000 / 12% / 15yr → ₹1,26,14,400', () => {
    const res = calcSIP(25000, 12, 15);
    expect(Math.round(res.maturity)).toBe(12614400);
    expect(res.invested).toBe(4500000);
    expect(Math.round(res.gain)).toBe(8114400);
  });

  it('SIP: 3, 5, 10, 20 year checkpoints', () => {
    expect(Math.round(calcSIP(25000, 12, 3).maturity)).toBe(1087691);
    expect(Math.round(calcSIP(25000, 12, 5).maturity)).toBe(2062159);
    expect(Math.round(calcSIP(25000, 12, 10).maturity)).toBe(5808477);
  });

  it('Compound Interest / Lump Sum: ₹1,00,000, 8%, 10yr annual → ₹2,15,892.50', () => {
    const res = calcLumpSum(100000, 8, 10, 'annually');
    expect(res.maturity).toBeCloseTo(215892.50, 2);
  });

  it('CAGR: ₹1,00,000 → ₹2,50,000 in 5yr → 20.11%', () => {
    const res = calcCAGR(100000, 250000, 5);
    expect(res.cagrPct).toBeCloseTo(20.11, 2);
  });

  it('FD: ₹1,00,000, 7%, 5yr quarterly → ₹1,41,477.82', () => {
    const res = calcFD(100000, 7, 5, 'quarterly');
    expect(res.maturity).toBeCloseTo(141477.82, 2);
  });

  it('EMI: ₹10,00,000, 8.5%, 20yr → EMI ₹8,678, interest ₹10,82,776', () => {
    const res = calcEMI(1000000, 8.5, 20);
    expect(res.emi).toBeCloseTo(8678.23, 2);
    expect(res.emiRounded).toBe(8678);
    expect(Math.round(res.totalInterest)).toBe(1082776);
    expect(Math.round(res.totalPayment)).toBe(2082776);
  });

  it('Break-even: ₹5,00,000 fixed, ₹500 price, ₹300 variable → 2,500 units, ₹12,50,000 rev', () => {
    const res = calcBreakEven(500000, 500, 300);
    expect(res.unitsBreakEven).toBe(2500);
    expect(res.revenueBreakEven).toBe(1250000);
  });

  it('WACC: E/V 70% @ 14.2%, D/V 30% @ 8.5%, Tax 25% → 11.8525%', () => {
    const res = calcWACC(0.70, 14.2, 0.30, 8.5, 25);
    expect(res.waccPct).toBeCloseTo(11.8525, 4);
    expect(res.debtComponent * 100).toBeCloseTo(0.30 * 8.5 * 0.75, 4);
  });

  it('NPV & IRR: -1,00,000, [30k, 40k, 50k, 60k], discount 10%', () => {
    const cfs = [-100000, 30000, 40000, 50000, 60000];
    const npv = calcNPV(10, cfs);
    expect(npv).toBeCloseTo(38877.13, 2);

    const irr = calcIRR(cfs);
    expect(irr.valid).toBe(true);
    expect(irr.irrPct).toBeCloseTo(24.89, 2);
  });
});
