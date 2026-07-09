# Changelog

## Unreleased

### New Features
- Added Analytics Intelligence Engine modules for executive observations, analytical findings, warnings, opportunities, prioritized recommendations, action plans, grouped insights, and confidence-aware narratives.
- Added enterprise architecture foundation documentation for protected analytics, future API boundaries, and trade secret strategy.
- Added src/lib/platform interface layer for Analytics Studio responses and public analytics summaries.
- Added legal placeholder routes for /terms, /privacy, and /license with legal-review TODOs.
- Added interactive KPI explainability panels for Total Records, Total Fields, Missing Rows, Missing Cells, Fields with Blanks, Missing %, Duplicate Rows, Quality Score, Analytics Confidence Score, and Date Range.
- Added explainability sections for definitions, calculation logic, dataset-specific explanation, why it matters, recommended actions, related visuals, and export availability by package.
- Added documentation system.
- Added master product roadmap.
- Added pricing and analytics package documentation.
- Added plan-driven Studio dashboard tabs for Overview, Visual Analytics, Data Quality, Descriptive Statistics, Missing Values, Recommendations, and Deliverables.
- Added clickable Quality Score and Analytics Confidence Score KPI cards with detail panels.
- Added Missing Values tab metrics for missing rows, missing cells, fields with blanks, missing percentage, top missing fields by count, and top missing fields by percent.
- Implemented reusable chart-engine renderer modules for chart registry, chart selection, chart data normalization, dashboard building, and responsive layouts.
- Added chart render models for KPI card, line chart, bar chart, horizontal bar chart, donut chart, histogram, box plot summary, gauge, table, heatmap placeholder, and insight card.

### Improvements
- Platform responses now include structured intelligence output for future Dashboard, Report Generator, AI Analyst, and Export consumers.
- Dashboard builder contracts now include an Executive Summary tab destination.
- Standardized visible copyright footers to ProgramMetrics All Rights Reserved wording.
- Updated customer-facing package wording away from old tier language in key pages.
- Quality Score detail panels now include component breakdown, score bars, strengths, concerns, and recommendations from analytics-engine outputs.
- Analytics Confidence panels now include drivers, concerns, assumptions, affected insights, and overall confidence explanation.
- Missing Values panels now clarify missing rows versus missing cells, missing value coding used, top affected fields, and cleanup recommendations.
- Studio dashboard visuals now render from `generateAnalyticsPlan()` outputs instead of placeholder-only chart data.
- Recommended visual rendering now supports line, bar, horizontal bar, donut, histogram, boxplot, gauge, table, and insight-card visual types.
- Chart data now includes axes, legends, tooltips, accessibility labels, layout metadata, confidence, and empty-state metadata.
- Date trends are normalized into monthly/quarterly trend points when available.
- Category visuals use top 5-10 values and group rare categories as Other.
- Numeric fields normalize into distribution bins and box plot summaries.
- Unsupported visual types now show polished coming-soon cards instead of blank dashboard space.
- Static asset cache keys were bumped so browsers fetch the updated dashboard UI.

### Refactors
- Kept intelligence-generation business logic isolated under src/lib/analytics-engine/intelligence so UI consumers receive structured outputs rather than internal prioritization rules.
- Marked analytics-engine modules as protected business logic and routed future UI/API usage through platform interfaces.
- Added report/export copyright metadata placeholders.
- Added reusable Studio KPI explainability helpers that route KPI cards to metric-specific detail panels.
- Added chart-engine renderer modules for registry, selection, chart data normalization, layout, and dashboard grouping.
- Moved Studio preview behavior closer to analytics-plan-driven rendering while preserving upload, setup, package, and output level flow.
- Separated chart recommendation output from chart render-model creation.

### Bug Fixes
- Reduced customer-facing legacy tier wording in support, policy, Studio, and landing-page copy.
- Ensured Missing % and Analytics Confidence are available as first-class clickable KPI cards when the recommendation list omits them.
- Fixed recommended visuals that had object-based chart data, field-profile top values, missing profiles, or descriptive statistics from falling through to blank/placeholder states.
- Preserved locked preview watermark/export protection while rendering richer analytics previews.
