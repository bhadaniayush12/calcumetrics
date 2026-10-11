/**
 * embed.ts — Embeddable calculator widgets (/embed/<calc>) and their snippet builder.
 *
 * Widgets are framed on third-party sites. The snippet places a plain link
 * *outside* the iframe so the host page carries a real backlink.
 */
import { calcEMI } from './calculators/emi';
import { calcSIP } from './calculators/sip';
import { calcFD } from './calculators/fd';
import { calcGST } from './calculators/taxes';
import { calcPPF, PPF_DEFAULT_RATE, PPF_LOCK_IN_YEARS } from './calculators/ppf';
import { calcLumpSum } from './calculators/lumpsum';
import { calcAmortization } from './finance/amortization';
import { normalizeCurrency, SUPPORTED_CURRENCIES, type CurrencyCode } from './currency';
import { getFieldDefaults } from '../data/market-defaults';

export const SITE_ORIGIN = 'https://calcumetrics.com';

export type EmbedTheme = 'light' | 'dark';

interface EmbedFieldBase {
  /** Input id inside the widget and key in the market-defaults table (if any) */
  id: string;
  label: string;
  /** Fallback default when market-defaults has no entry */
  value: number;
}

export interface EmbedNumberField extends EmbedFieldBase {
  /** amount: money (min in INR, scaled per currency); percent/rate: decimals; years: whole numbers */
  kind: 'amount' | 'rate' | 'percent' | 'years';
  min: number;
  max: number;
}

export interface EmbedSelectField extends EmbedFieldBase {
  kind: 'select';
  options: { value: number; label: string }[];
}

export type EmbedField = EmbedNumberField | EmbedSelectField;

export interface EmbedResultRow {
  label: string;
  value: number;
  /** Highlighted as the main answer */
  hero?: boolean;
}

export interface EmbedCalculator {
  slug: string;
  title: string;
  /** Full calculator page the backlink points to */
  pagePath: string;
  /** Key in MARKET_DEFAULTS */
  marketKey: string;
  /** Restricts the widget to these currencies (statutory India tools are INR-only) */
  currencies: readonly CurrencyCode[];
  fields: EmbedField[];
  /** Labels for the composition bar: [base, growth] */
  barLabels: [string, string];
  compute: (v: Record<string, number>) => { rows: EmbedResultRow[]; base: number; growth: number };
  /** Widget height in px that fits the layout without scrolling */
  height: number;
}

const ALL = SUPPORTED_CURRENCIES;
const INR_ONLY = ['INR'] as const;

/** Monthly payment for a property loan: price minus down payment, standard reducing-balance EMI. */
function propertyLoan(price: number, downPct: number, rate: number, years: number) {
  const loan = price * (1 - downPct / 100);
  const r = calcAmortization(loan, rate, years);
  return {
    rows: [
      { label: 'Monthly payment', value: r.emi, hero: true },
      { label: 'Loan amount', value: loan },
      { label: 'Total interest', value: r.totalInterest },
    ],
    base: loan,
    growth: r.totalInterest,
  };
}

export const EMBED_CALCULATORS: Record<string, EmbedCalculator> = {
  emi: {
    slug: 'emi',
    title: 'EMI Calculator',
    pagePath: '/emi-calculator',
    marketKey: 'emi',
    currencies: ALL,
    fields: [
      { id: 'emi-principal', label: 'Loan amount', kind: 'amount', min: 10000, max: 1_000_000_000, value: 1000000 },
      { id: 'emi-rate', label: 'Interest rate (% p.a.)', kind: 'rate', min: 0.1, max: 30, value: 8.5 },
      { id: 'emi-years', label: 'Tenure (years)', kind: 'years', min: 1, max: 40, value: 20 },
    ],
    barLabels: ['Principal', 'Interest'],
    compute: (v) => {
      const r = calcEMI(v['emi-principal'], v['emi-rate'], v['emi-years']);
      return {
        rows: [
          { label: 'Monthly EMI', value: r.emiRounded, hero: true },
          { label: 'Total interest', value: r.totalInterest },
          { label: 'Total payment', value: r.totalPayment },
        ],
        base: r.principal,
        growth: r.totalInterest,
      };
    },
    height: 500,
  },
  'home-loan': {
    slug: 'home-loan',
    title: 'Home Loan Calculator',
    pagePath: '/home-loan-calculator',
    marketKey: 'home-loan',
    currencies: ALL,
    fields: [
      { id: 'hl-price', label: 'Property price', kind: 'amount', min: 10000, max: 10_000_000_000, value: 5000000 },
      { id: 'hl-down', label: 'Down payment (%)', kind: 'percent', min: 0, max: 95, value: 20 },
      { id: 'hl-rate', label: 'Interest rate (% p.a.)', kind: 'rate', min: 0.1, max: 30, value: 8.5 },
      { id: 'hl-years', label: 'Tenure (years)', kind: 'years', min: 1, max: 40, value: 20 },
    ],
    barLabels: ['Loan amount', 'Interest'],
    compute: (v) => propertyLoan(v['hl-price'], v['hl-down'], v['hl-rate'], v['hl-years']),
    height: 572,
  },
  mortgage: {
    slug: 'mortgage',
    title: 'Mortgage Calculator',
    pagePath: '/mortgage-calculator',
    marketKey: 'mortgage',
    currencies: ALL,
    fields: [
      { id: 'mort-price', label: 'Home price', kind: 'amount', min: 10000, max: 10_000_000_000, value: 400000 },
      { id: 'mort-down', label: 'Down payment (%)', kind: 'percent', min: 0, max: 95, value: 20 },
      { id: 'mort-rate', label: 'Interest rate (% p.a.)', kind: 'rate', min: 0.1, max: 30, value: 6.75 },
      { id: 'mort-years', label: 'Loan term (years)', kind: 'years', min: 1, max: 40, value: 30 },
    ],
    barLabels: ['Loan amount', 'Interest'],
    compute: (v) => propertyLoan(v['mort-price'], v['mort-down'], v['mort-rate'], v['mort-years']),
    height: 572,
  },
  sip: {
    slug: 'sip',
    title: 'SIP Calculator',
    pagePath: '/sip-calculator',
    marketKey: 'sip',
    currencies: ALL,
    fields: [
      { id: 'sip-monthly', label: 'Monthly investment', kind: 'amount', min: 500, max: 10_000_000, value: 25000 },
      { id: 'sip-rate', label: 'Expected return (% p.a.)', kind: 'rate', min: 1, max: 30, value: 12 },
      { id: 'sip-years', label: 'Time period (years)', kind: 'years', min: 1, max: 50, value: 10 },
    ],
    barLabels: ['Invested', 'Returns'],
    compute: (v) => {
      const r = calcSIP(v['sip-monthly'], v['sip-rate'], v['sip-years']);
      return {
        rows: [
          { label: 'Maturity value', value: r.maturity, hero: true },
          { label: 'Total invested', value: r.invested },
          { label: 'Estimated returns', value: r.gain },
        ],
        base: r.invested,
        growth: r.gain,
      };
    },
    height: 500,
  },
  'lump-sum': {
    slug: 'lump-sum',
    title: 'Lump Sum Calculator',
    pagePath: '/lump-sum-calculator',
    marketKey: 'lump-sum',
    currencies: ALL,
    fields: [
      { id: 'ls-principal', label: 'Investment amount', kind: 'amount', min: 500, max: 1_000_000_000, value: 100000 },
      { id: 'ls-rate', label: 'Expected return (% p.a.)', kind: 'rate', min: 1, max: 30, value: 8 },
      { id: 'ls-years', label: 'Time period (years)', kind: 'years', min: 1, max: 50, value: 10 },
    ],
    barLabels: ['Invested', 'Returns'],
    compute: (v) => {
      const r = calcLumpSum(v['ls-principal'], v['ls-rate'], v['ls-years'], 'annually');
      return {
        rows: [
          { label: 'Maturity value', value: r.maturity, hero: true },
          { label: 'Amount invested', value: r.principal },
          { label: 'Estimated returns', value: r.gain },
        ],
        base: r.principal,
        growth: r.gain,
      };
    },
    height: 500,
  },
  fd: {
    slug: 'fd',
    title: 'FD Calculator',
    pagePath: '/fd-calculator',
    marketKey: 'fd',
    currencies: ALL,
    fields: [
      { id: 'fd-principal', label: 'Deposit amount', kind: 'amount', min: 500, max: 1_000_000_000, value: 100000 },
      { id: 'fd-rate', label: 'Interest rate (% p.a.)', kind: 'rate', min: 0.1, max: 20, value: 7 },
      { id: 'fd-years', label: 'Tenure (years)', kind: 'years', min: 1, max: 30, value: 5 },
    ],
    barLabels: ['Deposit', 'Interest'],
    compute: (v) => {
      const r = calcFD(v['fd-principal'], v['fd-rate'], v['fd-years'], 'quarterly');
      return {
        rows: [
          { label: 'Maturity value', value: r.maturity, hero: true },
          { label: 'Total interest', value: r.interest },
          { label: 'Deposit', value: r.principal },
        ],
        base: r.principal,
        growth: r.interest,
      };
    },
    height: 500,
  },
  ppf: {
    slug: 'ppf',
    title: 'PPF Calculator',
    pagePath: '/in/ppf-calculator',
    marketKey: 'ppf',
    currencies: INR_ONLY,
    fields: [
      { id: 'ppf-annual', label: 'Yearly deposit (₹500 – ₹1.5 lakh)', kind: 'amount', min: 500, max: 150000, value: 150000 },
      { id: 'ppf-rate', label: 'Interest rate (% p.a.)', kind: 'rate', min: 1, max: 15, value: PPF_DEFAULT_RATE },
      { id: 'ppf-years', label: 'Time period (years, min 15)', kind: 'years', min: PPF_LOCK_IN_YEARS, max: 50, value: PPF_LOCK_IN_YEARS },
    ],
    barLabels: ['Invested', 'Interest'],
    compute: (v) => {
      const r = calcPPF(v['ppf-annual'], v['ppf-rate'], v['ppf-years']);
      return {
        rows: [
          { label: 'Maturity value', value: r.maturity, hero: true },
          { label: 'Total invested', value: r.invested },
          { label: 'Total interest', value: r.interest },
        ],
        base: r.invested,
        growth: r.interest,
      };
    },
    height: 500,
  },
  gst: {
    slug: 'gst',
    title: 'GST Calculator',
    pagePath: '/in/gst-calculator',
    marketKey: 'gst',
    currencies: INR_ONLY,
    fields: [
      { id: 'gst-amount', label: 'Amount', kind: 'amount', min: 1, max: 10_000_000_000, value: 10000 },
      {
        id: 'gst-slab',
        label: 'GST rate',
        kind: 'select',
        value: 18,
        options: [
          { value: 0, label: '0%' },
          { value: 5, label: '5%' },
          { value: 18, label: '18%' },
          { value: 40, label: '40%' },
          { value: 12, label: '12% (legacy)' },
          { value: 28, label: '28% (legacy)' },
        ],
      },
      {
        id: 'gst-direction',
        label: 'Amount is',
        kind: 'select',
        value: 0,
        options: [
          { value: 0, label: 'Before GST (add GST)' },
          { value: 1, label: 'Including GST (remove GST)' },
        ],
      },
    ],
    barLabels: ['Net amount', 'GST'],
    compute: (v) => {
      const r = calcGST(v['gst-amount'], v['gst-slab'], false, v['gst-direction'] === 1 ? 'remove' : 'add');
      return {
        rows: [
          { label: 'GST amount', value: r.gstAmount, hero: true },
          { label: 'Net amount (before GST)', value: r.baseAmount },
          { label: 'Total (including GST)', value: r.totalAmount },
        ],
        base: r.baseAmount,
        growth: r.gstAmount,
      };
    },
    height: 500,
  },
};

export const EMBED_SLUGS = Object.keys(EMBED_CALCULATORS);

/** The embeddable widget for a calculator page path, if one exists. */
export function getEmbedForPage(pathname: string): EmbedCalculator | undefined {
  // Build-time paths carry .html (build.format: 'file')
  const clean = pathname.replace(/\.html$/, '').replace(/\/+$/, '') || '/';
  return Object.values(EMBED_CALCULATORS).find((c) => c.pagePath === clean);
}

/** A currency the widget supports: the requested one when allowed, else the widget's first. */
export function resolveEmbedCurrency(calc: EmbedCalculator, requested: CurrencyCode): CurrencyCode {
  return calc.currencies.includes(requested) ? requested : calc.currencies[0];
}

/** Starting value for a field: market default for the currency, else the field fallback. */
export function getEmbedDefault(calc: EmbedCalculator, field: EmbedField, currency: CurrencyCode): number {
  return getFieldDefaults(calc.marketKey, field.id, currency)?.value ?? field.value;
}

/** Reads `currency` and `theme` from a widget URL's query string. */
export function parseEmbedOptions(search: string): { currency: CurrencyCode; theme: EmbedTheme } {
  const q = new URLSearchParams(search);
  return {
    currency: normalizeCurrency(q.get('currency')?.toUpperCase()),
    theme: q.get('theme') === 'dark' ? 'dark' : 'light',
  };
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** HTML snippet site owners paste: the iframe plus a crawlable backlink below it. */
export function buildEmbedSnippet(slug: string, currency: CurrencyCode, theme: EmbedTheme): string {
  const calc = EMBED_CALCULATORS[slug];
  if (!calc) throw new Error(`Unknown embed calculator: ${slug}`);
  const cur = resolveEmbedCurrency(calc, currency);
  const src = `${SITE_ORIGIN}/embed/${calc.slug}?currency=${cur}&theme=${theme}`;
  const title = escapeHtml(calc.title);
  return [
    `<iframe src="${escapeHtml(src)}" title="${title} by Calcumetrics" width="100%" height="${calc.height}" style="border:0;max-width:480px;" loading="lazy"></iframe>`,
    `<p style="font-size:12px;margin:4px 0 0;"><a href="${SITE_ORIGIN}${calc.pagePath}">${title}</a> by Calcumetrics</p>`,
  ].join('\n');
}
