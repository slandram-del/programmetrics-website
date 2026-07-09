# Changelog

## Unreleased

### New Features
- Added documentation system.
- Added master product roadmap.
- Added pricing and analytics package documentation.
- Added plan-driven Studio dashboard tabs for Overview, Visual Analytics, Data Quality, Descriptive Statistics, Missing Values, Recommendations, and Deliverables.
- Added clickable Quality Score and Analytics Confidence Score KPI cards with detail panels.
- Added Missing Values tab metrics for missing rows, missing cells, fields with blanks, missing percentage, top missing fields by count, and top missing fields by percent.

### Improvements
- Studio dashboard visuals now render from `generateAnalyticsPlan()` outputs instead of placeholder-only chart data.
- Recommended visual rendering now supports line, bar, horizontal bar, donut, histogram, boxplot, gauge, table, and insight-card visual types.
- Unsupported visual types now show polished coming-soon cards instead of blank dashboard space.
- Static asset cache keys were bumped so browsers fetch the updated dashboard UI.

### Refactors
- Added chart-engine renderer modules for registry, selection, chart data normalization, and dashboard grouping.
- Moved Studio preview behavior closer to analytics-plan-driven rendering while preserving upload, setup, package, and output level flow.

### Bug Fixes
- Fixed recommended visuals that had object-based chart data, field-profile top values, missing profiles, or descriptive statistics from falling through to blank/placeholder states.
- Preserved locked preview watermark/export protection while rendering richer analytics previews.
