import { describe, expect, it } from 'vitest';
import { BLOG_POSTS } from './posts';
import { getPublishedTools } from '../../config/site';

describe('Blog SEO and Internal Linking Audit', () => {
  const publishedTools = getPublishedTools();
  const validToolPaths = new Set(publishedTools.map((t) => t.path));
  const validBlogSlugs = new Set(BLOG_POSTS.map((p) => p.slug));
  const validHubs = new Set(['/investments', '/loans', '/taxes', '/business', '/corporate-finance', '/calculators', '/about', '/methodology', '/contact', '/privacy-policy', '/terms', '/disclaimer', '/cookie-policy', '/']);

  it('reports SEO title lengths and brand suffixes', () => {
    for (const post of BLOG_POSTS) {
      if (post.seoTitle.length > 80 || post.seoTitle.length < 40) {
        console.log(`[TITLE ${post.seoTitle.length}] ${post.slug}: "${post.seoTitle}"`);
      }
      expect(post.seoTitle).toContain('Calcumetrics');
    }
  });

  it('reports meta description lengths', () => {
    for (const post of BLOG_POSTS) {
      if (post.description.length > 170 || post.description.length < 120) {
        console.log(`[DESC ${post.description.length}] ${post.slug}: "${post.description}"`);
      }
      expect(post.description.length).toBeGreaterThanOrEqual(80);
    }
  });


  it('validates internal links inside HTML content point to existing routes', () => {
    const internalLinkRegex = /href=["'](\/[^"']*)["']/g;
    for (const post of BLOG_POSTS) {
      let match;
      while ((match = internalLinkRegex.exec(post.content)) !== null) {
        const path = match[1];
        if (path.startsWith('/blog/')) {
          const slug = path.replace('/blog/', '').replace(/\/$/, '');
          expect(validBlogSlugs.has(slug), `Post ${post.slug} links to non-existent blog article: ${path}`).toBe(true);
        } else if (path.includes('calculator')) {
          expect(validToolPaths.has(path), `Post ${post.slug} links to non-existent calculator: ${path}`).toBe(true);
        }
      }
    }
  });

  it('verifies all blog posts have at least 2 relatedCalculators and 1 relatedArticles', () => {
    for (const post of BLOG_POSTS) {
      expect(post.relatedCalculators.length).toBeGreaterThanOrEqual(2);
      expect(post.relatedArticles.length).toBeGreaterThanOrEqual(1);
    }
  });
});
