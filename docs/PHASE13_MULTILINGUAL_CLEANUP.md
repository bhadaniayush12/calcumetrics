# Phase 13: Removal of Deferred Multilingual Feature

- **STATUS:** COMPLETE
- **DATE:** 2026-09-23
- **BRANCH:** `development`
- **OBJECTIVE:** Complete removal of deferred multilingual/i18n feature remnants before Phase 14 SEO.
- **LAUNCH LANGUAGE:** English only (`<html lang="en">`)

---

## 1. Context & Rationale

Multilingual/localization functionality has been deferred until a future analytics-driven phase. Rather than merely hiding the UI with a boolean flag, all dead runtime code, state listeners, and marker attributes have been excised to keep the production codebase clean, maintainable, and strictly English-only for launch.

---

## 2. Remnants Removed

### Configuration
- Removed `SHOW_LANGUAGE = false` from `src/config/site.ts`.

### Component: `src/components/Header.astro`
- Removed unused `SHOW_LANGUAGE` import.
- Removed desktop language dropdown (`#header-lang-btn`, `#header-lang-menu`, `#current-lang-label`, EN / HI options, `data-lang-val`, `data-lang-check`, `data-lang-dropdown`).
- Cleaned desktop navigation links by removing dead `data-i18n` attributes (`nav-home`, `nav-tools`, `nav-blog`, `nav-about`, `nav-view-all`). Visible English text preserved intact.
- Preserved desktop utility layout with subtle, balanced dividers: `[Search]` | `[₹ INR]` | `[Theme Toggle]`.
- Removed mobile language select block (`#mobile-lang-select`, `nav-lang`). Retained mobile currency selector (`#mobile-currency-select`).
- Cleaned mobile navigation links by removing dead `data-i18n` attributes.
- Removed runtime language script infrastructure:
  - `langBtn`, `langMenu`, `langLabel`, `mobileLangSelect` DOM references
  - `I18N_TEXTS` translation dictionary (English & Hindi)
  - `applyLanguage()` translation function
  - `showToast()` helper (previously used only for language notifications)
  - `localStorage` persistence (`cm_lang`)
  - Custom event dispatch and listeners (`cm:lang-change`)
  - Language menu open/close, option click, outside-click, and mobile change handlers
  - Renumbered script comments sequentially (Section 1: Tools dropdown, Section 2: Search buttons, Section 3: Currency selector, Section 4: Dark mode toggle, Section 5: Mobile navigation, Section 6: Mobile tools accordion)

---

## 3. Scope Invariants & Verifications

| Check | Result | Detail |
|---|---|---|
| **English Only** | Confirmed | `<html lang="en">` in `src/layouts/Layout.astro` preserved |
| **No Route Changes** | Confirmed | Catalog locked at exactly 50 tools, no `/hi/` routes exist |
| **Jurisdictions** | Confirmed | `/in/*` and `/us/*` jurisdiction architecture preserved |
| **Currency** | Confirmed | INR / USD / EUR / GBP display system 100% functional |
| **Dark Mode** | Confirmed | Theme toggle and dark tokens 100% functional |
| **Vitest Tests** | PASS | 22 test files passed (394/394 tests) |
| **Static Build** | PASS | 76 pages built cleanly in 987ms |
| **Git Diff Check** | PASS | 0 whitespace or formatting errors |
| **Repository Search** | CLEAN | 0 active runtime references to removed language tokens |

---

## 4. Next Phase

- Phase 14: SEO Implementation (Sitemaps, canonicals, meta tags, schema markup, OpenGraph).
