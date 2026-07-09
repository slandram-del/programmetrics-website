import type { AnalyticsPlan } from "../analytics-engine";

export function exportDashboardPng(plan: AnalyticsPlan) {
  // TODO: Render dashboard and chart PNG assets.
  return { format: "png", count: plan.recommendedVisuals.length };
}
