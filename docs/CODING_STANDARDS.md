# Coding Standards

## TypeScript-First
New analytics modules should be TypeScript-first where the build supports it. Static browser compatibility may require mirrored JavaScript until the app has a bundler.


## Platform Architecture Rules
- Presentation code should call `src/lib/services` rather than importing protected engine modules directly.
- Services call engines and configuration; engines perform calculations; shared utilities provide diagnostics and errors.
- New package, pricing, export, feature flag, branding, and report-template data belongs in `src/config`.
- Protected engines should return structured outputs and should not expose formulas, weights, ranking rules, heuristics, or internal prompts to browser UI.
- Use `ProgramMetricsError` subclasses for consistent error handling.
- Use diagnostics helpers for internal timing and warnings; do not expose diagnostic logs directly to customers.
## Centralized Configuration
- Keep pricing in centralized package configuration.
- Do not hardcode package prices in unrelated UI code.
- Keep export permission logic centralized.
- Keep missing-value codes centralized.

## Reusable Components
- Prefer reusable Studio components for cards, KPIs, visual tiles, export menus, setup controls, and detail panels.
- Avoid duplicating package or output logic across pages.

## Analytics Logic
- All analytics logic should be testable.
- Keep UI and analytics logic separate.
- Do not create placeholder charts in production.
- Do not force charts when the data does not support them.
- Avoid high-cardinality fields as categorical charts.
- Use setupConfig so metadata rows and omitted columns are not analyzed.

## Documentation
- Document new modules.
- Add acceptance criteria comments for large features.
- Update docs when product language, pricing, package levels, or export behavior changes.

## UI Copy
- Use "package" and "output level" instead of old tier language.
- Keep pricing out of analytics summaries.
- Use plain-language explanations for quality, missing values, duplicates, and trends.

## Export Safety
- Protect locked exports in UI and export logic.
- Do not rely only on hiding buttons.
- Watermark locked previews.
- Never allow full copy, full download, or reusable packages for locked outputs.

## Review Checklist
- Real uploaded files work.
- Locked preview behavior is respected.
- Layout fits desktop and mobile widths.
- No syntax errors.
- Documentation is updated.
- Acceptance criteria are met.
