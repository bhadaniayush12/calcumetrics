import { describe, expect, it } from 'vitest';
import { BLOG_POSTS } from './posts';
import { getPublishedTools } from '../../config/site';

describe('Blog posts data integrity', () => {
  const publishedTools = getPublishedTools();
  const validToolPaths = new Set(publishedTools.map((t) => t.path));

  it('contains valid blog posts', () => {
    expect(BLOG_POSTS.length).toBeGreaterThan(0);
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
    }
  });

  it('ensures every post links to at least one valid published calculator in TOOLS', () => {
    for (const post of BLOG_POSTS) {
      expect(post.relatedCalculators.length).toBeGreaterThan(0);
      for (const calc of post.relatedCalculators) {
        expect(validToolPaths.has(calc.path)).toBe(true);
        expect(calc.name).toBeTruthy();
      }
    }
  });

  it('ensures FAQs are structured with question and answer', () => {
    for (const post of BLOG_POSTS) {
      expect(post.faqs.length).toBeGreaterThan(0);
      for (const faq of post.faqs) {
        expect(faq.question).toBeTruthy();
        expect(faq.answer).toBeTruthy();
      }
    }
  });
});
