# ProgramMetrics Roadmap

## Phase 1 - Product Positioning and Site Structure
- [ ] Replace feature upgrade language with Analytics Packages
- [x] Update customer-facing "tier" language to "package"
- [ ] Update navigation
- [ ] Update landing page
- [ ] Update pricing page
- [ ] Update examples page
- [ ] Update enterprise page

## Phase 2 - Analytics Studio Wizard
- [x] Upload step
- [x] File summary
- [x] Data setup step
- [x] Header row selector
- [x] Variable label row selector
- [x] Data start row selector
- [x] Omit rows control
- [x] Missing value coding panel
- [x] Package selection
- [x] Output level selection
- [x] Preview generation
- [x] Interactive preview launch
- [ ] Further refine responsive layout and package selector fit on small screens
- [ ] Add stronger metadata-column detection controls

## Phase 3 - Analytics Recommendation Engine - Complete for MVP
- [x] Dataset profile
- [x] Field profile
- [x] Missing profile
- [x] Duplicate profile
- [x] Descriptive statistics
- [x] Dataset type detection
- [x] Field role detection
- [x] KPI recommendations
- [x] Visual recommendations
- [x] Insight recommendations
- [x] Deliverables recommendations
- [x] Analytics confidence scoring

## Phase 4 - Visual Analytics Engine - In Progress
- [x] Reusable chart registry
- [x] Chart selector for `recommendedVisuals`
- [x] Chart data builder with axes, legends, tooltips, and render metadata
- [x] Dashboard builder with tab grouping
- [x] Responsive chart layouts
- [x] KPI cards from `recommendedKpis`
- [x] Interactive KPI detail panels for records, fields, missingness, duplicates, quality, confidence, and date range
- [x] Date trends from monthly/quarterly grouped plan data
- [x] Top category charts with top values and Other grouping
- [x] Donut charts
- [x] Heatmap placeholder / completeness visual
- [x] Histograms
- [x] Box plot summaries
- [ ] Scatter plots
- [x] Quality gauge
- [x] Component bars
- [x] KPI explainability sections: definition, calculation logic, dataset-specific explanation, why it matters, actions, related visuals, and export availability
- [x] Missing value visuals
- [ ] Duplicate review visuals beyond summary tables
- [x] Dashboard tabs for Overview, Visual Analytics, Data Quality, Descriptive Statistics, Missing Values, Recommendations, and Deliverables
- [x] Coming-soon chart card for unsupported visual types
- [ ] SVG/canvas production renderer for true chart drawing beyond HTML/CSS render models


## Phase 4.4 - Platform Architecture Foundation - Complete
- [x] Add protected analytics interface layer in `src/lib/platform`
- [x] Add application service layer in `src/lib/services`
- [x] Add centralized configuration layer in `src/config`
- [x] Add engine registry in `src/lib/engineRegistry.ts`
- [x] Add shared diagnostics and platform error types in `src/lib/shared`
- [x] Add architecture refactoring report
- [x] Document protected business logic and trade secret strategy
- [x] Add future ProgramMetrics API architecture path
- [x] Add legal placeholder routes for `/terms`, `/privacy`, and `/license`
- [x] Standardize copyright footer wording
- [x] Add export/report metadata copyright placeholders
- [ ] Move static Studio browser calculations behind the platform interface or future API
- [ ] Add automated architecture checks for public API/result contracts


## Phase 4.5 - Analytics Intelligence and Recommendation System - In Progress
- [x] Create Analytics Intelligence Engine above `AnalyticsPlan`
- [x] Add executive observation generator
- [x] Add analytical finding generator
- [x] Add warning detector
- [x] Add opportunity detector
- [x] Add recommendation prioritizer
- [x] Add confidence-aware narrative builder
- [x] Add executive narrative blocks for summary, quality, findings, recommendations, limitations, and next steps
- [x] Add grouped insight sections for dashboard/report/AI Analyst consumers
- [x] Add action planner with impact and effort
- [x] Expose intelligence output through `src/lib/platform`
- [ ] Connect static Studio dashboard tabs directly to intelligence output
- [ ] Add tests for observation, warning, finding, recommendation, and narrative outputs


## Phase 4.6 - Package Orchestrator and Deliverable Manifest Engine - Complete
- [x] Create `src/lib/package-orchestrator/`
- [x] Add centralized package registry for all Analytics Packages
- [x] Add output level inheritance for Essential, Professional, Premium, and Executive
- [x] Add deliverable manifest builder
- [x] Add report section manifest builder
- [x] Add dashboard manifest contracts
- [x] Add preview availability, watermark, page, and chart limits
- [x] Add branding availability manifest
- [x] Add industry-aware optional sections
- [x] Add permission resolver for included, preview-only, upgrade-required, and enterprise-only states
- [x] Add checkout metadata placeholders for selected price, upgrade price, comparisons, and upgrades
- [x] Expose package manifest through `deliverablesService`
- [ ] Connect static Studio deliverable cards directly to package manifests
- [ ] Add tests for package inheritance, permissions, previews, branding, and industry sections

## Phase 5 - Report Generator
- [ ] Executive summary
- [ ] Key findings
- [ ] Recommendations
- [ ] Methodology
- [ ] Appendix
- [ ] Data dictionary
- [ ] Processing notes
- [ ] Limitations

## Phase 6 - Export Engine
- [ ] CSV
- [ ] XLSX
- [ ] HTML
- [ ] PDF
- [ ] DOCX
- [ ] PPTX
- [ ] PNG
- [ ] SVG
- [ ] JSON
- [ ] ZIP
- [ ] Package-aware export locks connected to checkout state

## Phase 7 - Branding Engine
- [ ] Brand profile
- [ ] Logo upload
- [ ] Color palette
- [ ] Report footer
- [ ] Cover page
- [ ] Presentation theme
- [ ] Organization profile

## Phase 8 - AI Analyst
- [ ] Ask a question panel
- [ ] Dataset summary answers
- [ ] Quality score explanation
- [ ] Missing value explanation
- [ ] Trend explanation
- [ ] Executive summary generation
- [ ] Recommended fixes

## Phase 9 - Report Library
- [ ] Saved reports
- [ ] Saved dashboards
- [ ] Export history
- [ ] Regenerate report
- [ ] Duplicate report

## Phase 10 - Workflows
- [ ] Save workflow
- [ ] Re-run workflow
- [ ] Monthly reporting workflow
- [ ] Workflow templates

## Phase 11 - Industry Templates
- [ ] Housing and shelter
- [ ] Behavioral health
- [ ] Education
- [ ] Healthcare
- [ ] Government
- [ ] Nonprofits
- [ ] Research and evaluation

## Phase 12 - Enterprise
- [ ] Custom quote flow
- [ ] White labeling
- [ ] Team accounts
- [ ] API
- [ ] Audit logs
- [ ] Multi-file analytics

## Newly Discovered Subtasks
- Add browser or build-step integration so Studio can import the TypeScript chart engine directly instead of mirroring compatible browser logic.
- Add automated smoke tests for upload -> setup -> generate preview -> open interactive preview.
- Add visual regression screenshots for dashboard tabs and locked preview overlays.
- Add a TypeScript project config and test runner for chart-engine unit tests.
- Build native SVG/canvas chart renderers from the chart-engine render model.
- Add automated tests for KPI explainability panel content and click behavior.

- Add server-side protected analytics API boundary.
- Add architecture linting to prevent protected formulas from leaking into UI components.
- Add tests for intelligence-engine outputs using representative survey, business, and program datasets.
- Add architecture lint rules preventing presentation code from importing protected engines directly.

## Related Documents
- [Master Plan](PROGRAMMETRICS_MASTER_PLAN.md)
- [TODO](TODO.md)
- [Coding Standards](CODING_STANDARDS.md)
