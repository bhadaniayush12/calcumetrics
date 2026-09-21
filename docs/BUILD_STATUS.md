# Calcumetrics — BUILD STATUS

> Repository baseline and verified findings log.
>
> Rule: Only verified facts belong here. New findings must be added after direct
> code, route, build, browser, or test verification.

---

# VERIFIED FINDINGS LOG

This historical findings log is preserved from the repository audit roadmap.

- ✅ Design tokens (`global.css`) — light + dark, all hex values matched the locked specification at the time of audit.
- ✅ Header structure (`Header.astro`) — Home / Tools / Blog (conditional) / About + Search / Currency / Language / Dark toggle structure was verified at the time of audit, with accessible markup such as `aria-expanded` and `role="menu"`.
- ✅ `src/` audit — no live component was found violating the approved blur/box-shadow/glassmorphism direction. `Slider.astro` linear-gradient was identified as a legitimate hard-stop progress-fill technique rather than a visual gradient.
- ✅ `WindowFrame.astro` — flattened macOS-style frame with no shadow and no blur; the three window dots were documented as a controlled exception.
- ⚠️ `src/components/Welcome.astro` — default Astro scaffold leftover; identified as dead/unused code during the audit and marked for later cleanup.
- 🐛 CONFIRMED BUG — `src/pages/in/gst-calculator.astro` and `src/pages/in/income-tax-calculator.astro` were found to listen to the global `cm:currency-change` event and `localStorage.cm_currency`, causing India-specific calculators to respond to the global currency selector. Fix status must be verified separately.
- 📊 Historical repo-audit tool count at that point: 33 published + 1 draft = 34 total. The current scope registry has since been expanded and is documented separately in the current scope documents.
- ⚠️ Dark mode toggle was found to be live in code with persistent state and dark tokens; launch treatment remained a separate product decision.
- ⚠️ Hindi (`HI / हिन्दी`) existed as a selectable language option during the audit; English-only launch was the approved direction, so actual UI removal/hiding must be tracked separately.

---

# CURRENT VERIFIED BASELINE

## Phase 1.1 — Repository Branch

Branch:

`dev/phase-1-repo-baseline`

Tracking:

`origin/dev/phase-1-repo-baseline`

Working tree:

`clean`

Branch creation and clean-state verification completed successfully.

## Phase 1.2 — Build Baseline

### npm install

Status: PASS

- Dependencies installed successfully.
- 227 packages audited.
- 0 vulnerabilities reported.
- npm reported an install-script approval warning for `fsevents@2.3.3`; this was a warning, not a build/test failure.

### npm test

Status: PASS

- Test files: 2 passed
- Tests: 19 passed
- Command: `vitest run`

### npm run build

Status: PASS

- Astro static build completed successfully.
- Output mode: `static`
- Pages built: 48

## Phase 1.3 — Route Inventory

### Source route files

`src/pages` contains 52 files.

This consists of:

- 48 `.astro` page files
- 4 sitemap `.ts` route files

### Generated routes

The successful static build produced:

- 48 HTML pages
- 4 sitemap routes

Total generated route files represented by page/sitemap routes: 52.

### HTTP smoke test

Verified local responses:

- `/` → 200
- `/calculators` → 200
- `/sip-calculator` → 200
- `/in/income-tax-calculator` → 200
- `/us/401k-calculator` → 200
- `/blog` → 404
- `/this-route-does-not-exist` → 404

### Duplicate routes

No obvious duplicate route was identified from the source/build route inventory.

### Known route exception

UPI MDR currently builds at:

`/upi-mdr-calculator`

The registry target is:

`/in/upi-mdr-calculator`

Physical route migration remains deferred to a dedicated routing task. Do not treat this document as completion of that migration.

### Planned tools

Planned tools are not being emitted as production routes in the current build inventory.

---

# Phase 1.4 — Component Inventory

## Components

`src/components` contains 16 files.

### Shared/site components

- Header.astro
- Footer.astro
- Welcome.astro

### Calculator components

- CalculatorLayout.astro
- CompositionBar.astro
- Slider.astro
- WindowFrame.astro

### Generic UI components

- AdSlot.astro
- Alert.astro
- Button.astro
- Card.astro
- Chip.astro
- Dropdown.astro
- Input.astro
- SearchModal.astro
- Tooltip.astro

## Layouts

`src/layouts` contains:

- Layout.astro

## Calculation library

`src/lib` contains 25 files in the current inventory, including:

- calculator engines
- formatter
- calculator test suite

## Configuration

`src/config` contains:

- site.ts
- site.test.ts

## Styles

`src/styles` contains:

- global.css

---

# KNOWN ISSUES / DEFERRED ITEMS

These are findings that are intentionally not being fixed inside the Phase 1 baseline inventory task.

1. UPI MDR physical route still requires migration from `/upi-mdr-calculator` to `/in/upi-mdr-calculator`.

2. India-specific currency-jurisdiction behavior must be separately re-verified and, where necessary, fixed so India-specific calculators remain INR-locked.

3. `Welcome.astro` is a known dead/default scaffold candidate for later cleanup.

4. Header language UI still requires confirmation against the English-only launch decision.

5. Dark-mode launch treatment remains a separate product/UI decision.

---

# NOT YET AUDITED IN PHASE 1

The following areas are not declared resolved by this baseline document:

- Full component state audit
- Full browser/device QA
- Full internal-link crawl
- Full duplicate-content/canonical audit
- Calculator-by-calculator behavioral audit
- Current tax-law correctness audit
- Full accessibility audit
- Production Cloudflare deployment verification
- Search Console/indexing verification

---

# PHASE STATUS

- Phase 1.1 — LOCKED
- Phase 1.2 — LOCKED
- Phase 1.3 — LOCKED
- Phase 1.4 — LOCKED
- Phase 1.5 — IN PROGRESS

---

# BASELINE RULE

Do not modify source implementation merely to make this document look cleaner.

A finding changes status only after direct verification.

When a future task changes repository behavior, update this document with:

- what changed
- why it changed
- how it was verified
- test/build result
- commit reference

