# Sprint 09 - Industry Templates

## Status
Planned.

## Goal
Create industry-aware analytics templates that help ProgramMetrics choose better KPIs, visuals, recommendations, reports, and language for different customer datasets.

## Target Template Areas
- Housing and shelter
- Behavioral health
- Education
- Healthcare
- Government
- Nonprofits
- Research and evaluation
- Grant reporting
- Referral and denial workflows
- Program participation and outcomes

## Acceptance Criteria
- Dataset type detection can route to an industry template.
- Templates suggest relevant KPIs, fields, visuals, report sections, and recommendations.
- Templates use customer-friendly language for the domain.
- Templates never override actual dataset evidence.
- Templates support locked previews and package-aware export depth.

## Remaining Work
- Define template schema.
- Build field-role mappings by industry.
- Add template-specific KPI and visual recommendation rules.
- Add sample datasets and fixtures.
- Add template documentation and examples page content.

## Dependencies
- Analytics Engine
- AI Analyst
- Report Generator
- Pricing/package strategy

## Related Docs
- `docs/INDUSTRY_TEMPLATES.md`
- `docs/ANALYTICS_ENGINE.md`
- `docs/PROGRAMMETRICS_MASTER_PLAN.md`
