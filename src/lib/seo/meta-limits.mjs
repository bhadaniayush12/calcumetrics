// Build-time guard: every indexable page keeps <title> ≤ 60 and meta description ≤ 160 chars.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const MAX_TITLE = 60;
export const MAX_DESCRIPTION = 160;

const decode = (s) => s
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

/** Returns a list of problems for one HTML document (empty when it passes or is noindex). */
export function checkMetaLimits(html, page = '') {
  const robots = html.match(/<meta\s+name="robots"\s+content="([^"]*)"/i)?.[1] ?? '';
  if (/noindex/i.test(robots)) return [];
  // Redirect stubs have no real <head> worth checking
  if (/<meta\s+http-equiv="refresh"/i.test(html)) return [];
  const problems = [];
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? '');
  const description = decode(html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] ?? '');
  if ([...title].length > MAX_TITLE) problems.push(`${page}: title is ${[...title].length} chars (max ${MAX_TITLE}): "${title}"`);
  if ([...description].length > MAX_DESCRIPTION) problems.push(`${page}: description is ${[...description].length} chars (max ${MAX_DESCRIPTION}): "${description}"`);
  return problems;
}

/** Walks a build output directory and checks every .html file. */
export function checkBuildDir(dir) {
  const problems = [];
  const walk = (d) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith('.html')) problems.push(...checkMetaLimits(fs.readFileSync(p, 'utf8'), '/' + path.relative(dir, p)));
    }
  };
  walk(dir);
  return problems;
}

/** Astro integration: fails `astro build` when any indexable page breaks the limits. */
export function seoMetaLimits() {
  return {
    name: 'seo-meta-limits',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const problems = checkBuildDir(dir instanceof URL ? fileURLToPath(dir) : String(dir));
        if (problems.length) throw new Error(`SEO meta limits exceeded:\n${problems.join('\n')}`);
        logger.info('All indexable titles ≤ 60 and descriptions ≤ 160 chars');
      },
    },
  };
}
