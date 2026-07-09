# Export Engine

## Purpose
The Export Engine turns the analytics plan, visuals, narrative, branding, and setup metadata into protected previews and unlocked deliverables.


## Deliverables Platform Contract
The Export Engine should consume `ProfessionalReport` objects from `src/lib/deliverables-platform/`. Export adapters should not reconstruct report sections, package rules, or analytics calculations.

Prepared report objects include:
- deliverable metadata
- reusable rendered sections
- branding profile
- version metadata
- export availability
- locked preview and watermark flags
- prepared export format list

Native PDF, DOCX, PPTX, PNG, XLSX, CSV, and ZIP generation remains future work. The current Sprint 5.0 implementation prepares export-ready objects and preview metadata only.
## Export Formats
- CSV
- XLSX
- HTML
- PDF
- DOCX
- PPTX
- PNG
- SVG
- JSON
- ZIP

## Package-Level Export Permissions
- Data Foundation: cleaned data, missing value report, duplicate report, data dictionary, quality summary, and ZIP at higher output levels.
- Management Insights: dashboard, executive PDF, Word report, KPI dashboard image, recommendations, and expanded visuals.
- Professional Analytics: statistical analysis, trends, forecasts, outliers, benchmarks, and reusable workflow template.
- Executive Intelligence Suite: board-ready dashboard, PDF, DOCX, PPTX, HTML, AI narrative, and complete branded ZIP package.
- Enterprise Intelligence Platform: custom recurring exports, white labeling, team outputs, API, and multi-file packages.

## Locked Export Behavior
- Locked outputs may appear as previews.
- Locked previews must be watermarked.
- Locked exports must not download full cleaned datasets, full reports, reusable workflows, or advanced analytics packages.
- Upgrade actions should route to checkout or custom quote flow.

## ZIP Package Structure
```text
dashboard/
  interactive-dashboard.html
reports/
  executive-summary.pdf
  word-report.docx
  data-quality-report.pdf
slides/
  executive-presentation.pptx
data/
  cleaned-data.csv
  missing-value-report.csv
  duplicate-review.csv
  field-dictionary.xlsx
images/
  dashboard-overview.png
  chart-images/
metadata/
  metadata.json
  processing-summary.txt
README.pdf
```

## Export Quality Requirements
- Reports should be polished and branded when unlocked.
- HTML should be responsive and interactive where possible.
- CSV and JSON should be clean and machine-readable.
- ZIP packages should include metadata and processing notes.

## Related Documents
- [Pricing](PRICING.md)
- [Branding System](BRANDING_SYSTEM.md)
- [Coding Standards](CODING_STANDARDS.md)
