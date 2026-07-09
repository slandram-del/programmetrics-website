# TODO

## Next 10 Priorities
1. Add TypeScript project config and unit tests for `src/lib/chart-engine`.
2. Build native SVG/canvas renderers from the chart-engine render model.
3. Add visual regression tests for dashboard tabs, chart tiles, legends, axes, tooltips, and locked overlays.
4. Add automated Studio smoke tests for upload, data setup, preview generation, and interactive preview.
5. Add direct browser/build integration so Studio imports TypeScript analytics and chart engines.
6. Add scatter plot and richer duplicate-review visuals.
7. Improve metadata-column detection controls in Data Setup.
8. Build package-aware deliverables preview from `recommendedDeliverables`.
9. Add production report generator for HTML, PDF, DOCX, PPTX, PNG, JSON, and ZIP.
10. Build AI Analyst panel from analytics plan and chart-engine context.

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
