/**
 * animate-number.ts
 *
 * Smooth count-up / count-down animation for result numbers.
 * Strictly respects window.matchMedia('(prefers-reduced-motion: reduce)').
 *
 * Features:
 * - Cancels in-flight frame if value updates during transition (e.g. rapid slider dragging).
 * - Retains tabular-nums alignment.
 * - Extracts currency symbols (₹, $, €, £), prefixes, signs (+/-), and suffixes (Cr, L, Lakh, k, M, B, %, etc.).
 * - Seamlessly falls back to instant DOM text replacement when motion reduction is requested.
 */

export interface AnimateOptions {
  duration?: number; // duration in ms (default: 200ms)
  decimals?: number;
}

export function animateValue(
  el: HTMLElement | null,
  targetText: string,
  options: AnimateOptions = {}
): void {
  if (!el) return;

  const duration = options.duration ?? 200;

  // 1. Strict prefers-reduced-motion check
  if (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    el.textContent = targetText;
    return;
  }

  const raf =
    typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function'
      ? window.requestAnimationFrame.bind(window)
      : (cb: FrameRequestCallback) => setTimeout(() => cb(performance.now()), 16) as unknown as number;

  const caf =
    typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function'
      ? window.cancelAnimationFrame.bind(window)
      : (id: number) => clearTimeout(id);

  // 2. Cancel any running animation on this element
  const anyEl = el as any;
  if (anyEl.__cmAnimFrame) {
    caf(anyEl.__cmAnimFrame);
    anyEl.__cmAnimFrame = null;
  }

  const currentText = el.textContent || '';
  if (currentText.trim() === targetText.trim()) return;

  // 3. Extract prefix, numeric portion, and suffix
  // Handles:
  // "₹1.26 Cr" -> prefix: "₹", num: "1.26", suffix: " Cr"
  // "(₹1,26,14,400)" -> prefix: "(₹", num: "1,26,14,400", suffix: ")"
  // "+₹81.14 L" -> prefix: "+₹", num: "81.14", suffix: " L"
  // "15.4%" -> prefix: "", num: "15.4", suffix: "%"
  const matchCurrent = currentText.match(/^([^\d-]*)([-+]?[\d,.]+)(.*)$/);
  const matchTarget = targetText.match(/^([^\d-]*)([-+]?[\d,.]+)(.*)$/);

  if (!matchCurrent || !matchTarget) {
    el.textContent = targetText;
    return;
  }

  const prefix = matchTarget[1];
  const suffix = matchTarget[3];
  const startNum = parseFloat(matchCurrent[2].replace(/,/g, ''));
  const targetNum = parseFloat(matchTarget[2].replace(/,/g, ''));

  if (isNaN(startNum) || isNaN(targetNum)) {
    el.textContent = targetText;
    return;
  }

  // Determine decimal precision from target
  const decPart = matchTarget[2].split('.')[1];
  const decimals = options.decimals ?? (decPart ? decPart.length : 0);
  const hasCommas = matchTarget[2].includes(',');
  const isIndianGrouping = hasCommas && /,\d{2},/.test(matchTarget[2]);

  const startTime = performance.now();

  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    // Ease-out quad
    const ease = 1 - (1 - progress) * (1 - progress);
    const current = startNum + (targetNum - startNum) * ease;

    if (progress < 1) {
      let numStr = current.toFixed(decimals);
      if (hasCommas) {
        const parts = numStr.split('.');
        const intPart = parts[0];
        const dec = parts[1] ? '.' + parts[1] : '';
        const numInt = parseInt(intPart, 10);
        if (isIndianGrouping) {
          numStr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(numInt) + dec;
        } else {
          numStr = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(numInt) + dec;
        }
      }
      el.textContent = `${prefix}${numStr}${suffix}`;
      anyEl.__cmAnimFrame = raf(step);
    } else {
      el.textContent = targetText;
      anyEl.__cmAnimFrame = null;
    }
  }

  anyEl.__cmAnimFrame = raf(step);
}
