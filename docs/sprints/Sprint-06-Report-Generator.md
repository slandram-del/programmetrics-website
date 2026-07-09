# Sprint 06 - Report Generator

## Status
Planned / early implementation.

## Goal
Generate consulting-quality report outputs from analytics-plan and chart-engine outputs.

## Target Outputs
- Executive summary
- Key findings
- Recommendations
- Methodology
- Appendix
- Data dictionary
- Processing notes
- Limitations
- HTML dashboard/report
- PDF executive report
- DOCX editable report
- PPTX executive presentation
- PNG dashboard images
- JSON metadata package
- ZIP package

## Acceptance Criteria
- Reports use analytics-plan outputs, not placeholder text.
- Reports include chart-engine visual render models.
- Reports include KPI explanations and methodology notes.
- Locked previews remain watermarked and limited.
- Full exports require unlocked package/output level.
- If a native format is not implemented, the UI shows a format-specific coming-soon state rather than downloading raw text.

## Remaining Work
- Build report section templates.
- Build native PDF, DOCX, PPTX, PNG, XLSX, CSV, JSON, and ZIP exporters.
- Add package-aware output depth.
- Add branded cover pages and headers/footers.
- Add export tests and sample output fixtures.

## Dependencies
- Analytics Engine
- Chart Engine
- Branding Engine
- Export Engine

## Related Docs
- `docs/EXPORT_ENGINE.md`
- `docs/ANALYTICS_ENGINE.md`
- `docs/PROGRAMMETRICS_MASTER_PLAN.md`
