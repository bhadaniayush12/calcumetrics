import type { APIRoute } from 'astro';
import { getPublishedTools } from '../config/site';
import { HUBS } from '../data/hubs';

export const GET: APIRoute = async () => {
  const toolsByPath = new Map(getPublishedTools().map((t) => [t.path, t]));

  // Include only hubs with >= 4 published tools (Section 17 & 26.4: <4 tools gets noindex & omitted from sitemap)
  const urls = HUBS.map((hub) => {
    const list = [...new Set(hub.groups.flatMap((g) => g.tools))]
      .map((path) => toolsByPath.get(path))
      .filter((t) => t !== undefined);
    return { hub, list };
  })
    .filter(({ list }) => list.length >= 4)
    .map(({ hub, list }) => {
      const dates = [hub.updated, ...list.map((t) => t.dateModified)].filter(Boolean);
      const latest = dates.sort().reverse()[0];
      return `  <url>
    <loc>https://calcumetrics.com${hub.href}</loc>
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
