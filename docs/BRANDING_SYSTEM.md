# Branding System

## Purpose
The Branding System lets customers apply their organization identity to ProgramMetrics dashboards, reports, presentations, images, and export packages.

## Brand Profile Fields
- Organization name
- Program name
- Report title
- Subtitle
- Prepared for
- Prepared by
- Report date
- Logo
- Secondary logo
- Primary color
- Secondary color
- Accent color
- Preferred font
- Confidential footer
- Contact email
- Website
- Mission statement
- Executive summary notes

## How Branding Applies
### PDF
- Cover page
- Header and footer
- Section colors
- Logo placement
- Confidentiality footer

### DOCX
- Title page
- Heading styles
- Branded tables
- Footer and contact details

### PPTX
- Title slide
- Dashboard slide theme
- Chart colors
- Closing slide

### HTML
- Dashboard header
- Navigation accents
- Report title block
- Footer

### PNG
- Executive infographic
- Dashboard screenshot branding
- Chart image accents

### ZIP
- README
- Metadata
- Report folder naming
- Branded deliverable files

## Session Behavior
Logo uploads and brand settings entered during preview are session-only unless the future Report Library or Brand Profile system stores them with user permission.

## Related Documents
- [UI/UX Guidelines](UI_UX_GUIDELINES.md)
- [Export Engine](EXPORT_ENGINE.md)

## Sprint 5.2 Implementation
The reusable Branding Engine now lives in `src/lib/branding-engine/`.

Implemented modules:
- `brandingTypes.ts`: shared profile, asset, theme, chart theme, cover page, footer, validation, and preview contracts.
- `brandingProfile.ts`: ProgramMetrics defaults and profile normalization from Studio/browser aliases.
- `brandingProfileValidator.ts`: color, contrast, font, logo, and contact validation.
- `brandingResolver.ts`: package-aware branding availability and export permission resolution.
- `themeBuilder.ts`: dashboard/report theme model.
- `typographyResolver.ts`: approved web-safe typography choices.
- `colorPalette.ts`: color normalization, contrast scoring, tints/shades, and chart palette generation.
- `logoProcessor.ts`: PNG/JPG validation and session-safe preview handling, with SVG disabled until sanitization exists.
- `coverPageBuilder.ts`: branded cover-page model.
- `footerBuilder.ts`: footer/contact/copyright model.
- `chartThemeBuilder.ts`: branded chart palette and chart styling model.
- `brandingPreviewBuilder.ts`: render-ready dashboard/report preview model.
- `brandingRenderer.ts`: lightweight HTML preview helpers.
- `brandingEngine.ts`: orchestration function that returns profile, validation, permissions, theme, chartTheme, coverPage, footer, and preview.

## Default Behavior
If a customer leaves branding fields blank, ProgramMetrics uses clean defaults: ProgramMetrics organization text, professional blue/navy/teal colors, approved fonts, and standard copyright/footer copy.

Logo uploads are treated as session-only inputs. PNG and JPG/JPEG images are accepted within the current size guardrail. SVG logos are reported as warnings and not rendered until sanitization is implemented.

## Package-Aware Branding
Branding preview can be shown when requested, but branded export availability is controlled by the Package Orchestrator branding manifest. Export adapters should check `permissions.exportAvailable` before producing branded deliverables.

## Remaining Work
- Persist saved organization profiles after authentication and storage exist.
- Connect PDF, DOCX, PPTX, PNG, HTML, and ZIP exporters to the branding models.
- Add automated tests for profile normalization, validation, logo safety, color contrast, package permissions, and render models.
- Add secure SVG sanitization before enabling SVG logo previews or exports.
