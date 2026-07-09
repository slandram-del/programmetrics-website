# Platform Architecture

## Purpose
ProgramMetrics uses a layered architecture so UI code renders structured outputs while proprietary engines and business logic remain isolated and ready for future server-side execution.

## Layer Diagram
```text
Presentation Layer
  -> Application Services
  -> Analytics / Report / Branding / Workflow Engines
  -> Shared Utilities
  -> Configuration
  -> Future Infrastructure
```

Future SaaS deployment:

```text
Frontend
  -> ProgramMetrics API
  -> Application Services
  -> Analytics Engines
  -> Persistence
  -> Storage
```

## Layers

### Presentation Layer
Current static pages and future React components should display results, handle user input, and call services. They should not calculate quality scores, choose charts, rank recommendations, or contain package rules.

### Application Services
`src/lib/services/` exposes use-case oriented interfaces:
- `analyticsService.ts`
- `previewService.ts`
- `reportService.ts`
- `brandingService.ts`
- `deliverablesService.ts`
- `workflowService.ts`
- `pricingService.ts`

Services call engines and configuration. UI callers should use services rather than importing protected engine modules directly.

### Engine Layer
Engines live under `src/lib/*-engine/` and perform analytics, chart, report, branding, workflow, and AI-related work. Proprietary engines are registered in `src/lib/engineRegistry.ts` and documented as protected business logic.

### Shared Utilities
`src/lib/shared/` provides shared diagnostics and error classes:
- `AnalyticsError`
- `ReportGenerationError`
- `ExportError`
- `ConfigurationError`
- `ValidationError`
- diagnostics timing and event recording

### Configuration Layer
`src/config/` centralizes package, flag, template, branding, export, and application config:
- `analyticsPackages.ts`
- `featureFlags.ts`
- `industryTemplates.ts`
- `reportTemplates.ts`
- `brandingDefaults.ts`
- `exportFormats.ts`
- `applicationConfig.ts`

## Dependency Rule
```text
Presentation -> Services -> Engines -> Shared Utilities -> Configuration
```

Presentation code should not directly import protected engines. Services are the boundary for application behavior.

## Protected Business Logic
Treat these as trade secrets:
- Analytics Recommendation Engine
- Analytics Intelligence Engine
- Dataset Classification
- Quality Score Engine
- Analytics Confidence Engine
- Recommendation Prioritizer
- Visual Recommendation Engine
- Deliverables Engine
- Industry Intelligence
- AI Narrative Engine
- Report Assembly

Internal documentation may describe purpose, inputs, outputs, and interfaces. It should not publish formulas, scoring weights, ranking rules, recommendation heuristics, confidence calculations, quality formulas, or internal prompts.

## Diagnostics
Diagnostics record service and engine execution timing, warnings, and errors for internal troubleshooting. Diagnostics should not be shown directly to customers.

## Environment Configuration
No secrets, API keys, or private URLs should be hardcoded. Future API URLs and service credentials should come from environment configuration or secure backend settings.

## Current Technical Debt
The current static `script.js` still mirrors some package configuration, pricing, analytics, chart selection, and preview behavior so the static site can work without a bundler. Future work should migrate that browser logic behind `src/lib/services` or a ProgramMetrics API.
