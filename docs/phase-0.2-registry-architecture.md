# Calcumetrics — Phase 0.2 Registry Architecture

Date: 2026-09-22
Branch: development
Status: implemented on development; validation/lock pending.

## Purpose

Keep the tool catalog as the single metadata source while separating production-visible tools from future candidates that have not earned a build slot yet.

## Lifecycle

`planned → draft → published`

A new candidate starts as `planned`. It must carry research metadata and remain hidden from all production surfaces until its demand/intent evidence is verified.

Research workflow:

`Research → Approve → Draft → Build → Test → Publish`

## Research gate

New additions are research-gated. The default evidence source for the remaining candidates is Google demand data, with keyword/SERP validation for overlap or ambiguous intent.

The original 21–22 founder-audited tools are the validated starting set. The registry does not invent historical evidence for individual existing entries; future evidence should be recorded when those entries are revisited.

## Registry API

`src/config/site.ts` provides:
- `TOOLS`: complete catalog, including planned candidates.
- `getPublishedTools()`: production-visible tools only; planned is never included.
- `getPlannedTools()`: candidates still waiting on research/build.
- `getToolCatalog()`: full catalog.
- `getToolCatalogCount()`: complete catalog count.
- `getToolCount()`: production-visible count used by live UI.
- `isResearchVerified()`: explicit research gate check.

## Non-goals for Phase 0.2

No calculator build, route migration, UI redesign, tax logic, language work, currency work, or SEO copy changes are included.

## Acceptance criteria

- Current live count remains 33.
- Planned candidate count is 17.
- Catalog count is 50.
- Planned candidates never appear in published-tool helpers.
- Research metadata is available on planned candidates.
- Existing production consumers can continue using `getPublishedTools()` without showing planned entries.
