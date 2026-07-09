# Analytics Recommendation Engine

## Purpose
Inspect uploaded data, understand the dataset, recommend analyses, generate visuals, and produce grounded insights.

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

## Output Object
- datasetProfile
- fieldProfiles
- datasetType
- qualityProfile
- missingProfile
- duplicateProfile
- descriptiveStats
- recommendedKpis
- recommendedVisuals
- recommendedInsights
- recommendedDeliverables
- warnings
- assumptions

## Missing Value Logic
- Missing rows: records with at least one missing value.
- Missing cells: every blank or coded missing field in the dataset.
- Fields with blanks: columns with at least one missing value.
- Missing percentage: missing cells divided by total cells.

Default missing codes:
```json
["", " ", "NA", "N/A", "n/a", "null", "NULL", "unknown", "Unknown", "blank", "Blank", "not reported", "Not Reported", "missing", "Missing", "--", "-"]
```

## Field Types
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

## Dataset Types
- survey
- programEvaluation
- referralOrDenial
- caseManagement
- housingOrShelter
- behavioralHealth
- healthcare
- education
- finance
- crm
- hr
- genericSpreadsheet

## Visual Recommendation Rules
- Date fields become trends.
- Numeric fields become histograms, box plots, and statistics.
- Categorical fields become top category charts.
- Missingness becomes KPI cards, bars, and heatmaps.
- Quality becomes gauge and component bars.
- Duplicates become KPI and review table.

## Acceptance Criteria
- Uses setupConfig.
- Does not analyze omitted metadata rows.
- Does not create one bar per date.
- Uses variable labels when available.
- Avoids high-cardinality category charts.
- Produces grounded insights only.

## Related Documents
- [Visual Guidelines](UI_UX_GUIDELINES.md)
- [Export Engine](EXPORT_ENGINE.md)
- [Coding Standards](CODING_STANDARDS.md)
