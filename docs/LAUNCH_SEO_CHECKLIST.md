# Calcumetrics — Launch SEO & First 30 Days Action Plan

> **Document Type:** Operational Go-Live Playbook & Indexation Monitoring Plan  
> **Target Domain:** `https://calcumetrics.com`  
> **Infrastructure:** Astro Static Site, Cloudflare Pages, Global CDN  
> **Audited Baseline Date:** 2026-09-24  

---

## 1. Launch-Day Verification Steps (Hour 0 to Hour 24)

Execute these operational steps immediately upon DNS cutover to production:

### 1.1 Infrastructure & DNS Validation
- [ ] **Apex Domain & CNAME Configuration:** Verify Cloudflare Pages custom domain binding for `calcumetrics.com`. Ensure CNAME flattening is active on the apex domain.
- [ ] **WWW to Non-WWW Canonical Redirect:** Confirm that `https://www.calcumetrics.com` permanently redirects (HTTP 301) to `https://calcumetrics.com/` without chaining.
- [ ] **HTTPS & HSTS Enforcement:** Confirm HTTP requests automatically upgrade to HTTPS with strict transport security (`max-age=31536000; includeSubDomains; preload`).
- [ ] **Cloudflare Preview Host Disallow:** Verify `calcumetrics.pages.dev` and all `*.pages.dev` branch deployments serve `X-Robots-Tag: noindex, nofollow` headers via `public/_headers`.

### 1.2 Robots.txt & Sitemaps Validation
- [ ] **Live robots.txt Inspection:** Fetch `https://calcumetrics.com/robots.txt` in a clean browser session. Confirm exact content:
  ```txt
  User-agent: *
  Allow: /

  Sitemap: https://calcumetrics.com/sitemap-index.xml
  ```
- [ ] **Sitemap Index Delivery:** Fetch `https://calcumetrics.com/sitemap-index.xml` and verify it serves `content-type: application/xml` and references:
  1. `https://calcumetrics.com/sitemap-tools.xml` (50 published calculators)
  2. `https://calcumetrics.com/sitemap-hubs.xml` (5 category hubs)
  3. `https://calcumetrics.com/sitemap-pages.xml` (41 static and blog pages)
- [ ] **Sitemap Header & Status Check:** Verify all child sitemaps return HTTP 200, valid ISO 8601 `lastmod` dates, and contain zero 404, redirect, or noindex URLs.

### 1.3 404 & Soft-404 Validation
- [ ] **Error Status Header:** Request a non-existent URL (e.g., `https://calcumetrics.com/non-existent-page-test`). Ensure the server returns HTTP 404 (Not Found) rather than HTTP 200 with an error template.
- [ ] **Error Page Navigation:** Verify the 404 page renders a functional search box and navigation back to `/calculators` and category hubs.

### 1.4 Webmaster Tools Registration
- [ ] **Google Search Console (GSC):**
  - Add domain property `calcumetrics.com` via DNS TXT verification on Cloudflare DNS.
  - Submit sitemap index: `https://calcumetrics.com/sitemap-index.xml`.
  - Confirm sitemap status transitions to "Success".
- [ ] **Bing Webmaster Tools:**
  - Import verified property from Google Search Console or verify via DNS.
  - Submit sitemap index `https://calcumetrics.com/sitemap-index.xml`.

### 1.5 Live URL Inspection & Fast-Track Crawl Requests
Perform "URL Inspection" in GSC and click "Request Indexing" for the following 6 core representative templates:
1. **Homepage (`/`)** — Hub authority and site-wide branding.
2. **SIP Calculator (`/sip-calculator`)** — Primary global investment template.
3. **EMI Calculator (`/emi-calculator`)** — Primary global loan template.
4. **Income Tax Calculator (`/in/income-tax-calculator`)** — Flagship India statutory YMYL tool.
5. **Break-Even Calculator (`/break-even-calculator`)** — Primary global business template.
6. **WACC Calculator (`/wacc-calculator`)** — Flagship corporate finance valuation tool.

---

## 2. Weekly Search Console Monitoring Plan (First 30 Days)

### Week 1 (Days 1–7): Crawl Ingestion & Host Stability
- **Focus:** Host connectivity, robots.txt fetch rate, DNS health, and sitemap processing.
- **Key Metrics to Track:**
  - GSC > Settings > Crawl stats: Average response time (<200ms expected on Cloudflare edge).
  - Sitemaps status: Verify Googlebot discovered all 96 published URLs.
- **Action Items:**
  - Verify Googlebot smartphone is the primary crawler.
  - Ensure zero "Server error (5xx)" or "Failed: Host unreachable" incidents.

### Week 2 (Days 8–14): Index Coverage Triage
- **Focus:** First wave of Page Indexing reports in GSC.
- **Triage Matrix:**
  | GSC Status | Probable Cause | Action Protocol |
  |---|---|---|
  | **Discovered – currently not indexed** | Google knows the URL exists (from sitemap/links) but has not scheduled crawl due to crawl budget or domain freshness. | • Confirm internal links exist from high-traffic pages.<br>• Do NOT resubmit repeatedly.<br>• Verify URL is in sitemaps.<br>• Wait 7–10 days as domain trust establishes. |
  | **Crawled – currently not indexed** | Google crawled the page but decided not to index it (often thin content, repetitive boilerplate, or lack of search demand signals). | • Inspect page content depth.<br>• Verify formula, unique worked example, and FAQ are intact.<br>• Expand page text by 200–300 words with unique edge cases.<br>• Add 2–3 contextual internal links from relevant blog articles. |
  | **Duplicate without user-selected canonical** | Google detected multiple URLs resolving to identical content. | • Verify self-referencing canonical tag is present and matches the exact URL protocol/case.<br>• Ensure trailing slash consistency. |
  | **Page with redirect** | Outdated or mismatched URL linked internally. | • Update internal links to point directly to the destination URL. |

### Week 3 (Days 15–21): Query Impressions & SERP Snippet Optimization
- **Focus:** Search Performance data (Queries, Pages, Countries, Devices).
- **Key Metrics to Track:**
  - Impressions by category: Investments, Loans, Taxes, Business, Corporate Finance.
  - Queries ranking on pages 2–5 (positions 11–50) with high impression counts.
- **Action Items:**
  - Identify queries where Calcumetrics ranks for secondary keywords.
  - If a calculator ranks on page 2 for a specific calculation nuance, add a dedicated subsection or FAQ addressing that exact query.
  - Review SERP CTR. If impressions are high but CTR <2%, refine the meta description with clearer intent matching.

### Week 4 (Days 22–30): Authority Consolidation & AdSense Eligibility Check
- **Focus:** Stable indexation percentage (>85% of URLs indexed), steady organic impressions, zero spam manual actions.
- **Action Items:**
  - Audit Google's indexed URL count via `site:calcumetrics.com` query and GSC Indexing report.
  - Perform the AdSense Readiness Go/No-Go assessment (Section 4).

---

## 3. Top 10 Pages to Improve First (Data-Backed Audit Selection)

These 10 pages were identified directly from our 18-point pre-launch audit as having the greatest leverage for organic growth, content expansion, or regulatory compliance:

| Rank | Page URL | Audit Finding | Content Expansion Plan |
|:---:|---|---|---|
| **1** | `/cagr-calculator` | Lowest main text word count in catalog (483 words). | Add multi-period investment growth comparison table, CAGR vs IRR vs XIRR decision matrix, and inflation-adjusted CAGR formulas. |
| **2** | `/simple-interest-calculator` | Second lowest main word count (496 words). | Add simple vs compound interest breakeven timeline, Treasury bill discount yield comparison, and consumer lending flat-rate disclosures. |
| **3** | `/break-even-calculator` | High commercial intent; currently 752 words. | Add multi-product break-even formulas (weighted contribution margin), margin of safety calculation, and operating leverage sensitivity. |
| **4** | `/npv-calculator` | Core corporate finance tool (795 words). | Add capital rationing decisions, uneven cash flow scenarios, and NPV vs IRR conflict resolution (reinvestment rate paradox). |
| **5** | `/fd-calculator` | High retail search volume in India (803 words). | Add cumulative vs non-cumulative quarterly compounding mechanics, TDS rules under Section 194A (Form 15G/15H thresholds), and senior citizen rate delta explanations. |
| **6** | `/irr-calculator` | Flagship financial tool (833 words). | Add multiple internal rates of return (Descartes' rule of signs), modified internal rate of return (MIRR) alternative explanation, and reinvestment rate assumption traps. |
| **7** | `/wacc-calculator` | Corporate finance valuation anchor (858 words). | Add CAPM cost of equity breakdown, market value vs book value debt weighting guide, and corporate tax shield impact across debt ratios. |
| **8** | `/compound-interest-calculator` | High global competition (861 words). | Add Rule of 72/114/144 quick approximations, continuous compounding formula ($A = Pe^{rt}$), and frequency comparison table (daily vs monthly vs annual). |
| **9** | `/rd-calculator` | High India retail volume (892 words). | Add quarter-by-quarter compounding accrual table, premature closure penalty rules, and taxation under Income Tax slab vs TDS rules. |
| **10** | `/in/upi-mdr-calculator` | High regulatory sensitivity; impending Oct 15 circular changes. | Monitor NPCI/RBI interchange circular revisions. Update PPI merchant transaction slab tiers and interchange rate tables immediately upon release. |

---

## 4. Google AdSense Go / No-Go Checklist

Calcumetrics enforces strict separation between site launch and AdSense application. Applying prematurely before establishing organic search traffic and editorial history is the leading cause of "Low Value Content" rejections.

### 4.1 Prerequisites (Pass / Fail Criteria)

| Category | Prerequisite Requirement | Status | Go / No-Go Criteria |
|---|---|:---:|---|
| **Traffic** | Site must have minimum 30 days of live history with organic search impressions and steady real user sessions. | **PENDING** | **FAIL** — Cannot apply on Day 1. Wait for 30–60 days of indexed traffic. |
| **Content Uniqueness** | Less than 15% pairwise similarity across all calculators and articles (confirmed 13.01% max). | **PASS** | **GO** — Robust content separation across all 50 tools and 30 blog posts. |
| **Trust & Legal Pages** | About, Contact, Methodology, Privacy Policy, Terms, Disclaimer, Cookie Policy live and linked in footer. | **PASS** | **GO** — All 7 trust pages exist with clear methodology disclaimers. |
| **Ad Code State** | `ADS_ENABLED = false` in `src/config/site.ts`. Zero empty ad boxes or layout shifts. | **PASS** | **GO** — No ad placeholders or empty containers render in production. |
| **Publisher ID in ads.txt** | `public/ads.txt` contains placeholder `pub-XXXXXXXXXXXXXXXX`. | **PENDING** | **HOLD** — Keep placeholder until Google assigns official AdSense Publisher ID upon application submission. |
| **Consent & CMP** | Google-certified CMP (Consent Management Platform) integrated before ad script activation. | **PLANNED** | **HOLD** — CMP script placeholder ready; must be activated concurrently with `ADS_ENABLED = true`. |
| **Editorial E-E-A-T** | Clear "Methodology reviewed by the Calcumetrics team" and verified regulatory sources. | **PASS** | **GO** — No unverified claims or fake credential assertions. |

### 4.2 Application Readiness Verdict
- **Launch Day Indexation Deployment:** **YES (READY)** — SEO technical foundation, heading hierarchy, metadata, schemas, and sitemaps are 100% verified.
- **Immediate AdSense Application:** **NO (HOLD)** — Maintain ad-free user experience for the first 30–60 days while Google Search Console indexes the catalog and establishes domain crawl trust. Submit for AdSense only after achieving stable organic search impressions.
