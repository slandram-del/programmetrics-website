# Package Orchestrator

## Purpose
The Package Orchestrator determines what ProgramMetrics should generate for a selected Analytics Package and Output Level. It does not generate reports, dashboards, files, or exports. It returns a structured manifest that downstream engines consume.

The orchestrator is the single source of truth for:
- package contents
- inherited output levels
- deliverable availability
- report sections
- dashboard availability
- preview limits
- locked features
- export permissions
- branding requirements
- industry-aware optional sections
- checkout metadata

## Architecture
```text
Analytics Recommendation Engine
  -> Analytics Intelligence Engine
  -> Package Orchestrator
  -> Deliverables Engine
  -> Report Generator
  -> Export Engine
```

UI, report, export, and checkout surfaces should consume the manifest instead of hardcoding package rules.

## Source Files
```text
src/lib/package-orchestrator/
  packageOrchestrator.ts
  packageRegistry.ts
  packageResolver.ts
  outputLevelResolver.ts
  deliverableManifestBuilder.ts
  sectionManifestBuilder.ts
  featureAvailability.ts
  previewAvailability.ts
  brandingAvailability.ts
  industryAvailability.ts
  permissionResolver.ts
  deliverableCards.ts
  packageTypes.ts
  index.ts
```

## Manifest Contract
`buildPackageManifest()` returns:
- `package`
- `outputLevel`
- `inheritedLevels`
- `deliverables`
- `reportSections`
- `dashboards`
- `exports`
- `branding`
- `industry`
- `lockedFeatures`
- `previewFeatures`
- `permissions`
- `checkout`
- `futureEnterpriseSupport`

Every deliverable includes preview and export flags:
- `previewAvailable`
- `exportAvailable`
- `locked`
- `watermark`
- `maxPreviewPages`
- `maxPreviewCharts`
- `permission`

## Output Level Inheritance
Supported output levels:
- Essential
- Professional
- Premium
- Executive

Each level inherits everything below it. Legacy `complete` and `custom` selections are normalized to Executive so older Studio selections remain compatible.

## Package Registry
The centralized registry includes:
- Data Foundation Package
- Management Insights Package
- Professional Analytics Package
- Executive Intelligence Suite
- Enterprise Intelligence Platform

Each package defines deliverables, dashboards, report sections, enterprise capabilities, and package rank metadata.

## Permissions
Permission statuses are:
- Included
- Preview Only
- Upgrade Required
- Enterprise Only

Locked outputs remain previewable when appropriate but are watermarked, limited, and export-disabled. Export permission is determined by the orchestrator manifest rather than hidden UI buttons.

## Branding
Branding availability is determined by package and output level. Branding fields can be previewed, but export-ready branded output requires the appropriate package and level.

## Industry Awareness
The orchestrator accepts `AnalyticsPlan.datasetType` and maps it to industry contexts such as survey, housing, behavioral health, education, healthcare, finance, CRM, case management, government, research, or generic. Industry context adds optional report sections and recommended dashboard concepts.

## Deliverable Cards
`buildDeliverableCards()` turns deliverable manifest items into UI-ready metadata:
- thumbnail
- name
- description
- estimated pages
- generation time
- included
- preview
- locked
- export

## Trade Secret Boundary
The Package Orchestrator represents proprietary ProgramMetrics business logic. Public UI and API consumers should receive manifest outputs only. Do not expose internal package rules, inheritance logic, upgrade rules, or package comparison algorithms in customer-facing code or documentation.

## Current Limitations
- The orchestrator determines what should be generated; it does not generate report files.
- Static Studio still needs deeper integration so package and deliverable cards are driven directly by the manifest.
- Automated tests for package inheritance and permission edge cases are still needed.
