import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { PAGE_FRESHNESS, getFreshness } from './page-freshness';
import { formatDisplayDate } from '../lib/formatters';

const pageFile = (route: string) => `src/pages${route}.astro`;
const entries = Object.entries(PAGE_FRESHNESS);

describe('page freshness data', () => {
  it('has an entry for every /in/* page', () => {
    const inPages = readdirSync('src/pages/in').filter((f) => f.endsWith('.astro')).map((f) => `/in/${f.replace(/\.astro$/, '')}`);
    expect(inPages.length).toBeGreaterThan(0);
    for (const route of inPages) expect(PAGE_FRESHNESS[route], route).toBeDefined();
  });

  it.each(entries)('%s has an ISO date, a one-line summary and a commit', (route, entry) => {
    expect(existsSync(pageFile(route)), route).toBe(true);
    expect(entry.lastReviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(Date.parse(`${entry.lastReviewed}T00:00:00Z`))).toBe(false);
    expect(entry.whatChanged.trim().length).toBeGreaterThan(10);
    expect(entry.whatChanged).not.toMatch(/\n/);
    expect(entry.commit).toMatch(/^[0-9a-f]{7,40}$/);
  });

  it('resolves built routes with .html or a trailing slash', () => {
    expect(getFreshness('/in/tds-calculator.html')).toBe(PAGE_FRESHNESS['/in/tds-calculator']);
    expect(getFreshness('/in/tds-calculator/')).toBe(PAGE_FRESHNESS['/in/tds-calculator']);
    expect(getFreshness('/sip-calculator')).toBeUndefined();
  });

  it.each(entries)('%s takes its JSON-LD dateModified from the freshness entry', (route) => {
    const source = readFileSync(pageFile(route), 'utf8');
    expect(source).toContain(`getFreshness('${route}')`);
    expect(source).toContain('dateModified: freshness.lastReviewed');
    expect(source).not.toMatch(/dateModified: '\d{4}-\d{2}-\d{2}'/);
    // The visible note comes from CalculatorLayout or an explicit FreshnessNote.
    expect(source.includes('<CalculatorLayout') || source.includes('<FreshnessNote')).toBe(true);
  });
});

// Runs against the real build when dist/ exists (npm run build, or the currency-locking suite, creates it).
const dist = path.resolve(__dirname, '../../dist');
describe.skipIf(!existsSync(dist))('built pages', () => {
  it.each(entries)('%s shows the same "Last reviewed" date as its JSON-LD dateModified', (route, entry) => {
    const html = readFileSync(path.join(dist, `${route}.html`), 'utf8');
    const note = html.match(/<p[^>]*data-freshness[^>]*>([\s\S]*?)<\/p>/);
    expect(note, route).not.toBeNull();
    const visible = note![1].match(/<time datetime="([^"]+)">([^<]+)<\/time>/);
    expect(visible, route).not.toBeNull();
    const modified = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
      .flatMap((m) => {
        const data = JSON.parse(m[1]);
        return (data['@graph'] ?? [data]).map((node: { dateModified?: string }) => node.dateModified);
      })
      .filter(Boolean);
    expect(modified, route).toEqual([entry.lastReviewed]);
    expect(visible![1]).toBe(entry.lastReviewed);
    expect(visible![2]).toBe(formatDisplayDate(entry.lastReviewed));
    expect(note![1]).toContain('Last reviewed:');
  });
});
