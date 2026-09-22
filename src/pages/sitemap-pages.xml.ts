import type { APIRoute } from 'astro';
import { BLOG_POSTS } from '../data/blog/posts';

export const GET: APIRoute = async () => {
  const staticPages = [
    '/',
    '/calculators',
    '/blog',
    '/about',
    '/contact',
    '/methodology',
    '/privacy-policy',
    '/terms',
    '/disclaimer',
    '/cookie-policy',
  ];

  const blogPages = BLOG_POSTS.map((post) => `/blog/${post.slug}`);
  const pages = [...staticPages, ...blogPages];

  const urls = pages
    .map(
      (path) => `  <url>
    <loc>https://calcumetrics.com${path === '/' ? '/' : path}</loc>
    <lastmod>2026-09-23</lastmod>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`.trim();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
