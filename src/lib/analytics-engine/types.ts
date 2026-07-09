export type FieldType =
  | "date"
  | "numeric"
  | "categorical"
  | "text"
  | "id"
  | "email"
  | "phone"
  | "location"
  | "boolean"
  | "unknown";

export type FieldRole =
  | "identifier"
  | "demographic"
  | "date"
  | "outcome"
  | "status"
  | "program"
  | "organization"
  | "service"
  | "referral"
  | "reason"
  | "location"
  | "amount"
  | "score"
  | "freeText"
  | "metadata"
  | "other";

export type VisualType =
  | "kpi"
  | "line"
  | "bar"
  | "horizontalBar"
  | "donut"
  | "treemap"
  | "heatmap"
  | "histogram"
  | "boxplot"
  | "scatter"
  | "gauge"
  | "table"
  | "insightCard";

export type InsightSeverity = "info" | "opportunity" | "warning" | "critical";

export interface SetupConfig {
  headerRow?: number;
  codeRow?: number;
  labelRow?: number;
  dataStartRow?: number;
  dataStartsAt?: number;
  omittedRows?: number[];
  omitRows?: number[] | string;
  omittedColumns?: number[];
  omitColumns?: number[] | string;
  missingValueCodes?: string[];
  dateMergeFields?: Array<{ name: string; parts: string[] }>;
  dateCombinationFields?: Array<{ name: string; parts: string[] }>;
  useVariableLabels?: boolean;
  useLabels?: boolean;
  labelMap?: Record<string, string>;
}

export interface SelectedPackage {
  id: string;
  name?: string;
  rank?: number;
}

export interface SelectedLevel {
  id: string;
  name?: string;
  rank?: number;
}

export interface BrandingConfig {
  organizationName?: string;
  reportTitle?: string;
  primaryColor?: string;
  accentColor?: string;
  [key: string]: unknown;
}

export interface TopValue {
  value: string;
  count: number;
  percent: number;
}

export interface FieldProfile {
  fieldName: string;
  displayLabel: string;
  type: FieldType;
  role: FieldRole;
  nonMissingCount: number;
  missingCount: number;
  missingPercent: number;
  uniqueCount: number;
  uniquePercent: number;
  sampleValues: string[];
  topValues: TopValue[];
  parseSuccessRate: number;
  chartable: boolean;
  warnings: string[];
}

export interface DatasetProfile {
  totalRecords: number;
  totalFields: number;
  totalCells: number;
  detectedDateFields: string[];
  detectedNumericFields: string[];
  detectedCategoricalFields: string[];
  detectedTextFields: string[];
  possibleIdFields: string[];
  possibleNameFields: string[];
  possibleEmailFields: string[];
  possibleLocationFields: string[];
  possibleOutcomeFields: string[];
  possibleStatusFields: string[];
  possibleProgramFields: string[];
  possibleOrganizationFields: string[];
}

export interface DatasetTypeProfile {
  primaryType:
    | "survey"
    | "programEvaluation"
    | "referralOrDenial"
    | "caseManagement"
    | "housingOrShelter"
    | "behavioralHealth"
    | "healthcare"
    | "education"
    | "finance"
    | "crm"
    | "hr"
    | "genericSpreadsheet";
  confidence: number;
  reasons: string[];
  secondaryTypes: string[];
}

export interface MissingProfile {
  missingRows: number;
  missingCells: number;
  fieldsWithBlanks: number;
  missingPercent: number;
  topMissingFieldsByCount: Array<{ fieldName: string; displayLabel: string; missingCount: number; missingPercent: number }>;
  topMissingFieldsByPercent: Array<{ fieldName: string; displayLabel: string; missingCount: number; missingPercent: number }>;
  sampleRowsWithMissing: Array<{ rowIndex: number; missingFields: string[] }>;
  missingValueCodesUsed: string[];
  explanation: string;
}

export interface DuplicateProfile {
  exactDuplicateRows: number;
  duplicateGroups: Array<{ signature: string; count: number; rowIndexes: number[] }>;
  likelyDuplicateRiskFields: string[];
  explanation: string;
}

export interface NumericStats {
  fieldName: string;
  count: number;
  missing: number;
  min: number | null;
  max: number | null;
  mean: number | null;
  median: number | null;
  standardDeviation: number | null;
  q1: number | null;
  q3: number | null;
  iqr: number | null;
  outlierCount: number;
  outlierPercent: number;
}

export interface CategoricalStats {
  fieldName: string;
  uniqueCount: number;
  topValues: TopValue[];
  topValuePercent: number;
  concentration: "low" | "moderate" | "high";
  recommendedChartType: VisualType;
}

export interface DateStats {
  fieldName: string;
  earliest: string | null;
  latest: string | null;
  dateRangeDays: number | null;
  recordsByMonth: Record<string, number>;
  recordsByQuarter: Record<string, number>;
  recordsByYear: Record<string, number>;
  parseSuccessRate: number;
}

export interface DescriptiveStatsProfile {
  numeric: NumericStats[];
  categorical: CategoricalStats[];
  date: DateStats[];
}

export interface QualityProfile {
  overallScore: number;
  grade: string;
  components: Record<string, number>;
  explanation: string;
  strengths: string[];
  concerns: string[];
  recommendations: string[];
}

export interface AnalyticsConfidenceProfile {
  overallConfidence: number;
  label: "High" | "Moderate" | "Low";
  explanation: string;
  confidenceDrivers: string[];
  confidenceConcerns: string[];
  affectedInsights: string[];
  recommendations: string[];
}

export interface RecommendedKpi {
  id: string;
  title: string;
  value: string | number;
  subtitle: string;
  explanation: string;
  detailPanelType: string;
  packageAvailability: string;
}

export interface RecommendedVisual {
  id: string;
  title: string;
  description: string;
  type: VisualType;
  fieldNames: string[];
  priority: number;
  tab: string;
  packageMinimum: string;
  levelMinimum: string;
  chartConfig: Record<string, unknown>;
  insight: string;
  confidence: number;
}

export interface RecommendedInsight {
  id: string;
  title: string;
  text: string;
  severity: InsightSeverity;
  relatedFields: string[];
  recommendedAction: string;
  confidence: number;
}

export interface RecommendedDeliverable {
  id: string;
  name: string;
  description: string;
  format: "csv" | "xlsx" | "html" | "pdf" | "docx" | "pptx" | "png" | "svg" | "json" | "zip";
  included: boolean;
  locked: boolean;
  previewAvailable: boolean;
  exportAvailable: boolean;
}

export interface AnalyticsPlan {
  datasetProfile: DatasetProfile;
  fieldProfiles: FieldProfile[];
  datasetType: DatasetTypeProfile;
  qualityProfile: QualityProfile;
  confidenceProfile: AnalyticsConfidenceProfile;
  missingProfile: MissingProfile;
  duplicateProfile: DuplicateProfile;
  descriptiveStats: DescriptiveStatsProfile;
  recommendedKpis: RecommendedKpi[];
  recommendedVisuals: RecommendedVisual[];
  recommendedInsights: RecommendedInsight[];
  recommendedDeliverables: RecommendedDeliverable[];
  warnings: string[];
  assumptions: string[];
}

export type DataRow = Record<string, unknown>;
