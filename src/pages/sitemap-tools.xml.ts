import type { APIRoute } from 'astro';
import { getPublishedTools } from '../config/site';

export const GET: APIRoute = async () => {
  const tools = getPublishedTools();
  const urls = tools
    .map(
      (tool) => `  <url>
    <loc>https://calcumetrics.com${tool.path}</loc>
    <lastmod>${tool.dateModified}</lastmod>
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
