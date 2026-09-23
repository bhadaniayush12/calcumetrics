import type { APIRoute } from 'astro';
import { BLOG_POSTS } from '../data/blog/posts';

export const GET: APIRoute = async () => {
  // Static pages with their last meaningful update date
  const staticPages = [
    { path: '/',               lastmod: '2026-09-23' },
    { path: '/calculators',   lastmod: '2026-09-23' },
    { path: '/blog',          lastmod: '2026-09-23' },
    { path: '/about',         lastmod: '2026-09-23' },
    { path: '/contact',       lastmod: '2026-09-23' },
    { path: '/methodology',   lastmod: '2026-09-23' },
    { path: '/privacy-policy',lastmod: '2026-09-23' },
    { path: '/terms',         lastmod: '2026-09-23' },
    { path: '/disclaimer',    lastmod: '2026-09-23' },
    { path: '/cookie-policy', lastmod: '2026-09-23' },
  ];

  // Blog posts use their individual dateModified for accurate freshness signals
  const blogEntries = BLOG_POSTS.map((post) => ({
    path: `/blog/${post.slug}`,
    lastmod: post.dateModified,
  }));

  const allEntries = [...staticPages, ...blogEntries];

  const urls = allEntries
    .map(
      ({ path, lastmod }) => `  <url>
    <loc>https://calcumetrics.com${path}</loc>
    <lastmod>${lastmod}</lastmod>
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
