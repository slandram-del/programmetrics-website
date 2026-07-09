# Sprint 04 - Analytics Engine

## Status
MVP complete; refinement and tests remain.

## Goal
Build the intelligence layer that turns uploaded/session datasets into a structured analytics plan used by Studio dashboards, reports, exports, and AI explanations.

## Completed
- Dataset profiling
- Field profiling
- Missing-value analysis
- Duplicate analysis
- Descriptive statistics
- Dataset type detection
- Field role detection
- KPI recommendations
- Visual recommendations
- Insight recommendations
- Deliverable recommendations
- Analytics confidence scoring
- Setup-aware row preparation for survey-style exports

## Current Outputs
`generateAnalyticsPlan()` returns:
- `datasetProfile`
- `fieldProfiles`
- `datasetType`
- `qualityProfile`
- `confidenceProfile`
- `missingProfile`
- `duplicateProfile`
- `descriptiveStats`
- `recommendedKpis`
- `recommendedVisuals`
- `recommendedInsights`
- `recommendedDeliverables`
- `warnings`
- `assumptions`

## Acceptance Criteria
- Uploaded rows are prepared according to Data Setup rules.
- Metadata rows and omitted rows are excluded from analysis.
- Missing-value counts match engine definitions.
- Date fields are grouped for trends instead of charted as unique dates.
- Categorical fields prioritize top values and group rare values as Other.
- Analytics plan outputs are consumable by Studio and the chart engine.

## Remaining Work
- Add a TypeScript project config and test runner.
- Add fixtures for survey, referral, business, and generic spreadsheets.
- Add regression tests for missing-value, duplicate, quality, confidence, and recommendation outputs.
- Add browser-safe build integration so Studio can import the TypeScript engine directly.

## Dependencies
- Data Setup UI
- Chart Engine
- Report Generator
- Export Engine
- AI Analyst

## Related Docs
- `docs/ANALYTICS_ENGINE.md`
- `docs/ROADMAP.md`
- `docs/PROJECT_STATUS.md`
