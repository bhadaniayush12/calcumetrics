import { describe, it, expect } from 'vitest';
import {
  formatIndian,
  formatIntl,
  formatPercent,
  formatLiveInput,
  parseFormattedNumber,
  parseSmartInput,
  formatIndianCompact,
  formatIndianWords,
  formatCompactCurrency,
  formatDisplayDate,
} from './formatters';

describe('formatters', () => {
  describe('formatIndian', () => {
    it('formats numbers with Indian grouping', () => {
      expect(formatIndian(12614400)).toBe('1,26,14,400');
      expect(formatIndian(100000)).toBe('1,00,000');
      expect(formatIndian(25000)).toBe('25,000');
    });
  });

  describe('formatIndianCompact', () => {
    it('formats Crores correctly', () => {
      expect(formatIndianCompact(12614400)).toBe('₹1.26 Cr');
      expect(formatIndianCompact(10000000)).toBe('₹1 Cr');
      expect(formatIndianCompact(250000000)).toBe('₹25 Cr');
    });

    it('formats Lakhs correctly', () => {
      expect(formatIndianCompact(8114400)).toBe('₹81.14 Lakh');
      expect(formatIndianCompact(100000)).toBe('₹1 Lakh');
      expect(formatIndianCompact(4500000)).toBe('₹45 Lakh');
    });

    it('formats amounts under 1 Lakh with standard Indian grouping', () => {
      expect(formatIndianCompact(25000)).toBe('₹25,000');
      expect(formatIndianCompact(500)).toBe('₹500');
    });

    it('handles negative numbers', () => {
      expect(formatIndianCompact(-12614400)).toBe('-₹1.26 Cr');
      expect(formatIndianCompact(-500000)).toBe('-₹5 Lakh');
    });
  });

  describe('formatIndianWords', () => {
    it('formats numbers with full words (Crore / Lakh)', () => {
      expect(formatIndianWords(12614400)).toBe('₹1.26 Crore');
      expect(formatIndianWords(8114400)).toBe('₹81.14 Lakh');
      expect(formatIndianWords(25000)).toBe('₹25,000');
    });
  });

  describe('formatCompactCurrency', () => {
    it('formats INR using Indian compact notation', () => {
      expect(formatCompactCurrency(12614400, 'INR')).toBe('₹1.26 Cr');
      expect(formatCompactCurrency(8114400, 'INR')).toBe('₹81.14 Lakh');
    });

    it('formats USD using international compact notation', () => {
      expect(formatCompactCurrency(1261440, 'USD')).toBe('$1.26M');
      expect(formatCompactCurrency(25000, 'USD')).toBe('$25K');
    });
  });

  describe('formatLiveInput & parseFormattedNumber', () => {
    it('handles live input typing', () => {
      expect(formatLiveInput('25000', 'indian')).toBe('25,000');
      expect(formatLiveInput('12614400', 'indian')).toBe('1,26,14,400');
    });

    it('parses formatted string back to float', () => {
      expect(parseFormattedNumber('1,26,14,400')).toBe(12614400);
      expect(parseFormattedNumber('25,000')).toBe(25000);
    });
  });

  describe('formatDisplayDate', () => {
    it('converts ISO YYYY-MM-DD into human-friendly format (DD Mon YYYY)', () => {
      expect(formatDisplayDate('2026-09-24')).toBe('24 Sep 2026');
      expect(formatDisplayDate('2026-05-15')).toBe('15 May 2026');
      expect(formatDisplayDate('2026-01-01')).toBe('1 Jan 2026');
    });

    it('gracefully handles empty or malformed strings', () => {
      expect(formatDisplayDate('')).toBe('');
      expect(formatDisplayDate('invalid')).toBe('invalid');
    });
  });

  describe('parseSmartInput (Item 17 & Item 21)', () => {
    describe('Item 17 — Shorthand Multipliers', () => {
      it('parses k/K as thousands (x1,000)', () => {
        expect(parseSmartInput('55k')).toBe(55000);
        expect(parseSmartInput('55K')).toBe(55000);
        expect(parseSmartInput('1.5k')).toBe(1500);
        expect(parseSmartInput('500 k')).toBe(500000);
      });

      it('parses m/M as millions (x1,000,000)', () => {
        expect(parseSmartInput('1.5m')).toBe(1500000);
        expect(parseSmartInput('10M')).toBe(10000000);
        expect(parseSmartInput('0.5m')).toBe(500000);
      });

      it('parses b/B as billions (x1,000,000,000)', () => {
        expect(parseSmartInput('2b')).toBe(2000000000);
        expect(parseSmartInput('1.5B')).toBe(1500000000);
      });

      it('parses l/L/lakh/lac as lakhs (x100,000)', () => {
        expect(parseSmartInput('10l')).toBe(1000000);
        expect(parseSmartInput('10L')).toBe(1000000);
        expect(parseSmartInput('50 lakh')).toBe(5000000);
        expect(parseSmartInput('50lakh')).toBe(5000000);
        expect(parseSmartInput('50 lakhs')).toBe(5000000);
        expect(parseSmartInput('2.5 lac')).toBe(250000);
        expect(parseSmartInput('2.5 lacs')).toBe(250000);
      });

      it('parses cr/Cr/crore as crores (x10,000,000)', () => {
        expect(parseSmartInput('1.5cr')).toBe(15000000);
        expect(parseSmartInput('1.5Cr')).toBe(15000000);
        expect(parseSmartInput('2 crore')).toBe(20000000);
        expect(parseSmartInput('2.5 crores')).toBe(25000000);
      });

      it('handles currency symbols and signs with shorthand', () => {
        expect(parseSmartInput('₹55k')).toBe(55000);
        expect(parseSmartInput('$1.5M')).toBe(1500000);
        expect(parseSmartInput('€500k')).toBe(500000);
        expect(parseSmartInput('£2m')).toBe(2000000);
        expect(parseSmartInput('-55k')).toBe(-55000);
        expect(parseSmartInput('-$1.5M')).toBe(-1500000);
        expect(parseSmartInput('-₹10L')).toBe(-1000000);
      });
    });

    describe('Item 21 — European Decimal Notation', () => {
      it('treats single comma with no dot as decimal point', () => {
        expect(parseSmartInput('4,5')).toBe(4.5);
        expect(parseSmartInput('4,5%')).toBe(4.5);
        expect(parseSmartInput('12,75')).toBe(12.75);
        expect(parseSmartInput('0,25')).toBe(0.25);
        expect(parseSmartInput('8,5%')).toBe(8.5);
      });

      it('parses European dot-thousand and comma-decimal (1.000,50 -> 1000.50)', () => {
        expect(parseSmartInput('1.000,50')).toBe(1000.5);
        expect(parseSmartInput('1.234.567,89')).toBe(1234567.89);
        expect(parseSmartInput('€1.000,50')).toBe(1000.5);
      });

      it('parses single comma as decimal when activeCurrency is EUR', () => {
        expect(parseSmartInput('1000,50', 'EUR')).toBe(1000.5);
        expect(parseSmartInput('50,00', 'EUR')).toBe(50);
        expect(parseSmartInput('50,000', 'EUR')).toBe(50000);
      });

      it('parses standard thousand comma in non-EUR mode', () => {
        expect(parseSmartInput('50,000')).toBe(50000);
        expect(parseSmartInput('1,000.50')).toBe(1000.5);
        expect(parseSmartInput('10,00,000')).toBe(1000000);
      });

      it('combines European decimal comma with shorthand multipliers', () => {
        expect(parseSmartInput('1,5k')).toBe(1500);
        expect(parseSmartInput('1,5m')).toBe(1500000);
        expect(parseSmartInput('1,5cr')).toBe(15000000);
      });
    });

    describe('Edge cases & Fallbacks', () => {
      it('returns null for empty, whitespace, or invalid strings', () => {
        expect(parseSmartInput('')).toBeNull();
        expect(parseSmartInput('   ')).toBeNull();
        expect(parseSmartInput('abc')).toBeNull();
        expect(parseSmartInput('xyz123')).toBeNull();
        expect(parseSmartInput('1.2.3.4')).toBeNull();
      });

      it('handles numeric input passthrough', () => {
        expect(parseSmartInput(55000)).toBe(55000);
        expect(parseSmartInput(0)).toBe(0);
        expect(parseSmartInput(-0)).toBe(0);
      });

      it('handles zero correctly', () => {
        expect(parseSmartInput('0')).toBe(0);
        expect(parseSmartInput('0,0')).toBe(0);
        expect(parseSmartInput('0.0')).toBe(0);
      });
    });
  });
});
