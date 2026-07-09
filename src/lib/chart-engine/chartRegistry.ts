import type { RecommendedVisual } from "../analytics-engine";

export function getChartRegistry(): Record<string, string> {
  // TODO: Map RecommendedVisual.type values to concrete chart components.
  return {};
}

export function resolveChartComponent(visual: RecommendedVisual): string {
  return getChartRegistry()[visual.type] || "PlaceholderChart";
}
