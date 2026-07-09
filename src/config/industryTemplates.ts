export const industryTemplates = [
  { id: "housing-shelter", name: "Housing and Shelter", indicators: ["shelter", "housing", "bed", "referral", "denial", "client"] },
  { id: "behavioral-health", name: "Behavioral Health", indicators: ["diagnosis", "treatment", "service", "referral", "outcome"] },
  { id: "education", name: "Education", indicators: ["student", "school", "grade", "attendance", "completion"] },
  { id: "healthcare", name: "Healthcare", indicators: ["patient", "provider", "visit", "clinical", "status"] },
  { id: "government", name: "Government", indicators: ["agency", "program", "region", "compliance", "case"] },
  { id: "nonprofit", name: "Nonprofit", indicators: ["participant", "service", "grant", "outcome", "program"] }
] as const;
