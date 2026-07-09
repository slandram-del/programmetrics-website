# Test Coverage Plan

## Current State
ProgramMetrics does not yet have a committed TypeScript test runner or project config. Sprint 5.1 adds `src/lib/testing/stabilizationTestPlan.ts` as a no-framework registry of critical manual and automatable test cases.

## Critical Coverage Targets

### Analytics Engine
- dataset profiler returns stable row, field, and type summaries
- field profiler respects setup rows, labels, omitted rows, and missing codes
- missing value analyzer matches missing rows, missing cells, fields with blanks, and missing percentage definitions
- duplicate analyzer ignores metadata rows and identifies exact duplicate rows
- descriptive statistics return numeric, categorical, and date summaries without one-bar-per-date behavior
- quality and confidence scores return bounded outputs and explanations without exposing formulas

### Analytics Intelligence
- observations, warnings, recommendations, and narratives reference only evidence in `AnalyticsPlan`
- confidence narratives include drivers, concerns, assumptions, and affected insights

### Package Orchestrator
- package and output-level inheritance work consistently
- deliverable manifests return included, preview-only, locked, and enterprise-only states
- locked previews are watermarked and export-disabled

### Deliverables Platform
- reports are assembled from reusable sections
- each report includes version metadata
- preview cards display package inclusion, lock state, estimated pages, and generation time
- report previews limit content when locked

### Regression Flow
- upload file
- review data setup
- choose package
- choose output level
- generate preview
- open interactive preview
- click KPI detail panels
- review missing values and quality score
- review deliverables tab
- verify locked exports remain disabled

## Next Step
Add `package.json`, `tsconfig.json`, and a lightweight test runner so the stabilization registry can become executable tests.
