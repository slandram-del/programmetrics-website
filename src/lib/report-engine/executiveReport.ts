import type { AnalyticsPlan } from "../analytics-engine";

export function buildExecutiveReport(plan: AnalyticsPlan) {
  // TODO: Generate executive report content from the analytics plan.
  return { title: "Executive Report", insights: plan.recommendedInsights };
}
