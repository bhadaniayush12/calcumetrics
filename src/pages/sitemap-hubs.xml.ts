import type { APIRoute } from 'astro';
import { CATEGORIES, getToolsByCategory } from '../config/site';

export const GET: APIRoute = async () => {
  const toolsByCategory = getToolsByCategory();

  // Include only hubs with >= 4 published tools (Section 17 & 26.4: <4 tools gets noindex & omitted from sitemap)
  const eligibleCategories = CATEGORIES.filter((cat) => {
    const list = toolsByCategory.get(cat.name) ?? [];
    return list.length >= 4;
  });

  const urls = eligibleCategories
    .map((cat) => {
      const list = toolsByCategory.get(cat.name) ?? [];
      const dates = list.map((t) => t.dateModified).filter(Boolean);
      const latest = dates.length ? dates.sort().reverse()[0] : '2026-09-20';
      return `  <url>
    <loc>https://calcumetrics.com${cat.href}</loc>
    <lastmod>${latest}</lastmod>
  </url>`;
    })
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
