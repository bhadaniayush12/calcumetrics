import { describe, expect, it } from 'vitest';
import {
  CATEGORIES,
  TOOLS,
  getPlannedTools,
  getPublishedTools,
  getToolCatalogCount,
  validateToolRegistry,
} from './site';

describe('Phase 0.4 scope invariants', () => {
  it('keeps the catalog at the locked 50-tool target', () => {
    expect(TOOLS).toHaveLength(50);
    expect(getToolCatalogCount()).toBe(50);
  });

  it('keeps the five locked primary categories', () => {
    expect(CATEGORIES).toHaveLength(5);
    expect(new Set(CATEGORIES.map((category) => category.name)).size).toBe(5);
  });

  it('keeps routes valid and unique', () => {
    expect(validateToolRegistry()).toEqual([]);
    expect(new Set(TOOLS.map((tool) => tool.path))).toHaveLength(TOOLS.length);
  });

  it('keeps planned candidates behind the research gate', () => {
    const planned = getPlannedTools();
    const published = getPublishedTools();
    const publishedPaths = new Set(published.map((tool) => tool.path));

    if (planned.length > 0) {
      expect(planned.every((tool) => tool.research?.status === 'pending')).toBe(true);
      expect(planned.every((tool) => !publishedPaths.has(tool.path))).toBe(true);
    } else {
      expect(planned).toHaveLength(0);
    }
  });

  it('keeps every catalog entry in a valid lifecycle state', () => {
    expect(
      TOOLS.every((tool) => tool.status === 'published' || tool.status === 'draft' || tool.status === 'planned')
    ).toBe(true);
  });
});
