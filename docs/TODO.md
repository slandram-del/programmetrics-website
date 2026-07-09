# TODO

## Next 10 Priorities
1. Add automated tests for KPI detail panel click behavior and explanation content.
2. Add TypeScript project config and unit tests for `src/lib/chart-engine`.
3. Build native SVG/canvas renderers from the chart-engine render model.
4. Add visual regression tests for dashboard tabs, chart tiles, KPI detail panels, legends, axes, tooltips, and locked overlays.
5. Add automated Studio smoke tests for upload, data setup, preview generation, and interactive preview.
6. Add direct browser/build integration so Studio imports TypeScript analytics and chart engines.
7. Add scatter plot and richer duplicate-review visuals.
8. Improve metadata-column detection controls in Data Setup.
9. Build package-aware deliverables preview from `recommendedDeliverables`.
10. Add production report generator for HTML, PDF, DOCX, PPTX, PNG, JSON, and ZIP.

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
