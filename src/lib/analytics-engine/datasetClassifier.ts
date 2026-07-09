import type { DatasetTypeProfile, FieldProfile } from "./types";

const rules: Array<{ type: DatasetTypeProfile["primaryType"]; pattern: RegExp; reason: string }> = [
  { type: "survey", pattern: /\bq\d+|question|survey|response|qualtrics/i, reason: "Question-style fields or survey response labels were detected." },
  { type: "referralOrDenial", pattern: /referral|denial|denied|shelter|youth/i, reason: "Referral, denial, shelter, or youth fields were detected." },
  { type: "caseManagement", pattern: /client|case|service|outcome|intake/i, reason: "Client, case, service, or outcome fields were detected." },
  { type: "programEvaluation", pattern: /program|grant|evaluation|outcome|participant/i, reason: "Program, evaluation, participant, or outcome fields were detected." },
  { type: "housingOrShelter", pattern: /housing|shelter|bed|exit|destination/i, reason: "Housing, shelter, bed, exit, or destination fields were detected." },
  { type: "behavioralHealth", pattern: /diagnosis|behavioral|mental|substance|session|provider/i, reason: "Behavioral health terms were detected." },
  { type: "healthcare", pattern: /patient|diagnosis|clinic|provider|medical|discharge/i, reason: "Healthcare terms were detected." },
  { type: "education", pattern: /student|school|grade|attendance|teacher/i, reason: "Education terms were detected." },
  { type: "crm", pattern: /donor|account|lead|opportunity|contact/i, reason: "CRM terms were detected." },
  { type: "finance", pattern: /revenue|expense|budget|invoice|payment/i, reason: "Finance terms were detected." },
  { type: "hr", pattern: /employee|department|hire|termination|salary/i, reason: "HR terms were detected." }
];

export function classifyDataset(fieldProfiles: FieldProfile[]): DatasetTypeProfile {
  const text = fieldProfiles.map((field) => `${field.fieldName} ${field.displayLabel} ${field.sampleValues.join(" ")}`).join(" ");
  const matches = rules.filter((rule) => rule.pattern.test(text));
  if (matches.length === 0) return { primaryType: "genericSpreadsheet", confidence: 0.45, reasons: ["No strong industry-specific pattern was detected."], secondaryTypes: [] };
  const primary = matches[0];
  return {
    primaryType: primary.type,
    confidence: Math.min(0.95, 0.55 + matches.length * 0.1),
    reasons: matches.slice(0, 3).map((match) => match.reason),
    secondaryTypes: matches.slice(1, 4).map((match) => match.type)
  };
}
