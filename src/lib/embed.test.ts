import { describe, it, expect } from 'vitest';
import { EMBED_CALCULATORS, EMBED_SLUGS, buildEmbedSnippet, getEmbedDefault, getEmbedForPage, parseEmbedOptions, resolveEmbedCurrency } from './embed';
import { calcEMI } from './calculators/emi';
import { calcPPF } from './calculators/ppf';
import { calcLumpSum } from './calculators/lumpsum';

describe('embed widgets', () => {
  it('snippet has the iframe plus a crawlable backlink outside it', () => {
    const s = buildEmbedSnippet('emi', 'USD', 'dark');
    expect(s).toContain('<iframe src="https://calcumetrics.com/embed/emi?currency=USD&amp;theme=dark"');
    expect(s).toContain('height="500"');
    const [, after] = s.split('</iframe>');
    expect(after).toContain('<a href="https://calcumetrics.com/emi-calculator">EMI Calculator</a> by Calcumetrics');
  });

  it('rejects unknown calculators', () => {
    expect(() => buildEmbedSnippet('nope', 'INR', 'light')).toThrow();
  });

  it('parses currency/theme options with safe fallbacks', () => {
    expect(parseEmbedOptions('?currency=usd&theme=dark')).toEqual({ currency: 'USD', theme: 'dark' });
    expect(parseEmbedOptions('?currency=XYZ&theme=neon')).toEqual({ currency: 'INR', theme: 'light' });
    expect(parseEmbedOptions('')).toEqual({ currency: 'INR', theme: 'light' });
  });

  it('uses market defaults per currency and field fallbacks otherwise', () => {
    const emi = EMBED_CALCULATORS.emi;
    const [principal, , years] = emi.fields;
    expect(getEmbedDefault(emi, principal, 'INR')).toBe(1000000);
    expect(getEmbedDefault(emi, principal, 'USD')).toBe(25000);
    expect(getEmbedDefault(emi, years, 'USD')).toBe(20);
  });

  it('every calculator computes a positive hero value from its defaults', () => {
    for (const slug of EMBED_SLUGS) {
      const calc = EMBED_CALCULATORS[slug];
      const values = Object.fromEntries(calc.fields.map((f) => [f.id, getEmbedDefault(calc, f, calc.currencies[0])]));
      const { rows } = calc.compute(values);
      expect(rows.find((r) => r.hero)!.value).toBeGreaterThan(0);
    }
  });

  it('EMI widget matches the main calculator fixture (₹10L, 8.5%, 20y → ₹8,678)', () => {
    const { rows } = EMBED_CALCULATORS.emi.compute({ 'emi-principal': 1000000, 'emi-rate': 8.5, 'emi-years': 20 });
    expect(rows[0].value).toBe(8678);
  });

  it('home loan and mortgage widgets match EMI on (price − down payment)', () => {
    const { rows } = EMBED_CALCULATORS['home-loan'].compute({ 'hl-price': 5000000, 'hl-down': 20, 'hl-rate': 8.5, 'hl-years': 20 });
    expect(rows[0].value).toBeCloseTo(calcEMI(4000000, 8.5, 20).emi, 6);
    expect(rows[1].value).toBe(4000000);
    const m = EMBED_CALCULATORS.mortgage.compute({ 'mort-price': 400000, 'mort-down': 20, 'mort-rate': 6.75, 'mort-years': 30 });
    expect(m.rows[0].value).toBeCloseTo(calcEMI(320000, 6.75, 30).emi, 6);
  });

  it('GST widget adds and removes GST', () => {
    const add = EMBED_CALCULATORS.gst.compute({ 'gst-amount': 10000, 'gst-slab': 18, 'gst-direction': 0 });
    expect(add.rows[0].value).toBeCloseTo(1800, 6);
    expect(add.rows[2].value).toBeCloseTo(11800, 6);
    const remove = EMBED_CALCULATORS.gst.compute({ 'gst-amount': 11800, 'gst-slab': 18, 'gst-direction': 1 });
    expect(remove.rows[0].value).toBeCloseTo(1800, 6);
    expect(remove.rows[1].value).toBeCloseTo(10000, 6);
  });

  it('PPF and lump sum widgets match their main calculators', () => {
    const ppf = EMBED_CALCULATORS.ppf.compute({ 'ppf-annual': 150000, 'ppf-rate': 7.1, 'ppf-years': 15 });
    expect(ppf.rows[0].value).toBeCloseTo(calcPPF(150000, 7.1, 15).maturity, 6);
    const ls = EMBED_CALCULATORS['lump-sum'].compute({ 'ls-principal': 100000, 'ls-rate': 8, 'ls-years': 10 });
    expect(ls.rows[0].value).toBeCloseTo(calcLumpSum(100000, 8, 10, 'annually').maturity, 6);
  });

  it('locks GST and PPF to INR, including in the snippet', () => {
    expect(resolveEmbedCurrency(EMBED_CALCULATORS.gst, 'USD')).toBe('INR');
    expect(resolveEmbedCurrency(EMBED_CALCULATORS.emi, 'USD')).toBe('USD');
    expect(buildEmbedSnippet('ppf', 'GBP', 'light')).toContain('/embed/ppf?currency=INR&amp;theme=light');
    expect(buildEmbedSnippet('gst', 'USD', 'light')).toContain('href="https://calcumetrics.com/in/gst-calculator"');
  });

  it('maps calculator page paths to their widget', () => {
    expect(getEmbedForPage('/emi-calculator')?.slug).toBe('emi');
    expect(getEmbedForPage('/in/gst-calculator/')?.slug).toBe('gst');
    expect(getEmbedForPage('/home-loan-calculator.html')?.slug).toBe('home-loan');
    expect(getEmbedForPage('/npv-calculator')).toBeUndefined();
  });
});
