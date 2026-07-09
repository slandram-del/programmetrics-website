import type { AnalyticsPlan } from "../analytics-engine";

export function buildDashboard(plan: AnalyticsPlan) {
  // TODO: Build dashboard sections from recommendedVisuals and recommendedKpis.
  return { tabs: ["Overview", "Data Quality", "Visual Analytics"], visuals: plan.recommendedVisuals };
}
