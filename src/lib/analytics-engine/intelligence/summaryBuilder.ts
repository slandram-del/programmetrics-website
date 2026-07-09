import type { AnalyticsPlan } from "../types";
import type { AnalyticalFinding, ConfidenceNarrative, ExecutiveObservation, IntelligenceOpportunity, IntelligenceWarning } from "./analyticsIntelligenceEngine";

export function buildIntelligenceSummary(
  plan: AnalyticsPlan,
  observations: ExecutiveObservation[],
  findings: AnalyticalFinding[],
  warnings: IntelligenceWarning[],
  opportunities: IntelligenceOpportunity[],
  confidence: ConfidenceNarrative
): string {
  const pieces = [
    `${plan.datasetProfile.totalRecords} records and ${plan.datasetProfile.totalFields} fields were analyzed.`,
    `${observations.length} evidence-backed observations, ${findings.length} findings, ${warnings.length} warnings, and ${opportunities.length} opportunities were generated.`,
    `Analytics confidence is ${confidence.label} at ${confidence.score}%.`
  ];
  if (warnings[0]) pieces.push(`Primary caution: ${warnings[0].title}.`);
  if (opportunities[0]) pieces.push(`Top opportunity: ${opportunities[0].title}.`);
  return pieces.join(" ");
}
