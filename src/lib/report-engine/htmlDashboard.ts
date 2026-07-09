import type { AnalyticsPlan } from "../analytics-engine";

export function buildHtmlDashboard(plan: AnalyticsPlan) {
  // TODO: Render interactive dashboard HTML from selected charts.
  return { format: "html", visuals: plan.recommendedVisuals };
}
