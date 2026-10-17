import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { checkBuildDir, checkMetaLimits } from './meta-limits.mjs';

const page = (title: string, description: string, robots = 'index,follow') =>
  `<html><head><title>${title}</title><meta name="description" content="${description}" /><meta name="robots" content="${robots}" /></head></html>`;

describe('checkMetaLimits', () => {
  it('passes a title of exactly 60 and a description of exactly 160', () => {
    expect(checkMetaLimits(page('a'.repeat(60), 'b'.repeat(160)))).toEqual([]);
  });

  it('flags a 61-char title and a 161-char description', () => {
    expect(checkMetaLimits(page('a'.repeat(61), 'b'.repeat(161)))).toHaveLength(2);
  });

  it('counts entities as one character', () => {
    expect(checkMetaLimits(page('&amp;'.repeat(60), 'x'))).toEqual([]);
  });

  it('ignores noindex pages', () => {
    expect(checkMetaLimits(page('a'.repeat(90), 'x', 'noindex,follow'))).toEqual([]);
  });
});

// Runs against the real build when dist/ exists (npm run build also enforces this via the integration)
const dist = path.resolve(__dirname, '../../../dist');
describe.skipIf(!fs.existsSync(dist))('built site', () => {
  it('every indexable page has title ≤ 60 and description ≤ 160', () => {
    expect(checkBuildDir(dist)).toEqual([]);
  });
});
