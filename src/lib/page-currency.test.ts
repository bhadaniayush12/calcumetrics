import { describe, expect, it } from 'vitest';
import { formatPageMoney, pageCurrencyFor } from './page-currency';

describe('page-currency', () => {
  it('maps codes to symbol and locale from CURRENCY_CONFIG', () => {
    expect(pageCurrencyFor('USD')).toEqual({ code: 'USD', symbol: '$', locale: 'en-US' });
    expect(pageCurrencyFor('GBP')).toEqual({ code: 'GBP', symbol: '£', locale: 'en-GB' });
    expect(pageCurrencyFor('INR').locale).toBe('en-IN');
  });

  it('formats with the currency grouping (Indian only for INR)', () => {
    expect(formatPageMoney(150000, pageCurrencyFor('USD'))).toBe('$150,000');
    expect(formatPageMoney(150000, pageCurrencyFor('INR'))).toBe('₹1,50,000');
    expect(formatPageMoney(-1234.6, pageCurrencyFor('GBP'))).toBe('-£1,235');
  });
});
