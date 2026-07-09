import type { AnalyticsPlan } from "../analytics-engine";

export function buildPdfReport(plan: AnalyticsPlan) {
  // TODO: Produce PDF-ready report sections.
  return { format: "pdf", quality: plan.qualityProfile };
}
