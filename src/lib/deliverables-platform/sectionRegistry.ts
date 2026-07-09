export type ReportSectionType =
  | "cover"
  | "executive-summary"
  | "dataset-overview"
  | "dataset-confidence"
  | "quality-review"
  | "missing-values"
  | "duplicate-review"
  | "visual-analytics"
  | "descriptive-statistics"
  | "key-findings"
  | "recommendations"
  | "opportunities"
  | "warnings"
  | "methodology"
  | "limitations"
  | "appendix"
  | "data-dictionary"
  | "processing-notes"
  | "version-metadata";

export interface SectionDefinition {
  id: ReportSectionType;
  title: string;
  description: string;
  defaultOrder: number;
  required: boolean;
}

export const sectionRegistry: SectionDefinition[] = [
  { id: "cover", title: "Cover Page", description: "Branded report title, organization, prepared for/by, and report date.", defaultOrder: 1, required: true },
  { id: "executive-summary", title: "Executive Summary", description: "Plain-language summary of the dataset, findings, and recommended next steps.", defaultOrder: 2, required: true },
  { id: "dataset-overview", title: "Dataset Overview", description: "Record counts, field counts, detected dataset type, and import assumptions.", defaultOrder: 3, required: true },
  { id: "dataset-confidence", title: "Dataset Confidence", description: "Analytics confidence score, drivers, concerns, and assumptions.", defaultOrder: 4, required: false },
  { id: "quality-review", title: "Data Quality Review", description: "Quality score, strengths, concerns, and component breakdown.", defaultOrder: 5, required: true },
  { id: "missing-values", title: "Missing Value Summary", description: "Missing rows, cells, fields with blanks, missing percentage, and top affected fields.", defaultOrder: 6, required: true },
  { id: "duplicate-review", title: "Duplicate Review", description: "Exact duplicates, likely duplicate risk fields, and cleanup guidance.", defaultOrder: 7, required: true },
  { id: "visual-analytics", title: "Visual Analytics", description: "Recommended charts and dashboard visuals from the Analytics Engine.", defaultOrder: 8, required: false },
  { id: "descriptive-statistics", title: "Descriptive Statistics", description: "Numeric, categorical, and date summaries when supported by the dataset.", defaultOrder: 9, required: false },
  { id: "key-findings", title: "Key Findings", description: "Grounded insights and significant findings from the intelligence layer.", defaultOrder: 10, required: false },
  { id: "recommendations", title: "Recommendations", description: "Prioritized recommendations and next-step actions.", defaultOrder: 11, required: false },
  { id: "opportunities", title: "Opportunities", description: "Potential dashboard, report, trend, and analytics opportunities.", defaultOrder: 12, required: false },
  { id: "warnings", title: "Warnings", description: "Data limitations, missingness, duplicates, and readiness warnings.", defaultOrder: 13, required: false },
  { id: "methodology", title: "Methodology", description: "Processing method and analysis assumptions.", defaultOrder: 14, required: true },
  { id: "limitations", title: "Limitations", description: "Known limits and caveats based on the available data.", defaultOrder: 15, required: true },
  { id: "appendix", title: "Appendix", description: "Support tables, field summaries, and detailed notes.", defaultOrder: 16, required: false },
  { id: "data-dictionary", title: "Data Dictionary", description: "Field names, labels, inferred types, roles, and completeness.", defaultOrder: 17, required: false },
  { id: "processing-notes", title: "Processing Notes", description: "Session processing, setup rows, omitted rows, and export notes.", defaultOrder: 18, required: true },
  { id: "version-metadata", title: "Version Metadata", description: "Hidden or exportable engine version metadata for auditing.", defaultOrder: 19, required: true }
];

export function getSectionDefinition(sectionId: string): SectionDefinition {
  return sectionRegistry.find((section) => section.id === sectionId) || {
    id: "appendix",
    title: sectionId.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
    description: "Package-specific report section.",
    defaultOrder: 99,
    required: false
  };
}
