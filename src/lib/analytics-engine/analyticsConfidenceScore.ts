import type { AnalyticsConfidenceProfile, DatasetProfile, DatasetTypeProfile, DuplicateProfile, FieldProfile, MissingProfile, QualityProfile } from "./types";

export function calculateAnalyticsConfidence(dataset: DatasetProfile, fields: FieldProfile[], missing: MissingProfile, duplicates: DuplicateProfile, quality: QualityProfile, datasetType: DatasetTypeProfile, assumptions: string[] = []): AnalyticsConfidenceProfile {
  let score = 50;
  const drivers: string[] = [];
  const concerns: string[] = [];
  if (dataset.totalRecords >= 100) { score += 12; drivers.push("The dataset has enough records for stable summaries."); } else concerns.push("Small sample size may limit trend and comparison confidence.");
  if (dataset.detectedDateFields.length) { score += 10; drivers.push("Usable date fields support trend analysis."); } else concerns.push("No reliable date field was detected for trends.");
  if (fields.filter((field) => field.chartable).length >= 3) { score += 10; drivers.push("Multiple chartable fields are available."); } else concerns.push("Few fields are suitable for reliable visuals.");
  if (missing.missingPercent < 0.2) score += 10; else { score -= 12; concerns.push("Missing values may affect some insights."); }
  if (duplicates.exactDuplicateRows === 0) score += 8; else { score -= 10; concerns.push("Exact duplicate rows reduce confidence until reviewed."); }
  score += Math.round((quality.overallScore - 70) * 0.25);
  score += Math.round((datasetType.confidence - 0.5) * 20);
  score -= assumptions.length * 3;
  const overallConfidence = Math.max(0, Math.min(100, Math.round(score)));
  const label = overallConfidence >= 75 ? "High" : overallConfidence >= 50 ? "Moderate" : "Low";
  const explanation = label === "High"
    ? "ProgramMetrics has high confidence because the dataset has enough records, usable analysis fields, and limited quality concerns."
    : label === "Moderate"
      ? "ProgramMetrics has moderate confidence because the dataset is usable, but some missingness, structure, or field limitations may affect conclusions."
      : "ProgramMetrics has low confidence because data quality or structure limits reliable analysis.";
  return {
    overallConfidence,
    label,
    explanation,
    confidenceDrivers: drivers,
    confidenceConcerns: concerns,
    affectedInsights: concerns.length ? ["trend analysis", "participant-level summaries", "category comparisons"] : [],
    recommendations: concerns.length ? ["Review setup rows, missing codes, and duplicate records before final export."] : ["Use the analysis plan to build dashboard visuals and executive narrative."]
  };
}
