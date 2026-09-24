import { describe, expect, it } from 'vitest';
import {
  getAllIndiaTaxRecords,
  getAuthoritativeSources,
  INDIA_TAX_DATA,
  resolveTaxRecordForRoute,
  validateSourceEntry,
  validateTaxDatabase,
  validateTaxRecord,
  type TaxRecord,
} from './schema';
import {
  computeFingerprint,
  formatChangeIssuePayload,
  normalizeSourceContent,
} from './monitor-utils';

describe('India Tax Data Schema Validation (Section 9)', () => {
  it('validates that all active tax records pass strict schema validation', () => {
    const records = getAllIndiaTaxRecords();
    expect(records.length).toBeGreaterThanOrEqual(9);

    for (const record of records) {
      const res = validateTaxRecord(record);
      expect(res.valid, `Record for ${record.sourceTitle} failed: ${res.errors.join(', ')}`).toBe(true);
      expect(res.errors).toHaveLength(0);
    }
  });

  it('validates the complete tax database with no unversioned duplicates', () => {
    const records = getAllIndiaTaxRecords();
    const res = validateTaxDatabase(records);
    expect(res.valid, `Database validation failed: ${res.errors.join(', ')}`).toBe(true);
    expect(res.errors).toHaveLength(0);
  });

  it('rejects records with missing required metadata fields', () => {
    const base = { ...INDIA_TAX_DATA.incomeTax['AY-2025-26'] };

    // Missing jurisdiction
    expect(validateTaxRecord({ ...base, jurisdiction: '' }).valid).toBe(false);

    // Missing sourceTitle
    expect(validateTaxRecord({ ...base, sourceTitle: '' }).valid).toBe(false);

    // Missing source
    expect(validateTaxRecord({ ...base, source: '' }).valid).toBe(false);

    // Missing sourceUrl
    expect(validateTaxRecord({ ...base, sourceUrl: '' }).valid).toBe(false);

    // Malformed sourceUrl
    expect(validateTaxRecord({ ...base, sourceUrl: 'ftp://invalid-protocol.com' }).valid).toBe(false);
    expect(validateTaxRecord({ ...base, sourceUrl: 'not-a-url' }).valid).toBe(false);

    // Missing verifiedOn
    expect(validateTaxRecord({ ...base, verifiedOn: '' }).valid).toBe(false);

    // Missing effectiveFrom
    expect(validateTaxRecord({ ...base, effectiveFrom: '' }).valid).toBe(false);

    // Missing governingFramework
    expect(validateTaxRecord({ ...base, governingFramework: '', framework: '' }).valid).toBe(false);

    // Missing applicable period
    expect(
      validateTaxRecord({
        ...base,
        taxYear: undefined,
        financialYear: undefined,
        assessmentYear: undefined,
      }).valid
    ).toBe(false);

    // Missing values
    expect(validateTaxRecord({ ...base, values: {} }).valid).toBe(false);
  });

  it('rejects records with invalid or contradictory dates', () => {
    const base = { ...INDIA_TAX_DATA.incomeTax['AY-2025-26'] };

    // Invalid date formats
    expect(validateTaxRecord({ ...base, effectiveFrom: '2024/04/01' }).valid).toBe(false);
    expect(validateTaxRecord({ ...base, verifiedOn: '23-09-2026' }).valid).toBe(false);
    expect(validateTaxRecord({ ...base, effectiveFrom: '2024-02-31' }).valid).toBe(false);

    // Contradictory date range: effectiveFrom after applicableTo
    expect(
      validateTaxRecord({
        ...base,
        effectiveFrom: '2025-04-01',
        applicableTo: '2024-03-31',
      }).valid
    ).toBe(false);
  });

  it('rejects records with malformed numeric values, NaN, or Infinity', () => {
    const base = { ...INDIA_TAX_DATA.incomeTax['AY-2025-26'] };

    // NaN
    const nanValues = JSON.parse(JSON.stringify(base.values));
    nanValues.newRegime.standardDeduction = Number.NaN;
    expect(validateTaxRecord({ ...base, values: nanValues }).valid).toBe(false);

    // Infinity
    const infValues = JSON.parse(JSON.stringify(base.values));
    infValues.newRegime.standardDeduction = Number.POSITIVE_INFINITY;
    expect(validateTaxRecord({ ...base, values: infValues }).valid).toBe(false);

    // Out-of-bounds rate percentage (>100 or <0)
    const invalidRateValues = JSON.parse(JSON.stringify(base.values));
    invalidRateValues.newRegime.slabs[1].ratePct = 150;
    expect(validateTaxRecord({ ...base, values: invalidRateValues }).valid).toBe(false);

    // Negative min threshold
    const negativeMinValues = JSON.parse(JSON.stringify(base.values));
    negativeMinValues.newRegime.slabs[0].min = -500;
    expect(validateTaxRecord({ ...base, values: negativeMinValues }).valid).toBe(false);

    // Inverted threshold (min >= max)
    const invertedMinMaxValues = JSON.parse(JSON.stringify(base.values));
    invertedMinMaxValues.newRegime.slabs[1].min = 700000;
    invertedMinMaxValues.newRegime.slabs[1].max = 300000;
    expect(validateTaxRecord({ ...base, values: invertedMinMaxValues }).valid).toBe(false);
  });

  it('rejects duplicate unversioned active records for the same period and framework', () => {
    const rec1 = { ...INDIA_TAX_DATA.incomeTax['AY-2025-26'] };
    const rec2 = { ...INDIA_TAX_DATA.incomeTax['AY-2025-26'] };
    delete rec1.version;
    delete rec2.version;

    const res = validateTaxDatabase([rec1, rec2]);
    expect(res.valid).toBe(false);
    expect(res.errors[0]).toContain('Duplicate active version');
  });
});

describe('Framework & Temporal Coexistence (Section 2 & 10)', () => {
  it('coexists historical Income-tax Act, 1961 with Income-tax Act, 2025 without overwriting', () => {
    const ay2025 = INDIA_TAX_DATA.incomeTax['AY-2025-26'];
    const ay2026 = INDIA_TAX_DATA.incomeTax['AY-2026-27'];
    const ty2026 = INDIA_TAX_DATA.incomeTax['TY-2026-27'];

    expect(ay2025.governingFramework).toBe('Income-tax Act, 1961');
    expect(ay2025.assessmentYear).toBe('AY 2025-26');
    expect(ay2025.financialYear).toBe('FY 2024-25');

    expect(ay2026.governingFramework).toBe('Income-tax Act, 1961');
    expect(ay2026.assessmentYear).toBe('AY 2026-27');

    expect(ty2026.governingFramework).toBe('Income-tax Act, 2025');
    expect(ty2026.taxYear).toBe('TY 2026-27');
    expect(ty2026.assessmentYear).toBeUndefined(); // Tax Year replaces Assessment Year under 2025 Act
  });

  it('documents TDS transition rules between 1961 Act and 2025 Act', () => {
    const tds = INDIA_TAX_DATA.tds.current;
    expect(tds.notes).toContain('31 March 2026');
    expect(tds.notes).toContain('Income-tax Act, 2025');
    expect(tds.governingFramework).toContain('Income-tax Act, 1961');
  });
});

describe('Source Manifest Validation (Section 5)', () => {
  it('validates all entries in sources.json', () => {
    const sources = getAuthoritativeSources();
    expect(sources.length).toBeGreaterThanOrEqual(9);

    for (const source of sources) {
      const res = validateSourceEntry(source);
      expect(res.valid, `Source ${source.id} failed: ${res.errors.join(', ')}`).toBe(true);
      expect(source.jurisdiction).toBe('IN');
      expect(source.url.startsWith('https://') || source.url.startsWith('http://')).toBe(true);
    }
  });

  it('rejects malformed source entries', () => {
    expect(validateSourceEntry(null).valid).toBe(false);
    expect(validateSourceEntry({ id: 'test' }).valid).toBe(false);
    expect(validateSourceEntry({ id: 'test', format: 'invalid' }).valid).toBe(false);
  });
});

describe('Route Resolution & UI Notice Integration (Section 11 & 12)', () => {
  const TARGET_ROUTES = [
    '/in/income-tax-calculator',
    '/in/gst-calculator',
    '/in/hra-calculator',
    '/in/tds-calculator',
    '/in/capital-gains-tax-calculator',
    '/in/advance-tax-calculator',
    '/in/salary-ctc-calculator',
    '/in/ppf-calculator',
    '/in/upi-mdr-calculator',
  ];

  it('resolves authoritative tax data for all 9 India calculator routes', () => {
    for (const route of TARGET_ROUTES) {
      const record = resolveTaxRecordForRoute(route);
      expect(record, `Failed to resolve tax record for route: ${route}`).toBeDefined();
      expect(record?.sourceTitle).toBeDefined();
      expect(record?.sourceUrl).toMatch(/^https?:\/\//);
      expect(record?.verifiedOn).toMatch(/^2026-09-\d{2}$/);
      expect(record?.jurisdiction).toBe('IN');
    }
  });

  it('returns null for non-India or unknown routes', () => {
    expect(resolveTaxRecordForRoute('/sip-calculator')).toBeNull();
    expect(resolveTaxRecordForRoute('/us/401k-calculator')).toBeNull();
    expect(resolveTaxRecordForRoute('/non-existent')).toBeNull();
  });
});

describe('Change Detection Normalization & Fingerprinting (Section 6, 7, 15)', () => {
  it('normalizes dynamic markup, scripts, and timestamps deterministically', () => {
    const rawHtml1 = `
      <html>
        <head>
          <script>console.log("tracking");</script>
          <style>.ad { display:none; }</style>
        </head>
        <body>
          <!-- Generated at 2026-09-23T02:00:00Z -->
          <h1>Central Goods and Services Tax</h1>
          <p>Standard GST rates: 0%, 5%, 12%, 18%, 28%.</p>
          <span>Server time: Wed, 23 Sep 2026 02:00:00 GMT</span>
        </body>
      </html>
    `;

    const rawHtml2 = `
      <html>
        <head>
          <script>alert("different tracking script");</script>
          <style>.theme { color: red; }</style>
        </head>
        <body>
          <!-- Different comment -->
          <h1>Central   Goods and Services Tax</h1>
          <p>Standard GST rates: 0%, 5%, 12%, 18%, 28%.</p>
          <span>Server time: Thu, 24 Sep 2026 15:45:00 UTC</span>
        </body>
      </html>
    `;

    const norm1 = normalizeSourceContent(rawHtml1, 'html');
    const norm2 = normalizeSourceContent(rawHtml2, 'html');

    expect(norm1).toBe(norm2);
    expect(computeFingerprint(norm1)).toBe(computeFingerprint(norm2));
  });

  it('detects substantive regulatory text changes', () => {
    const docA = 'Standard rate of GST on specified item is 18%.';
    const docB = 'Standard rate of GST on specified item is 12%.';

    const hashA = computeFingerprint(normalizeSourceContent(docA));
    const hashB = computeFingerprint(normalizeSourceContent(docB));

    expect(hashA).not.toBe(hashB);
  });

  it('formats GitHub issue payload requiring human approval without auto-mutation', () => {
    const payload = formatChangeIssuePayload({
      id: 'cbic-gst-rates',
      authority: 'Central Board of Indirect Taxes and Customs (CBIC)',
      title: 'GST Rate Schedule',
      sourceUrl: 'https://cbic-gst.gov.in',
      timestamp: '2026-09-23T03:00:00Z',
      previousFingerprint: 'hash-aaa',
      newFingerprint: 'hash-bbb',
      domain: 'gst',
      affectedTaxPeriod: 'current',
      requiresManualReview: true,
    });

    expect(payload.title).toContain('[Tax Source Alert]');
    expect(payload.body).toContain('NOT AUTHORITATIVE — HUMAN REVIEW REQUIRED');
    expect(payload.body).toContain('No rate change is ever applied based on AI interpretation alone');
    expect(payload.body).toContain('https://cbic-gst.gov.in');
  });
});

describe('Calculator Integration & INR-Lock Status (Section 11 & C5)', () => {
  it('confirms PPF calculator engine computes matching 7.1% statutory maturity values', async () => {
    const { calcPPF } = await import('../calculators/ppf');
    const res = calcPPF(150000, 7.1, 15);
    expect(res.invested).toBe(2250000);
    expect(Math.round(res.maturity)).toBe(4068209);
    expect(Math.round(res.interest)).toBe(1818209);
    expect(res.gain).toBe(res.interest);
    expect(Number.isNaN(res.gainFraction)).toBe(false);
    expect(Number.isNaN(res.principalFraction)).toBe(false);
  });

  it('preserves INR locking on India tax engines without currency conversion', async () => {
    const { calcGST, calcHRA, calcTDS, calcCapitalGains, calcAdvanceTax, calcSalaryCTC } = await import('./india');

    const gst = calcGST(10000, 18);
    expect(gst.baseAmount).toBe(10000);
    expect(gst.gstAmount).toBe(1800);
    expect(gst.cgst).toBe(900);
    expect(gst.sgst).toBe(900);

    const hra = calcHRA(600000, 240000, 180000, 'mumbai');
    expect(hra.isMetro).toBe(true);
    expect(hra.hraExemption).toBe(120000);

    const tds = calcTDS(100000, '194J');
    expect(tds.tdsAmount).toBe(10000);
    expect(tds.netAmount).toBe(90000);

    const cg = calcCapitalGains(500000, 200000, 15, 'equity');
    expect(cg.gainType).toBe('LTCG');
    expect(cg.taxRatePct).toBe(12.5);

    const adv = calcAdvanceTax(100000);
    expect(adv.required).toBe(true);
    expect(adv.instalments).toHaveLength(4);

    const sal = calcSalaryCTC(1200000);
    expect(sal.basic).toBe(480000);
    expect(sal.employerEPF).toBe(21600); // 12% on 15,000 * 12
  });
});

describe('Phase 8 Legal Safety, Disclosures, Assumptions, and Limitations', () => {
  const PROHIBITED_PHRASES = [
    'You are legally required to',
    'Your exact tax liability is',
    'This is the final amount you must pay',
    'definitely eligible',
  ];

  it('guarantees every active India tax record contains structured assumptions, limitations, and disclaimers', () => {
    const records = getAllIndiaTaxRecords();
    expect(records.length).toBeGreaterThanOrEqual(10);

    for (const record of records) {
      // 1. Assumptions
      expect(record.assumptions, `Missing assumptions in ${record.sourceTitle}`).toBeDefined();
      const assumptions = Array.isArray(record.assumptions) ? record.assumptions : [record.assumptions!];
      expect(assumptions.length).toBeGreaterThanOrEqual(1);
      assumptions.forEach((a) => {
        expect(typeof a).toBe('string');
        expect(a.trim().length).toBeGreaterThan(5);
      });

      // 2. Limitations
      expect(record.limitations, `Missing limitations in ${record.sourceTitle}`).toBeDefined();
      expect(record.limitations!.length).toBeGreaterThanOrEqual(1);
      record.limitations!.forEach((l) => {
        expect(typeof l).toBe('string');
        expect(l.trim().length).toBeGreaterThan(5);
      });

      // 3. Disclaimer
      expect(record.disclaimer, `Missing disclaimer in ${record.sourceTitle}`).toBeDefined();
      expect(record.disclaimer!.toLowerCase()).toContain('educational');
      expect(record.disclaimer!.toLowerCase()).toContain('advice');

      // 4. Prohibited phrase checks
      const serialized = JSON.stringify({
        assumptions: record.assumptions,
        limitations: record.limitations,
        disclaimer: record.disclaimer,
        notes: record.notes,
      });

      for (const phrase of PROHIBITED_PHRASES) {
        expect(serialized.toLowerCase()).not.toContain(phrase.toLowerCase());
      }
    }
  });

  it('verifies route resolution provides complete Phase 8 legal safety metadata for all 9 India routes', () => {
    const TARGET_ROUTES = [
      '/in/income-tax-calculator',
      '/in/gst-calculator',
      '/in/hra-calculator',
      '/in/tds-calculator',
      '/in/capital-gains-tax-calculator',
      '/in/advance-tax-calculator',
      '/in/salary-ctc-calculator',
      '/in/ppf-calculator',
      '/in/upi-mdr-calculator',
    ];

    for (const route of TARGET_ROUTES) {
      const record = resolveTaxRecordForRoute(route);
      expect(record, `Route ${route} returned null`).toBeDefined();
      expect(record?.assumptions).toBeDefined();
      expect(record?.limitations).toBeDefined();
      expect(record?.disclaimer).toBeDefined();
      expect(record?.verifiedOn).toBeDefined();
      expect(record?.governingFramework).toBeDefined();
      expect(record?.sourceUrl).toMatch(/^https?:\/\//);
    }
  });
});


