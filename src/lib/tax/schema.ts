/**
 * schema.ts — Schema definitions, validation, and resolution for India tax data.
 *
 * Enforces strict validation (Section 9), historical coexistence (Section 10),
 * and route-to-provenance resolution (Section 12).
 *
 * Rules:
 *   - No silent coercion of missing or invalid data.
 *   - Both old framework (Income-tax Act, 1961) and new framework (Income-tax Act, 2025) coexist.
 *   - Pure TypeScript, zero browser DOM dependency.
 */

import sourcesManifest from '../../data/tax/india/sources.json';
import incomeTaxAY2025_26 from '../../data/tax/india/income-tax/AY-2025-26.json';
import incomeTaxAY2026_27 from '../../data/tax/india/income-tax/AY-2026-27.json';
import incomeTaxTY2026_27 from '../../data/tax/india/income-tax/TY-2026-27.json';
import gstCurrent from '../../data/tax/india/gst/current.json';
import tdsCurrent from '../../data/tax/india/tds/current.json';
import hraAY2026_27 from '../../data/tax/india/hra/AY-2026-27.json';
import capitalGainsAY2025_26 from '../../data/tax/india/capital-gains/AY-2025-26.json';
import advanceTaxAY2026_27 from '../../data/tax/india/advance-tax/AY-2026-27.json';
import salaryCTCFY2025_26 from '../../data/tax/india/salary-ctc/FY-2025-26.json';
import ppfCurrent from '../../data/tax/india/ppf/current.json';
import upiMDRCurrent from '../../data/tax/india/upi-mdr/current.json';

export interface TaxRecord {
  jurisdiction: string;
  taxDomain?: string;
  effectiveFrom: string;
  applicableTo?: string;
  taxYear?: string;
  financialYear?: string;
  assessmentYear?: string;
  governingFramework: string;
  framework?: string;
  source: string;
  sourceUrl: string;
  sourceTitle: string;
  verifiedOn: string;
  notes: string;
  assumptions?: string;
  values: Record<string, unknown>;
  version?: string;
}

export interface SourceEntry {
  id: string;
  authority: string;
  title: string;
  url: string;
  taxDomain: string;
  jurisdiction: string;
  applicablePeriods: string[];
  format: 'html' | 'pdf';
  lastChecked: string;
  contentHash: string;
  enabled: boolean;
}

export interface ValidationIssue {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function isValidISODate(dateStr: string): boolean {
  if (!ISO_DATE_REGEX.test(dateStr)) return false;
  const d = new Date(dateStr + 'T00:00:00Z');
  if (Number.isNaN(d.getTime())) return false;
  const [year, month, day] = dateStr.split('-').map(Number);
  return (
    d.getUTCFullYear() === year &&
    d.getUTCMonth() + 1 === month &&
    d.getUTCDate() === day
  );
}

/** Recursively verifies numerical fields are finite numbers and not NaN or Infinity */
function checkValuesRecursive(
  val: unknown,
  path: string,
  errors: string[]
): void {
  if (val === null || val === undefined) return;

  if (typeof val === 'number') {
    if (Number.isNaN(val)) {
      errors.push(`Invalid number at values.${path}: NaN is not allowed`);
    } else if (!Number.isFinite(val)) {
      errors.push(`Invalid number at values.${path}: Infinity is not allowed`);
    }
    return;
  }

  if (Array.isArray(val)) {
    val.forEach((item, index) => {
      checkValuesRecursive(item, `${path}[${index}]`, errors);
      if (
        item &&
        typeof item === 'object' &&
        'ratePct' in item &&
        typeof (item as Record<string, unknown>).ratePct === 'number'
      ) {
        const rate = (item as Record<string, unknown>).ratePct as number;
        if (rate < 0 || rate > 100) {
          errors.push(`Invalid ratePct ${rate} at values.${path}[${index}]: must be between 0 and 100`);
        }
      }
      if (
        item &&
        typeof item === 'object' &&
        'min' in item &&
        'max' in item
      ) {
        const min = (item as Record<string, unknown>).min as number;
        const max = (item as Record<string, unknown>).max as number | null;
        if (typeof min === 'number' && min < 0) {
          errors.push(`Negative threshold min at values.${path}[${index}]: ${min}`);
        }
        if (typeof min === 'number' && typeof max === 'number' && max <= min) {
          errors.push(`Impossible threshold range at values.${path}[${index}]: min ${min} >= max ${max}`);
        }
      }
    });
    return;
  }

  if (typeof val === 'object') {
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      checkValuesRecursive(v, path ? `${path}.${k}` : k, errors);
    }
  }
}

/**
 * Validates a single tax record against Section 9 specification.
 * Rejects missing fields, invalid/contradictory dates, malformed numbers, and impossible thresholds.
 */
export function validateTaxRecord(record: unknown): ValidationResult {
  const errors: string[] = [];

  if (!record || typeof record !== 'object') {
    return { valid: false, errors: ['Record must be a non-null object'] };
  }

  const r = record as Partial<TaxRecord>;

  // 1. Mandatory core identification & provenance fields
  if (!r.jurisdiction || typeof r.jurisdiction !== 'string' || r.jurisdiction.trim() === '') {
    errors.push('Missing required field: jurisdiction');
  }

  if (!r.sourceTitle || typeof r.sourceTitle !== 'string' || r.sourceTitle.trim() === '') {
    errors.push('Missing required field: sourceTitle');
  }

  if (!r.source || typeof r.source !== 'string' || r.source.trim() === '') {
    errors.push('Missing required field: source');
  }

  if (!r.sourceUrl || typeof r.sourceUrl !== 'string' || r.sourceUrl.trim() === '') {
    errors.push('Missing required field: sourceUrl');
  } else {
    try {
      const url = new URL(r.sourceUrl);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        errors.push(`Invalid sourceUrl protocol: ${r.sourceUrl}`);
      }
    } catch {
      errors.push(`Malformed sourceUrl: ${r.sourceUrl}`);
    }
  }

  // 2. Dates
  if (!r.effectiveFrom || typeof r.effectiveFrom !== 'string' || !isValidISODate(r.effectiveFrom)) {
    errors.push(`Missing or invalid effectiveFrom date: ${r.effectiveFrom}`);
  }

  if (r.applicableTo !== undefined) {
    if (typeof r.applicableTo !== 'string' || !isValidISODate(r.applicableTo)) {
      errors.push(`Invalid applicableTo date: ${r.applicableTo}`);
    } else if (r.effectiveFrom && isValidISODate(r.effectiveFrom) && r.effectiveFrom > r.applicableTo) {
      errors.push(
        `Contradictory date range: effectiveFrom (${r.effectiveFrom}) is after applicableTo (${r.applicableTo})`
      );
    }
  }

  if (!r.verifiedOn || typeof r.verifiedOn !== 'string' || !isValidISODate(r.verifiedOn)) {
    errors.push(`Missing or invalid verifiedOn date: ${r.verifiedOn}`);
  }

  // 3. Applicable period
  const hasPeriod = Boolean(r.taxYear || r.financialYear || r.assessmentYear);
  if (!hasPeriod) {
    errors.push('Missing applicable period: must specify at least one of taxYear, financialYear, or assessmentYear');
  }

  // 4. Governing framework
  const framework = r.governingFramework || r.framework;
  if (!framework || typeof framework !== 'string' || framework.trim() === '') {
    errors.push('Missing required field: governingFramework');
  }

  // 5. Values payload
  if (!r.values || typeof r.values !== 'object' || Object.keys(r.values).length === 0) {
    errors.push('Missing or empty values payload');
  } else {
    checkValuesRecursive(r.values, '', errors);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a collection of tax records, rejecting duplicate active records
 * for the same jurisdiction and period unless explicitly versioned.
 */
export function validateTaxDatabase(records: TaxRecord[]): ValidationResult {
  const errors: string[] = [];
  const seenKeys = new Map<string, TaxRecord>();

  for (const record of records) {
    const recordValidation = validateTaxRecord(record);
    if (!recordValidation.valid) {
      errors.push(...recordValidation.errors);
      continue;
    }

    const periodKey =
      record.taxYear ||
      record.assessmentYear ||
      record.financialYear ||
      record.effectiveFrom;
    const domain = record.taxDomain || record.governingFramework;
    const domainKey = `${record.jurisdiction}:${domain}:${periodKey}`;

    if (!record.version && seenKeys.has(domainKey)) {
      errors.push(
        `Duplicate active version for key ${domainKey} without explicit version distinction`
      );
    } else {
      seenKeys.set(domainKey, record);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates an entry from sources.json.
 */
export function validateSourceEntry(entry: unknown): ValidationResult {
  const errors: string[] = [];
  if (!entry || typeof entry !== 'object') {
    return { valid: false, errors: ['Source entry must be a non-null object'] };
  }

  const s = entry as Partial<SourceEntry>;

  if (!s.id || typeof s.id !== 'string') errors.push('Missing or invalid id');
  if (!s.authority || typeof s.authority !== 'string') errors.push('Missing or invalid authority');
  if (!s.title || typeof s.title !== 'string') errors.push('Missing or invalid title');
  if (!s.url || typeof s.url !== 'string') {
    errors.push('Missing or invalid url');
  } else {
    try {
      new URL(s.url);
    } catch {
      errors.push(`Malformed url: ${s.url}`);
    }
  }
  if (!s.taxDomain || typeof s.taxDomain !== 'string') errors.push('Missing or invalid taxDomain');
  if (!s.jurisdiction || typeof s.jurisdiction !== 'string') errors.push('Missing or invalid jurisdiction');
  if (!Array.isArray(s.applicablePeriods) || s.applicablePeriods.length === 0) {
    errors.push('applicablePeriods must be a non-empty array of strings');
  }
  if (s.format !== 'html' && s.format !== 'pdf') {
    errors.push(`Invalid format: ${s.format}; must be 'html' or 'pdf'`);
  }
  if (!s.lastChecked || !isValidISODate(s.lastChecked)) {
    errors.push(`Invalid lastChecked date: ${s.lastChecked}`);
  }
  if (!s.contentHash || typeof s.contentHash !== 'string' || s.contentHash.length < 16) {
    errors.push('Missing or malformed contentHash');
  }
  if (typeof s.enabled !== 'boolean') {
    errors.push('enabled must be a boolean');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ── Registry of all India Tax Data Records ────────────────────────────────────

export const INDIA_TAX_DATA = {
  incomeTax: {
    'AY-2025-26': incomeTaxAY2025_26 as unknown as TaxRecord,
    'AY-2026-27': incomeTaxAY2026_27 as unknown as TaxRecord,
    'TY-2026-27': incomeTaxTY2026_27 as unknown as TaxRecord,
  },
  gst: {
    current: gstCurrent as unknown as TaxRecord,
  },
  tds: {
    current: tdsCurrent as unknown as TaxRecord,
  },
  hra: {
    'AY-2026-27': hraAY2026_27 as unknown as TaxRecord,
  },
  capitalGains: {
    'AY-2025-26': capitalGainsAY2025_26 as unknown as TaxRecord,
  },
  advanceTax: {
    'AY-2026-27': advanceTaxAY2026_27 as unknown as TaxRecord,
  },
  salaryCTC: {
    'FY-2025-26': salaryCTCFY2025_26 as unknown as TaxRecord,
  },
  ppf: {
    current: ppfCurrent as unknown as TaxRecord,
  },
  upiMDR: {
    current: upiMDRCurrent as unknown as TaxRecord,
  },
};

/** Returns all active India tax records across all domains */
export function getAllIndiaTaxRecords(): TaxRecord[] {
  return [
    INDIA_TAX_DATA.incomeTax['AY-2025-26'],
    INDIA_TAX_DATA.incomeTax['AY-2026-27'],
    INDIA_TAX_DATA.incomeTax['TY-2026-27'],
    INDIA_TAX_DATA.gst.current,
    INDIA_TAX_DATA.tds.current,
    INDIA_TAX_DATA.hra['AY-2026-27'],
    INDIA_TAX_DATA.capitalGains['AY-2025-26'],
    INDIA_TAX_DATA.advanceTax['AY-2026-27'],
    INDIA_TAX_DATA.salaryCTC['FY-2025-26'],
    INDIA_TAX_DATA.ppf.current,
    INDIA_TAX_DATA.upiMDR.current,
  ];
}

/** Returns the authoritative source entries from sources.json */
export function getAuthoritativeSources(): SourceEntry[] {
  return sourcesManifest as SourceEntry[];
}

/** Route to tax record mapping for UI display in IndiaTaxSourceNotice */
const ROUTE_TAX_RECORD_MAP: Record<string, TaxRecord> = {
  '/in/income-tax-calculator': INDIA_TAX_DATA.incomeTax['AY-2025-26'],
  '/in/gst-calculator': INDIA_TAX_DATA.gst.current,
  '/in/hra-calculator': INDIA_TAX_DATA.hra['AY-2026-27'],
  '/in/tds-calculator': INDIA_TAX_DATA.tds.current,
  '/in/capital-gains-tax-calculator': INDIA_TAX_DATA.capitalGains['AY-2025-26'],
  '/in/advance-tax-calculator': INDIA_TAX_DATA.advanceTax['AY-2026-27'],
  '/in/salary-ctc-calculator': INDIA_TAX_DATA.salaryCTC['FY-2025-26'],
  '/in/ppf-calculator': INDIA_TAX_DATA.ppf.current,
  '/in/upi-mdr-calculator': INDIA_TAX_DATA.upiMDR.current,
};

/**
 * Resolves the authoritative tax record for a given router pathname.
 */
export function resolveTaxRecordForRoute(pathname: string): TaxRecord | null {
  const normalized = pathname.replace(/\/$/, '') || '/';
  return ROUTE_TAX_RECORD_MAP[normalized] ?? null;
}
