import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  formatDisplayCurrency,
  getStoredCurrency,
  normalizeCurrency,
  getCurrencyConfig,
  type CurrencyCode,
} from './currency';

describe('Methodology Sandbox Currency Synchronization', () => {
  // Mock DOM environment representing the Methodology Sandbox elements
  let dom: {
    pInput: { value: string; addEventListener: any };
    rInput: { value: string; addEventListener: any };
    pVal: { textContent: string };
    rVal: { textContent: string };
    engineCalc: { textContent: string };
    outputResult: { textContent: string };
    outputGain: { textContent: string };
    displayFormatEl: { textContent: string };
  };
  let windowListeners: Record<string, ((e: any) => void)[]>;
  let currentCurrency: CurrencyCode;

  beforeEach(() => {
    windowListeners = {};
    (global as any).window = {
      addEventListener: (event: string, handler: (e: any) => void) => {
        windowListeners[event] = windowListeners[event] || [];
        windowListeners[event].push(handler);
      },
      removeEventListener: (event: string, handler: (e: any) => void) => {
        if (!windowListeners[event]) return;
        windowListeners[event] = windowListeners[event].filter((h) => h !== handler);
      },
      dispatchEvent: (event: any) => {
        const handlers = windowListeners[event.type] || [];
        handlers.forEach((h) => h(event));
      },
      matchMedia: vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
      })),
      requestAnimationFrame: vi.fn(),
      cancelAnimationFrame: vi.fn(),
      localStorage: {
        getItem: vi.fn().mockReturnValue(null),
        setItem: vi.fn(),
      },
    };

    dom = {
      pInput: { value: '500000', addEventListener: vi.fn() },
      rInput: { value: '7.5', addEventListener: vi.fn() },
      pVal: { textContent: '' },
      rVal: { textContent: '' },
      engineCalc: { textContent: '' },
      outputResult: { textContent: '' },
      outputGain: { textContent: '' },
      displayFormatEl: { textContent: '' },
    };

    currentCurrency = getStoredCurrency();
  });

  function simulateSandboxUpdate(currency: CurrencyCode) {
    const P = parseFloat(dom.pInput.value) || 500000;
    const rPercent = parseFloat(dom.rInput.value) || 7.5;
    const t = 5;
    const r = rPercent / 100;
    const config = getCurrencyConfig(currency);

    dom.pVal.textContent = formatDisplayCurrency(P, currency);
    dom.rVal.textContent = `${rPercent.toFixed(2)}%`;
    dom.engineCalc.textContent = `${P.toLocaleString(config.locale)} × (1 + ${r.toFixed(3)})^${t}`;

    const A = P * Math.pow(1 + r, t);
    const gain = A - P;

    dom.outputResult.textContent = formatDisplayCurrency(A, currency);
    dom.outputGain.textContent = `+ ${formatDisplayCurrency(gain, currency)} wealth gain`;
    dom.displayFormatEl.textContent =
      currency === 'INR' ? 'Indian Lakhs/Crores' : 'International grouping';

    return { P, r, t, A, gain };
  }

  it('formats initial default state as INR with ₹ symbol and Indian Lakhs/Crores grouping', () => {
    const result = simulateSandboxUpdate('INR');

    expect(dom.pVal.textContent).toBe('₹5,00,000');
    expect(dom.rVal.textContent).toBe('7.50%');
    expect(dom.engineCalc.textContent).toBe('5,00,000 × (1 + 0.075)^5');
    expect(dom.outputResult.textContent).toBe('₹7,17,815');
    expect(dom.outputGain.textContent).toBe('+ ₹2,17,815 wealth gain');
    expect(dom.displayFormatEl.textContent).toBe('Indian Lakhs/Crores');

    expect(Math.round(result.A)).toBe(717815);
    expect(Math.round(result.gain)).toBe(217815);
  });

  it('formats USD with $ symbol and International grouping without altering math', () => {
    const result = simulateSandboxUpdate('USD');

    expect(dom.pVal.textContent).toBe('$500,000');
    expect(dom.outputResult.textContent).toBe('$717,815');
    expect(dom.outputGain.textContent).toBe('+ $217,815 wealth gain');
    expect(dom.displayFormatEl.textContent).toBe('International grouping');
    expect(dom.engineCalc.textContent).toBe('500,000 × (1 + 0.075)^5');

    // Strict invariant: Zero FX conversion. 500,000 stays 500,000
    expect(Math.round(result.A)).toBe(717815);
    expect(Math.round(result.gain)).toBe(217815);
  });

  it('formats EUR with € symbol and International grouping without altering math', () => {
    const result = simulateSandboxUpdate('EUR');

    expect(dom.pVal.textContent).toBe('€500.000');
    expect(dom.outputResult.textContent).toBe('€717.815');
    expect(dom.outputGain.textContent).toBe('+ €717.815 wealth gain'.replace('717.815', '217.815'));
    expect(dom.displayFormatEl.textContent).toBe('International grouping');
    expect(dom.engineCalc.textContent).toBe('500.000 × (1 + 0.075)^5');

    expect(Math.round(result.A)).toBe(717815);
    expect(Math.round(result.gain)).toBe(217815);
  });

  it('formats GBP with £ symbol and International grouping without altering math', () => {
    const result = simulateSandboxUpdate('GBP');

    expect(dom.pVal.textContent).toBe('£500,000');
    expect(dom.outputResult.textContent).toBe('£717,815');
    expect(dom.outputGain.textContent).toBe('+ £217,815 wealth gain');
    expect(dom.displayFormatEl.textContent).toBe('International grouping');
    expect(dom.engineCalc.textContent).toBe('500,000 × (1 + 0.075)^5');

    expect(Math.round(result.A)).toBe(717815);
    expect(Math.round(result.gain)).toBe(217815);
  });

  it('immediately updates values when currency changes while sliders are already moved', () => {
    // 1. Move sliders
    dom.pInput.value = '1000000';
    dom.rInput.value = '10';

    // 2. Initial compute in INR
    let state = simulateSandboxUpdate('INR');
    expect(dom.pVal.textContent).toBe('₹10,00,000');
    expect(dom.outputResult.textContent).toBe('₹16,10,510');
    expect(dom.outputGain.textContent).toBe('+ ₹6,10,510 wealth gain');
    expect(Math.round(state.A)).toBe(1610510);

    // 3. User switches global currency to USD
    state = simulateSandboxUpdate('USD');
    expect(dom.pVal.textContent).toBe('$1,000,000');
    expect(dom.outputResult.textContent).toBe('$1,610,510');
    expect(dom.outputGain.textContent).toBe('+ $610,510 wealth gain');
    expect(dom.displayFormatEl.textContent).toBe('International grouping');
    expect(dom.engineCalc.textContent).toBe('1,000,000 × (1 + 0.100)^5');
    expect(Math.round(state.A)).toBe(1610510);

    // 4. User switches global currency to GBP
    state = simulateSandboxUpdate('GBP');
    expect(dom.pVal.textContent).toBe('£1,000,000');
    expect(dom.outputResult.textContent).toBe('£1,610,510');
    expect(dom.outputGain.textContent).toBe('+ £610,510 wealth gain');
    expect(dom.displayFormatEl.textContent).toBe('International grouping');
    expect(Math.round(state.A)).toBe(1610510);

    // 5. User switches back to INR
    state = simulateSandboxUpdate('INR');
    expect(dom.pVal.textContent).toBe('₹10,00,000');
    expect(dom.outputResult.textContent).toBe('₹16,10,510');
    expect(dom.displayFormatEl.textContent).toBe('Indian Lakhs/Crores');
    expect(Math.round(state.A)).toBe(1610510);
  });

  it('handles cm:currency-change event listener without duplicate registrations', () => {
    const win = (global as any).window;
    let callCount = 0;

    const setupHandler = () => {
      if (win.__cmMethodologyCurrencyHandler) {
        win.removeEventListener('cm:currency-change', win.__cmMethodologyCurrencyHandler);
      }
      win.__cmMethodologyCurrencyHandler = (e: any) => {
        const code = e?.detail?.code ? normalizeCurrency(e.detail.code) : getStoredCurrency();
        currentCurrency = code;
        callCount++;
        simulateSandboxUpdate(currentCurrency);
      };
      win.addEventListener('cm:currency-change', win.__cmMethodologyCurrencyHandler);
    };

    // Simulate two initializations (e.g. initial + astro:page-load)
    setupHandler();
    setupHandler();

    // Verify only ONE listener is registered in windowListeners
    expect(windowListeners['cm:currency-change']).toHaveLength(1);

    // Dispatch cm:currency-change event
    win.dispatchEvent({
      type: 'cm:currency-change',
      detail: { code: 'USD', symbol: '$' },
    });

    expect(callCount).toBe(1);
    expect(currentCurrency).toBe('USD');
    expect(dom.pVal.textContent).toBe('$500,000');
    expect(dom.outputResult.textContent).toBe('$717,815');
  });
});
