import type { DatasetProfile, FieldProfile } from "./types";

export function profileDataset(fieldProfiles: FieldProfile[], totalRecords: number): DatasetProfile {
  const byType = (type: string) => fieldProfiles.filter((field) => field.type === type).map((field) => field.fieldName);
  const byRole = (role: string) => fieldProfiles.filter((field) => field.role === role).map((field) => field.fieldName);
  const nameFields = fieldProfiles.filter((field) => /name/i.test(`${field.fieldName} ${field.displayLabel}`)).map((field) => field.fieldName);
  return {
    totalRecords,
    totalFields: fieldProfiles.length,
    totalCells: totalRecords * fieldProfiles.length,
    detectedDateFields: byType("date"),
    detectedNumericFields: byType("numeric"),
    detectedCategoricalFields: byType("categorical"),
    detectedTextFields: byType("text"),
    possibleIdFields: byType("id").concat(byRole("identifier")),
    possibleNameFields: nameFields,
    possibleEmailFields: byType("email"),
    possibleLocationFields: byType("location").concat(byRole("location")),
    possibleOutcomeFields: byRole("outcome"),
    possibleStatusFields: byRole("status"),
    possibleProgramFields: byRole("program"),
    possibleOrganizationFields: byRole("organization")
  };
}
