import { afterEach, describe, expect, it, vi } from 'vitest';
import { Window } from 'happy-dom';
import { initDOMCurrencyText, updateAllCurrencySpans, processTextNode, INDIA_CURRENCY_NOTICE, EXAMPLE_CURRENCY_NOTICE } from './dynamic-currency-text';

export function mount(html: string, path = '/example') {
  const window = new Window({ url: `https://calcumetrics.com${path}` });
  window.document.write(html);
  vi.stubGlobal('window', window);
  vi.stubGlobal('document', window.document);
  vi.stubGlobal('NodeFilter', window.NodeFilter);
  return window;
}

afterEach(() => vi.unstubAllGlobals());

describe('currency DOM locks and notices', () => {
  it.each(['USD', 'EUR', 'GBP'] as const)('leaves the entire locked subtree untouched in %s', code => {
    const w = mount('<main><article data-currency-lock="INR" data-currency-article="india"><h1>₹1,000</h1><table><tr><td>₹5,00,000</td></tr></table><details><summary>Fee?</summary>₹1,31,407</details><p data-currency-prefix>₹</p></article></main>');
    const article = w.document.querySelector('article')!;
    const original = article.innerHTML;
    initDOMCurrencyText(code);
    expect(article.querySelector('[data-cm-currency-text]')).toBeNull();
    const notice = article.querySelector<HTMLElement>('[data-currency-notice]')!;
    expect(notice.textContent).toBe(INDIA_CURRENCY_NOTICE);
    expect(notice.hidden).toBe(false);
    notice.remove();
    expect(article.innerHTML).toBe(original);
  });

  it('swaps general examples, restores INR, and toggles exactly one notice', () => {
    const w = mount('<main><p>Example ₹5,00,000 and ₹50 Lakh.</p></main>');
    const root = w.document.querySelector('main')!;
    initDOMCurrencyText('INR');
    const notice = root.querySelector<HTMLElement>('[data-currency-notice]')!;
    expect(notice.hidden).toBe(true);
    expect(notice.textContent).toBe(EXAMPLE_CURRENCY_NOTICE);
    const walk = vi.spyOn(w.document, 'createTreeWalker');
    for (const [code, expected] of [['USD', '$500,000 and $5M'], ['EUR', '€500,000 and €5M'], ['GBP', '£500,000 and £5M']] as const) {
      initDOMCurrencyText(code);
      expect(root.textContent).toContain(expected);
      expect(notice.hidden).toBe(false);
    }
    updateAllCurrencySpans('INR');
    expect(root.textContent).toContain('₹5,00,000 and ₹50 Lakh');
    expect(notice.hidden).toBe(true);
    expect(root.querySelectorAll('[data-currency-notice]')).toHaveLength(1);
    expect(root.querySelectorAll('[data-cm-currency-text]')).toHaveLength(2);
    expect(root.querySelectorAll('[data-cm-currency-text] [data-cm-currency-text]')).toHaveLength(0);
    expect(walk).not.toHaveBeenCalled();
  });

  it('hides the India notice on INR and restores it on another switch', () => {
    const w = mount('<main><article data-currency-article="india" data-currency-lock="INR">₹1,000</article></main>');
    initDOMCurrencyText('USD');
    const notice = w.document.querySelector<HTMLElement>('[data-currency-notice]')!;
    initDOMCurrencyText('INR');
    expect(notice.hidden).toBe(true);
    initDOMCurrencyText('GBP');
    expect(notice.hidden).toBe(false);
    expect(w.document.querySelectorAll('[data-currency-notice]')).toHaveLength(1);
  });

  it('respects a lock added after indexing, including direct text processing', () => {
    const w = mount('<main><section>₹1,000</section></main>');
    initDOMCurrencyText('INR');
    const section = w.document.querySelector('section')!;
    section.setAttribute('data-currency-lock', 'INR');
    updateAllCurrencySpans('USD');
    expect(section.textContent).toBe('₹1,000');
    expect(processTextNode(section.querySelector('span')!.firstChild as unknown as Text)).toBeNull();
  });

  it.each(['/in/example', '/us/example', '/uk/example'])('preserves jurisdiction route %s', path => {
    const w = mount('<main>₹1,000</main>', path);
    initDOMCurrencyText('USD');
    expect(w.document.querySelector('main')!.innerHTML).toBe('₹1,000');
    expect(w.document.querySelector('[data-currency-notice]')).toBeNull();
  });
});
