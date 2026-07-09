import type { RecommendedVisual } from "../analytics-engine";

export function buildChartData(visual: RecommendedVisual, rows: Record<string, unknown>[] = []) {
  // TODO: Transform source rows into chart-ready data by visual type.
  return { visualId: visual.id, rows };
}
