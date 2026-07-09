# Sprint 05 - Visual Analytics

## Status
In progress.

## Goal
Transform analytics-engine recommendations into polished, readable, PowerBI-style dashboard previews and interactive visual experiences.

## Completed
- Reusable chart registry
- Chart selector for `recommendedVisuals`
- Chart data builder with axes, legends, tooltips, accessibility labels, layout metadata, and empty states
- Dashboard builder with tab grouping
- Responsive chart layouts
- KPI cards from `recommendedKpis`
- Interactive KPI detail panels for records, fields, missingness, duplicates, quality, confidence, and date range
- Date trends from monthly/quarterly grouped plan data
- Top category charts with Other grouping
- Donut charts
- Heatmap placeholder / completeness visual
- Histograms
- Box plot summaries
- Quality gauge and component bars
- Missing-value visuals
- Dashboard tabs for Overview, Visual Analytics, Data Quality, Descriptive Statistics, Missing Values, Recommendations, and Deliverables

## Acceptance Criteria
- Recommended visuals render through chart-engine render models.
- Every KPI is clickable and explainable.
- Missing Values tab uses engine definitions.
- Locked previews remain watermarked and export-disabled.
- Dashboard visuals are readable on desktop and mobile.

## Remaining Work
- Add SVG/canvas production renderers for sharper visual output.
- Add scatter plot rendering.
- Add deeper duplicate review visuals beyond summary tables.
- Add visual regression screenshots for dashboard tabs and locked overlays.
- Add automated tests for KPI detail panel content and click behavior.
- Add direct browser/build integration for TypeScript chart-engine modules.

## Dependencies
- Analytics Engine
- Studio Workspace UI
- Export Engine for PNG/PDF/PPTX render targets

## Related Docs
- `docs/ANALYTICS_ENGINE.md`
- `docs/UI_UX_GUIDELINES.md`
- `docs/PROJECT_STATUS.md`
