import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  serializeHash,
  parseHash,
  restoreFromHash,
  readCurrentHash,
  updateHash,
  type HashState,
} from './url-state';
import type { ValidationRules } from './validate';

describe('Phase 4.4 — Calculator URL State Architecture', () => {
  const sipSchema: Record<'p' | 'r' | 'y', ValidationRules> = {
    p: { required: true, min: 500, max: 1000000 },
    r: { required: true, min: 1, max: 30, decimal: true },
    y: { required: true, min: 1, max: 40, integerOnly: true },
  };

  // ── Requirement 1: Serialize simple state ──────────────────────────────────
  it('1. serializes a simple state object into a URL hash', () => {
    const state: HashState = { p: 25000 };
    expect(serializeHash(state)).toBe('#p=25000');
  });

  // ── Requirement 2: Serialize multiple fields ───────────────────────────────
  it('2. serializes multiple fields joined with &', () => {
    const state: HashState = { p: 25000, r: 12, y: 15 };
    expect(serializeHash(state)).toBe('#p=25000&r=12&y=15');
  });

  // ── Requirement 3: Deterministic key ordering ──────────────────────────────
  it('3. enforces deterministic alphabetical key ordering regardless of insertion order', () => {
    const state1: HashState = { y: 15, p: 25000, r: 12 };
    const state2: HashState = { r: 12, y: 15, p: 25000 };
    const state3: HashState = { p: 25000, r: 12, y: 15 };

    const expected = '#p=25000&r=12&y=15';
    expect(serializeHash(state1)).toBe(expected);
    expect(serializeHash(state2)).toBe(expected);
    expect(serializeHash(state3)).toBe(expected);
  });

  // ── Requirement 4: Parse normal hash ───────────────────────────────────────
  it('4. parses normal hash string into key-value pairs', () => {
    const hash = '#p=25000&r=12&y=15';
    const parsed = parseHash(hash);
    expect(parsed).toEqual({
      p: '25000',
      r: '12',
      y: '15',
    });
  });

  // ── Requirement 5: Parse empty hash ────────────────────────────────────────
  it('5. parses empty hash safely into empty object', () => {
    expect(parseHash('')).toEqual({});
    expect(parseHash('#')).toEqual({});
    expect(parseHash('###')).toEqual({});
    expect(restoreFromHash('', sipSchema).valid).toBe(false);
    expect(restoreFromHash('', sipSchema).values).toEqual({});
  });

  // ── Requirement 6: Parse missing # ─────────────────────────────────────────
  it('6. parses hash without leading # identically to hash with #', () => {
    const withHash = parseHash('#p=25000&r=12');
    const withoutHash = parseHash('p=25000&r=12');
    expect(withHash).toEqual({ p: '25000', r: '12' });
    expect(withoutHash).toEqual({ p: '25000', r: '12' });
  });

  // ── Requirement 7: Round-trip serialize → parse ───────────────────────────
  it('7. round-trip serialize → restore preserves all values', () => {
    const initial = { p: 25000, r: 12, y: 15 };
    const hash = serializeHash(initial);
    const restored = restoreFromHash(hash, sipSchema);

    expect(restored.valid).toBe(true);
    expect(restored.values).toEqual(initial);
  });

  // ── Requirement 8: Numeric values preserved ────────────────────────────────
  it('8. preserves large numeric values with fidelity', () => {
    const schema = { amount: { min: 0 } };
    const restored = restoreFromHash('#amount=10000000', schema);
    expect(restored.valid).toBe(true);
    expect(restored.values.amount).toBe(10000000);
  });

  // ── Requirement 9: Decimal values preserved ────────────────────────────────
  it('9. preserves decimal values with exact precision', () => {
    const restored = restoreFromHash('#p=25.5&r=12.75&y=15', sipSchema);
    expect(restored.valid).toBe(false); // y is 15, r is 12.75, but p=25.5 is below min: 500
    expect(restored.values.r).toBe(12.75);
    expect(restored.values.y).toBe(15);

    const decimalSchema = {
      p: { min: 1, decimal: true },
      r: { min: 0.1, decimal: true },
    };
    const decRestored = restoreFromHash('#p=25.5&r=12.75', decimalSchema);
    expect(decRestored.valid).toBe(true);
    expect(decRestored.values.p).toBe(25.5);
    expect(decRestored.values.r).toBe(12.75);
  });

  // ── Requirement 10: Negative values preserved when schema allows ───────────
  it('10. negative values preserved only when schema specifies negativeAllowed: true', () => {
    const signedSchema = {
      cashFlow: { negativeAllowed: true },
      disallowed: { negativeAllowed: false },
    };

    // Allowed
    const allowed = restoreFromHash('#cashFlow=-5000', signedSchema);
    expect(allowed.valid).toBe(true);
    expect(allowed.values.cashFlow).toBe(-5000);

    // Disallowed
    const disallowed = restoreFromHash('#disallowed=-5000', signedSchema);
    expect(disallowed.valid).toBe(false);
    expect(disallowed.values.disallowed).toBeUndefined();
    expect(disallowed.invalidKeys).toContain('disallowed');
  });

  // ── Requirement 11: Malformed pair handled safely ──────────────────────────
  it('11. handles malformed syntax pairs safely without throwing exceptions', () => {
    const malformedInputs = [
      '#&&&=&&&=',
      '#===',
      '#p=25000&&&r=12',
      '#p=25000&=12&=',
      '#keyWithoutVal',
      '#=valWithoutKey',
      '#%ZZ=malformedPercent',
    ];

    for (const h of malformedInputs) {
      expect(() => parseHash(h)).not.toThrow();
      expect(() => restoreFromHash(h, sipSchema)).not.toThrow();
    }
  });

  // ── Requirement 12: Invalid number handled safely ──────────────────────────
  it('12. handles invalid numeric values safely by rejecting them', () => {
    const res = restoreFromHash('#p=abc&r=12&y=15', sipSchema);
    expect(res.valid).toBe(false);
    expect(res.values.p).toBeUndefined();
    expect(res.invalidKeys).toContain('p');
    // Valid fields are still safely restored
    expect(res.values.r).toBe(12);
    expect(res.values.y).toBe(15);
  });

  // ── Requirement 13: Empty value does not become zero ───────────────────────
  it('13. empty value (#p=) does NOT become zero', () => {
    const res = restoreFromHash('#p=&r=12&y=15', sipSchema);
    expect(res.valid).toBe(false);
    expect(res.values.p).toBeUndefined();
    expect(res.values.p).not.toBe(0);
    expect(res.invalidKeys).toContain('p'); // p is required, so empty fails
  });

  // ── Requirement 14: Validation integration ─────────────────────────────────
  it('14. integrates with centralized validate engine (min/max/integer boundaries)', () => {
    // Below min
    const belowMin = restoreFromHash('#p=100&r=12&y=15', sipSchema);
    expect(belowMin.invalidKeys).toContain('p');

    // Above max
    const aboveMax = restoreFromHash('#p=25000&r=45&y=15', sipSchema);
    expect(aboveMax.invalidKeys).toContain('r');

    // Non-integer tenure
    const nonInt = restoreFromHash('#p=25000&r=12&y=15.5', sipSchema);
    expect(nonInt.invalidKeys).toContain('y');
  });

  // ── Requirement 15: Invalid field ignored/rejected ─────────────────────────
  it('15. invalid field is rejected while reporting invalidKeys', () => {
    const res = restoreFromHash('#p=Infinity&r=12&y=15', sipSchema);
    expect(res.valid).toBe(false);
    expect(res.invalidKeys).toContain('p');
    expect(res.values.p).toBeUndefined();
  });

  // ── Requirement 16: Valid fields restored ──────────────────────────────────
  it('16. valid fields are restored cleanly', () => {
    const res = restoreFromHash('#p=25000&r=12&y=15', sipSchema);
    expect(res.valid).toBe(true);
    expect(res.restoredKeys).toEqual(['p', 'r', 'y']);
    expect(res.values).toEqual({ p: 25000, r: 12, y: 15 });
  });

  // ── Requirement 17: Mixed valid + invalid fields handled safely ────────────
  it('17. handles mixed valid + invalid fields without discarding valid fields', () => {
    const res = restoreFromHash('#p=25000&r=abc&y=15', sipSchema);
    expect(res.valid).toBe(false);
    expect(res.invalidKeys).toEqual(['r']);
    expect(res.restoredKeys).toEqual(['p', 'y']);
    expect(res.values.p).toBe(25000);
    expect(res.values.y).toBe(15);
    expect(res.values.r).toBeUndefined();
  });

  // ── Requirement 18: Special URL characters encoded/decoded ─────────────────
  it('18. encodes and decodes special characters and spaces correctly', () => {
    const state: HashState = {
      'loan type': 'home loan',
      'rate & fee': '8.5',
    };

    const hash = serializeHash(state);
    expect(hash).toContain('loan%20type=home%20loan');
    expect(hash).toContain('rate%20%26%20fee=8.5');

    const parsed = parseHash(hash);
    expect(parsed['loan type']).toBe('home loan');
    expect(parsed['rate & fee']).toBe('8.5');
  });

  // ── Requirement 19: Duplicate keys have deterministic behavior ─────────────
  it('19. resolves duplicate keys deterministically (last key wins)', () => {
    const hash = '#p=1000&p=25000&r=12';
    const parsed = parseHash(hash);
    expect(parsed.p).toBe('25000');

    const res = restoreFromHash(hash, sipSchema);
    expect(res.values.p).toBe(25000);
  });

  // ── Requirement 20: No window/document access at module evaluation ─────────
  it('20. runs pure functions in SSR/Node without window or document', () => {
    // Pure utility functions do not require browser globals
    expect(typeof serializeHash).toBe('function');
    expect(typeof parseHash).toBe('function');
    expect(typeof restoreFromHash).toBe('function');

    expect(readCurrentHash()).toBe('');
  });

  // ── Requirement 21: Input object is not mutated ────────────────────────────
  it('21. does not mutate input state or schema objects', () => {
    const state: HashState = Object.freeze({ p: 25000, r: 12, y: 15 });
    const schema = Object.freeze({
      p: Object.freeze({ required: true, min: 500 }),
    });

    serializeHash(state);
    restoreFromHash('#p=25000', schema);

    expect(state).toEqual({ p: 25000, r: 12, y: 15 });
  });

  // ── Requirement 22: Serialization is deterministic across repeated calls ──
  it('22. produces identical serialization strings across repeated calls', () => {
    const state: HashState = { y: 20, p: 50000, r: 15 };
    const first = serializeHash(state);
    const second = serializeHash(state);
    const third = serializeHash({ r: 15, p: 50000, y: 20 });

    expect(first).toBe(second);
    expect(first).toBe(third);
  });

  // ── Edge Cases from Prompt ─────────────────────────────────────────────────
  describe('Specific Prompt Edge Cases', () => {
    it('handles #p=25000&r=12&y=15', () => {
      const res = restoreFromHash('#p=25000&r=12&y=15', sipSchema);
      expect(res.valid).toBe(true);
      expect(res.values).toEqual({ p: 25000, r: 12, y: 15 });
    });

    it('handles #p=&r=abc&y=15', () => {
      const res = restoreFromHash('#p=&r=abc&y=15', sipSchema);
      expect(res.valid).toBe(false);
      expect(res.invalidKeys).toContain('p');
      expect(res.invalidKeys).toContain('r');
      expect(res.values.y).toBe(15);
      expect(res.values.p).toBeUndefined();
    });

    it('handles formatted numeric string with comma: #p=25,000&r=12&y=15', () => {
      const res = restoreFromHash('#p=25,000&r=12&y=15', sipSchema);
      expect(res.valid).toBe(true);
      expect(res.values.p).toBe(25000);
      expect(res.values.r).toBe(12);
      expect(res.values.y).toBe(15);
    });

    it('rejects Infinity safely: #p=Infinity&r=12&y=15', () => {
      const res = restoreFromHash('#p=Infinity&r=12&y=15', sipSchema);
      expect(res.valid).toBe(false);
      expect(res.invalidKeys).toContain('p');
      expect(res.values.p).toBeUndefined();
      expect(res.values.r).toBe(12);
      expect(res.values.y).toBe(15);
    });

    it('handles negative value against schema: #p=25000&r=-12&y=15', () => {
      // Default sipSchema has negativeAllowed: false
      const res = restoreFromHash('#p=25000&r=-12&y=15', sipSchema);
      expect(res.valid).toBe(false);
      expect(res.invalidKeys).toContain('r');
      expect(res.values.p).toBe(25000);
      expect(res.values.y).toBe(15);
    });

    it('handles decimal values: #p=25.5&r=12.75&y=15', () => {
      const flexibleSchema = {
        p: { min: 1, decimal: true },
        r: { min: 1, decimal: true },
        y: { min: 1, integerOnly: true },
      };
      const res = restoreFromHash('#p=25.5&r=12.75&y=15', flexibleSchema);
      expect(res.valid).toBe(true);
      expect(res.values.p).toBe(25.5);
      expect(res.values.r).toBe(12.75);
      expect(res.values.y).toBe(15);
    });

    it('omits null, undefined, and empty string during serialization', () => {
      const state: HashState = {
        p: 25000,
        r: undefined,
        y: null,
        notes: '',
      };
      expect(serializeHash(state)).toBe('#p=25000');
    });

    it('parseHash overload returns RestoreResult when schema is passed', () => {
      const res = parseHash('#p=25000&r=12&y=15', sipSchema);
      expect(res.valid).toBe(true);
      expect(res.values.p).toBe(25000);
    });
  });

  // ── Browser Runtime Helper Integration ─────────────────────────────────────
  describe('Browser Runtime Helpers', () => {
    const originalWindow = globalThis.window;

    afterEach(() => {
      globalThis.window = originalWindow;
    });

    it('readCurrentHash reads window.location.hash in browser', () => {
      const mockLocation = { hash: '#p=5000' } as Location;
      globalThis.window = { location: mockLocation } as any;

      expect(readCurrentHash()).toBe('#p=5000');
    });

    it('updateHash replaces history state by default', () => {
      const replaceStateMock = vi.fn();
      const mockLocation = {
        pathname: '/sip-calculator',
        search: '',
        hash: '',
      } as unknown as Location;

      globalThis.window = {
        location: mockLocation,
        history: {
          state: null,
          replaceState: replaceStateMock,
        },
      } as any;

      updateHash('#p=25000');
      expect(replaceStateMock).toHaveBeenCalledWith(null, '', '/sip-calculator#p=25000');
    });
  });
});
