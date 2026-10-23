// Run after npm run build. Produces a browser benchmark at /tmp/currency-locking-benchmark.html.
// Open it in Chromium, or use --headless --dump-dom to read the JSON result.
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { build } from 'esbuild';
import { Window } from 'happy-dom';

const baseline = process.argv[2] || 'origin/main';
const w = new Window();
const posts = readdirSync('dist/blog').filter(f => f.endsWith('.html')).map(file => {
  w.document.body.innerHTML = readFileSync(`dist/blog/${file}`, 'utf8');
  const article = w.document.querySelector('main > article');
  return article ? { slug: file.slice(0, -5), words: article.textContent.trim().split(/\s+/).length, html: w.document.querySelector('main').outerHTML } : null;
}).filter(Boolean).sort((a, b) => b.words - a.words);
const longest = posts[0];
const oldSource = execFileSync('git', ['show', `${baseline}:src/lib/dynamic-currency-text.ts`], { encoding: 'utf8' });
const oldCode = (await build({ stdin: { contents: oldSource, resolveDir: resolve('src/lib'), loader: 'ts' }, bundle: true, write: false, format: 'iife', globalName: 'Before' })).outputFiles[0].text;
const newCode = (await build({ entryPoints: ['src/lib/dynamic-currency-text.ts'], bundle: true, write: false, format: 'iife', globalName: 'After' })).outputFiles[0].text;
const payload = JSON.stringify(longest).replace(/</g, '\\u003c');
writeFileSync('/tmp/currency-locking-benchmark.html', `<!doctype html><body><div id="fixture"></div><pre id="result">running</pre><script>${oldCode}\n${newCode}\n
const post = ${payload};
const fixture = document.querySelector('#fixture');
function median(values) { return values.sort((a,b)=>a-b)[Math.floor(values.length/2)]; }
function measure(api, old, locked) {
  fixture.innerHTML = locked ? post.html : post.html.replace(/ data-currency-(?:lock|article)="[^"]*"/g, '');
  const start = performance.now();
  api.initDOMCurrencyText('INR');
  const indexMs = performance.now() - start;
  const samples=[];
  for (let i=0;i<220;i++) {
    const code = ['USD','EUR','GBP','INR'][i%4];
    const begin = performance.now();
    api.initDOMCurrencyText(code);
    if(old) api.updateAllCurrencySpans(code); // Existing Header's duplicate event update.
    const ms=performance.now()-begin;
    if(i>=20) samples.push(ms);
  }
  return { indexMs, medianSwitchMs: median(samples), maxSwitchMs: Math.max(...samples), samples: samples.length, spans:fixture.querySelectorAll('[data-cm-currency-text]').length };
}
const result={slug:post.slug, words:post.words, userAgent:navigator.userAgent, baseline:${JSON.stringify(baseline)}, before:measure(Before,true,false), after:measure(After,false,true), afterUnlocked:measure(After,false,false)};
document.querySelector('#result').textContent=JSON.stringify(result,null,2);
</script>`);
console.log(JSON.stringify({ slug: longest.slug, words: longest.words, benchmark: '/tmp/currency-locking-benchmark.html' }));

if (process.argv.includes('--dom')) {
  function measureDom(code, name, old, locked) {
    const dom = new Window({ url: `https://calcumetrics.com/blog/${longest.slug}` });
    dom.document.body.innerHTML = locked ? longest.html : longest.html.replace(/ data-currency-(?:lock|article)="[^"]*"/g, '');
    const api = new Function('window', 'document', 'NodeFilter', `${code}; return ${name};`)(dom, dom.document, dom.NodeFilter);
    let start = performance.now();
    api.initDOMCurrencyText('INR');
    const indexMs = performance.now() - start;
    const samples = [];
    for (let i = 0; i < 220; i++) {
      const target = ['USD', 'EUR', 'GBP', 'INR'][i % 4];
      start = performance.now();
      api.initDOMCurrencyText(target);
      if (old) api.updateAllCurrencySpans(target);
      const elapsed = performance.now() - start;
      if (i >= 20) samples.push(elapsed);
    }
    samples.sort((a, b) => a - b);
    return { indexMs, medianSwitchMs: samples[100], maxSwitchMs: samples.at(-1), samples: samples.length, spans: dom.document.querySelectorAll('[data-cm-currency-text]').length };
  }
  console.log(JSON.stringify({ slug: longest.slug, words: longest.words, environment: `happy-dom on ${process.version}`, baseline, before: measureDom(oldCode, 'Before', true, false), after: measureDom(newCode, 'After', false, true), afterUnlocked: measureDom(newCode, 'After', false, false) }, null, 2));
}
