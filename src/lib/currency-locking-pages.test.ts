import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { Window } from 'happy-dom';
import { buildSync } from 'esbuild';
import { resolve } from 'node:path';
import { BLOG_POSTS } from '../data/blog/posts';
import { initDOMCurrencyText } from './dynamic-currency-text';
import { applyCurrencyVisibility } from './page-currency';

let activeWindow: Window | undefined;
let dscrClient = '';
function closeWindow() {
  activeWindow?.document.replaceChildren();
  activeWindow?.close();
  activeWindow = undefined;
}

beforeAll(() => {
  // Exercise real Astro routes, including the shared article template and FAQs.
  execFileSync('npm', ['run', 'build'], { stdio: 'pipe', timeout: 120_000 });
  const source = readFileSync('src/pages/dscr-calculator.astro', 'utf8');
  dscrClient = buildSync({ stdin: { contents: source.slice(source.lastIndexOf('<script>') + 8, source.lastIndexOf('</script>')), resolveDir: resolve('src/pages'), loader: 'ts' }, bundle: true, write: false, format: 'iife' }).outputFiles[0].text;
}, 120_000);
afterEach(() => { closeWindow(); vi.unstubAllGlobals(); });

function render(path: string) {
  closeWindow();
  const html = readFileSync(`dist/${path}.html`, 'utf8');
  const w = new Window({ url: `https://calcumetrics.com/${path}` });
  // Parse the real rendered main and schema, omitting unrelated navigation/assets.
  w.document.body.innerHTML = (html.match(/<main\b[\s\S]*?<\/main>/)?.[0] || '<main></main>')
    + [...html.matchAll(/<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g)].map(m => m[0]).join('');
  activeWindow = w;
  vi.stubGlobal('window', w);
  vi.stubGlobal('document', w.document);
  vi.stubGlobal('NodeFilter', w.NodeFilter);
  return w;
}

describe('built Astro currency locking', () => {
  it.each([
    ['itr-due-date-21-november-2026-late-fee-interest', ['₹1,000', '₹5,00,000']],
    ['rbi-repo-rate-5-50-fd-returns-october-2026', ['₹1,31,407']],
  ])('retains factual INR amounts on /blog/%s in USD mode', (slug, amounts) => {
    const w = render(`blog/${slug}`);
    const article = w.document.querySelector('main > article')!;
    const before = article.textContent;
    const jsonld = w.document.querySelector('script[type="application/ld+json"]')!.textContent;
    initDOMCurrencyText('USD');
    for (const amount of amounts) expect(article.textContent).toContain(amount);
    expect(article.textContent).not.toContain('$');
    expect(article.getAttribute('data-currency-lock')).toBe('INR');
    const notice = article.querySelector('[data-currency-notice]')!;
    notice.remove();
    expect(article.textContent).toBe(before);
    expect(w.document.querySelector('script[type="application/ld+json"]')!.textContent).toBe(jsonld);
  });

  it('locks every India badge article using the same market field', () => {
    for (const post of BLOG_POSTS.filter(p => p.market === 'India-Only')) {
      const w = render(`blog/${post.slug}`);
      const article = w.document.querySelector('main > article')!;
      expect(article.textContent).toContain('🇮🇳 India-Specific');
      expect(article.getAttribute('data-currency-lock')).toBe('INR');
    }
  });

  it('keeps every explicit lock byte-for-byte intact across all built global pages', () => {
    for (const file of readdirSync('dist').filter(f => f.endsWith('.html'))) {
      const w = render(file.slice(0, -5));
      const locks = [...w.document.querySelectorAll('[data-currency-lock]')];
      const originals = locks.map(el => el.innerHTML);
      initDOMCurrencyText('USD');
      locks.forEach((el, i) => expect(el.innerHTML, `${file}: ${el.outerHTML.slice(0, 100)}`).toBe(originals[i]));
    }
  });

  it.each([
    ['methodology', '#income-tax'], ['methodology', '#gst'],
    ['taxes', '[data-currency-lock]'], ['about', '[data-currency-lock]'],
    ['fd-calculator', '[aria-labelledby="fd-faq"]'],
    ['rd-calculator', '[aria-labelledby="rd-calculator-faq"]'],
    ['sip-calculator', '[aria-labelledby="sip-faq"]'],
    ['home-loan-calculator', '[aria-labelledby="home-loan-calculator-faq"]'],
  ])('retains statutory text on /%s %s', (path, selector) => {
    const w = render(path);
    const block = w.document.querySelector(selector)!;
    expect(block.closest('[data-currency-lock]')).not.toBeNull();
    const before = block.innerHTML;
    initDOMCurrencyText('USD');
    expect(block.innerHTML).toBe(before);
  });

  it('keeps mixed articles unlocked while protecting their Indian sections and FAQs', () => {
    for (const post of BLOG_POSTS.filter(p => p.market === 'Both')) {
      const w = render(`blog/${post.slug}`);
      const article = w.document.querySelector('main > article')!;
      expect(article.hasAttribute('data-currency-lock'), post.slug).toBe(false);
      const locks = [...article.querySelectorAll('[data-currency-lock]')];
      expect(locks.length, post.slug).toBeGreaterThan(0);
      const originals = locks.map(el => el.innerHTML);
      initDOMCurrencyText('USD');
      locks.forEach((el, i) => expect(el.innerHTML, post.slug).toBe(originals[i]));
      expect(article.querySelectorAll('.article-body > :not([data-currency-lock])').length, post.slug).toBeGreaterThan(0);
    }
  });

  it('never rewrites Indian legal amounts found during the whole-site paragraph audit', () => {
    const paths = [
      ...readdirSync('dist').filter(f => f.endsWith('.html')).map(f => f.slice(0, -5)),
      ...BLOG_POSTS.map(p => `blog/${p.slug}`),
    ];
    const indianRule = /(?:Section\s+(?:194|24|80|87|115)|\b(?:TDS|GST|LTCG|STCG|DICGC|PPF|EPF|RBI|SEBI|CBDT)\b|Income.tax Act|tax regime|Indian.*(?:tax|rate|rule))/i;
    for (const path of paths) {
      const w = render(path);
      const blocks = [...w.document.querySelectorAll('main p, main li, main details')]
        .filter(el => el.textContent.includes('₹') && indianRule.test(el.textContent));
      const originals = blocks.map(el => el.textContent);
      initDOMCurrencyText('USD');
      blocks.forEach((el, i) => expect(el.textContent, `${path}: ${originals[i].slice(0, 120)}`).toBe(originals[i]));
    }
  });

  it('renders the same FAQ answers as JSON-LD on all non-jurisdiction pages', () => {
    const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();
    const paths = [
      ...readdirSync('dist').filter(f => f.endsWith('.html')).map(f => f.slice(0, -5)),
      ...BLOG_POSTS.map(p => `blog/${p.slug}`),
    ];
    for (const path of paths) {
      const w = render(path);
      const details = [...w.document.querySelectorAll('main details')];
      for (const script of w.document.querySelectorAll('script[type="application/ld+json"]')) {
        const json = JSON.parse(script.textContent);
        const schemas = [...(json['@graph'] || []), json].filter(entry => entry['@type'] === 'FAQPage');
        for (const schema of schemas) for (const faq of schema.mainEntity) {
          const detail = details.find(d => normalize(d.querySelector('summary')?.textContent || '') === normalize(faq.name));
          // Some index pages intentionally have schema FAQs without an accordion.
          if (!detail) continue;
          const visible = [...detail.childNodes].filter(n => n !== detail.querySelector('summary')).map(n => n.textContent).join('');
          const text = w.document.createElement('div');
          text.innerHTML = faq.acceptedAnswer.text;
          expect(normalize(visible), `${path}: ${faq.name}`).toBe(normalize(text.textContent));
        }
      }
    }
  });

  it.each(['INR', 'USD', 'EUR', 'GBP'] as const)('keeps DSCR a currency-free ratio in %s', code => {
    const w = render('dscr-calculator');
    initDOMCurrencyText(code);
    const text = w.document.querySelector('#dscr-plain-translation')!.textContent;
    expect(text).toContain('1.50× the operating income');
    expect(text).not.toMatch(/[₹$€£]/);
    // Execute the real calculator script and trigger its currency/recalculation path.
    w.happyDOM.settings.enableJavaScriptEvaluation = true;
    w.eval(dscrClient);
    const noi = w.document.querySelector<HTMLInputElement>('#dscr-noi')!;
    const debt = w.document.querySelector<HTMLInputElement>('#dscr-debt')!;
    noi.value = '1250000';
    debt.value = '1000000';
    const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
    w.dispatchEvent(new w.CustomEvent('cm:currency-change', { detail: { code, symbol: symbols[code] } }));
    const live = w.document.querySelector('#dscr-plain-translation')!.textContent;
    expect(live).toContain('1.25× the operating income');
    expect(live).not.toMatch(/[₹$€£]/);
    noi.value = '750000';
    w.document.querySelector<HTMLButtonElement>('#dscr-calculate')!.click();
    const shortfall = w.document.querySelector('#dscr-plain-translation')!.textContent;
    expect(shortfall).toContain('0.75× the amount');
    expect(shortfall).not.toMatch(/[₹$€£]/);
  });

  it('hides the India-only home loan tax note in USD and never converts its limits', () => {
    const w = render('home-loan-calculator');
    // Same steps as Header.applyCurrency on a non-jurisdiction route.
    initDOMCurrencyText('USD');
    applyCurrencyVisibility('USD');
    const main = w.document.querySelector('main')!;
    expect(main.textContent).not.toContain('$150k');
    expect(main.textContent).not.toContain('$200k');
    const notes = [...main.querySelectorAll('[role="status"]')].filter(el => el.textContent.includes('Section 80C'));
    expect(notes.length).toBe(1);
    const note = notes[0];
    expect(note.closest('.hidden')).not.toBeNull();
    expect(note.textContent).toContain('₹1.5L');
    expect(note.textContent).toContain('₹2L/year');
    applyCurrencyVisibility('INR');
    expect(note.closest('.hidden')).toBeNull();
  });

  it('swaps unlocked calculator examples and shows their notice', () => {
    const w = render('sip-calculator');
    initDOMCurrencyText('USD');
    expect(w.document.querySelector('[data-currency-notice="examples"]')).not.toBeNull();
    expect(w.document.querySelector('main')!.textContent).toContain('$');
  });
});
