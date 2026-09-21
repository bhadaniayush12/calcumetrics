# Calcumetrics — Phase 0.4 Scope Lock

Date: 2026-09-22
Branch: development
Status: LOCKED

## Scope lock

Phase 0 is now frozen around a **50-tool target** and a single registry-driven architecture.

### Locked product structure

- Target catalog size: **50 tools**
- Primary categories: **5**
  - Investments
  - Loans
  - Taxes
  - Business
  - Corporate Finance
- Every tool has exactly one primary category.
- Global tools use root-level routes: `/<slug>`
- Jurisdiction-specific tools use prefixed routes: `/<region>/<slug>`
- Supported region prefixes currently defined: `IN`, `US`, `UK`

## Tool selection rule

The 50-tool target is a capacity target, not permission to add arbitrary pages.

- The original 21–22 tools personally audited by the founder are the validated starting set.
- Every additional tool must be justified by market-demand evidence before it moves beyond `planned`.
- Default evidence source for remaining additions: **Google data**.
- Keyword/SERP research is required when intent is ambiguous, overlapping, or potentially cannibalistic.
- Research evidence must be recorded in registry metadata.
- A candidate without verified evidence remains `planned` and stays out of production surfaces.
- If a planned candidate fails research, its slot can be replaced only by another researched candidate of appropriate strategic fit; the 50-tool target itself does not change.

## Lifecycle lock

All additions follow:

`Research → Approve → Draft → Build → Test → Publish`

No planned candidate is allowed to become a live route merely because it exists in the scope list.

## Current snapshot

The registry currently contains:

- **33 published**
- **17 planned**
- **0 draft**
- **50 total catalog entries**

The 17 planned entries are placeholders pending research approval; they are not promises that all 17 exact names will ship unchanged.

## Architecture guardrails

`src/config/site.ts` is the single registry source for tool metadata and exposes:

- production-visible tools
- planned tools
- complete catalog
- catalog count
- research verification
- canonical region route mapping
- registry validation

A scope-invariant test now protects the 50-tool count, five-category structure, route uniqueness/validity, lifecycle states, and planned-tool research gate.

## Deferred work does not reopen Phase 0 scope

The following remain separate implementation tasks:

- UPI MDR physical page migration from `/upi-mdr-calculator` to `/in/upi-mdr-calculator`, including redirects/canonical/internal links
- overlap research for Home Loan vs Mortgage
- overlap research for EMI vs Loan Amortization
- overlap research for NPV vs Present Value
- calculator builds and formula changes
- India tax-rule modernization
- currency/i18n
- UI/Figma restoration
- content and SEO optimization

These tasks must not silently change the locked catalog architecture.

## Change-control rule

Any future scope change must be intentional and traceable.

A change to the 50-tool target, category model, region routing model, or research gate requires:
1. explicit scope review;
2. updated scope documentation;
3. updated registry/test invariants;
4. verification before implementation continues.

**Phase 0 scope is locked.**
