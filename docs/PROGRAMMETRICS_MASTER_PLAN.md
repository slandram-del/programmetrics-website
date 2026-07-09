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

## Package Orchestrator Layer
The Package Orchestrator sits after the Analytics Recommendation and Analytics Intelligence layers and before Deliverables, Report Generator, and Export Engine. It determines what should be generated for each Analytics Package and Output Level without generating files itself.

The orchestrator returns a manifest for deliverables, report sections, dashboards, exports, branding, industry-aware sections, locked features, preview limits, permissions, checkout metadata, and future enterprise capabilities. Downstream engines should consume the manifest rather than hardcoding package rules.

### Protected Package Logic
Package definitions, output inheritance, permission decisions, upgrade rules, and deliverable availability are proprietary ProgramMetrics business logic. UI and future API consumers should receive manifest outputs only.

## Professional Deliverables Platform
The Deliverables Platform sits after the Package Orchestrator and before the Report Generator and Export Engine. It assembles versioned professional report objects from reusable templates and reusable sections. It does not calculate analytics; it consumes `AnalyticsPlan`, package manifests, and optional branding.

The platform currently supports Executive Report, Management Report, Analytics Report, Data Quality Report, Technical Appendix, and Board Report templates. It produces preview cards, locked preview metadata, report preview models, HTML/text preview render outputs, and version metadata for future enterprise auditability.

### Versioning System
`src/lib/versioning/` records Analytics Engine, Analytics Intelligence, Package Orchestrator, Deliverables Platform, Branding, Report Generator, Export Engine, generated date, and ProgramMetrics versions for every generated report object.


## Branding Engine Layer
The Branding Engine sits after package selection and before dashboard/report/export rendering. It normalizes customer organization profile input, applies ProgramMetrics defaults when fields are blank, validates colors/fonts/logos, builds dashboard/report/chart themes, and returns render-ready cover page, footer, and branding preview models.

Branding availability and export permission should come from the Package Orchestrator branding manifest. Tier 1/Data Foundation users can preview branding fields when requested, while branded exports require the package/output level indicated by the manifest.

### Branding Outputs
`src/lib/branding-engine/` returns:
- `BrandingProfile`
- `BrandTheme`
- `ChartTheme`
- `CoverPageModel`
- `FooterModel`
- `BrandingPreviewModel`
- validation messages
- package-aware permissions

Native PDF, DOCX, PPTX, PNG, HTML, and ZIP exporters should consume these outputs instead of recreating brand rules.
## Stabilization Layer
Sprint 5.1 pauses feature expansion and adds reliability guardrails: user-facing error normalization, dataset performance profiles, security/IP review checklists, accessibility requirements, and a no-framework stabilization test plan registry.

This work does not replace the need for executable tests, a TypeScript project config, CI, or a server-side API boundary. Those remain required before production launch.
## Current Architecture
- `src/lib/services/` exposes application-service boundaries for analytics, previews, reports, branding, deliverables, workflows, and pricing.
- `src/config/` centralizes packages, feature flags, export formats, templates, branding defaults, and application config.
- `src/lib/shared/` provides platform errors and diagnostics.
- `src/lib/engineRegistry.ts` registers current and future engines.
- `src/lib/platform/` exposes the analytics interface contract for services, UI, and future API callers.
- `src/lib/analytics-engine/` is the protected source of truth for `generateAnalyticsPlan()`.
- `src/lib/chart-engine/` converts `recommendedVisuals` into reusable render models through chart registry, chart selector, chart data builder, dashboard builder, and responsive chart layouts.
- `src/lib/package-orchestrator/` returns package manifests for deliverables, sections, dashboards, exports, branding, industry context, previews, permissions, and checkout metadata.
- `src/lib/deliverables-platform/` assembles versioned professional report objects, preview cards, preview models, and reusable report sections from package manifests and analytics outputs.
- `src/lib/versioning/` provides engine version metadata for reproducibility and enterprise auditing.
- `src/lib/testing/` documents stabilization test cases until an executable test runner is added.
- `src/lib/branding-engine/` normalizes organization profiles, validates brand inputs, builds dashboard/report/chart themes, and creates cover page/footer/preview models.
- `src/lib/shared/` now includes error, diagnostics, performance, security-review, and accessibility guidance utilities.
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
| Package Orchestrator | MVP Complete | Central manifest engine now determines package contents, output level inheritance, deliverables, report sections, dashboards, previews, branding, industry sections, permissions, and checkout metadata. |
| Deliverables Platform | MVP Complete | Versioned report-object assembly, reusable sections, templates, preview cards, branding profile support, and future-export preparation exist. Static Studio integration and tests remain. |
| Report Generator | In Progress | HTML-style report outputs exist; native PDF, DOCX, and PPTX generation need production implementation. |
| Export Engine | In Progress | Export menu and ZIP structure exist; native binary formats need production-grade exporters. |
| Branding Engine | MVP Complete | Reusable profile normalization, validation, logo safety, color/typography/theme generation, cover pages, footers, previews, and package-aware permissions exist. Persistence and native exporter adapters remain. |
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
