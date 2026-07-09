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




## Platform Architecture
ProgramMetrics now uses a layered architecture:

```text
Presentation Layer
  -> Application Services
  -> Analytics / Report / Branding / Workflow Engines
  -> Shared Utilities
  -> Configuration
  -> Future Infrastructure
```

Application services live in `src/lib/services/`, centralized product configuration lives in `src/config/`, shared diagnostics and error types live in `src/lib/shared/`, and engine discovery lives in `src/lib/engineRegistry.ts`.

UI and future React components should call services. Services call engines. Engines perform protected calculations and return structured outputs only.
## Analytics Intelligence Layer
The Analytics Intelligence Layer sits above the Analytics Recommendation Engine and converts `AnalyticsPlan` outputs into evidence-backed executive observations, analytical findings, warnings, opportunities, prioritized recommendations, action plans, grouped insights, and confidence-aware narratives.

This layer is designed for:
- Dashboard Executive Summary and Recommendations tabs
- Report Generator narrative sections
- AI Analyst grounded context
- Export package summaries and metadata

The intelligence layer consumes `AnalyticsPlan` only. It should not reanalyze raw data in presentation components.

### Executive Narrative System
Narrative blocks include Executive Summary, Data Quality Summary, Key Findings, Recommendations, Limitations, and Next Steps. Each paragraph references available dataset metrics such as record count, field count, missing cells, duplicate rows, quality score, and analytics confidence.

### Recommendation Prioritization
Recommendations are grouped into categories such as Clean first, Review, Investigate, Report, Forecast, Collect, Standardize, and Monitor. UI and report consumers should display the resulting rank, action, effort, impact, package availability, and confidence without exposing prioritization rules.

### Confidence-Aware Insights
Narratives include confidence labels, drivers, concerns, assumptions, and affected insights. The confidence explanation is customer-facing; internal scoring logic remains protected.
## Enterprise Architecture
ProgramMetrics now has a protected interface layer in `src/lib/platform/` that sits between UI callers and internal analytics modules. The UI should consume result contracts from the platform interface rather than calling or duplicating internal algorithms.

### Protected Business Logic
The Analytics Recommendation Engine, Dataset Classification, KPI Recommendation Engine, Visual Recommendation Engine, Quality Score Engine, Analytics Confidence Engine, AI Narrative Engine, Industry Intelligence, and Deliverable Recommendation Engine are treated as proprietary ProgramMetrics business logic.

### Trade Secret Strategy
Internal docs may describe module responsibilities, inputs, and outputs. Customer-facing docs and future API responses should not expose exact formulas, scoring weights, ranking rules, or recommendation heuristics.

### Future API Architecture
Future SaaS architecture should route requests through a ProgramMetrics API before invoking analytics, report, branding, workflow, and export engines. Browser clients should receive renderable results, summaries, dashboards, and export metadata instead of protected calculation methods.
## Current Architecture
- `src/lib/services/` exposes application-service boundaries for analytics, previews, reports, branding, deliverables, workflows, and pricing.
- `src/config/` centralizes packages, feature flags, export formats, templates, branding defaults, and application config.
- `src/lib/shared/` provides platform errors and diagnostics.
- `src/lib/engineRegistry.ts` registers current and future engines.
- `src/lib/platform/` exposes the analytics interface contract for services, UI, and future API callers.
- `src/lib/analytics-engine/` is the protected source of truth for `generateAnalyticsPlan()`.
- `src/lib/chart-engine/` converts `recommendedVisuals` into reusable render models through chart registry, chart selector, chart data builder, dashboard builder, and responsive chart layouts.
- The current static Studio browser script mirrors the chart-engine behavior so uploaded/session files can render immediately without a bundler; a future build step should import the TypeScript engine directly.
- Locked previews keep watermark and export-disable behavior while still rendering limited plan-driven previews.
- Studio KPI cards now include an explainability layer that answers definition, calculation logic, dataset-specific interpretation, why it matters, recommended actions, related visuals, and package/export availability.
## Current Development Status
| Area | Status | Notes |
| --- | --- | --- |
| Product positioning and navigation | In Progress | Analytics package positioning is active and should keep replacing old package-level wording where it appears. |
| Analytics Studio wizard | In Progress | Upload, setup, package selection, preview, and interactive preview exist and need continued polishing. |
| Analytics Recommendation Engine | MVP Complete | `generateAnalyticsPlan()` now produces dataset, field, missing, duplicate, quality, confidence, KPI, visual, insight, and deliverable outputs used by Studio previews. |
| Analytics Intelligence Layer | In Progress | New intelligence modules generate executive observations, findings, warnings, opportunities, prioritized actions, and confidence-aware narratives from `AnalyticsPlan`. |
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
