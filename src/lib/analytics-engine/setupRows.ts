import type { DataRow, SetupConfig } from "./types";

export const DEFAULT_MISSING_VALUE_CODES = [
  "", " ", "NA", "N/A", "n/a", "null", "NULL", "unknown", "Unknown", "blank", "Blank",
  "not reported", "Not Reported", "missing", "Missing", "--", "-"
];

export function normalizeValue(value: unknown): string {
  return value === null || value === undefined ? "" : String(value).trim();
}

export function getMissingCodes(setupConfig: SetupConfig = {}): Set<string> {
  return new Set([...DEFAULT_MISSING_VALUE_CODES, ...(setupConfig.missingValueCodes || [])].map((value) => String(value).trim()));
}

export function isMissingValue(value: unknown, missingCodes: Set<string>): boolean {
  return missingCodes.has(normalizeValue(value));
}

function toNumberArray(value: number[] | string | undefined): number[] {
  if (Array.isArray(value)) return value.map(Number).filter((entry) => Number.isFinite(entry));
  if (typeof value !== "string") return [];
  return value.split(",").map((entry) => Number(entry.trim())).filter((entry) => Number.isFinite(entry));
}

export function prepareRows(rawRows: DataRow[] | unknown[][], setupConfig: SetupConfig = {}): { rows: DataRow[]; labelMap: Record<string, string>; assumptions: string[] } {
  const assumptions: string[] = [];
  if (!Array.isArray(rawRows) || rawRows.length === 0) return { rows: [], labelMap: {}, assumptions: ["No rows were provided."] };

  if (!Array.isArray(rawRows[0])) {
    return { rows: rawRows as DataRow[], labelMap: setupConfig.labelMap || {}, assumptions };
  }

  const matrix = rawRows as unknown[][];
  const headerRow = Math.max(1, setupConfig.headerRow || setupConfig.codeRow || 1);
  const labelRow = Math.max(1, setupConfig.labelRow || headerRow);
  const dataStartRow = Math.max(1, setupConfig.dataStartRow || setupConfig.dataStartsAt || (labelRow > headerRow ? labelRow + 2 : headerRow + 1));
  const omittedRows = new Set([...toNumberArray(setupConfig.omitRows), ...(setupConfig.omittedRows || [])]);
  const omittedColumns = new Set([...toNumberArray(setupConfig.omitColumns), ...(setupConfig.omittedColumns || [])]);
  const useLabels = setupConfig.useVariableLabels ?? setupConfig.useLabels ?? Boolean(setupConfig.labelRow);
  const header = matrix[headerRow - 1] || [];
  const labels = matrix[labelRow - 1] || header;
  const maxWidth = Math.max(header.length, labels.length, ...matrix.map((row) => row.length));
  const used = new Set<string>();
  const fields = Array.from({ length: maxWidth }, (_, index) => {
    const fallback = `Column ${index + 1}`;
    const code = normalizeValue(header[index]) || fallback;
    const label = normalizeValue(labels[index]) || code;
    let name = useLabels ? label : code;
    while (used.has(name)) name = `${name} ${index + 1}`;
    used.add(name);
    return { index, name, label };
  }).filter((field) => !omittedColumns.has(field.index + 1));

  const rows: DataRow[] = [];
  matrix.forEach((sourceRow, index) => {
    const oneBased = index + 1;
    if (oneBased < dataStartRow || omittedRows.has(oneBased) || oneBased === headerRow || oneBased === labelRow) return;
    const row: DataRow = {};
    fields.forEach((field) => { row[field.name] = sourceRow[field.index] ?? ""; });
    if (Object.values(row).some((value) => normalizeValue(value))) rows.push(row);
  });

  const labelMap = fields.reduce<Record<string, string>>((map, field) => {
    map[field.name] = field.label;
    return map;
  }, {});

  if (!setupConfig.dataStartRow && !setupConfig.dataStartsAt) assumptions.push("Data start row was inferred from header and label rows.");
  return { rows, labelMap, assumptions };
}

export function getColumns(rows: DataRow[]): string[] {
  const columns = new Set<string>();
  rows.forEach((row) => Object.keys(row).forEach((key) => columns.add(key)));
  return Array.from(columns);
}
