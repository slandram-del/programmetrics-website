import type { AnalyticsPlan } from "../analytics-engine";

export function runWorkflow(plan: AnalyticsPlan) {
  // TODO: Execute saved workflow steps against an analytics plan.
  return { status: "preview", planSummary: plan.datasetProfile };
}
