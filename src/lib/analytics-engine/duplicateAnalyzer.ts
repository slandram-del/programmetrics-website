import type { DataRow, DuplicateProfile, FieldProfile } from "./types";
import { getColumns, normalizeValue } from "./setupRows";

export function analyzeDuplicates(rows: DataRow[], fieldProfiles: FieldProfile[]): DuplicateProfile {
  const columns = getColumns(rows).sort();
  const groups = new Map<string, number[]>();
  rows.forEach((row, index) => {
    const signature = columns.map((column) => normalizeValue(row[column]).toLowerCase()).join("||");
    groups.set(signature, [...(groups.get(signature) || []), index + 1]);
  });
  const duplicateGroups = Array.from(groups.entries())
    .filter(([, indexes]) => indexes.length > 1)
    .map(([signature, rowIndexes]) => ({ signature, count: rowIndexes.length, rowIndexes }));
  const likelyDuplicateRiskFields = fieldProfiles
    .filter((field) => /(name|first name|last name|email|dob|date of birth|client id|participant id|referral date|program|organization)/i.test(`${field.fieldName} ${field.displayLabel}`))
    .map((field) => field.fieldName);
  return {
    exactDuplicateRows: duplicateGroups.reduce((sum, group) => sum + group.count - 1, 0),
    duplicateGroups,
    likelyDuplicateRiskFields,
    explanation: "Exact duplicates are detected by normalizing every field in a row and comparing full-row signatures. Fuzzy matching is intentionally not applied yet."
  };
}
