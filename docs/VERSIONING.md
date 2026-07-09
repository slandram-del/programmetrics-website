# Versioning

## Purpose
ProgramMetrics version metadata supports reproducibility, debugging, enterprise audits, and future version history for generated reports and deliverables.

Every professional report object should include version metadata describing the engines that produced it.

## Source Files
```text
src/lib/versioning/
  engineVersions.ts
  reportVersion.ts
  packageVersion.ts
  versionMetadata.ts
  index.ts
```

## Current Engine Versions
- Analytics Engine: v1.0.0
- Analytics Intelligence Engine: v1.0.0
- Package Orchestrator: v1.0.0
- Deliverables Platform: v1.0.0
- Branding Engine: v1.0.0
- Report Generator: v1.0.0
- Export Engine: v1.0.0
- ProgramMetrics: v1.0.0

## Metadata Contract
`buildVersionMetadata()` returns:
- `analyticsEngineVersion`
- `intelligenceEngineVersion`
- `packageOrchestratorVersion`
- `deliverablesPlatformVersion`
- `brandingVersion`
- `reportGeneratorVersion`
- `exportEngineVersion`
- `generatedDate`
- `programMetricsVersion`

## Report Metadata
Report objects include version metadata through the Deliverables Platform. The Version Metadata section may be hidden in rendered customer previews while remaining available to exports and enterprise audit records.

## Package Metadata
`buildPackageVersion()` records the selected package, output level, and version metadata for package-level reproducibility.

## Future Work
- Persist version metadata with saved reports.
- Add semantic version bump policy for protected engines.
- Add migration notes when report templates or package manifest rules change.
- Add enterprise audit exports that include version metadata.
