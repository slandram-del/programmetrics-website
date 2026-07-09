import type { AnalyticsPlan, RecommendedInsight } from "../types";
import type { AnalyticalFinding, ExecutiveObservation, GroupedInsightSection, IntelligenceOpportunity, IntelligenceWarning, PrioritizedRecommendation } from "./analyticsIntelligenceEngine";

type Section = GroupedInsightSection["section"];

function createSection(section: Section): GroupedInsightSection {
  return { section, observations: [], findings: [], warnings: [], opportunities: [], recommendations: [], sourceInsights: [] };
}

function sectionForInsight(insight: RecommendedInsight): Section {
  const text = `${insight.title} ${insight.text} ${insight.recommendedAction}`.toLowerCase();
  if (/missing|duplicate|quality|format|blank/.test(text)) return "Data Quality";
  if (/visual|trend|category|chart|dashboard/.test(text)) return "Visual Analytics";
  if (/statistic|numeric|distribution|outlier/.test(text)) return "Descriptive Statistics";
  if (/deliverable|export|package/.test(text)) return "Deliverables";
  if (/recommend|action|review|fix/.test(text)) return "Recommendations";
  return "Overview";
}

export function groupInsights(
  plan: AnalyticsPlan,
  observations: ExecutiveObservation[],
  findings: AnalyticalFinding[],
  warnings: IntelligenceWarning[],
  opportunities: IntelligenceOpportunity[],
  recommendations: PrioritizedRecommendation[]
): GroupedInsightSection[] {
  const sections: Record<Section, GroupedInsightSection> = {
    Overview: createSection("Overview"),
    "Data Quality": createSection("Data Quality"),
    "Visual Analytics": createSection("Visual Analytics"),
    "Descriptive Statistics": createSection("Descriptive Statistics"),
    Recommendations: createSection("Recommendations"),
    "Executive Summary": createSection("Executive Summary"),
    Deliverables: createSection("Deliverables")
  };

  observations.forEach((observation) => {
    const section: Section = /Quality|Completeness|Duplicates|Missing/.test(observation.category) ? "Data Quality" : /Trends|Organizations|Programs|Outcomes|Dates|Numeric/.test(observation.category) ? "Visual Analytics" : "Overview";
    sections[section].observations.push(observation);
    sections["Executive Summary"].observations.push(observation);
  });

  findings.forEach((finding) => {
    const section: Section = /missing|duplicate|quality/i.test(finding.title) ? "Data Quality" : /numeric|statistics/i.test(finding.title) ? "Descriptive Statistics" : "Executive Summary";
    sections[section].findings.push(finding);
  });

  warnings.forEach((warning) => sections["Data Quality"].warnings.push(warning));
  opportunities.forEach((opportunity) => sections["Overview"].opportunities.push(opportunity));
  recommendations.forEach((recommendation) => sections["Recommendations"].recommendations.push(recommendation));
  plan.recommendedInsights.forEach((insight) => sections[sectionForInsight(insight)].sourceInsights.push(insight));

  return Object.values(sections);
}
