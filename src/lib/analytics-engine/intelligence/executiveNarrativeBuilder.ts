import type { AnalyticsPlan } from "../types";
import type { AnalyticalFinding, ConfidenceNarrative, ExecutiveObservation, IntelligenceWarning, NarrativeBlock, PrioritizedRecommendation } from "./analyticsIntelligenceEngine";

function paragraph(parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function buildExecutiveNarrative(
  plan: AnalyticsPlan,
  observations: ExecutiveObservation[],
  findings: AnalyticalFinding[],
  warnings: IntelligenceWarning[],
  recommendations: PrioritizedRecommendation[],
  confidenceNarrative: ConfidenceNarrative
): NarrativeBlock[] {
  const topWarning = warnings[0];
  const topFinding = findings[0];
  const topRecommendation = recommendations[0];
  const dateText = plan.datasetProfile.detectedDateFields.length
    ? `${plan.datasetProfile.detectedDateFields.length} date field(s) support trend analysis.`
    : "No reliable date field was detected for trend analysis.";

  const executiveSummary: NarrativeBlock = {
    id: "executive-summary",
    title: "Executive Summary",
    section: "Executive Summary",
    confidenceLabel: confidenceNarrative.label,
    confidence: confidenceNarrative.score,
    relatedObservations: observations.slice(0, 4).map((observation) => observation.id),
    paragraphs: [
      paragraph([
        `This file contains ${plan.datasetProfile.totalRecords} records across ${plan.datasetProfile.totalFields} fields.`,
        `ProgramMetrics classified it as ${plan.datasetType.primaryType} data.`,
        dateText,
        `The current quality score is ${plan.qualityProfile.overallScore} and analytics confidence is ${plan.confidenceProfile.overallConfidence}%.`
      ]),
      paragraph([
        topFinding ? `Key finding: ${topFinding.description}` : undefined,
        topWarning ? `Primary caution: ${topWarning.description}` : "No critical warning was detected from the current analytics plan.",
        topRecommendation ? `Recommended next step: ${topRecommendation.recommendedAction}` : undefined
      ])
    ]
  };

  const dataQuality: NarrativeBlock = {
    id: "data-quality-summary",
    title: "Data Quality Summary",
    section: "Data Quality Summary",
    confidenceLabel: confidenceNarrative.label,
    confidence: confidenceNarrative.score,
    relatedObservations: observations.filter((observation) => /Quality|Missing|Duplicate|Completeness/.test(observation.category)).map((observation) => observation.id),
    paragraphs: [
      paragraph([
        `The dataset has ${plan.missingProfile.missingCells} missing cells across ${plan.missingProfile.fieldsWithBlanks} fields.`,
        `${plan.duplicateProfile.exactDuplicateRows} exact duplicate row(s) were detected.`,
        plan.qualityProfile.explanation
      ]),
      plan.qualityProfile.recommendations.length ? `Quality recommendation: ${plan.qualityProfile.recommendations[0]}` : "Continue reviewing quality details before final exports."
    ]
  };

  const keyFindings: NarrativeBlock = {
    id: "key-findings",
    title: "Key Findings",
    section: "Key Findings",
    confidenceLabel: confidenceNarrative.label,
    confidence: confidenceNarrative.score,
    relatedObservations: observations.slice(0, 6).map((observation) => observation.id),
    paragraphs: findings.slice(0, 4).map((finding) => `${finding.title}: ${finding.businessImpact}`)
  };

  const recommendationBlock: NarrativeBlock = {
    id: "recommendations",
    title: "Recommendations",
    section: "Recommendations",
    confidenceLabel: confidenceNarrative.label,
    confidence: confidenceNarrative.score,
    relatedObservations: [],
    paragraphs: recommendations.slice(0, 5).map((recommendation) => `${recommendation.rank}: ${recommendation.recommendedAction}`)
  };

  const limitations: NarrativeBlock = {
    id: "limitations",
    title: "Limitations",
    section: "Limitations",
    confidenceLabel: confidenceNarrative.label,
    confidence: confidenceNarrative.score,
    relatedObservations: [],
    paragraphs: [
      warnings.length
        ? `Limitations identified: ${warnings.slice(0, 3).map((warning) => warning.title).join(", ")}.`
        : "No major limitations were identified from the current analytics plan, but final outputs should still be reviewed before business use.",
      confidenceNarrative.summary
    ]
  };

  const nextSteps: NarrativeBlock = {
    id: "next-steps",
    title: "Next Steps",
    section: "Next Steps",
    confidenceLabel: confidenceNarrative.label,
    confidence: confidenceNarrative.score,
    relatedObservations: [],
    paragraphs: recommendations.slice(0, 3).map((recommendation) => recommendation.recommendedAction)
  };

  return [executiveSummary, dataQuality, keyFindings, recommendationBlock, limitations, nextSteps];
}
