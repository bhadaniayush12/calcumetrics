import { describe, it, expect } from 'vitest';
import {
  formatConvertedToken,
  convertCurrencyString,
  processTextNode,
  CurrencyTokenData,
} from './dynamic-currency-text';

describe('formatConvertedToken', () => {
  it('returns pristine originalRaw when target currency is INR', () => {
    const token: CurrencyTokenData = {
      originalRaw: '₹1,26,14,400',
      sign: '',
      numericValue: 12614400,
      hasRupee: true,
      decLen: 0,
    };
    expect(formatConvertedToken(token, 'INR')).toBe('₹1,26,14,400');

    const compactToken: CurrencyTokenData = {
      originalRaw: '~₹52.6 Lakh',
      sign: '~',
      numericValue: 52.6,
      unit: 'Lakh',
      hasRupee: true,
      decLen: 1,
    };
    expect(formatConvertedToken(compactToken, 'INR')).toBe('~₹52.6 Lakh');
  });

  it('formats full currency amounts into international grouping for USD, EUR, GBP', () => {
    const token1: CurrencyTokenData = {
      originalRaw: '₹25,000',
      sign: '',
      numericValue: 25000,
      hasRupee: true,
      decLen: 0,
    };
    expect(formatConvertedToken(token1, 'USD')).toBe('$25,000');
    expect(formatConvertedToken(token1, 'EUR')).toBe('€25,000');
    expect(formatConvertedToken(token1, 'GBP')).toBe('£25,000');

    const token2: CurrencyTokenData = {
      originalRaw: '₹1,26,14,400',
      sign: '',
      numericValue: 12614400,
      hasRupee: true,
      decLen: 0,
    };
    expect(formatConvertedToken(token2, 'USD')).toBe('$12,614,400');
    expect(formatConvertedToken(token2, 'EUR')).toBe('€12,614,400');

    const token3: CurrencyTokenData = {
      originalRaw: '₹10,00,000',
      sign: '',
      numericValue: 1000000,
      hasRupee: true,
      decLen: 0,
    };
    expect(formatConvertedToken(token3, 'USD')).toBe('$1,000,000');
  });

  it('handles signed currency amounts correctly', () => {
    const negToken: CurrencyTokenData = {
      originalRaw: '-₹1,00,000',
      sign: '-',
      numericValue: 100000,
      hasRupee: true,
      decLen: 0,
    };
    expect(formatConvertedToken(negToken, 'USD')).toBe('-$100,000');

    const posToken: CurrencyTokenData = {
      originalRaw: '+₹20,000',
      sign: '+',
      numericValue: 20000,
      hasRupee: true,
      decLen: 0,
    };
    expect(formatConvertedToken(posToken, 'USD')).toBe('+$20,000');
  });

  it('formats compact units (Crores, Lakhs) accurately into $M and $k', () => {
    const crToken: CurrencyTokenData = {
      originalRaw: '₹1.26 Cr',
      sign: '',
      numericValue: 1.26,
      unit: 'Cr',
      hasRupee: true,
      decLen: 2,
    };
    expect(formatConvertedToken(crToken, 'USD')).toBe('$12.6M');

    const lakhToken: CurrencyTokenData = {
      originalRaw: '~₹52.6 Lakh',
      sign: '~',
      numericValue: 52.6,
      unit: 'Lakh',
      hasRupee: true,
      decLen: 1,
    };
    expect(formatConvertedToken(lakhToken, 'USD')).toBe('~$5.26M');

    const lakhIntToken: CurrencyTokenData = {
      originalRaw: '₹50 Lakh',
      sign: '',
      numericValue: 50,
      unit: 'Lakh',
      hasRupee: true,
      decLen: 0,
    };
    expect(formatConvertedToken(lakhIntToken, 'USD')).toBe('$5M');

    const smallLakhToken: CurrencyTokenData = {
      originalRaw: '₹1.25 Lakh',
      sign: '',
      numericValue: 1.25,
      unit: 'Lakh',
      hasRupee: true,
      decLen: 2,
    };
    expect(formatConvertedToken(smallLakhToken, 'USD')).toBe('$125k');
  });

  it('converts Indian grouping numbers without currency symbol into international grouping', () => {
    const indNum: CurrencyTokenData = {
      originalRaw: '10,00,000',
      sign: '',
      numericValue: 1000000,
      hasRupee: false,
      decLen: 0,
    };
    expect(formatConvertedToken(indNum, 'USD')).toBe('1,000,000');
    expect(formatConvertedToken(indNum, 'INR')).toBe('10,00,000');

    const indNum2: CurrencyTokenData = {
      originalRaw: '1,00,000',
      sign: '',
      numericValue: 100000,
      hasRupee: false,
      decLen: 0,
    };
    expect(formatConvertedToken(indNum2, 'USD')).toBe('100,000');
    expect(formatConvertedToken(indNum2, 'INR')).toBe('1,00,000');
  });
});

describe('convertCurrencyString', () => {
  it('converts complex worked mathematical example text correctly', () => {
    const input = 'Here is how the formula calculates a ₹25,000 monthly SIP at 12% p.a. over 15 years step-by-step:';
    expect(convertCurrencyString(input, 'USD')).toBe(
      'Here is how the formula calculates a $25,000 monthly SIP at 12% p.a. over 15 years step-by-step:'
    );
    expect(convertCurrencyString(input, 'EUR')).toBe(
      'Here is how the formula calculates a €25,000 monthly SIP at 12% p.a. over 15 years step-by-step:'
    );
    expect(convertCurrencyString(input, 'INR')).toBe(input);
  });

  it('converts mathematical multiplication lines and totals', () => {
    const multLine = 'Annuity-due multiplication: 25,000 × (4.995802 / 0.01) × 1.01 = ₹1,26,14,400';
    expect(convertCurrencyString(multLine, 'USD')).toBe(
      'Annuity-due multiplication: 25,000 × (4.995802 / 0.01) × 1.01 = $12,614,400'
    );

    const totals = 'Total Invested: ₹45,00,000 | Wealth Gain: ₹81,14,400';
    expect(convertCurrencyString(totals, 'USD')).toBe(
      'Total Invested: $4,500,000 | Wealth Gain: $8,114,400'
    );
  });

  it('converts inflation misconception with compact units', () => {
    const text = 'A ₹1.26 Cr corpus 15 years from now has a real purchasing power of ~₹52.6 Lakh at 6% inflation.';
    expect(convertCurrencyString(text, 'USD')).toBe(
      'A $12.6M corpus 15 years from now has a real purchasing power of ~$5.26M at 6% inflation.'
    );
    expect(convertCurrencyString(text, 'INR')).toBe(text);
  });

  it('converts formulas with Indian grouping numbers and rupee results', () => {
    const text = 'Numerator: (10,00,000 × 0.00708333 × 5.42095) / (5.42095 − 1) ≈ ₹8,678';
    expect(convertCurrencyString(text, 'USD')).toBe(
      'Numerator: (1,000,000 × 0.00708333 × 5.42095) / (5.42095 − 1) ≈ $8,678'
    );
  });

  it('converts worked example headings and loan parameters', () => {
    const heading = 'Worked example: ₹50 Lakh property, 20% down payment, 8.5% p.a. for 20 years';
    expect(convertCurrencyString(heading, 'USD')).toBe(
      'Worked example: $5M property, 20% down payment, 8.5% p.a. for 20 years'
    );
  });

  it('converts ledger tables with signed amounts', () => {
    const line = 'Outflow: -₹1,00,000, Profit: +₹20,000, Valuation: +₹1,85,000';
    expect(convertCurrencyString(line, 'USD')).toBe(
      'Outflow: -$100,000, Profit: +$20,000, Valuation: +$185,000'
    );
  });
});

describe('processTextNode with mock document', () => {
  it('splits text into text nodes and span elements with data attributes', () => {
    const createdElements: any[] = [];
    (global as any).document = {
      createTextNode: (val: string) => ({
        nodeType: 3,
        nodeValue: val,
      }),
      createElement: (tag: string) => {
        const el: any = {
          nodeType: 1,
          tagName: tag.toUpperCase(),
          attributes: {} as Record<string, string>,
          setAttribute: (k: string, v: string) => {
            el.attributes[k] = v;
          },
          getAttribute: (k: string) => el.attributes[k],
          textContent: '',
        };
        createdElements.push(el);
        return el;
      },
    };

    const mockTextNode: any = {
      nodeType: 3,
      nodeValue: 'Multiplication: 25,000 × (4.995802 / 0.01) × 1.01 = ₹1,26,14,400',
    };

    const fragments = processTextNode(mockTextNode);

    expect(fragments).not.toBeNull();
    expect(fragments.length).toBe(2); // text before + 1 span
    expect(fragments[0].nodeValue).toBe('Multiplication: 25,000 × (4.995802 / 0.01) × 1.01 = ');
    expect(fragments[1].getAttribute('data-cm-currency-text')).toBe('true');
    expect(fragments[1].getAttribute('data-cm-orig')).toBe('₹1,26,14,400');

    const data = JSON.parse(fragments[1].getAttribute('data-cm-data'));
    expect(data.numericValue).toBe(12614400);
    expect(data.hasRupee).toBe(true);
  });
});

