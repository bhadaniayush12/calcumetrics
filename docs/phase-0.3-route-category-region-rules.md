# Calcumetrics — Phase 0.3 Route, Category & Region Rules

Date: 2026-09-22
Branch: development
Status: LOCKED after local test/build verification.

## Rules

### Route structure

- **Global** tools use root-level routes: \`/<slug>\`
- **Jurisdiction-specific** tools use a region-prefixed route: \`/<region>/<slug>\`
- Current supported jurisdiction prefixes: \`/in/\`, \`/us/\`, \`/uk/\`
- The registry slug must match the final route slug.
- Every production route must be unique.

### Region meaning

- \`Global\`: formula/content is generally applicable without a jurisdiction-specific product or law dependency.
- \`IN\`: India-specific law, tax, payment rails, or India-only financial products.
- \`US\`: US-specific products or rules.
- \`UK\`: UK-specific products or rules.
- A universal mathematical formula does not by itself make a jurisdiction-specific product Global.

### Category rules

Every tool has exactly one primary category from the five locked categories:

- Investments
- Loans
- Taxes
- Business
- Corporate Finance

A tool should not be duplicated across categories merely for navigation.

## Current registry enforcement

\`src/config/site.ts\` now exposes:

- \`REGION_ROUTE_PREFIX\`: canonical region → route-prefix mapping.
- \`getExpectedToolPath()\`: derives the only valid registry route for a slug + region.
- \`validateToolRegistry()\`: detects invalid routes, unknown categories, and duplicate routes.

These helpers are architecture validation only; they do not change existing page files or redirects.

## Existing route exception requiring a dedicated migration task

The current registry marks **UPI MDR** as \`region: 'IN'\` but its existing page is still at \`/upi-mdr-calculator\`.

This is intentionally **not silently changed in Phase 0.3** because moving the page requires a dedicated route migration with redirect/canonical/internal-link verification.

Target route for the final architecture remains:

\`/in/upi-mdr-calculator\`

## Publication rule

A planned tool must pass market-demand research before it can be promoted. Route structure does not override the research gate.

## Non-goals

No calculator logic, UI redesign, tax-rule update, language work, currency conversion, or SEO-copy work is included in Phase 0.3.
