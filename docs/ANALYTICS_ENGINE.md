# Analytics Engine

## Purpose
ProgramMetrics has a central intelligence architecture for profiling uploaded datasets, classifying dataset type, recommending KPIs and visuals, generating grounded insights, scoring quality, scoring analytics confidence, and recommending deliverables.

The engine is intended to become the single source of truth for:
- Analytics Studio
- Interactive Preview
- Visual Analytics
- Data Quality
- Descriptive Statistics
- Executive Summary
- Report Generator
- Export Engine
- AI Analyst
- Industry Templates

## Folder Structure
```text
src/lib/analytics-engine/
  analyticsRecommendationEngine.ts
  datasetProfiler.ts
  datasetClassifier.ts
  fieldProfiler.ts
  fieldRoleDetector.ts
  fieldTypeDetector.ts
  missingValueAnalyzer.ts
  duplicateAnalyzer.ts
  descriptiveStatistics.ts
  qualityScoreEngine.ts
  analyticsConfidenceScore.ts
  kpiRecommendationEngine.ts
  visualRecommendationEngine.ts
  insightGenerator.ts
  recommendationGenerator.ts
  deliverableRecommendation.ts
  setupRows.ts
  types.ts
  index.ts

src/lib/chart-engine/
  chartRegistry.ts
  chartSelector.ts
  chartDataBuilder.ts
  dashboardBuilder.ts
  chartLayouts.ts
  index.ts

src/lib/report-engine/
src/lib/ai-engine/
src/lib/branding-engine/
src/lib/workflow-engine/
```

## Main Function
```ts
generateAnalyticsPlan({
  rawRows,
  setupConfig,
  selectedPackage,
  selectedLevel,
  brandingConfig
})
```

It returns:
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

## Setup-Aware Row Preparation
The engine respects setup config before analysis:
- header/code row
- variable label row
- data start row
- omitted rows
- omitted columns
- missing value codes
- date merge field metadata
- use variable labels setting

Qualtrics-style exports are supported through setup config, including row 1 field codes, row 2 labels, row 3 import metadata, and row 4+ real data. Omitted metadata rows are not analyzed.

## Quality Score vs Confidence Score
Quality score answers: how clean and usable is the dataset?

It considers:
- completeness
- exact duplicates
- date consistency
- numeric validity
- categorical usability
- structure

Confidence score answers: how much confidence should users have in the insights?

It considers:
- sample size
- missingness in useful fields
- duplicate rate
- date consistency
- field type reliability
- chartable field availability
- dataset type confidence
- assumptions made during setup

## Missing Value Definitions
These definitions are fixed across the engine:
- Missing rows: records with at least one missing value.
- Missing cells: every blank or coded missing field in the dataset.
- Fields with blanks: columns with at least one missing value.
- Missing percentage: missing cells divided by total analyzed cells.

Default missing codes:
```json
["", " ", "NA", "N/A", "n/a", "null", "NULL", "unknown", "Unknown", "blank", "Blank", "not reported", "Not Reported", "missing", "Missing", "--", "-"]
```

User-defined missing codes from setup config are added to the defaults.

## Field Type Rules
Field type detection classifies fields as:
- date
- numeric
- categorical
- text
- id
- email
- phone
- location
- boolean
- unknown

The detector avoids treating IDs, emails, phone numbers, metadata, names, timestamps, and high-cardinality free-text fields as default chart categories.

## Field Role Rules
Field role detection infers roles such as identifier, demographic, date, outcome, status, program, organization, service, referral, reason, location, amount, score, free text, metadata, or other from field names, labels, and sample values.

## Visual Recommendation Rules
- Date fields become monthly, quarterly, or yearly trends.
- Never create one bar per unique date.
- Categorical fields use top 5 or top 10 values and group rare values as Other.
- Donut charts are reserved for small categorical fields.
- Numeric fields become histograms, boxplots, and descriptive statistics tables.
- Missingness becomes KPI cards, top missing field bars, and completeness heatmaps.
- Quality becomes a gauge and component bars.
- Confidence becomes a confidence score card and driver/concern visuals.
- Duplicate review uses exact duplicate KPIs and tables.
- High-cardinality or meaningless visuals are filtered out.

## Chart Recommendation Pipeline
1. `generateAnalyticsPlan()` creates `recommendedVisuals` from dataset profile, field profiles, missing profile, quality profile, and descriptive statistics.
2. `chartRegistry.ts` maps each `VisualType` to a reusable renderer component, layout kind, tooltip/axis/legend support, and empty state.
3. `chartSelector.ts` normalizes tabs, marks locked visuals by package rank, and sorts visuals by priority/confidence/support.
4. `chartDataBuilder.ts` converts each recommended visual into chart-ready render data with points, axes, legends, tooltip text, layout metadata, accessibility label, confidence, and empty state.
5. `chartLayouts.ts` provides PowerBI-style responsive layout specs for KPI, score, standard, wide, narrative, table, and compact chart cards.
6. `dashboardBuilder.ts` groups KPIs, visuals, insights, and deliverables into dashboard tabs and returns a full render model for Studio, Interactive Preview, and future exports.

Supported chart-engine render models:
- KPI card
- Line chart
- Bar chart
- Horizontal bar chart
- Donut chart
- Histogram
- Box plot summary
- Gauge
- Table
- Heatmap placeholder with real completeness data
- Insight card

Unsupported chart types return `ComingSoonChart` render models with polished empty-state metadata rather than blank space.

## Current UI Integration
Analytics Studio and Interactive Preview now store an `analytics_plan` object on each generated analysis and render primary dashboard content from the plan.

Connected outputs:
- `recommendedKpis` render as clickable dashboard KPI cards.
- `recommendedVisuals` render as line, bar, horizontal bar, donut, histogram, boxplot, gauge, table, heatmap placeholder, and insight-card tiles when supported.
- Unsupported visual types render polished coming-soon chart cards instead of blank space.
- `missingProfile` powers the Missing Values tab, including missing rows, missing cells, fields with blanks, missing percentage, top missing fields by count, and top missing fields by percent.
- `qualityProfile` powers the Quality Score card, detail panel, gauge, and component bars.
- `confidenceProfile` powers the Analytics Confidence Score card and detail panel.
- `descriptiveStats` powers the Descriptive Statistics tab and numeric summary table.
- `recommendedInsights` and `recommendedDeliverables` power the Recommendations and Deliverables tabs.

The current static browser implementation mirrors the TypeScript chart-engine behavior because the site does not yet have a bundler-backed import path. Future work should add a browser-safe build step so Studio can import `src/lib/chart-engine` directly.

## Acceptance Criteria
- Core engine folder structure exists.
- Main `generateAnalyticsPlan` function exists.
- Missing-value, duplicate, field type, field role, dataset profile, dataset classification, descriptive statistics, quality score, confidence score, KPI, visual, insight, and deliverable modules exist.
- Chart-engine renderer modules export registry, selector, data builder, layout, and dashboard builder functions.
- Existing Studio UI remains compatible and renders plan-driven dashboard previews from uploaded/session data.

## Related Documents
- [Visual Guidelines](UI_UX_GUIDELINES.md)
- [Export Engine](EXPORT_ENGINE.md)
- [Coding Standards](CODING_STANDARDS.md)
- [Roadmap](ROADMAP.md)
- [TODO](TODO.md)
