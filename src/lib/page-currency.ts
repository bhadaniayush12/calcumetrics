/**
 * page-currency.ts — client helpers for global (non-jurisdiction) calculator pages.
 *
 * Pages render server-side in USD (like mortgage-calculator.astro) and switch symbol,
 * locale and India-only content from CURRENCY_CONFIG at runtime, so no page has to
 * hard-code ₹ / en-IN or lakh formatting.
 *
 * Markup hooks:
 *   [data-inr-only]      shown only when the active currency is INR (India-specific notes)
 *   [data-non-inr-only]  hidden when the active currency is INR
 */

import { CURRENCY_CONFIG, getActiveCurrency, normalizeCurrency, type CurrencyCode } from './currency';

export interface PageCurrency {
  code: CurrencyCode;
  symbol: string;
  locale: string;
}

/** Symbol and locale for a currency code. */
export function pageCurrencyFor(code: unknown): PageCurrency {
  const c = CURRENCY_CONFIG[normalizeCurrency(code)];
  return { code: c.code, symbol: c.symbol, locale: c.locale };
}

/** Symbol and locale for the currency currently in effect on this page. */
export function activePageCurrency(): PageCurrency {
  return pageCurrencyFor(getActiveCurrency());
}

/** Whole-unit money string in the given currency (e.g. $6,000 / ₹1,50,000 / 5.000 €-style grouping with symbol first). */
export function formatPageMoney(n: number, cur: PageCurrency): string {
  const sign = n < 0 ? '-' : '';
  return sign + cur.symbol + new Intl.NumberFormat(cur.locale, { maximumFractionDigits: 0 }).format(Math.abs(Math.round(n)));
}

/** Show/hide India-only and non-India blocks for the active currency. */
export function applyCurrencyVisibility(code: CurrencyCode, root: ParentNode = document): void {
  const isInr = code === 'INR';
  root.querySelectorAll<HTMLElement>('[data-inr-only]').forEach((el) => el.classList.toggle('hidden', !isInr));
  root.querySelectorAll<HTMLElement>('[data-non-inr-only]').forEach((el) => el.classList.toggle('hidden', isInr));
}
