import { analyzeDuplicates } from "../duplicateAnalyzer";
import { profileFields } from "../fieldProfiler";
import { analyzeMissingValues } from "../missingValueAnalyzer";

// TODO: Convert this sample into real unit tests after the project selects a TypeScript test runner.
// Suggested coverage:
// - missing rows vs missing cells definitions
// - exact duplicate row signatures
// - field type detection for dates, numeric fields, emails, IDs, and high-cardinality text
// - descriptive statistics and IQR outlier counts
// - quality score components
// - analytics confidence labels

export function sampleAnalyticsEngineSmokeTest() {
  const rows = [
    { id: "1", status: "Complete", amount: "10", email: "a@example.com" },
    { id: "2", status: "", amount: "20", email: "b@example.com" },
    { id: "2", status: "", amount: "20", email: "b@example.com" }
  ];
  const fieldProfiles = profileFields(rows);
  const missing = analyzeMissingValues(rows, fieldProfiles);
  const duplicates = analyzeDuplicates(rows, fieldProfiles);
  return {
    missingRows: missing.missingRows,
    missingCells: missing.missingCells,
    exactDuplicateRows: duplicates.exactDuplicateRows
  };
}
