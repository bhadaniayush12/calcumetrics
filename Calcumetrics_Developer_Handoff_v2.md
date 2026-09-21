# Calcumetrics — Developer Handoff v2

**This document replaces the old "Master Developer Handoff" .md completely. Ignore that file** (it specifies glassmorphism, blur, shadows, serif headings, aurora glows and a different footer, all of which are now banned).

**Rule of precedence:** this document > Stitch/Figma exports. The Stitch HTML files are a *visual reference only*. Do not copy their code: they load the Tailwind Play CDN and Google Fonts at runtime, both banned in production.

**Sections 15-24 are the SEO, indexing and AdSense-compliance spec. They are as binding as the design rules.** The visual design is locked; nothing in this document asks for a UI change. Design fidelity to the original Figma pages (Home, Directory, Blog, Article, About, Methodology, 404) is defined in **section 26**, which supersedes any conflicting statement in sections 7, 14, 22 and 25. Where a page has no design at all, build it from the existing components (section 22).

**Figma:** use the PNGs in `/design-reference/` for the layout, section order, hierarchy and copy tone of each page. The page frames (Home, Directory, Article, Blog, About, Methodology, 404, WACC, Privacy) contain effects that are NOT to be built (blur, shadows, gradients, glow); section 26 lists the flat replacement for each. Never use a full-canvas SVG export as an asset.

---

## 1. Product

- Free, 100% client-side financial calculator platform. **No login, no signup, no backend calculations.**
- Audience: global (professionals, CAs, analysts, retail investors, students).
- Business goal: organic SEO traffic, then AdSense monetisation. Every decision below protects Core Web Vitals and crawlability.
- Scale target: 30-50+ calculators, all built from ONE master calculator template (section 6).
- Logo: use `Group 1.svg` (3.7 KB) only. Do **not** ship `Calcumetrics.png` (8 MB) or any large export.

## 2. Design tokens (locked)

| Token | Value |
|---|---|
| Canvas background | `#F7F7F4` |
| Surface | `#FFFFFF` |
| Text primary | `#171A18` |
| Text muted (light surfaces only) | `#66706B` |
| Accent | `#176B5B` |
| Accent hover / pressed | `#135A4D` / `#0E443A` |
| Border | `#D8DDD9` (1px solid ONLY) |
| Disabled bg / text | `#EEF0EE` / `#8A928D` |
| Error text / bg / border / bg-hover | `#B42318` / `#FEF3F2` / `#FECDCA` / `#FEE4E2` |
| **Dark output panel** bg / border | `#171A18` / `#2B302D` |
| Dark text / muted / accent | `#F7F7F4` / `#A8B0AB` / `#5FCDB6` |

No other colours. Do not use `#66706B` on dark surfaces (contrast ~3.3:1, fails); use `#A8B0AB`.

Radius: controls 8px, cards 12px, chips/tags 6px, checkboxes 4px. Nothing else.
Font: **Inter only**, no monospace, no serif. `font-variant-numeric: tabular-nums` on every number. Minimum text size 12px. Spacing on an 8px grid.

## 3. Hard prohibitions (any violation = bug)

- No `box-shadow` of any kind. **No Tailwind `ring-*` utilities** (they compile to box-shadow).
- No `blur`, `backdrop-filter`, glassmorphism, gradients (including slider fills), glows, noise textures, translucent borders, `/10`-style opacity-tinted backgrounds.
- No borders other than 1px solid (no `border-2`, no dashed).
- No spinners (skeletons only). No hover-lift/transform animations.
- Allowed motion: colour/background/border transitions at **120ms**; toggle knob slide; chevron rotate; skeleton opacity pulse (add `motion-reduce:animate-none`).
- No Tailwind Play CDN, no runtime Google Fonts.

## 4. Focus and accessibility

- Focus = outline only: `2px solid #176B5B`, offset 2px, on `:focus-visible` for every interactive element. On any dark surface (output panel, mobile bottom bar, bottom sheet) use `#5FCDB6`.
- Every input has a real `<label for>` (search boxes get `aria-label`). Currency/number inputs: `inputmode="decimal"`.
- Toggle: `role="switch"` + accessible name + `aria-checked`. Segmented control: real buttons with `aria-pressed` (or radio group with arrow keys); never plain `<span>`.
- Errors: `aria-invalid`, `aria-describedby` pointing at the message; inline alert has `role="alert"`.
- `aria-live="polite"` goes on the **hero result only**, debounced ~500ms. Not on the whole output panel.
- FAQ: native `<details>/<summary>` (no JS, content stays in DOM for crawlers).
- Touch targets >= 44px on mobile. One `<h1>` per page (the tool/category title).

## 5. Components

**Buttons** — Primary (`#176B5B`, white text), Secondary (white, 1px border), Ghost (no border, accent text), Destructive-subtle (`#FEF3F2` / `#B42318`, border `#FECDCA`, hover `#FEE4E2`). Heights 32/40/48px. States: default, hover, pressed, focus, disabled. Copy-result button has a "Copied!" state.

**Inputs** — 44px high, 8px radius, label 13px/500 above, helper 12px below. Numbers right-aligned with tabular figures. Prefix (`₹ $ €`) and suffix (`%`, `Yrs`) inside the field. Live digit grouping **while typing** (not on blur), locale-aware: Indian (`10,00,000`) or international (`1,000,000`) via `Intl.NumberFormat`. States: default, hover (border darkens), focus, filled, error, disabled, read-only.

**Slider** — paired with a numeric input, always both on desktop AND mobile. Track 4px `#D8DDD9`; filled portion `#176B5B` drawn with an overlay element (width via CSS variable), *not* a gradient; thumb 20px `#176B5B` with 1px white border. Style both `::-webkit-slider-*` and `::-moz-range-*` (including `::-moz-range-progress`).

**Dropdowns** — Default to native `<select>` (currency/format, region): best accessibility, zero JS. Custom listbox only for the searchable country/jurisdiction picker (flat, 1px border, 8px radius, 4px offset, selected = teal check).

**Tooltips** — `#171A18` bg, `#F7F7F4` text, 12px, 8px radius, max-width 240px, flat arrow. Open on hover AND focus, close on Esc. Plain-language definitions (students are an audience).

**Cards** — Input card (white, 1px border, 12px, 24px padding). Dark output card. Stat card. Directory card (hover = border `#176B5B`; whole card is one `<a>`). Empty-state card (solid 1px border). Skeleton versions: flat `#EEF0EE` bars on light, `#2B302D` bars on dark.

**Chips / tags** — 6px radius. Region tag uses `#EEF0EE` bg (never opacity tints).

**Inline alerts** — info: `#F7F7F4` bg, 1px `#D8DDD9`; error: `#FEF3F2` bg, 1px `#FECDCA`.

## 6. Master calculator template (every calculator uses this)

**Desktop (>=1024px):** max-width 1200px, 12-col grid. Left 7 cols = input card. Right 5 cols = dark output panel, `position: sticky; top: 24px`. **No ancestor may have `overflow: hidden`** (it breaks sticky).

**Input card contents:** region/currency selector (one place only, not also in the header), inputs, slider + numeric pair, segmented controls, toggles, Calculate (primary) + Reset (ghost).

**Output panel:** muted label, 40px hero result (600 weight), 3 secondary metric rows with `#2B302D` dividers, composition bar (flat, `#A8B0AB` principal / `#5FCDB6` gain), Copy Result + Share Link buttons, disclaimer line.

**Mandatory text near results:** *"For information only. Not financial advice. Results are estimates; returns are not guaranteed."* and a one-line convention note, e.g. *"Assumes contributions at the start of each month; nominal annual rate compounded monthly (i = r/12)."* Pick one rate convention per calculator and state it. Never say "effective" if the formula is nominal.

**Mobile (<1024px):** inputs stack full width (same controls as desktop: numeric+slider, toggles, Reset). The output panel is replaced by a **fixed bottom bar**: `#171A18`, 1px top border `#2B302D`, `position: fixed; bottom: 0; padding-bottom: env(safe-area-inset-bottom)`, hero value + "Details" button (>=44px). "Details" opens a **full-height flat bottom sheet** (`#171A18`) with hero, all metrics, composition bar, Copy/Share, a 44px close button; focus is trapped, Esc closes, body scroll locks; focus ring `#5FCDB6`. Reserve bottom padding on the page so the bar never covers content. (This sheet has no Stitch design; build to this description.)

**Initial state:** the static HTML must contain a realistic pre-rendered example (e.g. ₹25,000 / 12% / 15 yrs with its result) so crawlers and users see real numbers and nothing jumps on hydration. The zero "ghost" state appears only after Reset/clear. **Loading:** skeletons only for genuinely deferred pieces (e.g. a lazy-loaded chart); never flash skeletons over static content on first paint. **Error:** inline message on the field + alert, never a blank page.

**Below the split (in this order):**
1. "How this calculator works": formula in Inter, e.g. `M = P × [((1 + i)^n − 1) / i] × (1 + i)`, variable legend.
2. Worked example table, wrapped in `overflow-x-auto` (never `overflow-hidden`; it clips on mobile).
3. FAQ (`<details>`).
4. Related calculators (3 directory cards).
5. Reserved ad slot(s), section 9.

**Content per calculator page:** aim for 600+ words of original, page-specific explanation (formula, a worked example with its own numbers, FAQ, assumptions). This is a working heuristic, not a Google rule; the real test is that the page is genuinely useful and not a re-skin of a template. Thin or near-duplicate calculator pages are the most common "low value content" problem.

## 7. Directory, categories, routing (Step 06)

**Assumptions (DEFAULTS, change before build if wrong):** the site is *global-first*; India is one region among several. Launch is **light theme only**; the header theme toggle is hidden until a dark palette is defined (none exists yet).

**URLs**
- Global tools, flat: `/sip-calculator`, `/emi-calculator`, `/wacc-calculator`.
- Jurisdiction-specific tools prefixed: `/in/gst-calculator`, `/in/hra-calculator`, `/in/ppf-calculator`, `/us/401k-calculator`.
- Category hubs: `/investments`, `/loans`, `/taxes`, `/business`, `/corporate-finance` (no trailing slash anywhere, section 16). **Homepage `/`** follows the Figma Home page and **`/calculators`** is the full directory (Figma "The Ultimate Financial Toolkit" + Step 6 Frame A); see section 26.4.
- Breadcrumb: Home › Category › Tool (independent of URL). Add `BreadcrumbList` schema. Each page: self-referencing canonical, unique title/description, included in the XML sitemap.

**Crawlability:** all tool links are in the initial static HTML (SSG). Search and filter chips only toggle a `hidden` class; they never unmount DOM nodes. Filter chips are `<button aria-pressed>`. Result count is `aria-live="polite"`.

**One primary category per tool** (the Stitch board was inconsistent about this). Sample set:

| Category | Tools |
|---|---|
| Investments (9) | SIP, Lump Sum, Compound Interest, CAGR, XIRR, FD, RD, PPF (IN), 401(k) (US) |
| Loans (4) | EMI, Home Loan, Car Loan, Loan Prepayment |
| Taxes (2 now) | GST (IN), HRA (IN); Income Tax variants come later, one per country |
| Business (4) | Break-even, Profit Margin, Markup vs Margin, ROI |
| Corporate Finance (5) | WACC, NPV, IRR, Payback Period, DCF |

The 24-tool list on the boards is a **placeholder**; the real list is what the client approves. Region tag rule: "Global" only if both the math and the copy apply worldwide; otherwise tag the country (IN/US/UK). "Old vs New Regime" is India-only, so it can never be tagged Global.

**Footer:** locked 6-column layout was Taxes / Investments / Business / Corporate Finance / Company / Legal. **Loans needs a column.** Default: merge Company + Legal into one column, keep 6. Add a **"Cookie settings"** text link in that column (it reopens the consent dialog, section 19). This is a link, not a layout change.

## 8. Tax and law content rules

- Never hard-code slab rates, section numbers, or limits inside card copy or descriptions.
- Keep rates in a data file (`rates.json`) with a `verifiedOn` date and an official-source URL; show "Rates last verified: <date>" on every tax tool.
- **Verify before launch** (as far as we know, these changed recently): India moved GST to a 5% / 18% structure (plus 40% for sin/luxury goods) in Sept 2025, so 12%/28% slabs are obsolete; the Income-tax Act, 2025 replaced the 1961 Act from 1 April 2026, so old section references (e.g. 10(13A)) and "Assessment Year" labels need re-checking against official sources.
- Placeholder finance text on the Stitch boards (slabs, "AY 2025-26 (Current)", "Budget 2024-25 update") is NOT to be used.

## 9. Ads (AdSense)

- Reserve slot geometry before ads load: desktop leaderboard `min-height: 90px`, mobile rectangle `height: 250px`. Never collapse to 0/auto. Prevents layout shift.
- Container: `#F7F7F4`, 1px `#D8DDD9`, 12px label "ADVERTISEMENT" (`#66706B`). No shadows.
- >= 24px from any input, button, or link. Never adjacent to Calculate. Do not combine the mobile sticky bottom bar with anchor/overlay ad formats.
- Before serving ads to EEA/UK/Switzerland users, add a Google-certified consent management platform.
- Required pages before applying: About, Contact (working email/form), Privacy Policy (must disclose ad cookies/third-party vendors), Terms, Disclaimer. Plain semantic HTML: H1/H2/P, no fancy UI.

## 10. Copy rules (applies to every page template)

Do not write: "zero ads", "no tracking / no tracking pixels", "verified calculators", "guaranteed precision", "statutory limit" (for rate inputs), "historical benchmark" rate hints, "100% Core Web Vitals score". Say "assumption", "estimate", "for information only". Privacy claims must match the Privacy Policy once analytics/ads exist.

## 11. Performance budget

- Static generation (SSG). Recommended: Astro (static HTML + interactive islands) or Next.js SSG. Ship JS only for calculators.
- Tailwind at build time (purged CSS). Self-host Inter (woff2, Latin subset, `font-display: swap`, preload the regular weight).
- Targets: LCP < 2.5s, CLS < 0.1, INP < 200ms on mid-range mobile. Test on real devices.
- All calculation logic in pure functions, unit-tested (section 12). Round only for display.

## 12. Calculation test fixtures (must pass to the rupee)

Compute internally with full float precision; round only when rendering. Currency shown Indian-grouped.

**SIP** (annuity-due, i = r/12/100, contribution at start of month): ₹25,000/month, 12% p.a.

| Years | Maturity |
|---|---|
| 3 | ₹10,87,691 |
| 5 | ₹20,62,159 |
| 10 | ₹58,08,477 |
| **15** | **₹1,26,14,400** (invested ₹45,00,000; gain ₹81,14,400 = 180.3%) |
| 20 | ₹2,49,78,698 |

(Ordinary-annuity variant for 15y = ₹1,24,89,505; only if the tool explicitly offers "end of month".) The Stitch boards showed ₹1,26,11,847, which is **wrong**.

| Tool | Input | Expected |
|---|---|---|
| EMI | ₹10,00,000, 8.5% p.a., 20 yrs | EMI ₹8,678; total interest ₹10,82,776 (use unrounded EMI internally) |
| CAGR | ₹1,00,000 → ₹2,50,000 in 5 yrs | 20.11% |
| Compound interest / Lump sum | ₹1,00,000, 8% annual, 10 yrs | ₹2,15,892.50 |
| FD (quarterly) | ₹1,00,000, 7%, 5 yrs | ₹1,41,477.82 |
| NPV @10% | -1,00,000; 30,000; 40,000; 50,000; 60,000 | ₹38,877.13 |
| IRR | same cash flows | 24.89% |
| WACC | E/V 70%, Re 14.2%, D/V 30%, Rd 8.5%, tax 25% | 11.8525% |
| Break-even | fixed ₹5,00,000, price ₹500, variable ₹300 | 2,500 units |

Add fixtures for every new calculator before it ships. Inflation-adjusted values: real = nominal / (1 + inflation)^years, and label inflation as an *assumption*.

## 13. Build order (suggested)

1. Tokens, layout shell (header/footer), Inter self-hosting, component library.
2. **SIP page end-to-end** (proves the master template, tests, SEO markup, ad slot).
3. Directory + category hubs.
4. Remaining calculators as data + content on the same template.
5. Static pages (About, Contact, Privacy, Terms, Disclaimer, Methodology, 404), plain semantic HTML.
6. Consent banner, analytics, then AdSense application.

## 14. Open decisions (defaults already applied above)

1. Global-first vs India-first URL structure (default: global-first, `/in/` for India-specific).
2. Dark mode (default: light-only at launch, toggle hidden).
3. Footer column for Loans (default: merge Company + Legal).
4. Homepage: resolved, follows the Figma Home page (section 26.4).
5. Real domain, contact email, About owner (person or entity) and AdSense publisher ID: needed from the owner before launch (section 24).
6. Theme toggle: hidden until the dark palette in section 26.7 is built and tested (feature flag).

## 15. Pre-launch SEO and AdSense checklist

No setup can guarantee rankings or AdSense approval; this list removes the avoidable technical causes of failure.

**Crawl and index**
- Link only to pages that are fully built. No "coming soon", placeholder or empty tool pages. Unbuilt tools must not appear in nav, footer, directory or sitemap.
- The static HTML must contain: H1, intro, formula, worked example, FAQ, related links and the pre-rendered example result.
- One URL per page: 301 http→https, www/non-www, trailing slash, lowercase; self-referencing canonicals. A tool lives only at its canonical path (not also under its hub path).
- No auto-redirect or content change by IP, geo or cookie (Googlebot mostly crawls from the US). Region/currency is a user choice or an explicit URL. `hreflang` only between real equivalent pages.
- Search, filter chips and region controls are client-side only: no crawlable `?query` URLs. Share Link stores inputs in the URL hash (`#`); if query params are ever used, add `noindex` + canonical to the base URL.
- Sitemap: only 200-status, indexable, canonical URLs, with real `lastmod`. `robots.txt` must allow CSS/JS. Before launch, confirm any staging `noindex` or `Disallow: /` is gone from production.
- A category hub with fewer than ~4 tools stays `noindex` (or does not exist) until it has real content.
- Every page reachable within 3 clicks from home; no orphan pages; descriptive anchor text. The footer links categories and top tools only; hubs and the directory carry the rest.
- Structured data: `WebApplication`/`SoftwareApplication` (free) and `BreadcrumbList`. Do not count on FAQ rich results (Google has limited them to a narrow set of sites).
- Set up Search Console and Bing Webmaster Tools on day one; submit the sitemap.

**Content and trust (ranking and AdSense)**
- Each page has its own worked example, FAQ and stated assumptions. No paragraph is copy-pasted across calculators. Give overlapping tools (SIP / Step-up SIP / Lump sum / Compound interest) clearly different intents so they do not compete with each other.
- Show "Last updated", the formula source, a Methodology page, an About page with a real person or entity, and a Contact page with a working email. If a CA or finance professional reviews content, name them with their consent; never invent reviewers.
- Disclaimer and Privacy Policy live; consent platform live before ads.
- A human checks every AI-drafted page and every number against the test fixtures.

**Performance (test on throttled mid-range mobile)**
- Pre-render everything; hydrate only the calculator.
- JS budget: aim for under ~100 KB compressed on calculator pages. No Chart.js/Recharts: use CSS/inline SVG. Paginate or virtualise long tables (e.g. 240-row amortization).
- Fonts: preload, `font-display: swap`, size-adjusted fallback font to avoid text shift.
- Debounce recalculation on input for heavy models; keep input handlers cheap (INP).
- Load AdSense after the load event/idle. No ads in the first viewport at launch. Keep reserved slot heights. Test CLS with ads on and off.
- The consent banner overlays (fixed); it must not push content down.
- Run Lighthouse CI in the pipeline, then watch the Core Web Vitals report in Search Console once real traffic arrives. Lab scores are a proxy; field data is what Google uses.

## 16. Technical SEO rules (every page)

**Head essentials**
```html
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"> <!-- never user-scalable=no -->
<title>…</title>
<meta name="description" content="…">
<link rel="canonical" href="https://{DOMAIN}/{path}">            <!-- absolute, self-referencing -->
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#F7F7F4">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">        <!-- derived from Group 1.svg -->
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">        <!-- 180x180 -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="Calcumetrics">
<meta property="og:title" content="(same as title)">
<meta property="og:description" content="(same as description)">
<meta property="og:url" content="(same as canonical)">
<meta property="og:image" content="https://{DOMAIN}/og/{slug}.png">
<meta name="twitter:card" content="summary_large_image">
```
- OG image: 1200x630, flat, on-token (`#F7F7F4` background, `#171A18` Inter title, logo mark), <= 200 KB, generated at build from the page title. One default image as fallback.
- Set `width`/`height` on any image. Decorative images: empty `alt`. Meaningful images: real `alt`.

**Title and meta description templates** (unique on every page; written for people; primary keyword near the front)

| Page | Title (~60 chars max) | Description (120-160 chars) |
|---|---|---|
| Homepage | `Free Online Financial Calculators \| Calcumetrics` | What the site offers + categories + "runs in your browser" |
| Category hub | `{Category} Calculators: {n} Free Tools \| Calcumetrics` | What the category covers + 3 tool names |
| Global tool | `{Tool} Calculator: {Outcome} \| Calcumetrics` e.g. `SIP Calculator: Maturity Value & Returns \| Calcumetrics` | What it computes, key inputs, the assumption |
| Jurisdiction tool | `{Tool} Calculator {Country}: {Outcome} \| Calcumetrics` | Same, with the country and rate basis |
| Static pages | `About Calcumetrics`, `Contact`, `Privacy Policy`, etc. + `\| Calcumetrics` | One plain sentence |

Rules: no keyword stuffing; no "best", "#1", "guaranteed"; no year in titles unless the page is genuinely year-specific and maintained; the description must accurately describe the page (Google may rewrite it anyway).

**Headings:** exactly one `<h1>` (the tool/category/page title); logical H2/H3; no skipped levels.

**Slugs:** lowercase, hyphenated, keyword-first, no dates/years/IDs, permanent. If one ever changes: 301 old to new, update canonical, sitemap and internal links.

**URL policy:** HTTPS only. Pick ONE host (default non-www `https://{DOMAIN}`) and 301 the other. **No trailing slash on any URL** (301 `/x/` to `/x`). Lowercase only. Parameter URLs are never linked and never indexed (canonical to the clean URL).

**Status codes:** 200 for live pages; 301 (max one hop) for moves; a **real 404 status** for missing pages (never a 200 "not found" page); 410 for deliberately removed pages. Verify with `curl -I`.

**Robots meta by page type**

| Page | Robots |
|---|---|
| Homepage, tool pages, hubs with >= 4 published tools, About, Contact, Methodology | `index,follow` |
| Privacy, Terms, Disclaimer, Cookie Policy | `index,follow` |
| Hubs with fewer than 4 published tools | `noindex,follow`, and omitted from the sitemap, until they have real content |
| Staging / preview | `noindex` + HTTP auth + `X-Robots-Tag: noindex` (launch gate, section 24) |

**hreflang:** not needed at launch (each tool exists once). Add only when the same tool exists in several regional versions with genuinely different content: self-referencing, reciprocal, plus `x-default`, in HTML and sitemap. Never redirect or change content by IP/geo/cookie.

**No doorway pages:** do not generate variants such as "SIP calculator for {city}" or "{tool} {year}" unless each has distinct, useful content. Near-duplicate pages are a spam-policy risk and an AdSense "low value content" risk.

**Links:** descriptive anchor text; official-source links (government, regulator) are normal links with `rel="noopener"`; no paid links or link swaps.

**Freshness:** `dateModified` (schema) and the visible "Last updated" change only when the logic, rates or copy actually change. Never auto-bump on deploy.

## 17. robots.txt, sitemaps, ads.txt

**`/robots.txt`** (production):
```
User-agent: *
Allow: /

Sitemap: https://{DOMAIN}/sitemap-index.xml
```
Staging uses `Disallow: /`. Never block CSS, JS or fonts. Never use robots.txt to hide a page that should be deindexed (use `noindex`).

**Sitemap rules**
- `/sitemap-index.xml` lists `sitemap-tools.xml`, `sitemap-hubs.xml`, `sitemap-pages.xml` (home, About, Contact, Methodology, legal pages).
- Each file: <= 50,000 URLs and <= 50 MB uncompressed, UTF-8, absolute canonical URLs.
- Include ONLY: HTTP 200, indexable, canonical, published pages. Exclude redirects, `noindex` pages, 404s, unbuilt tools and parameter URLs.
- `<lastmod>` in ISO 8601, equal to the real last content change (same value as schema `dateModified`). Omit `<priority>` and `<changefreq>` (Google ignores them).
- Generated at build. **The build fails if any sitemap URL is not a 200 or has a different canonical.**
- Submit in Google Search Console and Bing Webmaster Tools.

**`/ads.txt`** (root of the canonical host, plain text, HTTP 200):
```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```
Replace `pub-XXXXXXXXXXXXXXXX` with the publisher ID from the owner's AdSense account.

## 18. Structured data (JSON-LD)

Rules: JSON-LD only; generated at build from the same data as the visible page (title, description, dates, FAQ). It must never describe content that is not visible. **No `AggregateRating`, `Review` or invented `author`/`reviewedBy`** (fake or unverifiable markup is a spam violation). Validate every template with Google's Rich Results Test and the Schema.org validator. Expect no rich results from this markup; its job is clarity, not snippets.

**Homepage (once):**
```json
{"@context":"https://schema.org","@graph":[
 {"@type":"Organization","@id":"https://{DOMAIN}/#org","name":"Calcumetrics","url":"https://{DOMAIN}/","logo":"https://{DOMAIN}/logo-512.png"},
 {"@type":"WebSite","@id":"https://{DOMAIN}/#website","url":"https://{DOMAIN}/","name":"Calcumetrics","publisher":{"@id":"https://{DOMAIN}/#org"},"inLanguage":"en"}
]}
```
(`sameAs` only if real profiles exist. Logo PNG at least 112x112, small file.)

**Tool page:**
```json
{"@context":"https://schema.org","@graph":[
 {"@type":"WebApplication","name":"SIP Calculator","url":"https://{DOMAIN}/sip-calculator",
  "description":"(same as meta description)","applicationCategory":"FinanceApplication",
  "operatingSystem":"Any","browserRequirements":"Requires JavaScript","isAccessibleForFree":true,
  "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"inLanguage":"en",
  "dateModified":"2026-09-20","publisher":{"@id":"https://{DOMAIN}/#org"}},
 {"@type":"BreadcrumbList","itemListElement":[
  {"@type":"ListItem","position":1,"name":"Home","item":"https://{DOMAIN}/"},
  {"@type":"ListItem","position":2,"name":"Investments","item":"https://{DOMAIN}/investments"},
  {"@type":"ListItem","position":3,"name":"SIP Calculator"}]}
]}
```
Optional `FAQPage`: only if the visible `<details>` FAQ exists; questions and answers must match the visible text exactly.

**Category hub:** `CollectionPage` + `ItemList` (each tool: `position`, `url`, `name`) + `BreadcrumbList`.
```json
{"@context":"https://schema.org","@graph":[
 {"@type":"CollectionPage","name":"Investment Calculators","url":"https://{DOMAIN}/investments","description":"(meta description)"},
 {"@type":"ItemList","itemListElement":[{"@type":"ListItem","position":1,"url":"https://{DOMAIN}/sip-calculator","name":"SIP Calculator"}]},
 {"@type":"BreadcrumbList","itemListElement":[
  {"@type":"ListItem","position":1,"name":"Home","item":"https://{DOMAIN}/"},
  {"@type":"ListItem","position":2,"name":"Investments"}]}
]}
```
**Static pages:** `AboutPage` / `ContactPage` optional. The visible breadcrumb must match the schema breadcrumb.

## 19. Privacy, cookies and consent

**Google's requirement:** a Google-certified consent management platform (CMP) integrated with the IAB Transparency and Consent Framework is required to serve personalised ads to users in the EEA and UK (since 16 January 2024) and Switzerland (since 31 July 2024). Google does not check the CMP's full legal compliance; the site owner remains responsible. (Source: Google's "Google consent management requirements for serving ads in the EEA, the UK, and Switzerland" help page. Re-check it at build time.)

**Implementation**
- Use a Google-certified CMP. The lowest-effort option is Google's own consent message inside AdSense (Privacy & messaging); confirm in the dashboard. Do NOT design a custom banner. If a custom one is ever needed, it must reuse existing tokens and components and overlay the page without shifting layout.
- `<head>` order: (1) Consent Mode defaults, (2) CMP script, (3) AdSense and analytics scripts, loaded only after the consent state is known.
```html
<script>
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
// Default DENIED for EEA/UK/CH (use the CMP's built-in region rules or a `region` list);
// granted elsewhere unless the CMP or local law says otherwise. Counsel confirms the region set.
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
</script>
<!-- CMP script placeholder -->
<!-- AdSense script placeholder (async, data-ad-client="ca-pub-XXXXXXXXXXXXXXXX") -->
```
- Footer link **"Cookie settings"** reopens the CMP dialog so users can change their choice at any time.
- Regions outside the EU: show notice/opt-out where local law requires it (e.g. US state privacy laws, India's DPDP Act). Have counsel confirm the set; many CMPs include US-state options.
- Analytics default: cookieless/aggregate analytics, or GA4 loaded only after consent. No analytics before consent where consent is required.
- **Never send calculator inputs or results to analytics, logs or any third party.** Events may record names only ("calculate_clicked"), never values.
- Calculator state lives in memory or the URL hash only. Any `localStorage` use (e.g. remembered region) must be listed in the Cookie Policy.
- Self-host fonts (already required): removes a third-party request and a disclosure.
- No other trackers, pixels or social widgets.

## 20. Required pages (structure and content)

All are plain semantic HTML (H1/H2/P/UL) inside the locked header and footer, in a prose column (max-width 700px, Inter, existing tokens). No calculators, no ads, `index,follow`. Each shows "Last updated: {date}" under the H1. **Content must be real** (no lorem ipsum, no placeholder names).

| URL | Must contain |
|---|---|
| `/about` | Who runs the site (real person or entity, country); mission; what the tools are; **how the site makes money (ads)**; link to Methodology; link to Contact |
| `/contact` | A monitored email on the site's own domain (e.g. `hello@{DOMAIN}`); expected response time; how to report a calculation error; a `mailto:` link is enough (a form needs a backend) |
| `/methodology` | Formulas and conventions (e.g. annuity-due, nominal rate compounded monthly); data sources; how and when rates are verified; correction policy; limitations |
| `/privacy-policy` | See outline below |
| `/terms` | Acceptable use; no warranty; limitation of liability; intellectual property; changes to terms; governing law (owner's jurisdiction, counsel to confirm); contact |
| `/disclaimer` | Not financial, tax or legal advice; results are estimates from stated assumptions; returns not guaranteed; rates and laws change; consult a qualified professional; third-party links |
| `/cookie-policy` | Categories of cookies/storage used (necessary, analytics, advertising), purpose, duration, provider; how to change consent (link to Cookie settings) |

**Privacy Policy outline:**
1. Who we are and how to contact us.
2. What we collect: calculator inputs are processed in your browser and not sent to our servers (state only what is true); usage/analytics data; device/IP data processed by advertising and analytics vendors.
3. Cookies and similar technologies, and how to manage them (link to Cookie settings and Cookie Policy).
4. Third-party advertising: Google AdSense uses cookies and identifiers to serve ads. Link Google's "How Google uses information from sites or apps that use our services" page and Ads Settings, and an opt-out route (e.g. aboutads.info).
5. Legal bases and user rights: access, correction, deletion, objection, withdrawal of consent, and how to exercise them (cover GDPR/UK GDPR, India's DPDP Act, and California/US state rights as applicable).
6. Data retention, security, international transfers.
7. Children: the site is not directed at children.
8. Changes to the policy and effective date.

Use a reputable generator or a lawyer for the legal text. It must match the site's real practices (actual analytics, actual cookies, actual ad setup). This document is not legal advice.

Optional on each tool page: a small text link "Report an error" (`mailto:`) under the disclaimer.

## 21. AdSense compliance rules

- **No guarantee.** Google makes the final decision. These rules remove avoidable causes of rejection.
- Ads appear ONLY on pages with substantial publisher content: tool pages (with full content) and hubs. **No ads on:** homepage at launch, 404, Contact, About, Privacy, Terms, Disclaimer, Cookie Policy, empty/error/loading states, the mobile bottom bar or bottom sheet, or any unfinished page.
- **Manual ad units only.** Turn OFF Auto ads. Disable anchor, vignette and other overlay formats at launch (they break the reserved-slot and button-distance rules).
- Launch limit: at most 2 ad units per page, and the first viewport stays ad-free on every device. Content must clearly outweigh ads.
- Every unit sits in its reserved container with the "Advertisement" label (section 9). Nothing styled to look like navigation, results or buttons. Never encourage clicks; never click your own ads.
- Do not modify AdSense code beyond documented parameters. Load it async, after consent state is known.
- No login walls, no intrusive interstitials before content, no auto-playing media.
- Never make claims like "guaranteed returns", "risk-free", "best rates".
- Prohibited-content check before applying: no copied or scraped text, no misleading tools, no dead links, no "under construction" pages.
- Site must be on the final custom domain, HTTPS, publicly crawlable, and the initial tools indexed in Google (check Search Console) BEFORE applying.
- During review: do not change URLs, delete pages or redesign. If rejected: read the stated reason, fix the actual problem, then reapply.

## 22. Pages with no Stitch design (build from existing components, no new visuals)

- **Homepage `/` and `/calculators`:** superseded by section 26.4 (the Figma Home and Directory pages exist). No ad on the homepage at launch.
- **404 page:** H1 "Page not found", one sentence, the existing 44px search input, links to the 5 category hubs and to the homepage. Must return HTTP 404. No ads.
- **Static/legal pages:** as in section 20.

## 23. Infrastructure and security

- Host behind a CDN (Cloudflare Pages, Netlify or Vercel are all fine) on the custom domain. Enforce HTTPS; enable HSTS (`max-age=31536000`) after testing; Brotli compression; HTTP/2 or 3.
- Redirects at the edge: http to https, alternate host to canonical host, trailing slash removal.
- Caching: hashed assets `Cache-Control: public, max-age=31536000, immutable`; HTML `max-age=0, must-revalidate` (or a short CDN TTL).
- Headers: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (minimal), clickjacking protection (`frame-ancestors 'self'`). If a Content-Security-Policy is added it must allow Google's ad and consent domains. Start in Report-Only mode and test with ads and the CMP enabled.
- Set up SPF, DKIM and DMARC for the contact email domain so replies are not marked as spam.
- Add uptime monitoring and a broken-link check to CI.

## 24. Launch gates and runbook

**Gate A: all must be true before going live**
- [ ] Only completed tools are linked, in the sitemap, and in the directory.
- [ ] View-source of every page contains H1, intro, formula, worked example, FAQ, related links and the pre-rendered example result.
- [ ] All test fixtures in section 12 pass; a human has checked every number and every tax/rate statement.
- [ ] Staging `noindex`, auth and `Disallow: /` are removed from production.
- [ ] `robots.txt`, `sitemap-index.xml` and `ads.txt` are live; sitemap URLs are all 200 and canonical.
- [ ] Titles, descriptions, canonicals, OG tags and JSON-LD validated (Rich Results Test) on one page of each type.
- [ ] `curl -I` confirms: http to https 301, alternate host 301, trailing-slash 301, missing page returns 404.
- [ ] About, Contact (working email), Methodology, Privacy, Terms, Disclaimer and Cookie Policy are live with real content.
- [ ] CMP live and tested (EEA test via VPN); "Cookie settings" link works; no ad or analytics request fires before consent where required.
- [ ] Manual ad slots render inside reserved containers; CLS tested with ads on and off; Auto ads off.
- [ ] Lighthouse mobile run on a tool page (performance, accessibility, SEO) with no critical failures; axe accessibility scan clean.
- [ ] Real-device test on a mid-range Android phone and an iPhone.

**Day 0:** create a Search Console **domain property** (DNS TXT verification); submit the sitemap; run URL Inspection on the homepage, a hub and two tool pages; connect Bing Webmaster Tools (import from Search Console).

**Days 1-14:** check the Pages (indexing) report for "Discovered/Crawled, not indexed", soft 404, duplicate-canonical and redirect errors; fix and re-test; watch the Core Web Vitals report once field data appears.

**AdSense application:** apply only when the initial tools are indexed. Add the site, place the AdSense code, confirm `ads.txt`, then wait for review (typically days to a couple of weeks; the time varies). Do not alter the site materially during review.

**Ongoing:** re-verify rates and law-dependent tools on a schedule (record `verifiedOn`), re-check Google's consent and AdSense policy pages each quarter, and add new tools only when fully built.

## 25. UX behaviour spec for cases the boards do not show

These rules use only existing tokens and components. They add no new visual style. **If Figma or a Stitch export disagrees with this document, this document wins** (Figma may still show early effects such as frosted headers, shadows or serif headings, all banned in section 3).

**Breakpoints:** below 640px = mobile; 640-1023px = tablet; 1024px and up = desktop. Tablet uses the mobile pattern (single column, bottom output bar) with wider padding (24px) and a 2-column directory grid. Desktop uses the split layout, a 3-column directory grid and a 1200px container. Test at 360, 390, 768, 1024, 1280 and 1440px.

**Header**
- Desktop nav: superseded by section 26.3 (final header). The "Share Directory" button and "Region" label seen in the Stitch exports remain placeholders and are NOT part of the header.
- **Mobile nav:** the header shows the logo and a 44px menu button (line icon, `aria-expanded`, `aria-controls`). The menu opens as a flat full-width panel under the header: `#FFFFFF`, 1px `#D8DDD9` bottom border, links in 48px rows with 1px dividers (categories, then Methodology). No shadow, no blur. Focus is trapped; Esc or an outside tap closes it; the page behind does not scroll. Menu links stay in the HTML at all times.
- **Theme toggle and language selector:** rendered only when their feature flags are on (section 26.6); hidden by default at launch.

**Repeatable rows (NPV, IRR, XIRR, DCF, Payback, step-up schedules):** built from existing inputs. Each row has its labelled inputs (Year N, or Date + Amount for XIRR) and a ghost 44px "Remove" icon button. A secondary "Add row" button sits below the rows. Minimum 2 rows, maximum defined per tool (default 30). A new row takes focus in its first input; removal is announced via `aria-live`. IRR/XIRR need at least one negative and one positive cash flow, else an inline error. On mobile each row stacks (label above inputs).

**Schedules and long results (EMI amortization, SIP year-by-year):** reuse the worked-example table style in a `<details>` block titled "Year-by-year breakdown" below the split. Yearly rows by default; a segmented control switches to monthly; monthly rows (up to 360) are paginated 12 per page or virtualised. `overflow-x-auto` wrapper; numbers right-aligned, tabular. No CSV or PDF export at launch.

**Result panel flexibility:** 1 hero number plus 2-6 secondary rows depending on the tool (e.g. GST: base, CGST, SGST/IGST, total). The composition bar appears only when parts of a whole are meaningful (SIP, EMI, loans) and is omitted otherwise. The hero is the single number the user most wants. No other chart types at launch.

**Input behaviour**
- Format live while typing, keep the caret position, accept pasted text with symbols/spaces/commas (strip, then reformat). Digits and one decimal point only; `inputmode="decimal"`. Decimal separator is `.` at launch; grouping follows the selected Indian or international format.
- Minus sign only where the tool allows negatives (cash flows).
- Empty field: calculated as 0 internally, shows a "Required" message on blur, and the result never displays NaN, Infinity or a broken number (show the neutral state instead).
- Min/max come from each tool's config. Out-of-range values show the inline error on blur; they are not silently clamped. The slider covers a convenient sub-range: if the typed value is above the slider maximum, the slider rests at its maximum and the input stays valid.
- Slider and numeric input stay in two-way sync; slider keyboard steps use the tool's step.
- Results update live on every valid change (debounced ~100ms). The Calculate button gives the same result; on mobile it also scrolls to and announces the result. Enter in any field triggers Calculate.
- Reset restores the tool's default example values (not zeros) and returns focus to the first input.
- Changing region or currency reformats the displayed values without changing the numbers.

**Touch:** tooltips open on tap (the info button toggles), close on outside tap or Esc; hover-only tooltips are not acceptable. Native `<select>` is used on mobile.

**Copy Result / Share Link:** Copy Result copies a plain-text summary, e.g. "SIP Calculator: ₹25,000/month at 12% p.a. for 15 years gives ₹1,26,14,400 (estimate). {page URL}". Share Link copies the page URL with inputs in the hash, e.g. `#p=25000&r=12&y=15`. Both switch the button to the "Copied!" state for 2 seconds (announced via `aria-live`), using `navigator.clipboard` with a fallback. No toast component. Opening a URL with a valid hash restores the inputs; invalid values are ignored.

**Icons:** one outline icon set (1.5px stroke) as inline SVG, e.g. Lucide or Heroicons outline (both MIT). Do not mix sets; no icon fonts.

**Microcopy:** errors state the fix ("Enter a rate between 1% and 30%"); plain-language labels; units always shown; no exclamation marks; no jargon without a tooltip.

**Verify before build:** the Step 01 header and Step 02 footer were locked before this spec was written. Check their exported files against section 3 (no blur, shadow, glass) and section 25 (nav content, no theme toggle at launch).

## 26. Design fidelity addendum (supersedes conflicting text in sections 7, 14, 22 and 25)

**Owner decision:** the site stays as close as possible to the original Figma pages: layouts, section order, hierarchy, copy tone and the MacBook/Safari window compositions. Only effects that hurt speed are flattened. **Replace the effect, never the composition.** Reference PNGs live in `/design-reference/` (never deployed).

### 26.1 Effect replacement table

| In the Figma page | Build it as |
|---|---|
| Frosted glass / `backdrop-filter` blur (header, windows, tooltips) | Solid `#FFFFFF` (or `#F7F7F4`) + 1px `#D8DDD9` |
| Soft or layered drop shadows | 1px border only |
| Aurora / radial or linear gradient glows | Nothing, or a flat area in `#EEF0EE` / `#176B5B`; glow removed |
| Glowing badge | Flat chip: `#EEF0EE` background, 1px border |
| Hover lift (translate + shadow) | Border colour to `#176B5B`, 120ms |
| Serif headings | Inter 600; letter-spacing `-0.02em` at 32px and above |
| Translucent borders | Solid `#D8DDD9` |
| Noise / film grain | Removed |
| Hand-drawn doodles and arrows | Inline SVG, < 2 KB each, `aria-hidden="true"` |
| Number "ticking" animation | Static values (live update, no easing) |

### 26.2 WindowFrame component (MacBook / Safari look, CSS only)

`WindowFrame.astro`: container 1px `#D8DDD9`, radius 12px, no shadow, no blur, no images. Title bar 40px, `#EEF0EE`, with three 12px dots and an optional URL pill (white, 1px border, 12px text, outline lock icon, e.g. `calcumetrics.com/sip-calculator`). Body is a slot. Dark variant: bar `#2B302D`, body `#171A18`, text `#F7F7F4`. **The three dot colours `#FF5F56`, `#FFBD2E`, `#27C93F` are the only allowed colours outside the token list, and only inside this component.** Used on: Home hero, About hero, Methodology sandbox, 404.

### 26.3 Header (final; supersedes section 25 "Header")

- Left: logo (`Group 1.svg`, 32x32) + "Calcumetrics", linking to `/`.
- Nav: **Home**, **Tools** (chevron; flat dropdown listing the 5 categories with counts, a divider, then "View all calculators" to `/calculators`), **Blog** (only if `SHOW_BLOG_NAV`), **About**. Counts are computed at build from published tools, never hard-coded.
- Right: **Search** (icon button; flat popover with an input and results from a build-time JSON index, lazy-loaded; opens with `/` or Cmd/Ctrl+K), **Currency** (compact select: INR ₹, USD $, EUR €, GBP £; sets the global currency and digit grouping in `localStorage` key `cm_currency`; **one state shared with the calculator card's selector**; pre-rendered default INR; no layout shift on hydrate), **Language** (only if `SHOW_LANGUAGE`), **Theme toggle** (only if `ENABLE_DARK_MODE`).
- Solid `#FFFFFF`, 1px bottom border, no blur, no shadow. Sticky on desktop only; static on mobile.
- Mobile: hamburger (44px) opens a flat full-width panel with a Tools accordion and the currency select. Focus trap, Esc/outside-tap close, links stay in the HTML.
- Methodology, Contact and the legal links live in the footer.

### 26.4 Pages and routes (Figma frame in quotes)

| Route | Figma reference | Notes |
|---|---|---|
| `/` | Home ("Precision Financial Calculators") | Hero with a static, pre-rendered SIP preview inside `WindowFrame` linking to `/sip-calculator`; Most Popular Tools; Browse by Category; "Why Calcumetrics" (true claims only); latest guides (hidden if fewer than 3 published posts); closing CTA block (dark). **No email capture**: replace with two buttons (Browse all calculators, How it works). No ads at launch. |
| `/calculators` | Directory ("The Ultimate Financial Toolkit") | Search, chips, grouped grid, counts computed. |
| `/investments`, `/loans`, `/taxes`, `/business`, `/corporate-finance` | Step 6 Frame B | Hubs with fewer than 4 published tools are `noindex`. |
| `/{tool}-calculator`, `/in/...`, `/us/...` | Step 5 template; WACC page for composition | Section 6 and 25. |
| `/blog` | "Financial Insights & Methodology" | Featured dark card plus recent grid. `noindex` and hidden from nav until at least 5 published posts. |
| `/blog/{slug}` | Article page | 700px prose column; sticky scroll-spy TOC on the left (desktop); 2px teal reading-progress bar (`transform: scaleX`); dark "Playable Math Block" (sliders and live result, client island); `Article` + `BreadcrumbList` JSON-LD; real author only; visible "Last updated". |
| `/about` | About | Hero in `WindowFrame`; flat chip "100% Free · No signup"; dark counters block (values computed from real data); "What makes Calcumetrics different"; plus the required content in section 20 (owner, monetisation via ads). |
| `/methodology` | Methodology | Dark `WindowFrame` sandbox with a live equation and sliders (island); 3-step pipeline (User Input, Engine, Output) as flat SVG/CSS; engineering standards cards; plus the section 20 content (formulas, conventions, sources, verification, corrections, limitations). |
| `/404` | 404 ("The math isn't mathing") | `WindowFrame` with URL pill; giant faded "404" in flat `#EEF0EE`; doodle; CTA "Take me back home"; search and category links. HTTP status must be 404. No ads. |
| `/privacy-policy`, `/terms`, `/disclaimer`, `/cookie-policy`, `/contact` | Privacy Policy | Plain prose pages, 700px column, per section 20. The Figma privacy text is structure only: the final text must be true to actual practice and reviewed by a professional. |

### 26.5 Copy claims to change or verify

- Methodology H1 "Bank-grade accuracy, mathematically proven" is an unverifiable superlative. Use something checkable, e.g. "Every formula, shown and tested."
- Remove or prove: "verified", "guaranteed", "100% accurate", "trusted by ...", any testimonial, award or user count.
- "22+ tools" and every counter must equal the real published count, computed at build.
- No newsletter or email capture (the site is no-signup; it would also need a backend and consent handling).
- Sitewide copy rules in section 10 still apply.

### 26.6 Feature flags (`src/config/site.ts`)

| Flag | Default | Meaning |
|---|---|---|
| `SHOW_BLOG_NAV` | false | Show Blog in the header until at least 5 real posts are published |
| `SHOW_LANGUAGE` | false | A language selector with one language is a dead control; enable only when translated pages exist (with hreflang) |
| `ENABLE_DARK_MODE` | false | Shows the theme toggle once section 26.7 is built and tested |
| `ADS_ENABLED` | false | Render ad slots only after AdSense is approved and IDs are set |
| `PUBLISH_DRAFTS` | false | Production excludes `status: draft` pages from pages, nav, counts, sitemap and search |
| `SITE_URL` | (owner) | Canonical origin |

### 26.7 Dark mode (build last, only after every other gate passes)

Proposed palette (owner to approve; it adds three new neutral colours and three error colours):

| Token | Dark value |
|---|---|
| canvas | `#0F1211` |
| surface | `#171A18` |
| surface-raised (output panel) | `#1F2421` |
| border | `#2B302D` |
| text | `#F7F7F4` |
| muted | `#A8B0AB` (never `#66706B`) |
| accent (links, focus, highlights) | `#5FCDB6` |
| primary button | bg `#176B5B`, text `#FFFFFF` |
| error text / bg / border | `#FDA29B` / `#2A1614` / `#7A271A` |

Rules: `data-theme` on `<html>`; a tiny inline script in `<head>` sets the theme before first paint (no flash, no layout shift); default = OS preference until the user chooses; every template and component verified for contrast (>= 4.5:1). All section 3 prohibitions still apply in dark mode.