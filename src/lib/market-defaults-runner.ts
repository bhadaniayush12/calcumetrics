/**
 * market-defaults-runner.ts
 *
 * Client-side engine that applies market-realistic defaults (INR, USD, EUR, GBP)
 * across calculators when currency changes or on initial load.
 *
 * Behavior (per User Specification):
 * 1. If user has NOT modified a field: swap to the new market's realistic defaults (amount, rate, sliders).
 * 2. If user HAS modified a field (typed or dragged): keep their custom number intact.
 * 3. Update preset chips to market-realistic amounts and labels.
 * 4. Update slider min, max, step, and CSS variable --slider-pct.
 * 5. On calculator Reset: restore active market's defaults.
 */

import type { CurrencyCode } from './currency';
import { isJurisdictionLocked } from './currency';
import {
  MARKET_DEFAULTS,
  getCalculatorDefaults,
  getCalculatorChips,
  normalizeCalculatorKey,
  type FieldDefaults,
} from '../data/market-defaults';
import { formatIndian, formatIntl } from './formatters';

export interface ApplyMarketDefaultsOptions {
  /** If true, forces updating values even if data-user-modified is true (used by Reset) */
  forceReset?: boolean;
  /** Custom container root (defaults to document) */
  root?: HTMLElement | Document;
}

/**
 * Formats a numeric value for an input field based on its kind and target currency.
 */
export function formatFieldValue(val: number, kind: 'amount' | 'rate', currencyCode: CurrencyCode): string {
  if (kind === 'rate') {
    return String(val);
  }
  // kind === 'amount'
  if (currencyCode === 'INR') {
    return formatIndian(val);
  }
  // For USD, EUR, GBP
  return formatIntl(val);
}

/**
 * Applies realistic market defaults for a calculator and currency.
 * Returns true if any input or slider was updated.
 */
export function applyMarketDefaults(
  calculatorType: string,
  currencyCode: CurrencyCode,
  options: ApplyMarketDefaultsOptions = {}
): boolean {
  if (typeof window === 'undefined') return false;
  const root = options.root || document;

  // Jurisdiction-locked pages (/in/*, /us/*, etc.) do not switch defaults
  const pathname = typeof window.location !== 'undefined' ? window.location.pathname : '';
  if (isJurisdictionLocked(pathname)) {
    return false;
  }

  // Do not overwrite inputs if the URL contains explicit scenario hash parameters (unless forceReset is requested)
  if (!options.forceReset && typeof window !== 'undefined' && window.location.hash && window.location.hash.includes('=')) {
    return false;
  }

  const normKey = normalizeCalculatorKey(calculatorType);
  const calcConfig = (MARKET_DEFAULTS as Record<string, Record<string, any>>)[normKey];
  if (!calcConfig) return false;

  const defaults = getCalculatorDefaults(normKey, currencyCode);
  let updatedAny = false;
  const inputsToTrigger: HTMLInputElement[] = [];

  for (const [fieldId, fieldDef] of Object.entries(defaults)) {
    const input = root.querySelector<HTMLInputElement>(`#${fieldId}`);
    if (!input) continue;

    const slider = root.querySelector<HTMLInputElement>(`#${fieldId}-slider`);
    const fieldMeta = calcConfig[fieldId];
    const isUserModified = input.dataset.userModified === 'true' || slider?.dataset.userModified === 'true';

    // When forceReset is true, clear the userModified flag
    if (options.forceReset) {
      delete input.dataset.userModified;
      if (slider) {
        delete slider.dataset.userModified;
      }
    }

    // Only update input value if NOT user modified (or forceReset is active)
    if (!isUserModified || options.forceReset) {
      const formatted = formatFieldValue(fieldDef.value, fieldMeta?.kind || 'amount', currencyCode);
      if (input.value !== formatted) {
        input.value = formatted;
        updatedAny = true;
        inputsToTrigger.push(input);
      }
    }

    // Update the slider (min, max, step, and value if unedited)
    if (slider && fieldDef.min !== undefined && fieldDef.max !== undefined) {
      slider.min = String(fieldDef.min);
      slider.max = String(fieldDef.max);
      if (fieldDef.step !== undefined) {
        slider.step = String(fieldDef.step);
      }
      if (!isUserModified || options.forceReset) {
        slider.value = String(fieldDef.value);
      } else {
        // Clamp current slider value within new min/max if needed
        const curNum = parseFloat(slider.value);
        if (!isNaN(curNum)) {
          const clamped = Math.max(fieldDef.min, Math.min(fieldDef.max, curNum));
          slider.value = String(clamped);
        }
      }
      const sVal = parseFloat(slider.value);
      const sMin = parseFloat(slider.min);
      const sMax = parseFloat(slider.max);
      if (!isNaN(sVal) && !isNaN(sMin) && !isNaN(sMax) && sMax > sMin) {
        const pct = ((sVal - sMin) / (sMax - sMin)) * 100;
        slider.style.setProperty('--slider-pct', `${Math.max(0, Math.min(100, pct)).toFixed(2)}%`);
      }
    }
  }

  // Update preset chips if configured for this calculator
  const chips = getCalculatorChips(normKey, currencyCode);
  if (chips) {
    for (const [chipType, chipList] of Object.entries(chips)) {
      const chipButtons = root.querySelectorAll<HTMLButtonElement>(`[data-chip-${chipType}]`);
      chipButtons.forEach((btn, index) => {
        const chipData = chipList[index];
        if (chipData) {
          btn.setAttribute(`data-chip-${chipType}`, String(chipData.val));
          btn.textContent = chipData.label;
          btn.dataset.marketChipControlled = 'true';
        }
      });
    }
  }

  // Trigger recalculation on the calculator page if values changed
  if (inputsToTrigger.length > 0) {
    inputsToTrigger.forEach((inp) => {
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      inp.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  return updatedAny;
}
