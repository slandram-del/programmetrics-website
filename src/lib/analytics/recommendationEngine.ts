export type AnalyticsPlanInput = {
  rawRows: Record<string, unknown>[];
  setupConfig?: Record<string, unknown>;
  selectedPackage?: string;
  selectedLevel?: string;
  brandingConfig?: Record<string, unknown>;
};

export type RecommendedVisual = {
  id: string;
  title: string;
  description: string;
  type: "kpi" | "line" | "bar" | "horizontalBar" | "donut" | "treemap" | "heatmap" | "histogram" | "boxplot" | "scatter" | "gauge" | "table" | "insightCard";
  fieldNames: string[];
  priority: number;
  tab: string;
  packageMinimum: string;
  levelMinimum: string;
  chartConfig: Record<string, unknown>;
  insight: string;
};

const DEFAULT_MISSING_CODES = ["", " ", "NA", "N/A", "n/a", "null", "NULL", "unknown", "Unknown", "blank", "Blank", "not reported", "Not Reported", "missing", "Missing", "--", "-"];

function isMissing(value: unknown, codes = DEFAULT_MISSING_CODES) {
  if (value === null || value === undefined) return true;
  return codes.includes(String(value).trim());
}

function countValues(rows: Record<string, unknown>[], field: string) {
  return rows.reduce<Record<string, number>>((counts, row) => {
    const value = isMissing(row[field]) ? "Missing" : String(row[field]).trim();
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function topValues(rows: Record<string, unknown>[], field: string, limit = 10) {
  const entries = Object.entries(countValues(rows, field)).filter(([value]) => value !== "Missing").sort((a, b) => b[1] - a[1]);
  const top = entries.slice(0, limit).map(([value, count]) => ({ value, count }));
  const other = entries.slice(limit).reduce((sum, [, count]) => sum + count, 0);
  return other ? top.concat([{ value: "Other", count: other }]) : top;
}

function inferFieldType(rows: Record<string, unknown>[], field: string) {
  const values = rows.map((row) => row[field]).filter((value) => !isMissing(value));
  const name = field.toLowerCase();
  if (/email/.test(name)) return "email";
  if (/phone|mobile|cell/.test(name)) return "phone";
  if (/id$|\bid\b|responseid|recipient/.test(name)) return "id";
  const numeric = values.filter((value) => Number.isFinite(Number(value))).length;
  const dated = values.filter((value) => !/^\d+(\.\d+)?$/.test(String(value)) && !Number.isNaN(new Date(String(value)).getTime())).length;
  if (values.length && dated / values.length >= 0.6) return "date";
  if (values.length && numeric / values.length >= 0.7) return "numeric";
  const unique = new Set(values.map((value) => String(value).trim())).size;
  if (unique <= Math.max(25, rows.length * 0.25)) return "categorical";
  return "text";
}

function inferRole(field: string) {
  const name = field.toLowerCase();
  if (/shelter|site|agency|organization|provider/.test(name)) return "organization";
  if (/program|service/.test(name)) return "program";
  if (/status|outcome|completion|discharge/.test(name)) return "status";
  if (/reason|referral|denial|category|placement/.test(name)) return "reason";
  if (/date|month|year/.test(name)) return "date";
  if (/amount|score|rate|progress|duration|age|total/.test(name)) return "score";
  if (/id$|\bid\b|name|email/.test(name)) return "identifier";
  return "other";
}

export function generateAnalyticsPlan({ rawRows, setupConfig = {}, selectedPackage = "data-clean", selectedLevel = "essential", brandingConfig = {} }: AnalyticsPlanInput) {
  const rows = Array.isArray(rawRows) ? rawRows : [];
  const columns = rows.length ? Object.keys(rows[0]) : [];
  const missingCodes = Array.from(new Set(DEFAULT_MISSING_CODES.concat((setupConfig.missingValueCodes as string[] | undefined) || [])));
  const fieldProfiles = columns.map((fieldName) => {
    const values = rows.map((row) => row[fieldName]);
    const missingCount = values.filter((value) => isMissing(value, missingCodes)).length;
    const nonMissing = values.filter((value) => !isMissing(value, missingCodes));
    const uniqueCount = new Set(nonMissing.map((value) => String(value).trim())).size;
    return {
      fieldName,
      displayLabel: String((setupConfig.labelMap as Record<string, string> | undefined)?.[fieldName] || fieldName),
      type: inferFieldType(rows, fieldName),
      role: inferRole(fieldName),
      nonMissingCount: nonMissing.length,
      missingCount,
      missingPercent: rows.length ? Math.round((missingCount / rows.length) * 1000) / 10 : 0,
      uniqueCount,
      uniquePercent: nonMissing.length ? Math.round((uniqueCount / nonMissing.length) * 1000) / 10 : 0,
      sampleValues: nonMissing.slice(0, 5),
      topValues: topValues(rows, fieldName, 8),
      parseSuccessRate: rows.length ? Math.round((nonMissing.length / rows.length) * 1000) / 10 : 0,
      warnings: [] as string[],
    };
  });
  const missingCells = fieldProfiles.reduce((sum, field) => sum + field.missingCount, 0);
  const missingRows = rows.filter((row) => columns.some((column) => isMissing(row[column], missingCodes))).length;
  const duplicateSignatures = new Set<string>();
  let exactDuplicateRows = 0;
  rows.forEach((row) => {
    const signature = JSON.stringify(columns.map((column) => String(row[column] ?? "").trim().toLowerCase()));
    if (duplicateSignatures.has(signature)) exactDuplicateRows += 1;
    duplicateSignatures.add(signature);
  });
  const dateFields = fieldProfiles.filter((field) => field.type === "date").map((field) => field.fieldName);
  const numericFields = fieldProfiles.filter((field) => field.type === "numeric").map((field) => field.fieldName);
  const categoricalFields = fieldProfiles.filter((field) => field.type === "categorical").map((field) => field.fieldName);
  const completenessScore = Math.max(0, Math.round(100 - (missingCells / Math.max(1, rows.length * Math.max(1, columns.length))) * 100));
  const duplicateScore = Math.max(0, Math.round(100 - (exactDuplicateRows / Math.max(1, rows.length)) * 100));
  const overallScore = Math.round(completenessScore * 0.3 + duplicateScore * 0.2 + (dateFields.length ? 90 : 75) * 0.15 + (numericFields.length ? 88 : 82) * 0.1 + (categoricalFields.length ? 90 : 70) * 0.1 + 85 * 0.15);
  const datasetProfile = {
    totalRecords: rows.length,
    totalFields: columns.length,
    totalCells: rows.length * columns.length,
    detectedDateFields: dateFields,
    detectedNumericFields: numericFields,
    detectedCategoricalFields: categoricalFields,
    detectedTextFields: fieldProfiles.filter((field) => field.type === "text").map((field) => field.fieldName),
    possibleIdFields: fieldProfiles.filter((field) => field.type === "id").map((field) => field.fieldName),
    possibleNameFields: fieldProfiles.filter((field) => /name/i.test(field.fieldName)).map((field) => field.fieldName),
    possibleEmailFields: fieldProfiles.filter((field) => field.type === "email").map((field) => field.fieldName),
    possibleLocationFields: fieldProfiles.filter((field) => field.role === "location").map((field) => field.fieldName),
    possibleOutcomeFields: fieldProfiles.filter((field) => field.role === "status").map((field) => field.fieldName),
    possibleStatusFields: fieldProfiles.filter((field) => field.role === "status").map((field) => field.fieldName),
    possibleProgramFields: fieldProfiles.filter((field) => field.role === "program").map((field) => field.fieldName),
    possibleOrganizationFields: fieldProfiles.filter((field) => field.role === "organization").map((field) => field.fieldName),
  };
  const joined = columns.join(" ").toLowerCase();
  const primaryType = /referral|denial|shelter|youth/.test(joined) ? "referralOrDenial" : /q\d+|question|response|survey/.test(joined) ? "survey" : /program|outcome|service/.test(joined) ? "programEvaluation" : "genericSpreadsheet";
  const missingProfile = {
    missingRows,
    missingCells,
    fieldsWithBlanks: fieldProfiles.filter((field) => field.missingCount > 0).length,
    missingPercent: rows.length && columns.length ? Math.round((missingCells / (rows.length * columns.length)) * 1000) / 10 : 0,
    topMissingFieldsByCount: fieldProfiles.filter((field) => field.missingCount > 0).sort((a, b) => b.missingCount - a.missingCount).slice(0, 10),
    topMissingFieldsByPercent: fieldProfiles.filter((field) => field.missingCount > 0).sort((a, b) => b.missingPercent - a.missingPercent).slice(0, 10),
    sampleRowsWithMissing: [],
    missingValueCodesUsed: missingCodes,
    explanation: "Missing rows are records with at least one missing value. Missing cells are every blank or coded missing field in the file. One row can contain many missing cells.",
  };
  return {
    datasetProfile,
    fieldProfiles,
    datasetType: { primaryType, confidence: primaryType === "genericSpreadsheet" ? 35 : 75, reasons: [`Detected fields consistent with ${primaryType}.`], secondaryTypes: [] },
    qualityProfile: { overallScore, grade: overallScore >= 90 ? "A" : overallScore >= 80 ? "B" : overallScore >= 70 ? "C" : "Needs cleanup", components: { completenessScore, duplicateScore }, explanation: `Your quality score is ${overallScore} based on completeness, duplicates, field structure, and chart usability.`, strengths: [], concerns: [], recommendations: [] },
    missingProfile,
    duplicateProfile: { exactDuplicateRows, duplicatePercent: rows.length ? Math.round((exactDuplicateRows / rows.length) * 1000) / 10 : 0, duplicateGroups: [], likelyDuplicateRiskFields: datasetProfile.possibleIdFields, recommendations: [] },
    descriptiveStats: { numeric: {}, categorical: {}, dates: {} },
    recommendedKpis: [
      { id: "totalRecords", title: "Total records", value: rows.length, subtitle: "Rows analyzed", explanation: "Records are analyzed after setup rows are omitted.", detailPanelType: "rows", packageAvailability: "all" },
      { id: "qualityScore", title: "Quality score", value: overallScore, subtitle: "Weighted score", explanation: "Calculated from completeness, duplicates, field structure, and usability.", detailPanelType: "quality", packageAvailability: "all" },
    ],
    recommendedVisuals: categoricalFields.slice(0, 4).map<RecommendedVisual>((field, index) => ({ id: `top-${field}`, title: `Top ${field}`, description: "Top categories only; remaining values grouped as Other.", type: "horizontalBar", fieldNames: [field], priority: 80 - index, tab: "visuals", packageMinimum: "management-dashboard", levelMinimum: "essential", chartConfig: { chartType: "horizontalBar", xField: "count", yField: "category", data: topValues(rows, field, 10).map((item) => ({ category: item.value, count: item.count })) }, insight: "Recommended because this field has chartable categories." })),
    recommendedInsights: [{ id: "shape", title: "Dataset size", text: `This dataset contains ${rows.length} records across ${columns.length} fields.`, severity: "info", relatedFields: [], recommendedAction: "Review recommended visuals.", packageAvailability: "all" }],
    recommendedDeliverables: [],
    warnings: [],
    assumptions: ["Rows omitted in Data Setup are not analyzed.", "Exact duplicates are normalized full-row matches."],
    selectedPackage,
    selectedLevel,
    brandingConfig,
  };
}