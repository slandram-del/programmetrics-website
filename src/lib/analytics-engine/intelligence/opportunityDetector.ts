import type { AnalyticsPlan } from "../types";
import type { IntelligenceOpportunity } from "./analyticsIntelligenceEngine";

export function detectOpportunities(plan: AnalyticsPlan): IntelligenceOpportunity[] {
  const opportunities: IntelligenceOpportunity[] = [];
  const recordCount = plan.datasetProfile.totalRecords;
  const dateCount = plan.datasetProfile.detectedDateFields.length;
  const categoryCount = plan.datasetProfile.detectedCategoricalFields.length;
  const numericCount = plan.datasetProfile.detectedNumericFields.length;
  const locationFields = plan.datasetProfile.possibleLocationFields.length;

  if (recordCount >= 50 && categoryCount >= 2) {
    opportunities.push({
      id: "dashboard-ready",
      title: "Dataset is suitable for dashboards",
      description: `${recordCount} records and ${categoryCount} categorical fields support dashboard summaries and comparisons.`,
      priority: "High",
      confidence: 0.88,
      relatedPackage: "Management Insights Package",
      relatedFields: plan.datasetProfile.detectedCategoricalFields.slice(0, 5)
    });
  }

  if (dateCount) {
    opportunities.push({
      id: "trend-analysis",
      title: "Trend analysis is possible",
      description: `${dateCount} date field${dateCount === 1 ? " was" : "s were"} detected for monthly or quarterly trends.`,
      priority: "High",
      confidence: 0.84,
      relatedPackage: "Management Insights Package",
      relatedFields: plan.datasetProfile.detectedDateFields.slice(0, 5)
    });
  }

  if (recordCount >= 100 && numericCount > 0) {
    opportunities.push({
      id: "statistical-analysis",
      title: "Descriptive statistics are supported",
      description: `${numericCount} numeric field${numericCount === 1 ? " is" : "s are"} available across ${recordCount} records.`,
      priority: "Medium",
      confidence: 0.78,
      relatedPackage: "Professional Analytics Package",
      relatedFields: plan.datasetProfile.detectedNumericFields.slice(0, 5)
    });
  }

  if (recordCount >= 250 && dateCount && numericCount) {
    opportunities.push({
      id: "forecast-preview",
      title: "Forecasting preview may be useful",
      description: "The dataset has enough records plus date and numeric fields to consider limited forecasting previews after validation.",
      priority: "Medium",
      confidence: 0.68,
      relatedPackage: "Executive Intelligence Suite",
      relatedFields: [...plan.datasetProfile.detectedDateFields, ...plan.datasetProfile.detectedNumericFields].slice(0, 6)
    });
  }

  if (locationFields) {
    opportunities.push({
      id: "geographic-analysis",
      title: "Geographic analysis may be possible",
      description: `${locationFields} location-related field${locationFields === 1 ? " was" : "s were"} detected.`,
      priority: "Medium",
      confidence: 0.72,
      relatedPackage: "Professional Analytics Package",
      relatedFields: plan.datasetProfile.possibleLocationFields.slice(0, 5)
    });
  }

  if (plan.qualityProfile.overallScore >= 80 && plan.confidenceProfile.overallConfidence >= 75) {
    opportunities.push({
      id: "executive-ready",
      title: "Executive reporting readiness",
      description: `Quality score ${plan.qualityProfile.overallScore} and confidence ${plan.confidenceProfile.overallConfidence}% suggest the dataset can support polished executive summaries after review.`,
      priority: "High",
      confidence: plan.confidenceProfile.overallConfidence / 100,
      relatedPackage: "Executive Intelligence Suite",
      relatedFields: []
    });
  }

  return opportunities;
}
