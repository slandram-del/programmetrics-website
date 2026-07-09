import type { AnalyticsPlan } from "../types";
import type { AnalyticalFinding, ExecutiveObservation, IntelligenceOpportunity, IntelligencePackage, IntelligenceWarning, RecommendationRank } from "./analyticsIntelligenceEngine";

function packageForDepth(rank: RecommendationRank): IntelligencePackage {
  if (rank === "Critical") return "Data Foundation Package";
  if (rank === "High") return "Management Insights Package";
  if (rank === "Medium") return "Professional Analytics Package";
  return "Executive Intelligence Suite";
}

export function generateFindings(plan: AnalyticsPlan, observations: ExecutiveObservation[], warnings: IntelligenceWarning[], opportunities: IntelligenceOpportunity[]): AnalyticalFinding[] {
  const findings: AnalyticalFinding[] = [];
  const missing = plan.missingProfile;
  const dateCount = plan.datasetProfile.detectedDateFields.length;
  const numericCount = plan.datasetProfile.detectedNumericFields.length;
  const categoryCount = plan.datasetProfile.detectedCategoricalFields.length;

  if (missing.missingCells > 0) {
    const highMissing = missing.missingPercent >= 25;
    findings.push({
      id: "missing-values-finding",
      title: highMissing ? "High missingness should be addressed" : "Missing values are present",
      description: `${missing.missingCells} missing cells were identified across ${missing.fieldsWithBlanks} fields.`,
      importance: highMissing ? "High" : "Medium",
      confidence: 0.95,
      businessImpact: highMissing ? "High missingness may limit participant-level reporting, segmentation, and final exports." : "Some reporting fields may need review before final deliverables.",
      recommendedAction: "Review the top missing fields and decide which are required, optional, or safe to exclude.",
      packageAvailability: "Data Foundation Package",
      relatedFields: missing.topMissingFieldsByCount.slice(0, 5).map((field) => field.displayLabel || field.fieldName)
    });
  }

  findings.push({
    id: "duplicate-finding",
    title: plan.duplicateProfile.exactDuplicateRows ? "Duplicate rows require review" : "No exact duplicate records detected",
    description: plan.duplicateProfile.exactDuplicateRows ? `${plan.duplicateProfile.exactDuplicateRows} exact duplicate rows were detected.` : "No exact duplicate rows were detected in the analyzed dataset.",
    importance: plan.duplicateProfile.exactDuplicateRows ? "High" : "Low",
    confidence: 0.9,
    businessImpact: plan.duplicateProfile.exactDuplicateRows ? "Duplicate records can overstate counts and distort summaries." : "Record counts are less likely to be inflated by exact duplicate rows.",
    recommendedAction: plan.duplicateProfile.exactDuplicateRows ? "Review duplicate groups before generating final reports." : "Continue monitoring duplicates when new files are uploaded.",
    packageAvailability: "Data Foundation Package",
    relatedFields: plan.duplicateProfile.likelyDuplicateRiskFields.slice(0, 5)
  });

  if (dateCount) {
    findings.push({
      id: "date-coverage-finding",
      title: "Trend analysis is supported",
      description: `${dateCount} date field${dateCount === 1 ? " was" : "s were"} detected.`,
      importance: "Medium",
      confidence: 0.84,
      businessImpact: "Monthly or quarterly trend views can help leaders monitor volume, seasonality, and operational change over time.",
      recommendedAction: "Use grouped monthly or quarterly trend visuals instead of charting each unique date.",
      packageAvailability: "Management Insights Package",
      relatedFields: plan.datasetProfile.detectedDateFields.slice(0, 5)
    });
  }

  if (!numericCount) {
    findings.push({
      id: "limited-numeric-measures",
      title: "Limited numeric measures",
      description: "No chartable numeric fields were detected for distributions, outlier scans, or numeric summaries.",
      importance: "Medium",
      confidence: 0.8,
      businessImpact: "Professional statistical analysis may be limited unless numeric outcome, amount, score, or duration fields are added.",
      recommendedAction: "Collect or standardize numeric measures if advanced analytics are desired.",
      packageAvailability: "Professional Analytics Package",
      relatedFields: []
    });
  }

  if (categoryCount >= 3) {
    findings.push({
      id: "categorical-dashboard-readiness",
      title: "Strong categorical dashboard coverage",
      description: `${categoryCount} categorical fields are available for segmentation, ranking, or comparison visuals.`,
      importance: "Medium",
      confidence: 0.84,
      businessImpact: "The dataset is suitable for executive dashboard views that compare groups, programs, sites, statuses, or categories.",
      recommendedAction: "Prioritize top-category visuals and group rare values as Other.",
      packageAvailability: "Management Insights Package",
      relatedFields: plan.datasetProfile.detectedCategoricalFields.slice(0, 5)
    });
  }

  warnings.slice(0, 3).forEach((warning) => {
    if (!findings.some((finding) => finding.id === `warning-${warning.id}`)) {
      findings.push({
        id: `warning-${warning.id}`,
        title: warning.title,
        description: warning.description,
        importance: warning.severity === "critical" ? "Critical" : warning.severity === "warning" ? "High" : "Medium",
        confidence: warning.confidence,
        businessImpact: "This issue can affect the reliability or completeness of final analytics deliverables.",
        recommendedAction: warning.recommendedFixes[0] || "Review before reporting.",
        packageAvailability: packageForDepth(warning.severity === "critical" ? "Critical" : "High"),
        relatedFields: warning.affectedFields
      });
    }
  });

  opportunities.slice(0, 2).forEach((opportunity) => findings.push({
    id: `opportunity-${opportunity.id}`,
    title: opportunity.title,
    description: opportunity.description,
    importance: opportunity.priority,
    confidence: opportunity.confidence,
    businessImpact: "This strength can be used to create more useful analytics deliverables.",
    recommendedAction: "Use this opportunity when selecting dashboard and report outputs.",
    packageAvailability: opportunity.relatedPackage,
    relatedFields: opportunity.relatedFields
  }));

  return findings;
}
