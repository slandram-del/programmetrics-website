import type { AnalyticsPlan } from "../analytics-engine";

export function generateSummary(plan: AnalyticsPlan): string {
  // TODO: Add audience-aware summary generation.
  return `ProgramMetrics analyzed ${plan.datasetProfile.totalRecords} records across ${plan.datasetProfile.totalFields} fields.`;
}
