# Technical Debt Register

## Purpose
This register tracks known ProgramMetrics stabilization work before Branding, Export Engine, AI Analyst, and Industry Templates expand the platform.

| Issue | Severity | Affected Files | Recommended Fix | Priority |
| --- | --- | --- | --- | --- |
| Static Studio mirrors protected TypeScript engine behavior in browser script. | High | `script.js`, `script-20260610.js`, `src/lib/analytics-engine/`, `src/lib/platform/` | Add a build step or server-side API so Studio consumes platform/service outputs instead of duplicated browser logic. | P1 |
| No installed TypeScript project config or test runner. | High | `src/lib/**`, repo root | Add `package.json`, `tsconfig.json`, and a lightweight test runner for engine/service tests. | P1 |
| Native export adapters are not production-grade yet. | High | `src/lib/report-engine/`, `src/lib/deliverables-platform/`, `docs/EXPORT_ENGINE.md` | Build exporters that consume `ProfessionalReport` objects and enforce package manifest permissions. | P1 |
| Large dataset processing remains browser/session-bound. | High | `script.js`, `src/lib/analytics-engine/`, future API | Add background processing or server-side workers for 50k+ and 100k+ row files. | P1 |
| Accessibility needs manual QA across interactive preview and KPI panels. | Medium | `studio.html`, `script.js`, `styles.css` | Add keyboard regression checks, focus management tests, modal Escape handling checks, and chart text fallbacks. | P2 |
| Package/pricing content still exists in both config and static UI code. | Medium | `src/config/analyticsPackages.ts`, `script.js`, `studio-pricing.html` | Generate static package content from config or route through a manifest endpoint. | P2 |
| Deliverables Platform is not yet connected to the static Deliverables tab. | Medium | `src/lib/deliverables-platform/`, `script.js` | Render preview cards from `buildProfessionalDeliverablesOutput()` through a future service/API integration. | P2 |
| Visual regression coverage is missing. | Medium | `studio.html`, `styles.css`, `script.js` | Add Playwright screenshots for upload, setup, package selection, dashboard tabs, KPI panels, and locked overlays. | P2 |
| Security review is manual. | Medium | `src/lib/**`, `docs/**`, public HTML/JS | Add automated scans for secrets and protected-term leakage in public assets. | P2 |
| Documentation can drift quickly during sprint work. | Low | `docs/**` | Keep sprint docs updated in every feature commit and add docs checklist to PR template when repo moves to PR workflow. | P3 |

## Stabilization Notes
- No hardcoded API keys or secrets were found in the reviewed static source pass.
- Protected logic boundaries are documented, but automated enforcement is still planned.
- `src/lib/testing/stabilizationTestPlan.ts` documents test coverage targets until a test runner is added.
