# Enterprise Architecture Foundation

## Purpose
ProgramMetrics is preparing to operate as a scalable SaaS platform while keeping proprietary analytics logic protected behind clear service boundaries.

This foundation separates renderable UI results from the internal methods that create those results.

## Target Architecture
```text
Analytics Studio UI
  -> Analytics Engine Interface
  -> Analytics Recommendation Engine
  -> Chart Engine
  -> Report Engine
  -> Export Engine
```

Future server architecture:

```text
Frontend
  -> ProgramMetrics API
  -> Analytics Engine
  -> Report Engine
  -> Branding Engine
  -> Workflow Engine
  -> Export Engine
```

## Interface Boundary
UI and future API callers should depend on `src/lib/platform/analyticsEngineInterface.ts`.

The interface returns:
- `AnalyticsPlan`
- KPI list
- Visual list
- Insight list
- Deliverables list
- Quality profile
- Confidence profile
- Dashboard render model
- Protected architecture notice

The UI should render these outputs and avoid recalculating proprietary analytics behavior in presentation code.

## Protected Business Logic
Treat these modules as protected ProgramMetrics business logic:
- Analytics Recommendation Engine
- Dataset Profiler
- Dataset Classification
- Field Profiler
- Field Type Detection
- Field Role Detection
- Missing Value Analyzer
- Duplicate Analyzer
- Quality Score Engine
- Analytics Confidence Engine
- KPI Recommendation Engine
- Visual Recommendation Engine
- Insight Generator
- Deliverable Recommendation Engine
- AI Narrative Engine
- Industry Intelligence

## Trade Secret Strategy
Repository work should assume private development. Internal docs may describe responsibilities, interfaces, inputs, and outputs. Customer-facing docs and future APIs should not expose formulas, scoring weights, ranking rules, or recommendation heuristics.

Future APIs should return results required for rendering and exports, not internal formulas.

## Security Review Notes
- No API keys or secrets should be hardcoded in source files.
- Runtime credentials should move to environment variables.
- Future enterprise endpoints should be documented only as architecture plans until implemented.
- The current static Studio still mirrors some engine behavior in `script.js`; this is technical debt until a bundled or server-side engine boundary is added.

## Legal Foundation
Placeholder routes now exist for:
- `/terms`
- `/privacy`
- `/license`

Each placeholder includes `TODO: Legal review required.` Final legal content should be supplied or reviewed by qualified counsel.

## Branding Rules
Use these product names consistently:
- ProgramMetrics
- Analytics Studio
- Data Foundation Package
- Management Insights Package
- Professional Analytics Package
- Executive Intelligence Suite
- Enterprise Intelligence Platform

Avoid old tier language in new customer-facing UI and documentation.

## Remaining Architecture Work
- Add API layer.
- Add authentication and user accounts.
- Add organization profiles.
- Move protected analytics execution server-side.
- Add scheduled reports and background processing.
- Add audit logs and role-based access controls.
