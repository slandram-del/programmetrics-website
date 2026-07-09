# Sprint 07 - Branding

## Status
Planned / partial UI fields exist.

## Goal
Allow customers to preview and export branded analytics deliverables according to package access.

## Scope
- Organization name
- Program/report name
- Report title and subtitle
- Prepared for / prepared by
- Logo and secondary logo uploads
- Primary, secondary, and accent colors
- Preferred font
- Confidential footer
- Contact email and website
- Mission statement
- Executive summary notes

## Acceptance Criteria
- Branding fields are session-only and not stored as long-term customer data.
- Tier/package-locked users can preview branding but cannot export branded outputs until unlocked.
- Branding applies to dashboard header, report cover, PDF, DOCX, PPTX, PNG, HTML dashboard, and README/package metadata.
- If branding is blank, ProgramMetrics uses clean defaults.

## Remaining Work
- Convert current branding fields into reusable branding profiles.
- Apply branding to every export renderer.
- Add logo validation and preview handling.
- Add theme tokens for chart-engine colors.
- Add branded output tests.

## Dependencies
- Chart Engine
- Report Generator
- Export Engine
- Studio package access logic

## Related Docs
- `docs/BRANDING_SYSTEM.md`
- `docs/UI_UX_GUIDELINES.md`
- `docs/PROGRAMMETRICS_MASTER_PLAN.md`
