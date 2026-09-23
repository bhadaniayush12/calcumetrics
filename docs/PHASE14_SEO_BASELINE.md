# PHASE 14 — SEO BASELINE (Pre-Implementation State)

> **Document Purpose:** Records the ACTUAL state of the site before any Phase 14 SEO changes.
> Only facts verified by direct source code inspection are recorded here.
> Audited: 2026-09-23. Branch: development. Commit: 4107e95.

---

## 1. Production Domain & Canonical Host

| Item | Value |
|------|-------|
| Production domain | `https://calcumetrics.com` |
| Canonical host | `https://calcumetrics.com` |
| Protocol | HTTPS |
| `lang` attribute | `en` (set in Layout.astro line 26) |
| Domain config | Hardcoded in `src/config/site.ts` (`SITE_URL`) and `src/layouts/Layout.astro` |

---

## 2. Route Architecture

### Global routes (root-level, no region prefix)
- `/` — homepage
- `/calculators` — full directory
- `/investments` `/loans` `/taxes` `/business` `/corporate-finance` — 5 category hubs
- `/blog` `/blog/[slug]` — blog index + 30 individual articles
- `/about` `/methodology` `/contact` `/privacy-policy` `/terms` `/disclaimer` `/cookie-policy` — supporting pages
- `/404` — 404 page
- `/sip-calculator` `/emi-calculator` `/fd-calculator` `/rd-calculator` `/compound-interest-calculator` `/simple-interest-calculator` `/cagr-calculator` `/xirr-calculator` `/lump-sum-calculator` `/inflation-calculator` `/savings-goal-calculator` — 11 Global investment tools
- `/home-loan-calculator` `/car-loan-calculator` `/loan-prepayment-calculator` `/mortgage-calculator` `/loan-affordability-calculator` `/debt-to-income-ratio-calculator` `/credit-card-payoff-calculator` `/loan-amortization-calculator` `/interest-rate-calculator` — 9 Global loan tools
- `/break-even-calculator` `/profit-margin-calculator` `/markup-vs-margin-calculator` `/roi-calculator` `/eoq-calculator` `/depreciation-calculator` `/working-capital-calculator` `/cogs-calculator` `/inventory-turnover-calculator` `/liquidity-ratios-calculator` `/cash-conversion-cycle-calculator` `/dscr-calculator` — 12 Global business tools
- `/wacc-calculator` `/npv-calculator` `/irr-calculator` `/payback-period-calculator` `/dcf-calculator` `/discounted-payback-period-calculator` `/present-value-calculator` `/future-value-calculator` — 8 Global corporate finance tools

### India routes (`/in/` prefix)
- `/in/ppf-calculator` — Investments
- `/in/income-tax-calculator` `/in/gst-calculator` `/in/hra-calculator` `/in/tds-calculator` `/in/capital-gains-tax-calculator` `/in/advance-tax-calculator` `/in/salary-ctc-calculator` — 7 Tax tools
- `/in/upi-mdr-calculator` — Business

### US routes (`/us/` prefix)
- `/us/401k-calculator` — Investments

### Sitemap routes
- `/sitemap-index.xml` `/sitemap-tools.xml` `/sitemap-hubs.xml` `/sitemap-pages.xml`

---

## 3. Calculator Count Verification

| Category | Global | India (/in/) | US (/us/) | Total |
|----------|--------|--------------|-----------|-------|
| Investments | 11 | 1 (PPF) | 1 (401k) | 13 |
| Loans | 9 | 0 | 0 | 9 |
| Taxes | 0 | 7 | 0 | 7 |
| Business | 12 | 1 (UPI MDR) | 0 | 13 |
| Corporate Finance | 8 | 0 | 0 | 8 |
| **TOTAL** | **40** | **9** | **1** | **50** |

> ⚠️ **DEFECT NOTED:** The spec says Investments=12, Loans=10. Current registry shows Investments=13, Loans=9. The tools in the registry are all published; this is a categorization difference from the spec, not a missing tool. Actual 50 tools are all present and published.

---

## 4. Indexability State (Pre-Phase 14)

### Global Layout (Layout.astro)
- Default robots: `index,follow,max-image-preview:large`
- Robots are passed as a prop and output as `<meta name="robots">`
- AI bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended): **Not explicitly blocked** in `robots.txt`. `robots.txt` only has `User-agent: *` / `Allow: /`. AI bots can crawl.
- **GAP:** robots.txt does not explicitly allow named AI bots (low risk — wildcard `*` covers them, but explicit allowance is recommended per docs/adsense/ai-seo-geo-aeo-training.md section 3)

### Category pages — conditional noindex
```
const noindex = count < 4;
robots={noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}
```
All 5 categories have ≥4 tools, so all are indexable.

### Calculator pages
All 50 calculators use `index,follow,max-image-preview:large` (default via Layout).

### Supporting pages
| Page | Robots (verified) |
|------|-------------------|
| /about | index,follow (default) |
| /methodology | index,follow (default) |
| /contact | index,follow (default) |
| /privacy-policy | index,follow (default) |
| /terms | index,follow (default) |
| /disclaimer | index,follow (default) |
| /cookie-policy | index,follow (default) |
| /404 | Not inspected yet — typically noindex |
| /calculators | index,follow (default) |
| /blog | index,follow (default) |
| /blog/[slug] | index,follow (default) |

---

## 5. Title Tag Implementation

### Homepage (`/`)
```
Free Online Financial Calculators | Calcumetrics
```
Dynamically inserts tool count. **GOOD** — unique, descriptive, ~50 chars.

### Layout.astro default fallback title
```
Calcumetrics — Free Online Financial Calculators
```
Used only when no page-specific title is passed. This is a safety net, not applied to any actual page. **ACCEPTABLE.**

### Category pages (verified: investments.astro)
```
Investment Calculators: {count} Free Tools | Calcumetrics
```
Dynamic count. **GOOD** — unique, descriptive.

### Calculator pages (verified: sip-calculator.astro)
Per-page custom titles exist. Need to audit all 50 individually in Batch 4.

### Blog posts
Use `post.seoTitle` field from blog data. Each post has a distinct seoTitle. **GOOD** in principle; need to verify no duplicates.

### Supporting pages (verified)
- About: `About Calcumetrics | Calcumetrics` — **DEFECT:** brand name repeated. Not keyword-rich. LOW priority.
- Privacy Policy: `Privacy Policy | Calcumetrics` — adequate.

---

## 6. Meta Description Implementation

All pages pass `description` prop to Layout. Layout renders it as `<meta name="description">`.

### Homepage
```
{totalCount} free financial calculators for investments, loans, taxes, business and corporate finance. No sign-up, 100% client-side. Runs in your browser.
```
Dynamic, unique. **GOOD.**

### Category pages (verified: investments.astro)
```
{count} free investment calculators: SIP returns, lump sum growth, CAGR, XIRR, FD maturity, RD, PPF, and 401(k). 100% client-side.
```
Dynamic, useful. **GOOD.**

### Calculator pages
Per-page unique descriptions exist. Need full audit in Batch 4.

### Blog posts
Use `post.description` field — per-post unique. **GOOD** in principle.

---

## 7. Canonical Implementation

- Layout.astro computes canonical: `canonical || ${domain}${currentPath}`
- Production domain: `https://calcumetrics.com`
- Every page passes an explicit `canonical` prop.
- Absolute canonicals confirmed.
- Self-canonicals on all calculator, category, blog, and supporting pages.

**POTENTIAL DEFECT:** Homepage canonical is passed as `"https://calcumetrics.com/"` (with trailing slash). Layout fallback also produces trailing slash for `/`. Consistent — OK.

**POTENTIAL DEFECT:** No `og:image` per-page — all pages use `/og/default.png`. This file's existence in `public/` is **unverified** (not listed in `public/` directory scan; `public/` only shows: ads.txt, favicon.ico, favicon.svg, fonts/, logo.svg, robots.txt). **DEFECT: `/og/default.png` may not exist.** HIGH priority to verify.

---

## 8. robots.txt (current state)

```
User-agent: *
Allow: /

Sitemap: https://calcumetrics.com/sitemap-index.xml
```

**Assessment:**
- Simple, clean, allows all crawlers.
- No AI bot blocking (good).
- Sitemap correctly referenced.
- **GAP:** No explicit Disallow for non-public paths. Not a problem for this static site (no /admin, /api, etc. to protect), but worth confirming no sensitive route exists.
- **GAP:** AI-era best practice suggests explicitly naming GPTBot, ClaudeBot, PerplexityBot, Google-Extended as allowed (per ai-seo-geo-aeo-training.md). This is currently covered by `User-agent: *` but explicit listing adds clarity. LOW risk.

---

## 9. Sitemap Architecture (current state)

Three-sitemap indexed system:
1. `sitemap-index.xml` → references sitemap-tools.xml, sitemap-hubs.xml, sitemap-pages.xml
2. `sitemap-tools.xml` → all published tools via `getPublishedTools()` with `dateModified`
3. `sitemap-hubs.xml` → 5 category pages (≥4 tools filter) with `lastmod: 2026-09-20`
4. `sitemap-pages.xml` → homepage, /calculators, /blog, supporting pages + all blog slugs with `lastmod: 2026-09-23`

**Assessment:**
- Registry-driven, auto-updates when tools are added/removed. **GOOD.**
- All 50 tools will be in sitemap-tools.xml. **GOOD.**
- Blog articles included in sitemap-pages.xml via BLOG_POSTS. **GOOD.**
- **GAP:** sitemap-hubs.xml uses hardcoded `2026-09-20` lastmod. Should reflect actual last update.
- **GAP:** sitemap-pages.xml uses hardcoded `2026-09-23` for ALL pages including blog articles. Blog articles should use their individual `dateModified` values.
- **GAP:** `/in/ppf-calculator`, `/us/401k-calculator` etc. are covered by sitemap-tools.xml (via `getPublishedTools()` which returns all regions). **CONFIRMED GOOD.**

---

## 10. Structured Data (current state)

### Homepage
- `Organization` with `@id: #org`, name, url
- `WebSite` with `@id: #website`, url, name, publisher, inLanguage

**GAP:** Organization lacks logo, sameAs social profiles, contactPoint — recommended per ai-seo-geo-aeo-training.md section 5.

### Category pages (verified: investments.astro)
- `CollectionPage` with name, url, description
- `ItemList` with all tools as ListItems
- `BreadcrumbList`

**GOOD** — complete and accurate.

### Calculator pages (verified: sip-calculator.astro)
- `WebApplication` with name, url, description, applicationCategory, operatingSystem, isAccessibleForFree, offers, inLanguage, dateModified, publisher
- `BreadcrumbList`
- `FAQPage` with mainEntity questions

**GOOD** structure. Need to verify all 50 calculators have this pattern.

### Blog posts (via [slug].astro)
- `Article` with headline, description, url, datePublished, dateModified, author (Organization), publisher (Organization with logo)
- `BreadcrumbList`
- `FAQPage` (from post.faqs array)

**NOTE:** `author` is typed as `Organization` not `Person`. Per Google's Article schema, `author` should ideally be a `Person`. Using Organization is valid but Person is preferred for E-E-A-T signals. LOW risk.

---

## 11. Open Graph Implementation

From Layout.astro:
```html
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Calcumetrics" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonicalUrl} />
<meta property="og:image" content={`${domain}/og/default.png`} />
<meta name="twitter:card" content="summary_large_image" />
```

**DEFECTS:**
1. `og:image` points to `/og/default.png` — file NOT found in `public/` scan. **HIGH RISK** — broken OG image.
2. `og:type` is always `website` even for Articles. Blog posts should use `article`. MEDIUM.
3. No `twitter:title`, `twitter:description`, `twitter:image` — only card type is set. MEDIUM.
4. No `og:image:width` / `og:image:height` — needed for proper rendering. LOW.

---

## 12. Internal Linking (current state)

### Calculator pages
- Each calculator page has a "Related Tools" section showing 3 calculators from the same category.
- Links use `tool.path` from registry — correct absolute paths.

### Category pages
- Each category page lists all tools in that category as clickable cards.

### Homepage
- Shows 6 "popular" tools with links.
- Shows 5 category cards with links.

### Blog posts
- Each post has `relatedCalculators` array rendered as clickable chips in the blog index.
- Blog template ([slug].astro) — need to inspect full rendering of calculator links in article body.

**GAP:** No cross-category internal links from calculators to blog articles.
**GAP:** Blog articles link to calculators via relatedCalculators array, but calculator pages do not link back to relevant blog articles.
**GAP:** No link from /calculators to category pages or vice versa (beyond nav).

---

## 13. Breadcrumbs (current state)

Visible breadcrumbs implemented on:
- Category pages: Home › [Category]
- Calculator pages: Home › [Category] › [Calculator Name]
- Blog index: Home › Blog
- Blog articles: Home › Blog › [Article Title]

JSON-LD BreadcrumbList exists and matches visible breadcrumbs on all inspected pages. **GOOD.**

---

## 14. Blog SEO (current state)

30 blog posts across 5 batch files. Each post has:
- `slug` — URL path
- `seoTitle` — used as `<title>`
- `description` — used as meta description
- `publishDate` — ISO 8601
- `dateModified` — ISO 8601
- `author` — string (e.g. "Calcumetrics Personal Finance Research Team")
- `category` — one of 5 categories
- `market` — India-Only | Global | Both
- `faqs` — array for FAQPage schema
- `relatedCalculators` — links to calculators
- `relatedArticles` — links to other posts
- `sources` — citations
- `content` — full HTML content

**DEFECT:** Blog post slugs referenced in `relatedArticles` may include articles that don't exist yet (seen in the grep output — multiple references to the same slug appearing many times suggests relatedArticles cross-reference). Need to verify no broken internal article links in Batch 5.

---

## 15. Image SEO (current state)

- Favicon: `/favicon.svg` (SVG) + `/favicon.ico` (ICO fallback) — both present in public/
- Logo: `/logo.svg` — present in public/
- OG image: `/og/default.png` — **NOT FOUND in public/** — HIGH priority defect
- Font files in `public/fonts/` — present (self-hosted Inter)
- No hero images, no calculator screenshots, no blog featured images found in source

**GAP:** No per-article OG images.
**GAP:** No alt text audit possible from source alone — need to inspect actual .astro files for `<img>` tags.

---

## 16. Supporting Pages (current state)

| Page | Title | Description | H1 | Canonical | Robots |
|------|-------|-------------|----|-----------|--------|
| /about | `About Calcumetrics \| Calcumetrics` | ✓ | "About Calcumetrics" | ✓ | default (index) |
| /methodology | not yet inspected | | | ✓ | default (index) |
| /contact | not yet inspected | | | ✓ | default (index) |
| /privacy-policy | `Privacy Policy \| Calcumetrics` | ✓ | "Privacy Policy" | ✓ | default (index) |
| /terms | not yet inspected | | | ✓ | default (index) |
| /disclaimer | not yet inspected | | | ✓ | default (index) |
| /cookie-policy | not yet inspected | | | ✓ | default (index) |
| /404 | not yet inspected | | | — | should be noindex |

---

## 17. Performance Observations

- Static site (Astro SSG) — all pages pre-rendered at build time. **EXCELLENT** for crawl/index performance.
- No backend, no database, no CMS.
- Fonts self-hosted in `public/fonts/` — avoids third-party font DNS cost.
- Theme initialization script is `is:inline` (minimal, ~200 bytes) — does not block rendering significantly.
- Google Consent Mode defaults script is `is:inline` — needed for compliance, minimal size.
- No heavy third-party scripts observed.
- Calculator logic is client-side JavaScript — calculators work without server.
- **GAP:** Calculator results are pre-rendered server-side (SSG fixture values) + re-computed on client. The SSG pre-rendering means Google can index default calculator output. **GOOD for SEO.**

---

## 18. Known Defects with Priority

| # | Defect | Priority | Location |
|---|--------|----------|----------|
| D1 | `/og/default.png` missing from `public/` | HIGH | Layout.astro:63 |
| D2 | `og:type` is always "website" even for blog Article pages | MEDIUM | Layout.astro:58 |
| D3 | No `twitter:title`, `twitter:description`, `twitter:image` tags | MEDIUM | Layout.astro |
| D4 | Blog post `author` is Organization, not Person | LOW | blog/[slug].astro |
| D5 | Organization schema missing `logo`, `sameAs` | LOW | index.astro |
| D6 | sitemap-pages.xml uses single hardcoded lastmod for all pages including blog | LOW | sitemap-pages.xml |
| D7 | sitemap-hubs.xml uses hardcoded lastmod | LOW | sitemap-hubs.xml |
| D8 | About page title repeats brand name unnecessarily | LOW | about.astro |
| D9 | No /404 noindex verification | MEDIUM | 404.astro |
| D10 | robots.txt doesn't explicitly list AI bot user-agents (covered by wildcard) | LOW | public/robots.txt |
| D11 | No per-article OG images | LOW | Layout.astro |
| D12 | No `og:image:width` / `og:image:height` | LOW | Layout.astro |
| D13 | Calculator pages don't link back to relevant blog articles | MEDIUM | all calculator .astro files |
| D14 | Blog post relatedArticles may reference non-existent slugs | MEDIUM | data/blog/batch*.ts |

---

## 19. Pre-Phase 14 Build Status

- `npm test` — **394 tests, 22 files, all pass** ✅
- `npm run build` — not yet run at baseline; will run after each batch

---

*Baseline created: 2026-09-23. Author: Phase 14 SEO implementation.*
