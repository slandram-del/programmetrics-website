import type { AnalyticsPlan } from "../analytics-engine";

export function buildPowerPoint(plan: AnalyticsPlan) {
  // TODO: Produce PPTX-ready slide outlines.
  return { format: "pptx", slides: plan.recommendedVisuals.slice(0, 8) };
}
