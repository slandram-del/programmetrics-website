import type { DataRow, FieldProfile, MissingProfile, SetupConfig } from "./types";
import { getColumns, getMissingCodes, isMissingValue } from "./setupRows";

export function analyzeMissingValues(rows: DataRow[], fieldProfiles: FieldProfile[], setupConfig: SetupConfig = {}): MissingProfile {
  const missingCodes = getMissingCodes(setupConfig);
  const columns = getColumns(rows);
  let missingCells = 0;
  let missingRows = 0;
  const sampleRowsWithMissing: Array<{ rowIndex: number; missingFields: string[] }> = [];

  rows.forEach((row, index) => {
    const missingFields = columns.filter((column) => isMissingValue(row[column], missingCodes));
    if (missingFields.length) {
      missingRows += 1;
      missingCells += missingFields.length;
      if (sampleRowsWithMissing.length < 10) sampleRowsWithMissing.push({ rowIndex: index + 1, missingFields });
    }
  });

  const topMissingFields = fieldProfiles
    .filter((field) => field.missingCount > 0)
    .map((field) => ({ fieldName: field.fieldName, displayLabel: field.displayLabel, missingCount: field.missingCount, missingPercent: field.missingPercent }));

  return {
    missingRows,
    missingCells,
    fieldsWithBlanks: topMissingFields.length,
    missingPercent: rows.length && columns.length ? missingCells / (rows.length * columns.length) : 0,
    topMissingFieldsByCount: [...topMissingFields].sort((a, b) => b.missingCount - a.missingCount).slice(0, 10),
    topMissingFieldsByPercent: [...topMissingFields].sort((a, b) => b.missingPercent - a.missingPercent).slice(0, 10),
    sampleRowsWithMissing,
    missingValueCodesUsed: Array.from(missingCodes),
    explanation: "Missing rows are records with at least one missing value. Missing cells are every blank or coded missing field in the file. One row can contain many missing cells."
  };
}
