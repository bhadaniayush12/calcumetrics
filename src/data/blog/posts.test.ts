import { describe, expect, it } from 'vitest';
import { BLOG_POSTS } from './posts';
import { getPublishedTools } from '../../config/site';

describe('Blog posts data integrity', () => {
  const publishedTools = getPublishedTools();
  const validToolPaths = new Set(publishedTools.map((t) => t.path));

  it('contains exactly 10 evidenced blog posts', () => {
    expect(BLOG_POSTS.length).toBe(10);
  });

  it('ensures every post has unique slugs and required metadata', () => {
    const slugs = new Set<string>();
    for (const post of BLOG_POSTS) {
      expect(post.slug).toBeTruthy();
      expect(slugs.has(post.slug)).toBe(false);
      slugs.add(post.slug);

      expect(post.title).toBeTruthy();
      expect(post.description).toBeTruthy();
      expect(post.category).toBeTruthy();
      expect(post.publishDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(post.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(post.content).toBeTruthy();
      expect(post.summary).toBeTruthy();
      expect(post.author).toBeTruthy();
      expect(['Evergreen', 'Trending', 'Hybrid']).toContain(post.type);
    }
  });

  it('ensures every post links to at least 2 valid published calculators in TOOLS', () => {
    for (const post of BLOG_POSTS) {
      expect(post.relatedCalculators.length).toBeGreaterThanOrEqual(2);
      for (const calc of post.relatedCalculators) {
        expect(validToolPaths.has(calc.path)).toBe(true);
        expect(calc.name).toBeTruthy();
        expect(calc.description).toBeTruthy();
      }
    }
  });

  it('ensures relatedArticles reference valid existing blog post slugs', () => {
    const allSlugs = new Set(BLOG_POSTS.map((p) => p.slug));
    for (const post of BLOG_POSTS) {
      expect(post.relatedArticles.length).toBeGreaterThanOrEqual(1);
      for (const rel of post.relatedArticles) {
        expect(allSlugs.has(rel.slug)).toBe(true);
        expect(rel.slug).not.toBe(post.slug);
        expect(rel.title).toBeTruthy();
        expect(rel.description).toBeTruthy();
      }
    }
  });

  it('ensures FAQs are structured with question and answer (at least 3 FAQs per post)', () => {
    for (const post of BLOG_POSTS) {
      expect(post.faqs.length).toBeGreaterThanOrEqual(3);
      for (const faq of post.faqs) {
        expect(faq.question).toBeTruthy();
        expect(faq.answer).toBeTruthy();
      }
    }
  });

  it('verifies Phase 11 Addendum market classifications and balance', () => {
    const counts = { Global: 0, 'India-Only': 0, Both: 0 };
    for (const post of BLOG_POSTS) {
      expect(['Global', 'India-Only', 'Both']).toContain(post.market);
      counts[post.market]++;
    }
    expect(counts['Global']).toBe(4);
    expect(counts['India-Only']).toBe(3);
    expect(counts['Both']).toBe(3);
  });

  it('verifies Phase 11 Addendum authoritative sources and E-E-A-T signals', () => {
    for (const post of BLOG_POSTS) {
      expect(post.author).toBeTruthy();
      expect(post.sources).toBeDefined();
      expect(post.sources?.length).toBeGreaterThanOrEqual(2);
      for (const src of post.sources!) {
        expect(src.name).toBeTruthy();
        expect(src.citation || src.url).toBeTruthy();
      }
    }
  });

  it('enforces Phase 11 Addendum market currency boundaries (no ₹ in global articles)', () => {
    for (const post of BLOG_POSTS) {
      if (post.market === 'Global') {
        const hasRupee = post.content.includes('₹');
        expect(hasRupee).toBe(false);
      }
      if (post.market === 'India-Only') {
        const hasRupee = post.content.includes('₹');
        expect(hasRupee).toBe(true);
      }
    }
  });

  it('enforces Phase 11 Addendum tone rules (no generic conclusion headers)', () => {
    for (const post of BLOG_POSTS) {
      expect(post.content.includes('>Conclusion<')).toBe(false);
      expect(post.content.includes('>Conclusion:')).toBe(false);
      expect(post.content.includes('In conclusion')).toBe(false);
      expect(post.content.includes('When it comes to')).toBe(false);
    }
  });
});
