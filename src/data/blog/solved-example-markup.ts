// Shared markup for the textbook-style "solved example" posts so every post in
// the series uses the same Tailwind classes as the rest of src/data/blog.

export const h2 = (text: string) =>
  `<h2 class="text-xl sm:text-2xl font-bold text-text-primary mt-8 mb-4">${text}</h2>`;

export const h3 = (text: string) =>
  `<h3 class="text-base font-bold text-text-primary mt-6 mb-3">${text}</h3>`;

export const p = (html: string) => `<p class="text-sm text-text-muted leading-relaxed mb-4">${html}</p>`;

export const link = (href: string, text: string) =>
  `<a href="${href}" class="text-accent font-medium hover:underline">${text}</a>`;

export const formulaBlock = (label: string, formula: string) => `
<div class="p-4 bg-surface border border-border rounded-card mb-6">
  <p class="text-xs font-mono uppercase tracking-wider text-text-muted mb-1">${label}</p>
  <p class="text-base font-mono text-text-primary bg-canvas/60 p-2.5 rounded border border-border">${formula}</p>
</div>`;

export const bullets = (items: string[]) =>
  `<ul class="list-disc pl-5 text-sm text-text-muted space-y-2 mb-4 leading-relaxed">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;

export const table = (caption: string, head: string[], rows: (string | number)[][]) => `
<div class="overflow-x-auto mb-6"><table class="w-full text-xs text-left border border-border rounded-card overflow-hidden"><caption class="text-xs text-text-muted text-left p-3 bg-surface border-b border-border">${caption}</caption><thead class="bg-surface text-text-primary font-semibold border-b border-border"><tr>${head.map((h) => `<th scope="col" class="p-3">${h}</th>`).join('')}</tr></thead><tbody class="divide-y divide-border text-text-muted">${rows.map((r) => `<tr>${r.map((c, i) => `<td class="p-3${i > 0 ? ' font-mono' : ''}">${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

/** Textbook layout: Question, numbered Solution steps, boxed final answer. */
export const solvedExample = (title: string, question: string, steps: string[], answer: string) => `
<div class="p-4 sm:p-5 bg-surface border border-border rounded-card mb-6">
  <h3 class="text-base font-bold text-text-primary mb-3">${title}</h3>
  <p class="text-sm text-text-muted leading-relaxed mb-3"><strong class="text-text-primary">Question:</strong> ${question}</p>
  <p class="text-sm font-semibold text-text-primary mb-2">Solution:</p>
  <ol class="list-decimal pl-5 text-sm text-text-muted space-y-2 mb-4 leading-relaxed">${steps.map((s) => `<li>${s}</li>`).join('')}</ol>
  <p class="text-sm text-text-primary bg-canvas/60 p-3 rounded border border-accent/30"><strong>Answer:</strong> ${answer}</p>
</div>`;

export const lastUpdated = (date: string) => `<p class="text-xs text-text-muted mt-6">Last updated: ${date}</p>`;
