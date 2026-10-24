import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { HUBS, hubForCategory, hubsForPost, hubsForTool } from './hubs';
import { BLOG_POSTS } from './blog/posts';
import { CATEGORIES, getPublishedTools } from '../config/site';

const tools = getPublishedTools();
const words = (paras: string[]) => paras.join(' ').split(/\s+/).filter(Boolean).length;

describe('topic hubs', () => {
  it('covers the target hub set', () => {
    expect(HUBS.map((h) => h.name)).toEqual(
      expect.arrayContaining(['Loans', 'Investing', 'Tax (India)', 'Business & Accounting', 'Everyday Math'])
    );
    // Hub URLs are unique, and every registry category keeps its existing hub URL.
    expect(new Set(HUBS.map((h) => h.href)).size).toBe(HUBS.length);
    for (const cat of CATEGORIES) expect(hubForCategory(cat.name).href).toBe(cat.href);
  });

  it.each(HUBS.map((h) => [h.id, h] as const))('%s has a 150–250 word intro and exactly 4 FAQs', (_, hub) => {
    const n = words(hub.intro);
    expect(n).toBeGreaterThanOrEqual(150);
    expect(n).toBeLessThanOrEqual(250);
    expect(hub.faqs).toHaveLength(4);
    expect(hub.title.length).toBeLessThanOrEqual(60);
    expect(hub.description.length).toBeLessThanOrEqual(160);
  });

  it('only lists published tools and existing posts', () => {
    const paths = new Set(tools.map((t) => t.path));
    const slugs = new Set(BLOG_POSTS.map((p) => p.slug));
    for (const hub of HUBS) {
      for (const g of hub.groups) {
        for (const path of g.tools) expect(paths.has(path), `${hub.id}: ${path}`).toBe(true);
        for (const slug of g.posts) expect(slugs.has(slug), `${hub.id}: ${slug}`).toBe(true);
      }
    }
  });

  it('puts every published calculator in at least one hub, including its category hub', () => {
    for (const tool of tools) {
      expect(hubsForTool(tool.path).length, tool.path).toBeGreaterThan(0);
      expect(hubsForTool(tool.path), tool.path).toContain(hubForCategory(tool.category));
    }
  });

  it('puts every post in at least one hub, including the hub its "More in" link points to', () => {
    for (const post of BLOG_POSTS) {
      expect(hubsForPost(post.slug).length, post.slug).toBeGreaterThan(0);
      expect(hubsForPost(post.slug), post.slug).toContain(hubForCategory(post.category));
    }
  });

  it('links every calculator page back to its hub through the breadcrumb', () => {
    for (const tool of tools) {
      const source = readFileSync(`src/pages${tool.path}.astro`, 'utf8');
      expect(source, tool.path).toContain(`categoryHref="${hubForCategory(tool.category).href}"`);
    }
  });

  it('links every post back to its hub', () => {
    const template = readFileSync('src/pages/blog/[slug].astro', 'utf8');
    expect(template).toContain('hubForCategory(post.category)');
    expect(template).toMatch(/More in <a href=\{hub\.href\}/);
  });

  it('keeps India-only tax content inside an INR currency lock', () => {
    const tax = HUBS.find((h) => h.id === 'tax-india')!;
    expect(tax.indiaOnly).toBe(true);
    const template = readFileSync('src/components/HubPage.astro', 'utf8');
    expect(template).toContain(`data-currency-lock={hub.indiaOnly ? 'INR' : undefined}`);
    expect(template).toContain(`lockIndia(tool.region === 'IN')`);
    expect(template).toContain(`lockIndia(post.market === 'India-Only')`);
    // Intros of hubs that are not India-only must not contain rupee amounts outside a lock.
    for (const hub of HUBS.filter((h) => !h.indiaOnly)) {
      expect(hub.intro.join(' '), hub.id).not.toContain('₹');
      expect(hub.faqs.map((f) => f.answer).join(' '), hub.id).not.toContain('₹');
    }
  });
});
