import type { DataRow, FieldProfile, TopValue } from "./types";
import { getColumns, getMissingCodes, isMissingValue, normalizeValue } from "./setupRows";
import { detectFieldRole } from "./fieldRoleDetector";
import { detectFieldType } from "./fieldTypeDetector";

function topValues(values: string[], total: number): TopValue[] {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) || 0) + 1));
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([value, count]) => ({ value, count, percent: total ? count / total : 0 }));
}

export function profileFields(rows: DataRow[], labelMap: Record<string, string> = {}, setupConfig = {}): FieldProfile[] {
  const missingCodes = getMissingCodes(setupConfig);
  const rowCount = rows.length;
  return getColumns(rows).map((fieldName) => {
    const values = rows.map((row) => row[fieldName]);
    const nonMissingValues = values.map(normalizeValue).filter((value) => !isMissingValue(value, missingCodes));
    const missingCount = rowCount - nonMissingValues.length;
    const uniqueCount = new Set(nonMissingValues).size;
    const typeResult = detectFieldType(fieldName, nonMissingValues);
    const displayLabel = labelMap[fieldName] || fieldName;
    const role = detectFieldRole(fieldName, displayLabel, nonMissingValues);
    const warnings = [...typeResult.warnings];
    const chartable = !["id", "email", "phone", "unknown"].includes(typeResult.type) && role !== "metadata" && role !== "identifier" && !(typeResult.type === "text" && uniqueCount / Math.max(1, rowCount) > 0.6);
    if (!chartable) warnings.push("Field is excluded from default charts to avoid noisy or identifying visuals.");
    return {
      fieldName,
      displayLabel,
      type: typeResult.type,
      role,
      nonMissingCount: nonMissingValues.length,
      missingCount,
      missingPercent: rowCount ? missingCount / rowCount : 0,
      uniqueCount,
      uniquePercent: rowCount ? uniqueCount / rowCount : 0,
      sampleValues: nonMissingValues.slice(0, 5),
      topValues: topValues(nonMissingValues, nonMissingValues.length),
      parseSuccessRate: typeResult.parseSuccessRate,
      chartable,
      warnings
    };
  });
}
