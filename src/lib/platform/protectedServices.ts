export const PROTECTED_ANALYTICS_SERVICES = [
  "Analytics Recommendation Engine",
  "Dataset Profiler",
  "Dataset Classification",
  "Field Profiler",
  "Field Type Detection",
  "Field Role Detection",
  "Missing Value Analyzer",
  "Duplicate Analyzer",
  "Quality Score Engine",
  "Analytics Confidence Engine",
  "KPI Recommendation Engine",
  "Visual Recommendation Engine",
  "Insight Generator",
  "Deliverable Recommendation Engine",
  "AI Narrative Engine",
  "Industry Intelligence"
] as const;

export type ProtectedAnalyticsService = typeof PROTECTED_ANALYTICS_SERVICES[number];

export const PROTECTED_ARCHITECTURE_NOTICE =
  "ProgramMetrics analytics services are protected business logic. Client and API callers receive result objects only, not internal formulas, ranking rules, or recommendation heuristics.";

export function isProtectedAnalyticsService(serviceName: string): boolean {
  return PROTECTED_ANALYTICS_SERVICES.some((service) => service.toLowerCase() === serviceName.toLowerCase());
}
