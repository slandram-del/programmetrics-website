import type { AnalyticsConfidenceProfile, DatasetProfile, DuplicateProfile, MissingProfile, QualityProfile, RecommendedKpi } from "./types";

export function recommendKpis(dataset: DatasetProfile, missing: MissingProfile, duplicates: DuplicateProfile, quality: QualityProfile, confidence: AnalyticsConfidenceProfile): RecommendedKpi[] {
  const kpis: RecommendedKpi[] = [
    { id: "total-records", title: "Total records", value: dataset.totalRecords, subtitle: "Rows analyzed", explanation: "Total records are counted after setup rules omit metadata rows.", detailPanelType: "rows", packageAvailability: "All packages" },
    { id: "total-fields", title: "Total fields", value: dataset.totalFields, subtitle: "Columns analyzed", explanation: "Total fields excludes omitted metadata columns when setup is configured.", detailPanelType: "fields", packageAvailability: "All packages" },
    { id: "missing-rows", title: "Missing rows", value: missing.missingRows, subtitle: "Rows with at least one blank", explanation: missing.explanation, detailPanelType: "missing", packageAvailability: "All packages" },
    { id: "missing-cells", title: "Missing cells", value: missing.missingCells, subtitle: "Every blank or coded missing cell", explanation: missing.explanation, detailPanelType: "missing", packageAvailability: "All packages" },
    { id: "fields-with-blanks", title: "Fields with blanks", value: missing.fieldsWithBlanks, subtitle: "Columns needing review", explanation: "Fields with blanks are columns that contain at least one missing value.", detailPanelType: "missing", packageAvailability: "All packages" },
    { id: "missing-percent", title: "Missing %", value: `${Math.round(missing.missingPercent * 1000) / 10}%`, subtitle: "Missing cells divided by total cells", explanation: "Missing percentage is calculated as missing cells divided by all analyzed cells.", detailPanelType: "missing", packageAvailability: "All packages" },
    { id: "exact-duplicates", title: "Exact duplicates", value: duplicates.exactDuplicateRows, subtitle: "Full-row duplicate matches", explanation: duplicates.explanation, detailPanelType: "duplicates", packageAvailability: "All packages" },
    { id: "quality-score", title: "Quality score", value: quality.overallScore, subtitle: quality.grade, explanation: quality.explanation, detailPanelType: "quality", packageAvailability: "All packages" },
    { id: "confidence-score", title: "Confidence score", value: confidence.overallConfidence, subtitle: confidence.label, explanation: confidence.explanation, detailPanelType: "confidence", packageAvailability: "All packages" }
  ];
  if (dataset.detectedDateFields.length) kpis.push({ id: "date-fields", title: "Date fields", value: dataset.detectedDateFields.length, subtitle: dataset.detectedDateFields.slice(0, 2).join(", "), explanation: "Date fields can power monthly, quarterly, or yearly trend visuals.", detailPanelType: "dates", packageAvailability: "Management Insights+" });
  if (dataset.possibleOrganizationFields.length) kpis.push({ id: "organization-fields", title: "Organization fields", value: dataset.possibleOrganizationFields.length, subtitle: "Comparison-ready fields", explanation: "Organization fields can support site, shelter, agency, or provider comparisons.", detailPanelType: "categories", packageAvailability: "Management Insights+" });
  return kpis;
}
