import { describe, it, expect } from 'vitest';
import { calcXIRR } from './xirr';

describe('calcXIRR', () => {
  it('solves a simple one-year doubling', () => {
    const res = calcXIRR([
      { amount: -100000, date: new Date('2023-01-01') },
      { amount: 200000, date: new Date('2024-01-01') },
    ]);
    expect(res.valid).toBe(true);
    expect(res.xirrPct).toBeGreaterThan(99);
    expect(res.xirrPct).toBeLessThan(101);
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
