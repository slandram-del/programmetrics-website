import type { AnalyticsPlan } from "../analytics-engine";

export function generateAiRecommendations(plan: AnalyticsPlan): string[] {
  // TODO: Add AI-assisted prioritization and package-aware recommendations.
  return plan.recommendedInsights.map((insight) => insight.recommendedAction).slice(0, 5);
}
