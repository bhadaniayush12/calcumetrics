/**
 * dynamic-currency-text.ts
 *
 * Universal dynamic currency formatting for educational content, worked mathematical
 * examples, limitations, formula steps, and static tables across global calculators.
 *
 * Automatically localizes static INR (₹, Lakh, Crore, Indian grouping) to the active
 * currency (USD $, EUR €, GBP £) while preserving original values on INR switch.
 *
 * Invariants:
 *   - Strictly skips jurisdiction-locked routes (/in/*, /us/*, /uk/*).
 *   - Zero FX conversions: display/grouping formatting only.
 *   - SSR safe: all DOM operations guarded by window/document checks.
 *   - Respects data-currency-lock on any ancestor; statutory amounts stay factual.
 *   - Indexes once per mounted main/root, updates cached spans in O(N) on change.
 */

import type { CurrencyCode } from './currency';
import { isJurisdictionLocked } from './currency';

export interface CurrencyTokenData {
  originalRaw: string;
  sign: string;
  numericValue: number;
  unit?: string;
  hasRupee: boolean;
  hasDollar?: boolean;
  decLen: number;
}

// Matches rupee and dollar expressions like: ₹25,000, $400,000, ₹1,26,14,400, ₹50 Lakh, ~₹52.6 Lakh, -₹1,00,000, +₹20,000
export const RUPEE_TOKEN_REGEX = /([-+~–−]?)(₹|\$)\s*([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?)(?:\s*(Crores?|Cr|Lakhs?|L|k|K|m|M|b|B))?\b/gi;

// Matches standalone Indian grouping numbers (e.g. 10,00,000 or 1,00,000) not preceded by currency or word char
export const INDIAN_NUM_TOKEN_REGEX = /(?<![₹$€£\w])\b(\d{1,2}(?:,\d{2})+(?:,\d{3})(?:\.\d+)?)\b/g;

/**
 * Converts a parsed currency token data object into formatted string for target currency.
 */
export function formatConvertedToken(
  data: CurrencyTokenData,
  targetCode: CurrencyCode
): string {
  if (data.hasDollar) {
    if (targetCode === 'USD') {
      return data.originalRaw;
    }
    const symMap: Record<CurrencyCode, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
    };
    const sym = symMap[targetCode] || '$';

    if (data.unit) {
      const u = data.unit.toLowerCase();
      const mult = u.startsWith('b') ? 1e9 : (u.startsWith('m') ? 1e6 : (u.startsWith('k') ? 1e3 : 1));
      const totalVal = data.numericValue * mult;
      let formattedUnit = '';
      if (targetCode === 'INR') {
        if (totalVal >= 10_000_000) {
          formattedUnit = `${sym}${(totalVal / 10_000_000).toFixed(2).replace(/\.?0+$/, '')} Cr`;
        } else if (totalVal >= 100_000) {
          formattedUnit = `${sym}${(totalVal / 100_000).toFixed(2).replace(/\.?0+$/, '')} Lakh`;
        } else {
          formattedUnit = `${sym}${new Intl.NumberFormat('en-IN').format(totalVal)}`;
        }
      } else {
        if (totalVal >= 1_000_000) {
          formattedUnit = `${sym}${(totalVal / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M`;
        } else if (totalVal >= 1_000) {
          formattedUnit = `${sym}${(totalVal / 1_000).toFixed(2).replace(/\.?0+$/, '')}k`;
        } else {
          formattedUnit = `${sym}${totalVal}`;
        }
      }
      return data.sign ? `${data.sign}${formattedUnit}` : formattedUnit;
    }

    const rounded = data.decLen > 0 ? data.numericValue.toFixed(data.decLen) : Math.round(data.numericValue).toString();
    const parts = rounded.split('.');
    const intPart = targetCode === 'INR'
      ? new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(parseInt(parts[0], 10))
      : parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const formattedNum = parts.length > 1 ? `${intPart}.${parts[1]}` : intPart;

    if (data.sign === '-' || data.sign === '–' || data.sign === '−') {
      return `-${sym}${formattedNum}`;
    } else if (data.sign) {
      return `${data.sign}${sym}${formattedNum}`;
    }
    return `${sym}${formattedNum}`;
  }

  if (targetCode === 'INR') {
    return data.originalRaw;
  }

  const symMap: Record<CurrencyCode, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
  };
  const sym = symMap[targetCode] || '$';

  if (data.unit) {
    const u = data.unit.toLowerCase();
    const multiplier = u.startsWith('cr') ? 10_000_000 : (u.startsWith('l') ? 100_000 : 1_000);
    const totalVal = data.numericValue * multiplier;

    let formattedUnit = '';
    if (totalVal >= 1_000_000) {
      const m = totalVal / 1_000_000;
      const mStr = m.toFixed(2).replace(/\.?0+$/, '');
      formattedUnit = `${sym}${mStr}M`;
    } else if (totalVal >= 1_000) {
      const k = totalVal / 1_000;
      const kStr = k.toFixed(2).replace(/\.?0+$/, '');
      formattedUnit = `${sym}${kStr}k`;
    } else {
      formattedUnit = `${sym}${totalVal}`;
    }

    return data.sign ? `${data.sign}${formattedUnit}` : formattedUnit;
  }

  if (data.hasRupee) {
    const rounded = data.decLen > 0 ? data.numericValue.toFixed(data.decLen) : Math.round(data.numericValue).toString();
    const parts = rounded.split('.');
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const formattedNum = parts.length > 1 ? `${intPart}.${parts[1]}` : intPart;

    if (data.sign === '-' || data.sign === '–' || data.sign === '−') {
      return `-${sym}${formattedNum}`;
    } else if (data.sign) {
      return `${data.sign}${sym}${formattedNum}`;
    }
    return `${sym}${formattedNum}`;
  } else {
    // Number only (Indian grouping replaced by international 3-digit comma grouping)
    const rounded = data.decLen > 0 ? data.numericValue.toFixed(data.decLen) : Math.round(data.numericValue).toString();
    const parts = rounded.split('.');
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.length > 1 ? `${intPart}.${parts[1]}` : intPart;
  }
}

/**
 * Pure string converter: transforms all rupee and dollar tokens and Indian grouping numbers
 * in a string into the target currency representation.
 */
export function convertCurrencyString(text: string, targetCode: CurrencyCode): string {
  if (!text) return '';
  if (targetCode === 'INR' && !text.includes('$')) return text;

  const COMBINED_REGEX = /([-+~–−]?)(₹|\$)\s*([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?)(?:\s*(Crores?|Cr|Lakhs?|L|k|K|m|M|b|B))?\b|(?<![₹$€£\w])\b(\d{1,2}(?:,\d{2})+(?:,\d{3})(?:\.\d+)?)\b/gi;

  return text.replace(COMBINED_REGEX, (fullMatch, sign, currSym, rawNum, unit, indNum) => {
    if (currSym === '₹' || currSym === '$') {
      const cleanNum = parseFloat(rawNum.replace(/,/g, ''));
      const decLen = rawNum.includes('.') ? rawNum.split('.')[1].length : 0;
      return formatConvertedToken(
        {
          originalRaw: fullMatch,
          sign: sign || '',
          numericValue: cleanNum,
          unit,
          hasRupee: currSym === '₹',
          hasDollar: currSym === '$',
          decLen,
        },
        targetCode
      );
    } else if (indNum) {
      const cleanNum = parseFloat(indNum.replace(/,/g, ''));
      const decLen = indNum.includes('.') ? indNum.split('.')[1].length : 0;
      return formatConvertedToken(
        {
          originalRaw: fullMatch,
          sign: '',
          numericValue: cleanNum,
          hasRupee: false,
          hasDollar: false,
          decLen,
        },
        targetCode
      );
    }
    return fullMatch;
  });
}

/**
 * Checks whether an element should be skipped during DOM scanning.
 */
export function shouldSkipElement(el: Element): boolean {
  const tag = el.tagName;
  if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'SELECT'].includes(tag)) {
    return true;
  }
  if (
    el.closest(
      'form, [data-calculator-form], #header-currency-menu, #current-currency-btn, #mobile-currency-select, #control-center-popover, #search-modal, [data-currency-lock], [data-currency-notice], [data-no-dynamic-currency], [data-preserve-currency], [data-jurisdiction-locked], [data-jurisdiction="IN"], [data-jurisdiction="US"], [data-jurisdiction="UK"]'
    )
  ) {
    return true;
  }
  if (
    el.hasAttribute('data-currency-prefix') ||
    el.hasAttribute('data-preset-chip') ||
    el.hasAttribute('data-cm-currency-text') ||
    el.hasAttribute('data-no-dynamic-currency')
  ) {
    return true;
  }
  return false;
}

/**
 * Splits a text node containing currency/Indian numbers into text and span nodes.
 */
export function processTextNode(node: Text): Node[] | null {
  if (node.parentElement && shouldSkipElement(node.parentElement)) return null;
  const text = node.nodeValue;
  if (!text || (!text.includes('₹') && !text.includes('$') && !/\d,\d{2},\d{3}/.test(text))) {
    return null;
  }

  const COMBINED_REGEX = /([-+~–−]?)(₹|\$)\s*([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?)(?:\s*(Crores?|Cr|Lakhs?|L|k|K|m|M|b|B))?\b|(?<![₹$€£\w])\b(\d{1,2}(?:,\d{2})+(?:,\d{3})(?:\.\d+)?)\b/gi;

  const fragments: Node[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = COMBINED_REGEX.exec(text)) !== null) {
    const matchStart = match.index;
    const matchEnd = COMBINED_REGEX.lastIndex;

    // Add text before match
    if (matchStart > lastIndex) {
      fragments.push(document.createTextNode(text.substring(lastIndex, matchStart)));
    }

    const fullMatch = match[0];
    let tokenData: CurrencyTokenData;

    if (match[2] === '₹' || match[2] === '$') {
      // Rupee or Dollar match
      const sign = match[1] || '';
      const rawNum = match[3];
      const unit = match[4];
      const cleanNum = parseFloat(rawNum.replace(/,/g, ''));
      const decLen = rawNum.includes('.') ? rawNum.split('.')[1].length : 0;

      tokenData = {
        originalRaw: fullMatch,
        sign,
        numericValue: cleanNum,
        unit,
        hasRupee: match[2] === '₹',
        hasDollar: match[2] === '$',
        decLen,
      };
    } else {
      // Indian number match
      const rawNum = match[5];
      const cleanNum = parseFloat(rawNum.replace(/,/g, ''));
      const decLen = rawNum.includes('.') ? rawNum.split('.')[1].length : 0;

      tokenData = {
        originalRaw: fullMatch,
        sign: '',
        numericValue: cleanNum,
        hasRupee: false,
        hasDollar: false,
        decLen,
      };
    }

    const span = document.createElement('span');
    span.setAttribute('data-cm-currency-text', 'true');
    span.setAttribute('data-cm-orig', tokenData.originalRaw);
    span.setAttribute('data-cm-data', JSON.stringify(tokenData));
    span.textContent = tokenData.originalRaw;

    fragments.push(span);
    lastIndex = matchEnd;
  }

  if (fragments.length === 0) return null;

  // Add trailing text
  if (lastIndex < text.length) {
    fragments.push(document.createTextNode(text.substring(lastIndex)));
  }

  return fragments;
}

/** One index per mounted main/root. Currency switches never walk the DOM again. */
interface CurrencyTextIndex {
  spans: HTMLElement[];
  notice: HTMLElement | null;
  code?: CurrencyCode;
}
const indexes = new WeakMap<Element, CurrencyTextIndex>();
const tokenCache = new WeakMap<HTMLElement, CurrencyTokenData>();

export const INDIA_CURRENCY_NOTICE = 'Amounts are in Indian rupees (₹) because this guide covers Indian rules.';
export const EXAMPLE_CURRENCY_NOTICE = 'Example amounts are shown in your selected currency and are not converted at exchange rates.';

function updateIndex(index: CurrencyTextIndex, targetCode: CurrencyCode): void {
  if (index.code === targetCode) return;
  for (const span of index.spans) {
    // Recheck locks in case a previously indexed block was subsequently locked.
    if (span.closest('[data-currency-lock]')) continue;
    let data = tokenCache.get(span);
    if (!data) {
      try { data = JSON.parse(span.getAttribute('data-cm-data') || 'null'); } catch { continue; }
      if (!data) continue;
      tokenCache.set(span, data);
    }
    const next = formatConvertedToken(data, targetCode);
    if (span.textContent !== next) span.textContent = next;
  }
  if (index.notice) index.notice.hidden = targetCode === 'INR';
  index.code = targetCode;
}

/** Updates the mounted page; also used for external currency-change events. */
export function updateAllCurrencySpans(targetCode: CurrencyCode): void {
  initDOMCurrencyText(targetCode);
}

/** Index once, then perform one O(n) pass over currency tokens per switch. No observer. */
export function initDOMCurrencyText(targetCode: CurrencyCode = 'INR', root?: Element): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (isJurisdictionLocked(window.location.pathname)) return;
  const container = root || document.querySelector('main') || document.body;
  if (!container) return;
  const existing = indexes.get(container);
  if (existing) {
    updateIndex(existing, targetCode);
    return;
  }

  // Reject whole locked/excluded subtrees, rather than visiting every descendant text.
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (node.nodeType === 1) return shouldSkipElement(node as Element)
        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP;
      const parent = node.parentElement;
      if (!parent || shouldSkipElement(parent)) return NodeFilter.FILTER_REJECT;
      const value = node.nodeValue || '';
      return value.includes('₹') || /\d,\d{2},\d{3}/.test(value)
        ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    },
  });
  const nodes: Text[] = [];
  if (!shouldSkipElement(container)) {
    let node: Node | null;
    while ((node = walker.nextNode())) nodes.push(node as Text);
  }
  const spans: HTMLElement[] = [];
  for (const node of nodes) {
    const fragments = processTextNode(node);
    if (!fragments) continue;
    const frag = document.createDocumentFragment();
    for (const part of fragments) {
      if (part.nodeType === 1) spans.push(part as HTMLElement);
      frag.appendChild(part);
    }
    node.parentNode?.replaceChild(frag, node);
  }

  // Notices are client-only: the original INR HTML and SEO text stay intact.
  const indiaArticle = container.matches('[data-currency-article="india"]')
    ? container : container.querySelector('[data-currency-article="india"]');
  let notice: HTMLElement | null = null;
  if (indiaArticle || spans.length) {
    notice = document.createElement('p');
    notice.dataset.currencyNotice = indiaArticle ? 'india' : 'examples';
    notice.className = 'text-xs text-text-muted my-3';
    notice.textContent = indiaArticle ? INDIA_CURRENCY_NOTICE : EXAMPLE_CURRENCY_NOTICE;
    notice.hidden = true;
    (indiaArticle || container).prepend(notice);
  }
  const index = { spans, notice };
  indexes.set(container, index);
  updateIndex(index, targetCode);
}
