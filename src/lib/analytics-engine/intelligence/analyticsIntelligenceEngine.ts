import type { AnalyticsPlan, RecommendedInsight } from "../types";
import { buildExecutiveObservations } from "./executiveObservationGenerator";
import { generateFindings } from "./findingGenerator";
import { detectWarnings } from "./warningDetector";
import { detectOpportunities } from "./opportunityDetector";
import { prioritizeRecommendations } from "./recommendationPrioritizer";
import { buildExecutiveNarrative } from "./executiveNarrativeBuilder";
import { buildIntelligenceSummary } from "./summaryBuilder";
import { groupInsights } from "./insightGrouping";
import { buildActionPlan } from "./actionPlanner";
import { buildConfidenceNarrative } from "./confidenceNarrative";

export type IntelligenceSeverity = "info" | "opportunity" | "warning" | "critical";
export type IntelligenceCategory =
  | "Dataset Overview"
  | "Data Quality"
  | "Completeness"
  | "Duplicates"
  | "Missing Values"
  | "Trends"
  | "Organizations"
  | "Programs"
  | "Outcomes"
  | "Dates"
  | "Numeric Patterns"
  | "Recommendations"
  | "Limitations";
export type RecommendationCategory = "Clean first" | "Review" | "Investigate" | "Report" | "Forecast" | "Collect" | "Standardize" | "Monitor";
export type RecommendationRank = "Critical" | "High" | "Medium" | "Low";
export type IntelligencePackage = "Data Foundation Package" | "Management Insights Package" | "Professional Analytics Package" | "Executive Intelligence Suite" | "Enterprise Intelligence Platform";

export interface SupportingMetric {
  label: string;
  value: string | number;
  context?: string;
}

export interface ExecutiveObservation {
  id: string;
  title: string;
  category: IntelligenceCategory;
  description: string;
  confidence: number;
  supportingMetrics: SupportingMetric[];
  relatedVisuals: string[];
  relatedFields: string[];
  severity: IntelligenceSeverity;
}

export interface AnalyticalFinding {
  id: string;
  title: string;
  description: string;
  importance: RecommendationRank;
  confidence: number;
  businessImpact: string;
  recommendedAction: string;
  packageAvailability: IntelligencePackage;
  relatedFields: string[];
}

export interface IntelligenceWarning {
  id: string;
  title: string;
  severity: IntelligenceSeverity;
  description: string;
  affectedVisuals: string[];
  affectedFields: string[];
  recommendedFixes: string[];
  confidence: number;
}

export interface IntelligenceOpportunity {
  id: string;
  title: string;
  description: string;
  priority: RecommendationRank;
  confidence: number;
  relatedPackage: IntelligencePackage;
  relatedFields: string[];
}

export interface PrioritizedRecommendation {
  id: string;
  category: RecommendationCategory;
  rank: RecommendationRank;
  title: string;
  rationale: string;
  recommendedAction: string;
  expectedImpact: "High" | "Medium" | "Low";
  estimatedEffort: "Low" | "Medium" | "High";
  confidence: number;
  packageAvailability: IntelligencePackage;
  relatedFields: string[];
}

export interface NarrativeBlock {
  id: string;
  title: string;
  section: "Executive Summary" | "Data Quality Summary" | "Key Findings" | "Recommendations" | "Limitations" | "Next Steps";
  paragraphs: string[];
  confidenceLabel: string;
  confidence: number;
  relatedObservations: string[];
}

export interface GroupedInsightSection {
  section: "Overview" | "Data Quality" | "Visual Analytics" | "Descriptive Statistics" | "Recommendations" | "Executive Summary" | "Deliverables";
  observations: ExecutiveObservation[];
  findings: AnalyticalFinding[];
  warnings: IntelligenceWarning[];
  opportunities: IntelligenceOpportunity[];
  recommendations: PrioritizedRecommendation[];
  sourceInsights: RecommendedInsight[];
}

export interface ActionPlanItem {
  id: string;
  priority: "Fix immediately" | "Review before reporting" | "Monitor monthly" | "Recommended future collection" | "Optional improvement";
  title: string;
  description: string;
  estimatedEffort: "Low" | "Medium" | "High";
  expectedImpact: "High" | "Medium" | "Low";
  relatedRecommendations: string[];
}

export interface ConfidenceNarrative {
  label: string;
  score: number;
  summary: string;
  drivers: string[];
  concerns: string[];
  assumptions: string[];
  affectedInsights: string[];
}

export interface AnalyticsIntelligence {
  executiveSummary: NarrativeBlock;
  summary: string;
  observations: ExecutiveObservation[];
  keyFindings: AnalyticalFinding[];
  warnings: IntelligenceWarning[];
  opportunities: IntelligenceOpportunity[];
  recommendations: PrioritizedRecommendation[];
  groupedInsights: GroupedInsightSection[];
  actionPlan: ActionPlanItem[];
  confidenceNarrative: ConfidenceNarrative;
  narrativeBlocks: NarrativeBlock[];
  aiAnalystContext: {
    executiveSummary: NarrativeBlock;
    keyFindings: AnalyticalFinding[];
    warnings: IntelligenceWarning[];
    recommendations: PrioritizedRecommendation[];
    confidenceNarrative: ConfidenceNarrative;
  };
  protectedNotice: string;
}

export function buildAnalyticsIntelligence(plan: AnalyticsPlan): AnalyticsIntelligence {
  const observations = buildExecutiveObservations(plan);
  const warnings = detectWarnings(plan);
  const opportunities = detectOpportunities(plan);
  const keyFindings = generateFindings(plan, observations, warnings, opportunities);
  const recommendations = prioritizeRecommendations(plan, warnings, opportunities, keyFindings);
  const actionPlan = buildActionPlan(recommendations, warnings);
  const confidenceNarrative = buildConfidenceNarrative(plan);
  const narrativeBlocks = buildExecutiveNarrative(plan, observations, keyFindings, warnings, recommendations, confidenceNarrative);
  const executiveSummary = narrativeBlocks.find((block) => block.section === "Executive Summary") || narrativeBlocks[0];
  const groupedInsights = groupInsights(plan, observations, keyFindings, warnings, opportunities, recommendations);
  const summary = buildIntelligenceSummary(plan, observations, keyFindings, warnings, opportunities, confidenceNarrative);

  return {
    executiveSummary,
    summary,
    observations,
    keyFindings,
    warnings,
    opportunities,
    recommendations,
    groupedInsights,
    actionPlan,
    confidenceNarrative,
    narrativeBlocks,
    aiAnalystContext: {
      executiveSummary,
      keyFindings,
      warnings,
      recommendations,
      confidenceNarrative
    },
    protectedNotice: "ProgramMetrics Intelligence outputs are structured conclusions and recommendations. Internal prioritization and narrative-generation rules are protected business logic."
  };
}
