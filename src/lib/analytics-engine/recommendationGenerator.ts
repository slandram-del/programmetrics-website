import type { RecommendedInsight } from "./types";

export function generateRecommendations(insights: RecommendedInsight[]): string[] {
  const recommendations = insights.map((insight) => insight.recommendedAction).filter(Boolean);
  return Array.from(new Set(recommendations)).slice(0, 8);
}
