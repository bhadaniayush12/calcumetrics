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
 *   - Fast: wraps matching text nodes once on mount, updates spans in O(N) on change.
 */

import type { CurrencyCode } from './currency';
import { isJurisdictionLocked } from './currency';

export interface CurrencyTokenData {
  originalRaw: string;
  sign: string;
  numericValue: number;
  unit?: string;
  hasRupee: boolean;
  decLen: number;
}

// Matches rupee expressions like: ₹25,000, ₹1,26,14,400, ₹50 Lakh, ~₹52.6 Lakh, -₹1,00,000, +₹20,000
export const RUPEE_TOKEN_REGEX = /([-+~–−]?)(₹)\s*([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?)(?:\s*(Crores?|Cr|Lakhs?|L|k|K))?\b/gi;

// Matches standalone Indian grouping numbers (e.g. 10,00,000 or 1,00,000) not preceded by currency or word char
export const INDIAN_NUM_TOKEN_REGEX = /(?<![₹$€£\w])\b(\d{1,2}(?:,\d{2})+(?:,\d{3})(?:\.\d+)?)\b/g;

/**
 * Converts a parsed currency token data object into formatted string for target currency.
 */
export function formatConvertedToken(
  data: CurrencyTokenData,
  targetCode: CurrencyCode
): string {
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
 * Pure string converter: transforms all rupee tokens and Indian grouping numbers
 * in a string into the target currency representation.
 */
export function convertCurrencyString(text: string, targetCode: CurrencyCode): string {
  if (!text) return '';
  if (targetCode === 'INR') return text;

  const COMBINED_REGEX = /([-+~–−]?)(₹)\s*([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?)(?:\s*(Crores?|Cr|Lakhs?|L|k|K))?\b|(?<![₹$€£\w])\b(\d{1,2}(?:,\d{2})+(?:,\d{3})(?:\.\d+)?)\b/gi;

  return text.replace(COMBINED_REGEX, (fullMatch, sign, rupee, rawNum, unit, indNum) => {
    if (rupee === '₹') {
      const cleanNum = parseFloat(rawNum.replace(/,/g, ''));
      const decLen = rawNum.includes('.') ? rawNum.split('.')[1].length : 0;
      return formatConvertedToken(
        {
          originalRaw: fullMatch,
          sign: sign || '',
          numericValue: cleanNum,
          unit,
          hasRupee: true,
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
function shouldSkipElement(el: Element): boolean {
  const tag = el.tagName;
  if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'SELECT'].includes(tag)) {
    return true;
  }
  if (el.closest('form, [data-calculator-form], #header-currency-menu, #current-currency-btn, #mobile-currency-select, #control-center-popover, #search-modal')) {
    return true;
  }
  if (el.hasAttribute('data-currency-prefix') || el.hasAttribute('data-preset-chip') || el.hasAttribute('data-cm-currency-text')) {
    return true;
  }
  return false;
}

/**
 * Splits a text node containing currency/Indian numbers into text and span nodes.
 */
export function processTextNode(node: Text): Node[] | null {
  const text = node.nodeValue;
  if (!text || (!text.includes('₹') && !/\d,\d{2},\d{3}/.test(text))) {
    return null;
  }

  const COMBINED_REGEX = /([-+~–−]?)(₹)\s*([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?)(?:\s*(Crores?|Cr|Lakhs?|L|k|K))?\b|(?<![₹$€£\w])\b(\d{1,2}(?:,\d{2})+(?:,\d{3})(?:\.\d+)?)\b/gi;

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

    if (match[2] === '₹') {
      // Rupee match
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
        hasRupee: true,
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

/**
 * Updates text content of all existing [data-cm-currency-text] spans on the page.
 */
export function updateAllCurrencySpans(targetCode: CurrencyCode): void {
  if (typeof document === 'undefined') return;
  const spans = document.querySelectorAll<HTMLElement>('[data-cm-currency-text]');
  spans.forEach((span) => {
    try {
      const dataStr = span.getAttribute('data-cm-data');
      if (dataStr) {
        const data: CurrencyTokenData = JSON.parse(dataStr);
        span.textContent = formatConvertedToken(data, targetCode);
      }
    } catch {}
  });
}

/**
 * Scans the root element, wraps all matching currency text nodes into spans,
 * and updates them to the target currency.
 */
export function initDOMCurrencyText(targetCode: CurrencyCode = 'INR', root?: Element): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (typeof window.location !== 'undefined' && isJurisdictionLocked(window.location.pathname)) return;

  const container = root || document.querySelector('main') || document.body;
  if (!container) return;

  // Walk all text nodes
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node: Text) {
        const parent = node.parentElement;
        if (!parent || shouldSkipElement(parent)) {
          return NodeFilter.FILTER_REJECT;
        }
        const val = node.nodeValue;
        if (!val || (!val.includes('₹') && !/\d,\d{2},\d{3}/.test(val))) {
          return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  const nodesToProcess: Text[] = [];
  let curr = walker.nextNode();
  while (curr) {
    nodesToProcess.push(curr as Text);
    curr = walker.nextNode();
  }

  nodesToProcess.forEach((textNode) => {
    const parent = textNode.parentNode;
    if (!parent) return;

    const fragments = processTextNode(textNode);
    if (fragments && fragments.length > 0) {
      const frag = document.createDocumentFragment();
      fragments.forEach((f) => frag.appendChild(f));
      parent.replaceChild(frag, textNode);
    }
  });

  // Apply target currency formatting
  updateAllCurrencySpans(targetCode);
}
