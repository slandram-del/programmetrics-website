import type { DatasetProfile, DescriptiveStatsProfile, DuplicateProfile, FieldProfile, MissingProfile, QualityProfile } from "./types";

function scoreToGrade(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "Needs Review";
}

export function calculateQualityScore(dataset: DatasetProfile, fields: FieldProfile[], missing: MissingProfile, duplicates: DuplicateProfile, descriptive: DescriptiveStatsProfile): QualityProfile {
  const completeness = Math.max(0, 100 - missing.missingPercent * 100);
  const duplicateRate = dataset.totalRecords ? duplicates.exactDuplicateRows / dataset.totalRecords : 0;
  const duplicateScore = Math.max(0, 100 - duplicateRate * 100);
  const dateFields = fields.filter((field) => field.type === "date");
  const dateConsistency = dateFields.length ? dateFields.reduce((sum, field) => sum + field.parseSuccessRate, 0) / dateFields.length * 100 : 85;
  const numericFields = fields.filter((field) => field.type === "numeric");
  const numericValidity = numericFields.length ? numericFields.reduce((sum, field) => sum + field.parseSuccessRate, 0) / numericFields.length * 100 : 85;
  const chartableCategorical = fields.filter((field) => field.type === "categorical" && field.chartable).length;
  const categoricalUsability = fields.some((field) => field.type === "categorical") ? Math.min(100, chartableCategorical * 20) : 80;
  const structure = dataset.totalRecords > 0 && dataset.totalFields > 0 ? Math.min(100, 70 + Math.min(dataset.totalFields, 20)) : 0;
  const components = { completeness, duplicates: duplicateScore, dateConsistency, numericValidity, categoricalUsability, structure };
  const overallScore = Math.round(completeness * 0.3 + duplicateScore * 0.2 + dateConsistency * 0.15 + numericValidity * 0.1 + categoricalUsability * 0.1 + structure * 0.15);
  const strengths: string[] = [];
  const concerns: string[] = [];
  if (completeness >= 80) strengths.push("Most cells are complete."); else concerns.push("Missing values may limit some analyses.");
  if (duplicateScore >= 95) strengths.push("Few or no exact duplicate rows were detected."); else concerns.push("Exact duplicates should be reviewed before export.");
  if (dateConsistency >= 80) strengths.push("Detected date fields are mostly parseable."); else concerns.push("Date fields may need standardization.");
  return {
    overallScore,
    grade: scoreToGrade(overallScore),
    components,
    explanation: `The quality score is ${overallScore} based on completeness, duplicate risk, date consistency, numeric validity, categorical usability, and structure.`,
    strengths,
    concerns,
    recommendations: concerns.length ? ["Review high-missing fields before building executive reports.", "Confirm duplicate rows before downloading cleaned exports."] : ["Dataset is ready for dashboard preview and report generation."]
  };
}
