import { describe, it, expect } from 'vitest';
import {
  calcGST,
  calcHRA,
  calcTDS,
  calcCapitalGains,
  calcAdvanceTax,
  calcSalaryCTC,
  METRO_CITIES,
  METRO_CITIES_FY_2025_26,
  TDS_RATES,
  TDS_ACT_2025_REF,
} from '../../lib/tax/india';
import { INDIA_TAX_DATA } from './schema';

describe('Finance Act 2025 dividend and acquisition thresholds', () => {
  it.each([['194', 10000], ['194LA', 500000]] as const)(
    '%s starts withholding only above its revised threshold', (section, threshold) => {
      expect(calcTDS(threshold - 1, section).tdsAmount).toBe(0);
      expect(calcTDS(threshold, section).tdsAmount).toBe(0);
      expect(calcTDS(threshold + 1, section).tdsAmount).toBeCloseTo((threshold + 1) * 0.1, 2);
    }
  );
});

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
    const res = calcHRA(600000, 240000, 180000, 'jaipur');
    expect(res.isMetro).toBe(false);
    expect(res.basicSalaryPct).toBeCloseTo(240000, 0); // 40% of 600000
  });

  it('exemption is min of three conditions', () => {
    // basic=600000, hra=240000, rent=180000, non-metro
    // C1: 240000, C2: 180000 - 60000 = 120000, C3: 240000
    // Min = 120000
    const res = calcHRA(600000, 240000, 180000, 'jaipur');
    expect(res.hraExemption).toBeCloseTo(120000, 0);
    expect(res.taxableHRA).toBeCloseTo(240000 - 120000, 0);
  });

  it('exemption cannot exceed HRA received', () => {
    // Very high rent paid but low HRA received
    const res = calcHRA(600000, 100000, 500000, 'delhi');
    expect(res.hraExemption).toBeLessThanOrEqual(100000);
  });

  it('all 8 rule 279 cities get 50% from tax year 2026-27', () => {
    ['mumbai', 'kolkata', 'delhi', 'chennai', 'hyderabad', 'pune', 'ahmedabad', 'bengaluru'].forEach(city => {
      expect(METRO_CITIES.has(city)).toBe(true);
      expect(calcHRA(600000, 400000, 400000, city).basicSalaryPct).toBeCloseTo(300000, 0);
    });
    expect(METRO_CITIES.size).toBe(8);
  });

  it('FY 2025-26 list (old Rule 2A) keeps only the four original cities', () => {
    expect([...METRO_CITIES_FY_2025_26].sort()).toEqual(['chennai', 'delhi', 'kolkata', 'mumbai']);
  });

  it('metro list matches hra/TY-2026-27.json', () => {
    const cities = INDIA_TAX_DATA.hra['TY-2026-27'].values.metroCities as string[];
    expect([...cities].sort()).toEqual([...METRO_CITIES].sort());
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

  it('194A senior citizen: ₹1,00,000 threshold instead of ₹50,000', () => {
    const general = calcTDS(75000, '194A');
    const senior = calcTDS(75000, '194A', { seniorCitizen: true });
    expect(general.threshold).toBe(50000);
    expect(general.tdsAmount).toBeCloseTo(7500, 2);
    expect(senior.threshold).toBe(100000);
    expect(senior.thresholdMet).toBe(false);
    expect(senior.tdsAmount).toBe(0);
    // Above ₹1,00,000 a senior is deducted at the normal 10%
    expect(calcTDS(120000, '194A', { seniorCitizen: true }).tdsAmount).toBeCloseTo(12000, 2);
  });

  it('senior citizen flag does not change other sections', () => {
    expect(calcTDS(100000, '194J', { seniorCitizen: true }).threshold).toBe(50000);
  });

  it('194O e-commerce: 0.1% from 1 Oct 2024 (Finance (No.2) Act 2024)', () => {
    const res = calcTDS(1000000, '194O');
    expect(res.ratePct).toBe(0.1);
    expect(res.tdsAmount).toBeCloseTo(1000, 2);
  });

  it('194N cash withdrawal: ₹1 crore threshold under section 393(3) Sl. 5 (tax year 2026-27)', () => {
    expect(TDS_RATES['194N'].threshold).toBe(10000000);
    expect(calcTDS(10000000, '194N').tdsAmount).toBe(0);
    expect(calcTDS(12000000, '194N').tdsAmount).toBeCloseTo(240000, 2);
  });

  it('194Q purchase of goods: 0.1% only on the sum exceeding ₹50 lakh (s.393(1) Sl. 8(ii) Note 1(b))', () => {
    expect(calcTDS(5000000, '194Q').tdsAmount).toBe(0);
    const res = calcTDS(7000000, '194Q');
    expect(res.tdsAmount).toBeCloseTo(2000, 2); // 0.1% of ₹20,00,000
    expect(res.netAmount).toBeCloseTo(6998000, 2);
  });

  it('every section has its Income-tax Act, 2025 reference, matching tds/current.json', () => {
    const sections = INDIA_TAX_DATA.tds.current.values.sections as Record<string, { act2025?: string }>;
    for (const sec of Object.keys(TDS_RATES)) {
      expect(TDS_ACT_2025_REF[sec as keyof typeof TDS_ACT_2025_REF], sec).toMatch(/^39[23]\(/);
      expect(sections[sec]?.act2025, sec).toBe(TDS_ACT_2025_REF[sec as keyof typeof TDS_ACT_2025_REF]);
    }
  });

  it('engine rate table matches tds/current.json', () => {
    const sections = INDIA_TAX_DATA.tds.current.values.sections as Record<string, { ratePct: number; threshold: number }>;
    for (const [sec, { ratePct, threshold }] of Object.entries(TDS_RATES)) {
      expect(sections[sec]?.ratePct, sec).toBe(ratePct);
      expect(sections[sec]?.threshold, sec).toBe(threshold);
    }
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

describe('calcCapitalGains holding-period boundaries', () => {
  it('treats exactly 12 months of equity as STCG (must exceed 12)', () => {
    expect(calcCapitalGains(500000, 300000, 12, 'equity').gainType).toBe('STCG');
    expect(calcCapitalGains(500000, 300000, 13, 'equity').gainType).toBe('LTCG');
  });

  it('treats exactly 24 months of real estate as STCG (must exceed 24)', () => {
    expect(calcCapitalGains(500000, 300000, 24, 'real-estate').gainType).toBe('STCG');
    expect(calcCapitalGains(500000, 300000, 25, 'real-estate').gainType).toBe('LTCG');
  });

  it('treats debt funds as deemed STCG regardless of holding (Section 50AA)', () => {
    expect(calcCapitalGains(500000, 300000, 120, 'debt-fund').gainType).toBe('STCG');
  });

  it('applies Section 50AA by acquisition date: on/after 1 Apr 2023 always STCG', () => {
    const after = calcCapitalGains(500000, 300000, 36, 'debt-fund', { acquisitionDate: '2023-04-01' });
    expect(after.gainType).toBe('STCG');
    expect(after.section).toMatch(/50AA/);
    expect(calcCapitalGains(500000, 300000, 40, 'debt-fund', { acquisitionDate: '2023-06-15' }).gainType).toBe('STCG');
  });

  it('debt-fund units acquired before 1 Apr 2023 use the 24-month rule', () => {
    const lt = calcCapitalGains(500000, 300000, 30, 'debt-fund', { acquisitionDate: '2023-03-31' });
    expect(lt.gainType).toBe('LTCG');
    expect(lt.taxRatePct).toBe(12.5);
    expect(lt.taxAmount).toBeCloseTo(25000, 2);
    const st = calcCapitalGains(500000, 300000, 24, 'debt-fund', { acquisitionDate: '2022-01-10' });
    expect(st.gainType).toBe('STCG');
    expect(st.section).not.toMatch(/50AA/);
  });

  it('applies 12.5% LTCG to other assets after Budget 2024', () => {
    expect(calcCapitalGains(500000, 300000, 36, 'other').taxRatePct).toBe(12.5);
  });
});

describe('calcAdvanceTax', () => {
  it('returns required=false when liability < 10000', () => {
    const res = calcAdvanceTax(8000);
    expect(res.required).toBe(false);
  });

  it('returns required=true when liability > 10000', () => {
    const res = calcAdvanceTax(50000);
    expect(res.required).toBe(true);
  });

  it.each([[9999, false], [10000, true], [10001, true]] as const)(
    'liability of %i gives required=%s (₹10,000 or more is liable)', (liability, required) => {
      expect(calcAdvanceTax(liability).required).toBe(required);
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

describe('calcCapitalGains — property acquired before 23 Jul 2024 (indexation option)', () => {
  it('indexation wins: 20% on indexed gain is lower than 12.5% flat', () => {
    // Bought 1 May 2010 (FY 2010-11, CII 167) for ₹20,00,000; held 197 months → sold Oct 2026 (FY 2026-27, CII 384) for ₹80,00,000
    // Indexed cost = 20,00,000 × 384 / 167 = 45,98,802.40; indexed gain = 34,01,197.60
    // With indexation: 20% × 34,01,197.60 = 6,80,239.52
    // Without: 12.5% × 60,00,000 = 7,50,000 → indexation applied
    const res = calcCapitalGains(8000000, 2000000, 197, 'real-estate', { acquisitionDate: '2010-05-01' });
    expect(res.indexation?.ciiAcquisition).toBe(167);
    expect(res.indexation?.ciiSale).toBe(384);
    expect(res.indexation?.saleFY).toBe('2026-27');
    expect(res.indexation?.indexedCost).toBeCloseTo((2000000 * 384) / 167, 4);
    expect(res.indexation?.taxWithoutIndexation).toBeCloseTo(750000, 4);
    expect(res.indexation?.taxWithIndexation).toBeCloseTo(680239.52, 1);
    expect(res.indexation?.applied).toBe('with-indexation');
    expect(res.taxRatePct).toBe(20);
    expect(res.taxAmount).toBeCloseTo(680239.52, 1);
    expect(res.cess).toBeCloseTo(680239.52 * 0.04, 1);
  });

  it('12.5% wins: flat rate is lower than 20% with indexation', () => {
    // Bought 1 Jun 2020 (FY 2020-21, CII 301) for ₹50,00,000; held 76 months → sold Oct 2026 (CII 384) for ₹1,00,00,000
    // Indexed cost = 50,00,000 × 384 / 301 = 63,78,737.54; indexed gain = 36,21,262.46
    // With indexation: 20% × 36,21,262.46 = 7,24,252.49
    // Without: 12.5% × 50,00,000 = 6,25,000 → 12.5% applied
    const res = calcCapitalGains(10000000, 5000000, 76, 'real-estate', { acquisitionDate: '2020-06-01' });
    expect(res.indexation?.taxWithIndexation).toBeCloseTo(724252.49, 1);
    expect(res.indexation?.taxWithoutIndexation).toBeCloseTo(625000, 4);
    expect(res.indexation?.applied).toBe('without-indexation');
    expect(res.taxRatePct).toBe(12.5);
    expect(res.taxAmount).toBeCloseTo(625000, 4);
  });

  it('explicit sale date overrides the derived one', () => {
    // Sale in FY 2025-26 (CII 376) instead of the derived FY 2026-27
    const res = calcCapitalGains(8000000, 2000000, 197, 'real-estate', { acquisitionDate: '2010-05-01', saleDate: '2026-03-15' });
    expect(res.indexation?.ciiSale).toBe(376);
  });

  it('no indexation option for property acquired on or after 23 Jul 2024', () => {
    const res = calcCapitalGains(8000000, 6000000, 30, 'real-estate', { acquisitionDate: '2024-07-23' });
    expect(res.indexation).toBeUndefined();
    expect(res.taxRatePct).toBe(12.5);
  });

  it('no acquisition date keeps the existing 12.5% behaviour', () => {
    const res = calcCapitalGains(8000000, 2000000, 197, 'real-estate');
    expect(res.indexation).toBeUndefined();
    expect(res.taxAmount).toBeCloseTo(750000, 4);
  });
});
