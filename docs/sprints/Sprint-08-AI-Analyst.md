# Sprint 08 - AI Analyst

## Status
Planned.

## Goal
Create a grounded AI-style analyst layer that explains dataset findings, answers user questions, and generates executive narrative from analytics-plan outputs.

## Scope
- Ask-a-question panel
- Dataset summary answers
- Quality score explanation
- Missing-value explanation
- Trend explanation
- Executive summary generation
- Recommended fixes
- Package-aware AI narrative depth
- Citation/traceback to analytics-plan metrics and visuals

## Acceptance Criteria
- AI answers are grounded in analytics-plan outputs.
- AI does not claim unsupported conclusions.
- Explanations reference actual dataset counts, fields, and quality/confidence results.
- Locked previews can show limited AI explanation, while full reusable narrative/export requires the correct package.
- AI output can flow into reports, slides, and executive summaries.

## Remaining Work
- Build prompt/context router from analytics-plan and chart-engine models.
- Add question categories and answer templates.
- Add safety guardrails for unsupported inference.
- Add executive narrative generator.
- Add tests for grounded answer behavior.

## Dependencies
- Analytics Engine
- KPI Explainability
- Chart Engine
- Report Generator

## Related Docs
- `docs/AI_ANALYST.md`
- `docs/ANALYTICS_ENGINE.md`
- `docs/PROJECT_STATUS.md`
