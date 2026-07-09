import type { AnalyticsPlan } from "../types";
import type { IntelligenceWarning } from "./analyticsIntelligenceEngine";

export function detectWarnings(plan: AnalyticsPlan): IntelligenceWarning[] {
  const warnings: IntelligenceWarning[] = [];
  const missing = plan.missingProfile;

  if (plan.datasetProfile.totalRecords < 30) {
    warnings.push({
      id: "small-dataset",
      title: "Small dataset",
      severity: "warning",
      description: `Only ${plan.datasetProfile.totalRecords} records were found. Some comparisons and trends may be unstable.`,
      affectedVisuals: plan.recommendedVisuals.map((visual) => visual.id).slice(0, 5),
      affectedFields: [],
      recommendedFixes: ["Use summary views carefully and avoid over-interpreting small group differences."],
      confidence: 0.92
    });
  }

  if (missing.missingPercent >= 40) {
    warnings.push({
      id: "high-missingness",
      title: "High missing-value rate",
      severity: "critical",
      description: `${missing.missingPercent}% of analyzed cells are missing.`,
      affectedVisuals: plan.recommendedVisuals.filter((visual) => /missing|quality|completeness/i.test(`${visual.id} ${visual.title}`)).map((visual) => visual.id),
      affectedFields: missing.topMissingFieldsByPercent.slice(0, 8).map((field) => field.displayLabel || field.fieldName),
      recommendedFixes: ["Review required fields.", "Separate optional fields from reporting-critical fields.", "Clean or filter high-missing fields before final export."],
      confidence: 0.96
    });
  } else if (missing.missingCells > 0) {
    warnings.push({
      id: "missing-values-present",
      title: "Missing values need review",
      severity: "warning",
      description: `${missing.missingCells} missing cells were found across ${missing.fieldsWithBlanks} fields.`,
      affectedVisuals: plan.recommendedVisuals.filter((visual) => /missing|quality|completeness/i.test(`${visual.id} ${visual.title}`)).map((visual) => visual.id),
      affectedFields: missing.topMissingFieldsByCount.slice(0, 5).map((field) => field.displayLabel || field.fieldName),
      recommendedFixes: ["Review the top missing fields before final reporting."],
      confidence: 0.95
    });
  }

  if (!plan.datasetProfile.detectedDateFields.length) {
    warnings.push({
      id: "no-date-fields",
      title: "No usable date fields detected",
      severity: "warning",
      description: "No date field was detected for timeline, monthly trend, or forecasting visuals.",
      affectedVisuals: plan.recommendedVisuals.filter((visual) => /trend|forecast|date/i.test(`${visual.id} ${visual.title}`)).map((visual) => visual.id),
      affectedFields: [],
      recommendedFixes: ["Add or standardize a date field before relying on trend analysis."],
      confidence: 0.86
    });
  }

  if (!plan.datasetProfile.detectedNumericFields.length) {
    warnings.push({
      id: "no-numeric-fields",
      title: "No chartable numeric fields detected",
      severity: "info",
      description: "The dataset may support categorical dashboards but not numeric distributions or advanced statistical summaries.",
      affectedVisuals: plan.recommendedVisuals.filter((visual) => /histogram|boxplot|numeric/i.test(`${visual.id} ${visual.title}`)).map((visual) => visual.id),
      affectedFields: [],
      recommendedFixes: ["Add numeric outcome, amount, duration, or score fields if statistical analysis is needed."],
      confidence: 0.82
    });
  }

  if (plan.duplicateProfile.exactDuplicateRows > 0) {
    warnings.push({
      id: "duplicates-detected",
      title: "Duplicate records detected",
      severity: "warning",
      description: `${plan.duplicateProfile.exactDuplicateRows} exact duplicate rows were detected.`,
      affectedVisuals: plan.recommendedVisuals.filter((visual) => /duplicate|record|overview/i.test(`${visual.id} ${visual.title}`)).map((visual) => visual.id),
      affectedFields: plan.duplicateProfile.likelyDuplicateRiskFields.slice(0, 5),
      recommendedFixes: ["Review duplicate groups and remove duplicate records before final reporting if appropriate."],
      confidence: 0.9
    });
  }

  return warnings;
}
