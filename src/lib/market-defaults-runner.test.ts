import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { applyMarketDefaults, formatFieldValue } from './market-defaults-runner';

describe('market-defaults-runner', () => {
  const origWindow = (globalThis as any).window;

  beforeEach(() => {
    (globalThis as any).window = {
      location: { pathname: '/sip-calculator' },
    };
  });

  afterEach(() => {
    (globalThis as any).window = origWindow;
    vi.restoreAllMocks();
  });

  describe('formatFieldValue', () => {
    it('formats amount according to currency locale', () => {
      expect(formatFieldValue(100000, 'amount', 'INR')).toBe('1,00,000');
      expect(formatFieldValue(10000, 'amount', 'USD')).toBe('10,000');
      expect(formatFieldValue(500, 'amount', 'EUR')).toBe('500');
    });

    it('formats rate as string number', () => {
      expect(formatFieldValue(12, 'rate', 'INR')).toBe('12');
      expect(formatFieldValue(8.5, 'rate', 'USD')).toBe('8.5');
    });
  });

  describe('applyMarketDefaults', () => {
    function createMockContainer() {
      const elements: Record<string, any> = {};

      function makeElem(id: string, initial: Record<string, any>) {
        const listeners: Record<string, Array<(e: any) => void>> = {};
        const elem = {
          id,
          value: initial.value ?? '',
          min: initial.min ?? '',
          max: initial.max ?? '',
          step: initial.step ?? '',
          textContent: initial.textContent ?? '',
          dataset: { ...(initial.dataset || {}) },
          style: {
            setProperty: vi.fn(),
          },
          getAttribute(attr: string) {
            return initial[attr] ?? (this.dataset as any)[attr] ?? null;
          },
          setAttribute(attr: string, val: string) {
            initial[attr] = val;
            (this.dataset as any)[attr] = val;
          },
          addEventListener(evt: string, fn: any) {
            (listeners[evt] = listeners[evt] || []).push(fn);
          },
          dispatchEvent(evt: any) {
            (listeners[evt.type] || []).forEach((fn) => fn(evt));
            return true;
          },
        };
        elements[id] = elem;
        return elem;
      }

      const monthlyInput = makeElem('sip-monthly', { value: '25,000' });
      const monthlySlider = makeElem('sip-monthly-slider', {
        min: '500',
        max: '200000',
        step: '500',
        value: '25000',
      });
      const rateInput = makeElem('sip-rate', { value: '12' });
      const rateSlider = makeElem('sip-rate-slider', { min: '1', max: '30', step: '0.5', value: '12' });

      const monthlyChips = [
        makeElem('chip-m-0', { 'data-chip-monthly': '5000', textContent: '₹5k' }),
        makeElem('chip-m-1', { 'data-chip-monthly': '10000', textContent: '₹10k' }),
        makeElem('chip-m-2', { 'data-chip-monthly': '25000', textContent: '₹25k' }),
        makeElem('chip-m-3', { 'data-chip-monthly': '50000', textContent: '₹50k' }),
        makeElem('chip-m-4', { 'data-chip-monthly': '100000', textContent: '₹1L' }),
      ];

      const rateChips = [
        makeElem('chip-r-0', { 'data-chip-rate': '10', textContent: '10%' }),
        makeElem('chip-r-1', { 'data-chip-rate': '12', textContent: '12%' }),
        makeElem('chip-r-2', { 'data-chip-rate': '15', textContent: '15%' }),
      ];

      const mockRoot = {
        querySelector(sel: string) {
          const matchId = sel.match(/^#([a-zA-Z0-9_-]+)$/);
          if (matchId) return elements[matchId[1]] || null;
          return null;
        },
        querySelectorAll(sel: string) {
          if (sel.includes('data-chip-monthly')) return monthlyChips;
          if (sel.includes('data-chip-rate')) return rateChips;
          return [];
        },
      } as unknown as HTMLElement;

      return { mockRoot, monthlyInput, monthlySlider, rateInput, rateSlider, monthlyChips, rateChips };
    }

    it('swaps unedited inputs, sliders, and chips to USD defaults', () => {
      const { mockRoot, monthlyInput, monthlySlider, rateInput, rateSlider, monthlyChips, rateChips } =
        createMockContainer();

      const inputSpy = vi.fn();
      monthlyInput.addEventListener('input', inputSpy);

      const result = applyMarketDefaults('sip', 'USD', { root: mockRoot });
      expect(result).toBe(true);

      // Monthly input swapped to $500
      expect(monthlyInput.value).toBe('500');
      // Slider updated to USD range (min 50, max 10000, value 500)
      expect(monthlySlider.min).toBe('50');
      expect(monthlySlider.max).toBe('10000');
      expect(monthlySlider.value).toBe('500');
      expect(monthlySlider.style.setProperty).toHaveBeenCalledWith('--slider-pct', expect.any(String));

      // Rate swapped to 8%
      expect(rateInput.value).toBe('8');
      expect(rateSlider.value).toBe('8');

      // Chips updated to USD values and labels
      expect(monthlyChips[0].getAttribute('data-chip-monthly')).toBe('100');
      expect(monthlyChips[0].textContent).toBe('$100');
      expect(monthlyChips[2].getAttribute('data-chip-monthly')).toBe('500');
      expect(monthlyChips[2].textContent).toBe('$500');

      expect(rateChips[1].getAttribute('data-chip-rate')).toBe('8');
      expect(rateChips[1].textContent).toBe('8% (S&P avg)');

      // Event was dispatched to trigger calculator recalculation
      expect(inputSpy).toHaveBeenCalled();
    });

    it('preserves user-modified input values when currency changes', () => {
      const { mockRoot, monthlyInput, monthlySlider, monthlyChips } = createMockContainer();

      // User typed custom amount $750
      monthlyInput.value = '750';
      monthlyInput.dataset.userModified = 'true';

      applyMarketDefaults('sip', 'USD', { root: mockRoot });

      // Monthly input must NOT be overwritten
      expect(monthlyInput.value).toBe('750');

      // Slider range still updates to USD range
      expect(monthlySlider.min).toBe('50');
      expect(monthlySlider.max).toBe('10000');

      // Chips still update to USD
      expect(monthlyChips[0].getAttribute('data-chip-monthly')).toBe('100');
    });

    it('preserves values when slider was modified by user dragging', () => {
      const { mockRoot, monthlyInput, monthlySlider } = createMockContainer();

      // User dragged slider to $750 (setting userModified on slider)
      monthlyInput.value = '750';
      monthlySlider.value = '750';
      monthlySlider.dataset.userModified = 'true';

      applyMarketDefaults('sip', 'USD', { root: mockRoot });

      // Monthly input must NOT be overwritten back to 500
      expect(monthlyInput.value).toBe('750');
      expect(monthlySlider.value).toBe('750');
    });

    it('overwrites user-modified input if forceReset is true', () => {
      const { mockRoot, monthlyInput, monthlySlider } = createMockContainer();
      monthlyInput.value = '750';
      monthlyInput.dataset.userModified = 'true';
      monthlySlider.dataset.userModified = 'true';

      applyMarketDefaults('sip', 'USD', { root: mockRoot, forceReset: true });

      // With forceReset, userModified is cleared on both input and slider, and default $500 is applied
      expect(monthlyInput.value).toBe('500');
      expect(monthlyInput.dataset.userModified).toBeUndefined();
      expect(monthlySlider.dataset.userModified).toBeUndefined();
    });

    it('does nothing on jurisdiction-locked routes', () => {
      const { mockRoot, monthlyInput } = createMockContainer();
      (globalThis as any).window.location.pathname = '/in/income-tax-calculator';

      const result = applyMarketDefaults('sip', 'USD', { root: mockRoot });

      expect(result).toBe(false);
      expect(monthlyInput.value).toBe('25,000');
    });

    it('returns false in SSR when window is undefined', () => {
      (globalThis as any).window = undefined;
      expect(applyMarketDefaults('sip', 'USD')).toBe(false);
    });
  });
});
