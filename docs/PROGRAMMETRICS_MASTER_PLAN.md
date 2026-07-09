# ProgramMetrics Master Plan

## Product Vision
ProgramMetrics is an AI-powered analytics platform that turns uploaded spreadsheets, CSV files, survey exports, and program datasets into consulting-quality analytics packages.

## Core Value Proposition
Upload any spreadsheet and receive a professional analytics package in minutes.

## Product Positioning
ProgramMetrics does not sell isolated dashboard exports. It sells Analytics Packages that include cleaned data, dashboards, executive reports, PowerPoint presentations, Word reports, data dictionaries, audit reports, and branded deliverables.

## Target Users
- Program managers
- Nonprofits
- Government agencies
- Evaluators
- Researchers
- Consultants
- Grant reporting teams
- Behavioral health programs
- Housing and shelter programs
- Education programs
- Healthcare teams

## Analytics Packages
- Data Foundation Package: data readiness, missing values, duplicates, quality scoring, validation, data dictionary, and cleanup recommendations.
- Management Insights Package: executive dashboards, KPIs, top categories, trends, management narrative, and recommendations.
- Professional Analytics Package: descriptive statistics, advanced trends, outlier review, forecasts, correlations, and statistical appendix.
- Executive Intelligence Suite: board-ready dashboards, executive reports, presentation files, AI narrative, and complete branded deliverables.
- Enterprise Intelligence Platform: custom recurring reporting, white labeling, team accounts, API, custom templates, and multi-file analytics.

## Product Workflow
Upload Data -> Review Data Setup -> Choose Analytics Package -> Choose Output Level -> Generate Preview -> Open Interactive Preview -> Export / Checkout

## Major Product Areas
- Analytics Studio
- Analytics Recommendation Engine
- Visual Analytics Engine
- Report Generator
- Export Engine
- Branding Engine
- AI Analyst
- Report Library
- Reusable Workflows
- Industry Intelligence
- Enterprise Platform

## Master Roadmap
1. Product positioning and navigation
2. Analytics Studio wizard
3. Analytics Recommendation Engine
4. Visual Analytics Engine
5. Report Generator
6. Export Engine
7. Branding Engine
8. AI Analyst
9. Report Library
10. Reusable Workflows
11. Industry Templates
12. Enterprise Features

## Current Architecture
- `src/lib/analytics-engine/` is the source of truth for `generateAnalyticsPlan()`.
- `src/lib/chart-engine/` converts `recommendedVisuals` into reusable render models through chart registry, chart selector, chart data builder, dashboard builder, and responsive chart layouts.
- The current static Studio browser script mirrors the chart-engine behavior so uploaded/session files can render immediately without a bundler; a future build step should import the TypeScript engine directly.
- Locked previews keep watermark and export-disable behavior while still rendering limited plan-driven previews.
- Studio KPI cards now include an explainability layer that answers definition, calculation logic, dataset-specific interpretation, why it matters, recommended actions, related visuals, and package/export availability.
## Current Development Status
| Area | Status | Notes |
| --- | --- | --- |
| Product positioning and navigation | In Progress | Analytics package positioning is active and should keep replacing old tier language. |
| Analytics Studio wizard | In Progress | Upload, setup, package selection, preview, and interactive preview exist and need continued polishing. |
| Analytics Recommendation Engine | MVP Complete | `generateAnalyticsPlan()` now produces dataset, field, missing, duplicate, quality, confidence, KPI, visual, insight, and deliverable outputs used by Studio previews. |
| Visual Analytics Engine | In Progress | Reusable chart-engine modules provide registry, selector, data builder, dashboard builder, and responsive layouts. Studio KPI cards now open dataset-specific explainability panels. SVG/canvas chart drawing, scatter plots, deeper duplicate visuals, accessibility tests, and screenshot QA remain. |
| Report Generator | In Progress | HTML-style report outputs exist; native PDF, DOCX, and PPTX generation need production implementation. |
| Export Engine | In Progress | Export menu and ZIP structure exist; native binary formats need production-grade exporters. |
| Branding Engine | In Progress | Branding fields exist and should be expanded into reusable profiles. |
| AI Analyst | Not Started | Planned grounded Q&A and narrative layer. |
| Report Library | Not Started | Requires persistence, authentication, and storage decisions. |
| Reusable Workflows | Not Started | Requires saved setup and rerun logic. |
| Industry Templates | Not Started | Planned templates by sector. |
| Enterprise Features | Not Started | Requires accounts, roles, API, audit logs, and custom quote flow. |

## Definition of Done
A feature is done when it:
- works with real uploaded files
- respects selected package and output level
- has locked preview behavior when needed
- is visually polished
- is documented
- has acceptance criteria met

## Related Documents
- [Product Vision](PRODUCT_VISION.md)
- [Roadmap](ROADMAP.md)
- [Pricing](PRICING.md)
- [Analytics Engine](ANALYTICS_ENGINE.md)
- [UI/UX Guidelines](UI_UX_GUIDELINES.md)
