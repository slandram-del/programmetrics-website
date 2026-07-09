import type { AnalyticsPlan, FieldProfile, RecommendedVisual } from "../types";
import type { ExecutiveObservation } from "./analyticsIntelligenceEngine";

function visualIds(visuals: RecommendedVisual[], match: RegExp): string[] {
  return visuals.filter((visual) => match.test(`${visual.id} ${visual.title} ${visual.tab}`)).map((visual) => visual.id).slice(0, 5);
}

function fieldLabels(fields: FieldProfile[], predicate: (field: FieldProfile) => boolean, limit = 5): string[] {
  return fields.filter(predicate).slice(0, limit).map((field) => field.displayLabel || field.fieldName);
}

function confidenceFromPlan(plan: AnalyticsPlan, fallback = 0.85): number {
  return Math.max(0.4, Math.min(0.98, (plan.confidenceProfile.overallConfidence || Math.round(fallback * 100)) / 100));
}

export function buildExecutiveObservations(plan: AnalyticsPlan): ExecutiveObservation[] {
  const observations: ExecutiveObservation[] = [];
  const datasetConfidence = confidenceFromPlan(plan);
  const dateFields = plan.fieldProfiles.filter((field) => field.type === "date");
  const categoricalFields = plan.fieldProfiles.filter((field) => field.chartable && field.type === "categorical");
  const numericFields = plan.fieldProfiles.filter((field) => field.type === "numeric");
  const organizationFields = plan.fieldProfiles.filter((field) => field.role === "organization");
  const outcomeFields = plan.fieldProfiles.filter((field) => field.role === "outcome" || field.role === "status");
  const topMissing = plan.missingProfile.topMissingFieldsByCount.slice(0, 3);

  observations.push({
    id: "dataset-size",
    title: "Dataset size",
    category: "Dataset Overview",
    description: `This dataset contains ${plan.datasetProfile.totalRecords} records across ${plan.datasetProfile.totalFields} fields.`,
    confidence: datasetConfidence,
    supportingMetrics: [
      { label: "Records", value: plan.datasetProfile.totalRecords },
      { label: "Fields", value: plan.datasetProfile.totalFields }
    ],
    relatedVisuals: visualIds(plan.recommendedVisuals, /overview|kpi|table/i),
    relatedFields: [],
    severity: "info"
  });

  observations.push({
    id: "dataset-type",
    title: "Detected dataset type",
    category: "Dataset Overview",
    description: `ProgramMetrics classified this file as ${plan.datasetType.primaryType} data based on the available fields and labels.`,
    confidence: plan.datasetType.confidence,
    supportingMetrics: [{ label: "Classification confidence", value: `${Math.round(plan.datasetType.confidence * 100)}%` }],
    relatedVisuals: [],
    relatedFields: plan.datasetType.reasons.slice(0, 3),
    severity: "info"
  });

  if (dateFields.length) {
    observations.push({
      id: "date-coverage",
      title: "Date coverage available",
      category: "Dates",
      description: `${dateFields.length} date field${dateFields.length === 1 ? " was" : "s were"} detected, so trend views can be generated when the date values are sufficiently complete.`,
      confidence: Math.max(...dateFields.map((field) => field.parseSuccessRate || 0.7)),
      supportingMetrics: [{ label: "Detected date fields", value: dateFields.length }],
      relatedVisuals: visualIds(plan.recommendedVisuals, /trend|date|month/i),
      relatedFields: fieldLabels(dateFields, () => true),
      severity: "opportunity"
    });
  }

  observations.push({
    id: "duplicate-status",
    title: plan.duplicateProfile.exactDuplicateRows ? "Duplicate rows need review" : "No exact duplicate rows identified",
    category: "Duplicates",
    description: plan.duplicateProfile.exactDuplicateRows
      ? `${plan.duplicateProfile.exactDuplicateRows} exact duplicate rows were detected and should be reviewed before final reporting.`
      : "No exact duplicate rows were identified using normalized full-row comparison.",
    confidence: 0.9,
    supportingMetrics: [{ label: "Exact duplicate rows", value: plan.duplicateProfile.exactDuplicateRows }],
    relatedVisuals: visualIds(plan.recommendedVisuals, /duplicate/i),
    relatedFields: plan.duplicateProfile.likelyDuplicateRiskFields.slice(0, 5),
    severity: plan.duplicateProfile.exactDuplicateRows ? "warning" : "opportunity"
  });

  if (plan.missingProfile.missingCells > 0) {
    const missingLabels = topMissing.map((field) => field.displayLabel || field.fieldName);
    observations.push({
      id: "missing-value-pattern",
      title: "Missing values are concentrated in specific fields",
      category: "Missing Values",
      description: `${plan.missingProfile.missingCells} missing cells were found across ${plan.missingProfile.fieldsWithBlanks} fields. Top affected fields include ${missingLabels.join(", ") || "the fields listed in the missing-value profile"}.`,
      confidence: 0.95,
      supportingMetrics: [
        { label: "Missing cells", value: plan.missingProfile.missingCells },
        { label: "Fields with blanks", value: plan.missingProfile.fieldsWithBlanks },
        { label: "Missing percent", value: `${plan.missingProfile.missingPercent}%` }
      ],
      relatedVisuals: visualIds(plan.recommendedVisuals, /missing|completeness/i),
      relatedFields: missingLabels,
      severity: plan.missingProfile.missingPercent > 25 ? "warning" : "info"
    });
  }

  if (categoricalFields.length) {
    observations.push({
      id: "chartable-categories",
      title: "Categorical dashboard coverage",
      category: "Organizations",
      description: `${categoricalFields.length} chartable categorical field${categoricalFields.length === 1 ? " is" : "s are"} available for comparisons, segmentation, or executive dashboard tiles.`,
      confidence: 0.84,
      supportingMetrics: [{ label: "Chartable category fields", value: categoricalFields.length }],
      relatedVisuals: visualIds(plan.recommendedVisuals, /top|category|donut|bar/i),
      relatedFields: fieldLabels(categoricalFields, () => true),
      severity: "opportunity"
    });
  }

  if (numericFields.length) {
    observations.push({
      id: "numeric-patterns",
      title: "Numeric measures available",
      category: "Numeric Patterns",
      description: `${numericFields.length} numeric field${numericFields.length === 1 ? " is" : "s are"} available for distribution review, outlier scanning, and descriptive statistics.`,
      confidence: 0.78,
      supportingMetrics: [{ label: "Numeric fields", value: numericFields.length }],
      relatedVisuals: visualIds(plan.recommendedVisuals, /histogram|box|distribution/i),
      relatedFields: fieldLabels(numericFields, () => true),
      severity: "opportunity"
    });
  }

  if (organizationFields.length) {
    observations.push({
      id: "organization-fields",
      title: "Organization or site comparisons are possible",
      category: "Organizations",
      description: `${organizationFields.length} organization-related field${organizationFields.length === 1 ? " was" : "s were"} detected for group comparisons.`,
      confidence: 0.82,
      supportingMetrics: [{ label: "Organization fields", value: organizationFields.length }],
      relatedVisuals: visualIds(plan.recommendedVisuals, /organization|site|top|bar/i),
      relatedFields: fieldLabels(organizationFields, () => true),
      severity: "opportunity"
    });
  }

  if (outcomeFields.length) {
    observations.push({
      id: "outcome-fields",
      title: "Outcome or status fields are present",
      category: "Outcomes",
      description: `${outcomeFields.length} outcome/status field${outcomeFields.length === 1 ? " was" : "s were"} detected and may support management or executive reporting.`,
      confidence: 0.8,
      supportingMetrics: [{ label: "Outcome/status fields", value: outcomeFields.length }],
      relatedVisuals: visualIds(plan.recommendedVisuals, /outcome|status|top|bar/i),
      relatedFields: fieldLabels(outcomeFields, () => true),
      severity: "opportunity"
    });
  }

  return observations;
}
