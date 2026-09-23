import { describe, it, expect } from 'vitest';
import {
  formatIndian,
  formatIntl,
  formatPercent,
  formatLiveInput,
  parseFormattedNumber,
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
});
