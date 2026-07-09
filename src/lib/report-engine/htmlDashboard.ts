import type { AnalyticsPlan } from "../analytics-engine";

export function buildHtmlDashboard(plan: AnalyticsPlan) {
  // TODO: Render interactive dashboard HTML from selected charts.
  return {
    format: "html",
    visuals: plan.recommendedVisuals,
    footer: "Copyright © 2026 ProgramMetrics. All Rights Reserved."
  };
}
