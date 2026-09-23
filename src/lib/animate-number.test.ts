import { describe, it, expect, vi, beforeEach } from 'vitest';
import { animateValue } from './animate-number';

describe('animateValue', () => {
  let element: any;

  beforeEach(() => {
    element = { textContent: '' };
    (global as any).window = {
      matchMedia: vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
      })),
      requestAnimationFrame: vi.fn(),
      cancelAnimationFrame: vi.fn(),
    };
    (global as any).performance = {
      now: vi.fn().mockReturnValue(1000),
    };
  });

  it('handles null or undefined element gracefully without throwing', () => {
    expect(() => animateValue(null, '₹1.26 Cr')).not.toThrow();
  });

  it('immediately sets textContent if prefers-reduced-motion is active', () => {
    element.textContent = '₹1.00 Cr';
    animateValue(element, '₹1.50 Cr', { duration: 200 });
    expect(element.textContent).toBe('₹1.50 Cr');
  });

  it('immediately updates if target text equals current text', () => {
    element.textContent = '₹1.26 Cr';
    animateValue(element, '₹1.26 Cr');
    expect(element.textContent).toBe('₹1.26 Cr');
  });

  it('immediately sets text if input does not contain a parseable number', () => {
    (global as any).window.matchMedia = vi.fn().mockReturnValue({ matches: false });
    element.textContent = 'N/A';
    animateValue(element, 'Calculating...');
    expect(element.textContent).toBe('Calculating...');
  });

  it('animates numbers and reaches target value after completion', () => {
    (global as any).window.matchMedia = vi.fn().mockReturnValue({ matches: false });
    element.textContent = '₹1.00 Cr';

    let animCallback: FrameRequestCallback | null = null;
    (global as any).window.requestAnimationFrame = vi.fn().mockImplementation((cb: any) => {
      animCallback = cb;
      return 123;
    });

    animateValue(element, '₹2.00 Cr', { duration: 100 });
    expect((global as any).window.requestAnimationFrame).toHaveBeenCalled();

    if (animCallback) {
      (animCallback as any)(1200);
    }
    expect(element.textContent).toBe('₹2.00 Cr');
  });

  it('cancels previous animation frame when called repeatedly', () => {
    (global as any).window.matchMedia = vi.fn().mockReturnValue({ matches: false });
    const cancelSpy = vi.fn();
    (global as any).window.cancelAnimationFrame = cancelSpy;
    (global as any).window.requestAnimationFrame = vi.fn().mockReturnValue(456);

    element.textContent = '₹10,000';
    animateValue(element, '₹20,000');
    animateValue(element, '₹30,000');

    expect(cancelSpy).toHaveBeenCalledWith(456);
  });
});
