import { describe, it, expect } from 'vitest';
import { calcXIRR, encodeXIRRFlows, decodeXIRRFlows } from './xirr';

describe('calcXIRR', () => {
  it('solves a simple one-year doubling', () => {
    const res = calcXIRR([
      { amount: -100000, date: new Date('2023-01-01') },
      { amount: 200000, date: new Date('2024-01-01') },
    ]);
    expect(res.valid).toBe(true);
    // 365 days apart → exactly one year under the Excel convention
    expect(res.xirrPct).toBeCloseTo(100, 6);
  });

  it('uses 365 days per year (Excel XIRR convention)', () => {
    // 2024 is a leap year: 2024-01-01 → 2024-12-31 is 365 days, so +10% is exactly 10.000%
    const res = calcXIRR([
      { amount: -1000, date: new Date('2024-01-01') },
      { amount: 1100, date: new Date('2024-12-31') },
    ]);
    expect(res.xirrPct).toBeCloseTo(10, 6);
  });

  it('matches the Microsoft Excel XIRR documentation example (0.373362535)', () => {
    const res = calcXIRR([
      { amount: -10000, date: new Date('2008-01-01') },
      { amount: 2750, date: new Date('2008-03-01') },
      { amount: 4250, date: new Date('2008-10-30') },
      { amount: 3250, date: new Date('2009-02-15') },
      { amount: 2750, date: new Date('2009-04-01') },
    ]);
    expect(res.valid).toBe(true);
    expect(res.xirr).toBeCloseTo(0.373362535, 6);
  });

  it('rejects flows without both signs', () => {
    expect(calcXIRR([{ amount: 100, date: new Date('2023-01-01') }]).valid).toBe(false);
  });

  it('never reports a non-finite rate as valid', () => {
    const res = calcXIRR([
      { amount: -1, date: new Date('2023-01-01') },
      { amount: 1e12, date: new Date('2023-01-02') },
    ]);
    if (res.valid) expect(Number.isFinite(res.xirr)).toBe(true);
    else expect(res.error).toBeDefined();
  });
});

describe('XIRR share-link state', () => {
  const rows = [
    { date: '2023-01-01', amount: -100000 },
    { date: '2023-07-01', amount: -50000.5 },
    { date: '2025-01-01', amount: 185000 },
  ];

  it('round-trips rows through the URL hash', () => {
    const hash = encodeXIRRFlows(rows);
    expect(hash).toBe('#f=2023-01-01_-100000~2023-07-01_-50000.5~2025-01-01_185000');
    expect(decodeXIRRFlows(hash)).toEqual(rows);
  });

  it('rejects malformed or unsafe state', () => {
    expect(decodeXIRRFlows('')).toBeNull();
    expect(decodeXIRRFlows('#f=2023-01-01_-100')).toBeNull(); // only one row
    expect(decodeXIRRFlows('#f=2023-01-01_-100~2024-13-45_200')).toBeNull(); // bad date
    expect(decodeXIRRFlows('#f=2023-01-01_-100~2024-01-01_abc')).toBeNull(); // bad amount
    expect(decodeXIRRFlows('#f=2023-01-01_-100~"><img src=x>_200')).toBeNull();
  });
});
