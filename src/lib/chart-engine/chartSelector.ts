import type { RecommendedVisual } from "../analytics-engine";

export function selectCharts(recommendedVisuals: RecommendedVisual[]): RecommendedVisual[] {
  // TODO: Add package-aware, layout-aware chart selection.
  return recommendedVisuals.sort((a, b) => a.priority - b.priority);
}
