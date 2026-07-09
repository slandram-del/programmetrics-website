import type { AnalyticsPlan } from "../analytics-engine";

export function explainAnalyticsPlan(plan: AnalyticsPlan): string {
  // TODO: Build detailed explainability responses for KPI and chart clicks.
  return `${plan.qualityProfile.explanation} ${plan.confidenceProfile.explanation}`;
}
