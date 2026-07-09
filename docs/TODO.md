# TODO

## Next 10 Priorities
1. Move static Studio browser calculations behind `src/lib/platform` or a server-side ProgramMetrics API.
2. Add authentication, user accounts, and organization profiles.
3. Add API layer for analytics-plan generation, report generation, workflow execution, and export packages.
4. Add background processing for large files, scheduled reports, and recurring workflows.
5. Add automated tests for KPI detail panel click behavior and explanation content.
6. Add TypeScript project config and unit tests for `src/lib/chart-engine` and `src/lib/platform`.
7. Build native SVG/canvas renderers from the chart-engine render model.
8. Add visual regression tests for dashboard tabs, chart tiles, KPI detail panels, legends, axes, tooltips, and locked overlays.
9. Add automated Studio smoke tests for upload, data setup, preview generation, and interactive preview.
10. Build production report generator for HTML, PDF, DOCX, PPTX, PNG, JSON, and ZIP.

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
