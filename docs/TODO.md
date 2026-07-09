# TODO

## Next 10 Priorities
1. Add `package.json`, `tsconfig.json`, and executable tests for analytics, orchestrator, deliverables, branding, and shared utilities.
2. Add authentication, user accounts, saved organization profiles, and profile ownership.
3. Add API layer for analytics-plan generation, report generation, workflow execution, and export packages.
4. Add background processing for large files, scheduled reports, and recurring workflows.
5. Add automated tests for KPI detail panel click behavior and explanation content.
6. Add TypeScript project config and unit tests for `src/lib/chart-engine` and `src/lib/platform`.
7. Build native SVG/canvas renderers from the chart-engine render model.
8. Add visual regression tests for dashboard tabs, chart tiles, KPI detail panels, legends, axes, tooltips, and locked overlays.
9. Add automated Studio smoke tests for upload, data setup, preview generation, and interactive preview.
10. Build production report generator for HTML, PDF, DOCX, PPTX, PNG, JSON, and ZIP.





## Stabilization Follow-Ups
- Convert `src/lib/testing/stabilizationTestPlan.ts` into executable tests once a test runner is added.
- Add CI checks for `git diff --check`, TypeScript compilation, unit tests, and public asset secret scanning.
- Add Playwright accessibility and regression checks for upload, setup, package selection, dashboard tabs, KPI panels, deliverables previews, and locked overlays.
- Add server/API boundary so static Studio no longer mirrors protected engine logic.
- Add large-dataset processing strategy for 50k+ and 100k+ row uploads.
## Deliverables Platform Follow-Ups
- Connect Studio Deliverables tab and Interactive Preview to deliverables platform preview cards.
- Add tests for report template selection, reusable section assembly, locked preview limits, and version metadata.
- Add export adapters that consume `ProfessionalReport` objects for HTML, PDF, DOCX, PPTX, PNG, XLSX, CSV, and ZIP.
- Add persisted report metadata and version history for future enterprise audits.
- Add branded cover-page and footer render adapters for native exporters.
## Package Orchestrator Follow-Ups
- Add unit tests for output level inheritance, package rank comparisons, preview limits, and permission states.
- Connect Studio package cards, Deliverables tab, export menu, and upgrade prompts directly to `buildPackageManifest()`.
- Ensure future Report Generator and Export Engine consume only manifest outputs.
- Add manifest fixtures for survey, housing, behavioral health, education, healthcare, finance, CRM, government, and research contexts.
- Add architecture checks to prevent UI code from hardcoding package rules or upgrade logic.
## Analytics Intelligence Follow-Ups
- Connect static Studio Executive Summary, Overview, Data Quality, and Recommendations tabs directly to `AnalyticsIntelligence` outputs.
- Add AI Analyst integration that uses `aiAnalystContext` for grounded answers.
- Feed executive narrative blocks into Report Generator outputs.
- Add industry-intelligence adapters that enrich observations without inventing unsupported conclusions.
- Add tests for executive observations, findings, warnings, opportunities, recommendations, action plans, and confidence narratives.
- Add package-aware narrative depth for Data Foundation, Management Insights, Professional Analytics, Executive Intelligence, and Enterprise outputs.

## Platform Architecture Follow-Ups
- Add TypeScript build/test setup for service, config, registry, and shared utility layers.
- Add architecture lint rules that prevent presentation components from importing protected engines directly.
- Migrate static `script.js` package, pricing, preview, and analytics mirrors behind `src/lib/services` or a ProgramMetrics API.
- Generate static page package/pricing content from `src/config/analyticsPackages.ts`.
- Add diagnostics adapters for browser, server, and background job contexts.
- Move future API base URLs and payment configuration into secure environment configuration.
## Enterprise Architecture Follow-Ups
- Implement ProgramMetrics API boundary for analytics, reports, branding, workflows, and exports.
- Add authentication and role-based access controls.
- Add user accounts and organization profiles.
- Add scheduled reports and background processing.
- Add audit logs and enterprise access controls.
- Add checks that public UI and API responses do not expose protected formulas, ranking weights, or recommendation heuristics.
- Move API keys, payment configuration, and future service credentials into environment variables.

## Explainability Follow-Ups
- Add keyboard focus management and Escape-key close behavior for KPI detail panels.
- Add tests for Total Records, Total Fields, Missing Rows, Missing Cells, Fields with Blanks, Missing %, Duplicate Rows, Quality Score, Analytics Confidence, and Date Range panels.
- Add screenshots for KPI explainability panels in desktop and mobile viewports.
- Add richer export availability mapping by exact package/output level.

## Chart Engine Follow-Ups
- Add a test runner and fixtures for date trends, top categories, missing values, gauges, histograms, boxplots, tables, and heatmaps.
- Add chart renderer adapters for static HTML, SVG, canvas, PDF, PowerPoint, and PNG export.
- Add interactive tooltip state and keyboard-accessible chart data tables.
- Add scatter plot rendering for numeric relationship recommendations.
- Add duplicate review visuals beyond summary tables.
- Add package-aware visual depth controls by output level.

## Analytics Engine Follow-Ups
- Add confidence score drivers as richer visual cards.
- Add stronger chart recommendations for datasets with no date fields.
- Add browser-safe engine bundle or build step if Studio should import TypeScript modules directly.

## Dashboard Follow-Ups
- Polish chart tile spacing and mobile fit for package cards, setup preview, and full-screen dashboard.
- Add field selector controls that regenerate the analytics plan rather than only changing visible charts.
- Add stronger empty states when a dataset lacks dates, numeric fields, or categorical fields.
- Add screenshot-based QA for PowerBI-style visual presentation.

## Documentation Follow-Ups
- Keep pricing documentation aligned with the Studio pricing page.
- Keep analytics engine documentation aligned with source code.
- Add implementation status after each major Studio release.
- Add screenshots or diagrams once the UI stabilizes.

## Branding Engine Follow-Ups
- Connect native PDF, DOCX, PPTX, PNG, HTML, and ZIP exporters to `BrandTheme`, `ChartTheme`, `CoverPageModel`, and `FooterModel`.
- Add persisted organization profile CRUD after authentication and storage are available.
- Add automated tests for `normalizeBrandingProfile()`, `validateBrandingProfile()`, logo validation, contrast warnings, and package-aware export permissions.
- Add secure SVG logo sanitization before enabling SVG previews or exports.
- Add branded dashboard screenshot/thumbnail adapters for executive export packages.
