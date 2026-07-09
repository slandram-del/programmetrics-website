# Deliverables Platform

## Purpose
The ProgramMetrics Deliverables Platform assembles consulting-quality report objects and preview metadata from Analytics Engine outputs, Analytics Intelligence outputs, and Package Orchestrator manifests.

It does not perform analytics calculations. It organizes approved outputs into reusable report templates, reusable report sections, preview cards, and future export-ready report objects.

## Architecture
```text
Analytics Recommendation Engine
  -> Analytics Intelligence Layer
  -> Package Orchestrator
  -> Deliverables Platform
  -> Report Generator
  -> Export Engine
```

## Source Files
```text
src/lib/deliverables-platform/
  deliverablesPlatform.ts
  reportBuilder.ts
  reportAssembler.ts
  sectionRegistry.ts
  sectionRenderer.ts
  previewBuilder.ts
  previewRenderer.ts
  deliverableManifest.ts
  deliverableMetadata.ts
  deliverableVersion.ts
  index.ts
```

## Main Entry Point
`buildDeliverablesPlatform()` accepts:
- `AnalyticsPlan`
- `PackageManifest`
- optional branding profile

It returns:
- professional deliverable manifest
- assembled report objects
- included reports
- preview-only reports
- locked reports
- preview cards
- report previews
- HTML/text preview render outputs

## Report Templates
Supported template contracts:
- Executive Report
- Management Report
- Analytics Report
- Data Quality Report
- Technical Appendix
- Board Report

Templates are section lists. They do not duplicate content. The platform combines template defaults with deliverable-specific sections from the Package Orchestrator.

## Standard Sections
Reusable sections include:
- Cover Page
- Executive Summary
- Dataset Overview
- Dataset Confidence
- Data Quality Review
- Missing Value Summary
- Duplicate Review
- Visual Analytics
- Descriptive Statistics
- Key Findings
- Recommendations
- Opportunities
- Warnings
- Methodology
- Limitations
- Appendix
- Data Dictionary
- Processing Notes
- Version Metadata

## Preview Behavior
Every generated report object can produce a preview card and preview model. Locked previews are limited, watermarked, and export-disabled. Preview cards include thumbnail, description, estimated pages, generation time, package inclusion, preview availability, and export lock state.

## Branding
Branding fields are accepted through the deliverables platform and passed into cover/report sections:
- logo
- organization
- primary color
- secondary color
- font family
- footer
- prepared for
- prepared by
- report date
- mission statement
- website

If branding is not provided, ProgramMetrics defaults are used.

## Export Readiness
The platform prepares report objects for future PDF, DOCX, PPTX, HTML, PNG, XLSX, CSV, and ZIP exporters. It does not produce binary exports yet.

## Protection Boundary
The Deliverables Platform is proprietary ProgramMetrics business logic. UI should receive report objects and preview metadata only. Report assembly rules, package expansion logic, and future export rules should remain isolated from presentation code.

## Current Limitations
- Native PDF, DOCX, PPTX, PNG, XLSX, CSV, and ZIP export generation remains in the Report Generator and Export Engine roadmap.
- Static Studio Deliverables tab still needs to consume these report preview objects directly.
- Automated tests are needed for section assembly, locked preview limits, branding, and version metadata.
