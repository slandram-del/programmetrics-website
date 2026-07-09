import type { AnalyticsPlan } from "../analytics-engine";

export function buildWordReport(plan: AnalyticsPlan) {
  // TODO: Produce DOCX-ready sections.
  return { format: "docx", sections: plan.recommendedInsights };
}
