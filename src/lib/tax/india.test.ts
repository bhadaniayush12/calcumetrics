import { describe, it, expect } from 'vitest';
import {
  calcGST,
  calcHRA,
  calcTDS,
  calcCapitalGains,
  calcAdvanceTax,
  calcSalaryCTC,
  METRO_CITIES,
  TDS_RATES,
} from '../../lib/tax/india';

describe('calcGST', () => {
  it('exclusive mode: adds GST to base', () => {
    const res = calcGST(1000, 18, 'exclusive');
    expect(res.baseAmount).toBe(1000);
    expect(res.gstAmount).toBeCloseTo(180, 4);
    expect(res.totalAmount).toBeCloseTo(1180, 4);
  });

  it('inclusive mode: extracts GST from total', () => {
    const res = calcGST(1180, 18, 'inclusive');
    expect(res.baseAmount).toBeCloseTo(1000, 2);
    expect(res.gstAmount).toBeCloseTo(180, 2);
    expect(res.totalAmount).toBeCloseTo(1180, 4);
  });

  it('CGST = SGST = half of GST amount', () => {
    const res = calcGST(10000, 28, 'exclusive');
    expect(res.cgst).toBeCloseTo(res.sgst, 4);
    expect(res.cgst + res.sgst).toBeCloseTo(res.gstAmount, 4);
  });

  it('IGST = full GST amount', () => {
    const res = calcGST(5000, 12, 'exclusive');
    expect(res.igst).toBeCloseTo(res.gstAmount, 4);
  });

  it('zero rate returns zero GST', () => {
    const res = calcGST(1000, 0, 'exclusive');
    expect(res.gstAmount).toBe(0);
    expect(res.baseAmount).toBe(res.totalAmount);
  });

  it('GST 2.0: 40% demerit/luxury rate calculation', () => {
    const res = calcGST(100000, 40, 'exclusive');
    expect(res.gstAmount).toBe(40000);
    expect(res.totalAmount).toBe(140000);
    expect(res.cgst).toBe(20000);
    expect(res.sgst).toBe(20000);
  });
});

describe('calcHRA', () => {
  it('metro city uses 50% of basic', () => {
    const res = calcHRA(600000, 240000, 180000, 'mumbai');
    expect(res.isMetro).toBe(true);
    expect(res.basicSalaryPct).toBeCloseTo(300000, 0); // 50% of 600000
  });

  it('non-metro city uses 40% of basic', () => {
    const res = calcHRA(600000, 240000, 180000, 'pune');
    expect(res.isMetro).toBe(false);
    expect(res.basicSalaryPct).toBeCloseTo(240000, 0); // 40% of 600000
  });

  it('exemption is min of three conditions', () => {
    // basic=600000, hra=240000, rent=180000, non-metro
    // C1: 240000, C2: 180000 - 60000 = 120000, C3: 240000
    // Min = 120000
    const res = calcHRA(600000, 240000, 180000, 'pune');
    expect(res.hraExemption).toBeCloseTo(120000, 0);
    expect(res.taxableHRA).toBeCloseTo(240000 - 120000, 0);
  });

  it('exemption cannot exceed HRA received', () => {
    // Very high rent paid but low HRA received
    const res = calcHRA(600000, 100000, 500000, 'delhi');
    expect(res.hraExemption).toBeLessThanOrEqual(100000);
  });

  it('all 4 metro cities recognized', () => {
    ['delhi', 'mumbai', 'kolkata', 'chennai'].forEach(city => {
      expect(METRO_CITIES.has(city)).toBe(true);
    });
  });
});

describe('calcTDS', () => {
  it('deducts TDS above threshold (194A — FD interest)', () => {
    // 194A threshold = 50000
    const res = calcTDS(75000, '194A');
    expect(res.thresholdMet).toBe(true);
    expect(res.tdsAmount).toBeCloseTo(7500, 2); // 10% of 75000
    expect(res.netAmount).toBeCloseTo(67500, 2);
  });

  it('no TDS below threshold', () => {
    const res = calcTDS(30000, '194A'); // threshold 50000
    expect(res.thresholdMet).toBe(false);
    expect(res.tdsAmount).toBe(0);
    expect(res.netAmount).toBe(30000);
  });

  it('194B lottery: 30% rate', () => {
    const res = calcTDS(50000, '194B'); // threshold 10000
    expect(res.ratePct).toBe(30);
    expect(res.tdsAmount).toBeCloseTo(15000, 2);
  });

  it('all sections have valid rate and threshold', () => {
    Object.values(TDS_RATES).forEach(({ ratePct, threshold }) => {
      expect(ratePct).toBeGreaterThanOrEqual(0);
      expect(threshold).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('calcCapitalGains', () => {
  it('STCG on equity at 20% (Budget 2024)', () => {
    // Held 6 months (< 12) → STCG
    const res = calcCapitalGains(150000, 100000, 6, 'equity');
    expect(res.gainType).toBe('STCG');
    expect(res.taxRatePct).toBe(20);
    expect(res.taxAmount).toBeCloseTo(10000, 2); // 20% of 50000
  });

  it('LTCG on equity at 12.5% above ₹1.25L exemption (Budget 2024)', () => {
    // Held 24 months → LTCG; gain = 300000, taxable = 300000 - 125000 = 175000
    const res = calcCapitalGains(500000, 200000, 24, 'equity');
    expect(res.gainType).toBe('LTCG');
    expect(res.taxRatePct).toBe(12.5);
    expect(res.taxAmount).toBeCloseTo(175000 * 0.125, 2);
  });

  it('cess is 4% of tax amount', () => {
    const res = calcCapitalGains(200000, 100000, 6, 'equity');
    expect(res.cess).toBeCloseTo(res.taxAmount * 0.04, 4);
    expect(res.totalTax).toBeCloseTo(res.taxAmount + res.cess, 4);
  });

  it('zero gain → no tax', () => {
    const res = calcCapitalGains(100000, 100000, 6, 'equity');
    expect(res.gain).toBe(0);
    expect(res.taxAmount).toBe(0);
  });

  it('loss → no tax (negative gain)', () => {
    const res = calcCapitalGains(80000, 100000, 6, 'equity');
    expect(res.gain).toBe(-20000);
    expect(res.taxAmount).toBe(0);
  });
});

describe('calcAdvanceTax', () => {
  it('returns required=false when liability ≤ 10000', () => {
    const res = calcAdvanceTax(8000);
    expect(res.required).toBe(false);
  });

  it('returns required=true when liability > 10000', () => {
    const res = calcAdvanceTax(50000);
    expect(res.required).toBe(true);
  });

  it('instalment schedule sums to 100% of liability', () => {
    const res = calcAdvanceTax(100000);
    const total = res.instalments.reduce((s, i) => s + i.instalment, 0);
    expect(total).toBeCloseTo(100000, 2);
  });

  it('has exactly 4 instalments', () => {
    const res = calcAdvanceTax(100000);
    expect(res.instalments).toHaveLength(4);
    expect(res.instalments[0].dueDate).toBe('15 June');
    expect(res.instalments[3].dueDate).toBe('15 March');
  });

  it('cumulative pcts are 15, 45, 75, 100', () => {
    const res = calcAdvanceTax(100000);
    expect(res.instalments.map(i => i.cumulativePct)).toEqual([15, 45, 75, 100]);
  });
});

describe('calcSalaryCTC', () => {
  it('basic = 40% of CTC', () => {
    const res = calcSalaryCTC(1200000);
    expect(res.basic).toBeCloseTo(480000, 2);
  });

  it('HRA = 40% of basic', () => {
    const res = calcSalaryCTC(1200000);
    expect(res.hra).toBeCloseTo(192000, 2); // 40% of 480000
  });

  it('employer EPF is capped at EPF ceiling (₹15,000/month basic)', () => {
    // CTC = 5,000,000 → basic = 2,000,000 → EPF applies on 180,000 (15000×12)
    const res = calcSalaryCTC(5000000);
    expect(res.employerEPF).toBeCloseTo(180000 * 0.12, 2); // 21600
  });

  it('annual gross = CTC - employer EPF', () => {
    const res = calcSalaryCTC(1200000);
    expect(res.annualGrossSalary).toBeCloseTo(res.ctc - res.employerEPF, 2);
  });
});
