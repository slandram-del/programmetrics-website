import type { AnalyticsPlan } from "../types";
import type { ConfidenceNarrative } from "./analyticsIntelligenceEngine";

export function buildConfidenceNarrative(plan: AnalyticsPlan): ConfidenceNarrative {
  const confidence = plan.confidenceProfile;
  const label = confidence.label;
  const summary = label === "High"
    ? `ProgramMetrics has high confidence in these analytics outputs because ${confidence.confidenceDrivers.slice(0, 2).join(" and ") || "the dataset has usable structure and limited quality concerns"}.`
    : label === "Moderate"
      ? `ProgramMetrics has moderate confidence. The dataset is usable, but ${confidence.confidenceConcerns.slice(0, 2).join(" and ") || "some quality or structure issues may affect interpretation"}.`
      : `ProgramMetrics has low confidence because ${confidence.confidenceConcerns.slice(0, 2).join(" and ") || "data quality or structure limits reliable interpretation"}.`;

  return {
    label,
    score: confidence.overallConfidence,
    summary,
    drivers: confidence.confidenceDrivers,
    concerns: confidence.confidenceConcerns,
    assumptions: plan.assumptions,
    affectedInsights: confidence.affectedInsights
  };
}
