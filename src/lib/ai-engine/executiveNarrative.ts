import type { AnalyticsPlan } from "../analytics-engine";

export function generateExecutiveNarrative(plan: AnalyticsPlan): string {
  // TODO: Replace deterministic narrative with AI-assisted narrative when service integration is ready.
  return plan.recommendedInsights.map((insight) => insight.text).join(" ");
}
