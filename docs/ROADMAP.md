# ProgramMetrics Roadmap

## Phase 1 - Product Positioning and Site Structure
- [ ] Replace feature upgrade language with Analytics Packages
- [ ] Update all "tier" language to "package"
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

## Related Documents
- [Master Plan](PROGRAMMETRICS_MASTER_PLAN.md)
- [TODO](TODO.md)
- [Coding Standards](CODING_STANDARDS.md)
