import type { AnalyticsPlan } from "../types";
import type { AnalyticalFinding, IntelligenceOpportunity, IntelligenceWarning, PrioritizedRecommendation, RecommendationCategory, RecommendationRank } from "./analyticsIntelligenceEngine";

function rankFromSeverity(severity: string): RecommendationRank {
  if (severity === "critical") return "Critical";
  if (severity === "warning") return "High";
  if (severity === "opportunity") return "Medium";
  return "Low";
}

function categoryFromText(text: string): RecommendationCategory {
  const lower = text.toLowerCase();
  if (/missing|clean|duplicate/.test(lower)) return "Clean first";
  if (/standard/.test(lower)) return "Standardize";
  if (/date|trend|dashboard|report/.test(lower)) return "Report";
  if (/forecast/.test(lower)) return "Forecast";
  if (/collect|field/.test(lower)) return "Collect";
  if (/monitor/.test(lower)) return "Monitor";
  if (/investigate|review/.test(lower)) return "Review";
  return "Investigate";
}

function rankWeight(rank: RecommendationRank): number {
  return rank === "Critical" ? 4 : rank === "High" ? 3 : rank === "Medium" ? 2 : 1;
}

export function prioritizeRecommendations(plan: AnalyticsPlan, warnings: IntelligenceWarning[], opportunities: IntelligenceOpportunity[], findings: AnalyticalFinding[]): PrioritizedRecommendation[] {
  const recommendations: PrioritizedRecommendation[] = [];

  warnings.forEach((warning) => {
    const rank = rankFromSeverity(warning.severity);
    recommendations.push({
      id: `fix-${warning.id}`,
      category: categoryFromText(`${warning.title} ${warning.description}`),
      rank,
      title: warning.title,
      rationale: warning.description,
      recommendedAction: warning.recommendedFixes[0] || "Review this issue before reporting.",
      expectedImpact: rank === "Critical" || rank === "High" ? "High" : "Medium",
      estimatedEffort: warning.affectedFields.length > 5 ? "High" : warning.affectedFields.length ? "Medium" : "Low",
      confidence: warning.confidence,
      packageAvailability: "Data Foundation Package",
      relatedFields: warning.affectedFields
    });
  });

  findings.forEach((finding) => {
    recommendations.push({
      id: `finding-${finding.id}`,
      category: categoryFromText(`${finding.title} ${finding.recommendedAction}`),
      rank: finding.importance,
      title: finding.recommendedAction,
      rationale: finding.businessImpact,
      recommendedAction: finding.recommendedAction,
      expectedImpact: finding.importance === "Critical" || finding.importance === "High" ? "High" : "Medium",
      estimatedEffort: finding.relatedFields.length > 5 ? "High" : finding.relatedFields.length ? "Medium" : "Low",
      confidence: finding.confidence,
      packageAvailability: finding.packageAvailability,
      relatedFields: finding.relatedFields
    });
  });

  opportunities.forEach((opportunity) => {
    recommendations.push({
      id: `use-${opportunity.id}`,
      category: categoryFromText(opportunity.title),
      rank: opportunity.priority,
      title: opportunity.title,
      rationale: opportunity.description,
      recommendedAction: "Use this opportunity when designing dashboards, reports, or executive deliverables.",
      expectedImpact: opportunity.priority === "High" ? "High" : "Medium",
      estimatedEffort: "Medium",
      confidence: opportunity.confidence,
      packageAvailability: opportunity.relatedPackage,
      relatedFields: opportunity.relatedFields
    });
  });

  if (plan.confidenceProfile.overallConfidence < 70) {
    recommendations.push({
      id: "confidence-improvement",
      category: "Review",
      rank: "High",
      title: "Improve analytics confidence before final reporting",
      rationale: plan.confidenceProfile.explanation,
      recommendedAction: plan.confidenceProfile.recommendations[0] || "Review confidence concerns and assumptions.",
      expectedImpact: "High",
      estimatedEffort: "Medium",
      confidence: 0.9,
      packageAvailability: "Management Insights Package",
      relatedFields: []
    });
  }

  return recommendations
    .filter((item, index, all) => all.findIndex((candidate) => candidate.title === item.title && candidate.recommendedAction === item.recommendedAction) === index)
    .sort((a, b) => rankWeight(b.rank) - rankWeight(a.rank) || b.confidence - a.confidence)
    .slice(0, 12);
}
