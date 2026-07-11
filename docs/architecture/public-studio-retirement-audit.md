# Public Studio Retirement Audit

Date: 2026-07-10
Status: Prepared locally; not deployed.

## Decision

The public website should no longer execute ProgramMetrics Studio. The public repository should present marketing, package, example, contact, and legal content. The private application repository owns Studio execution.

## Public website pages reviewed

| Page | Current role | Recommendation |
| --- | --- | --- |
| `index.html` | Marketing home, solutions, examples | Remain public. |
| `studio.html` | Former executable public Studio | Converted locally to a safe Studio launch/fallback page. Do not restore executable Studio here. |
| `studio-pricing.html` | Analytics package/pricing guide | Remain public; links may continue to the Studio launch page until `app.programmetrics.io` is live. |
| `dashboard-generator.html` | Legacy dashboard/Studio entry point | Redirect later or retire after owner review. Public page currently references `studio.html`. |
| `tier-2-dashboard-builder.html` | Legacy builder/demo page | Redirect later or retire after owner review. Public page currently references `studio.html`. |
| `checkout.html` | Public checkout flow | Requires manual review before retirement because public scripts still reference Studio unlock return paths. |
| `program-evaluation-demo.html` and template pages | Public examples/templates | Remain public. |
| `cyfd-denial-referral-visual-analysis.html` | Public example/demo artifact | Requires owner review; may remain as a public example if approved. |
| `contact.html`, legal pages, template pages | Marketing/support/legal | Remain public. |

## Private app equivalents

The following private application pages already exist in `programmetrics-app`:

- `studio.html`
- `studio-pricing.html`
- `dashboard-generator.html`
- `tier-2-dashboard-builder.html`

The corrected browser-verified Studio exists only in `programmetrics-app` and includes the build marker `V2.1-preview-fix-2026-07-10`.

## Copies requiring manual review

- `programmetrics-website/github-upload-package/*`
- `programmetrics-website/migration-output/programmetrics-app/*`

These are packaging/migration artifacts and should not be treated as the current served source without owner review.

## Public launch routing prepared

`programmetrics-website/studio.html` is now a launch/fallback page that links to `https://app.programmetrics.io` and provides public alternatives:

- Review Analytics Packages
- Review Examples
- Contact ProgramMetrics
- Request Early Access

No private application code was copied into the public website.