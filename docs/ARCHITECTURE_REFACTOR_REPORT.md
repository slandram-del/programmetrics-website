# Architecture Refactoring Report

## Audit Summary
The repository already had separated engine folders for analytics, chart, report, branding, workflow, AI, and platform interfaces. The remaining risk is that the static browser implementation in `script.js` still duplicates some package, pricing, analytics, chart, preview, and export behavior for no-build browser compatibility.

## Findings

### Analytics Logic in UI
- `src/lib/analytics-engine/` contains the protected TypeScript analytics source of truth.
- `script.js` still contains browser-compatible mirrored calculations for static Studio previews.
- Follow-up: replace static mirrored logic with service/API calls or a browser-safe bundled build.

### Quality and Confidence Logic
- Protected TypeScript modules exist for quality and confidence scoring.
- Customer-facing copy should show explanations and scores, not formulas or weights.
- Follow-up: add tests that prevent scoring internals from leaking into presentation components.

### Missing-Value Logic
- `src/lib/analytics-engine/missingValueAnalyzer.ts` defines missing rows, cells, fields, and percentages.
- `src/config/analyticsPackages.ts` and future config should centralize product/package rules, while missing-code defaults remain in analytics setup utilities until a dedicated data-quality config is added.

### Chart Selection
- `src/lib/chart-engine/` now owns chart registry, selector, data builder, dashboard builder, and layouts.
- Static Studio rendering still mirrors some chart behavior.
- Follow-up: UI should call `previewService` or future ProgramMetrics API instead of directly maintaining chart rules.

### Report Logic
- `src/lib/report-engine/` has report-output placeholders and metadata.
- `src/lib/services/reportService.ts` now provides the application boundary for report generation.

### Package and Pricing Rules
- `src/config/analyticsPackages.ts` centralizes package and output-level configuration for future services.
- `script.js` and static pages still contain duplicated display data for current no-build behavior.
- Follow-up: import config through a build process or fetch package config from backend.

## Refactoring Completed
- Added application service layer under `src/lib/services/`.
- Added centralized config under `src/config/`.
- Added engine registry under `src/lib/engineRegistry.ts`.
- Added diagnostics and shared error types under `src/lib/shared/`.
- Documented dependency boundaries and protected business logic.

## Remaining Technical Debt
- Static Studio still mirrors TypeScript service and engine behavior.
- No automated architecture lint rules yet.
- No TypeScript project config or test runner yet.
- No backend API, authentication, persistence, storage, or scheduled processing yet.

## Recommended Next Steps
1. Add a TypeScript build/test setup.
2. Create architecture tests that block UI imports from protected engine folders.
3. Move package/pricing display in static pages to generated config output.
4. Route Studio preview generation through `previewService` or future ProgramMetrics API.
5. Add server-side execution for protected analytics and intelligence engines.
