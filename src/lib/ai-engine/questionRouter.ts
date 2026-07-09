import type { AnalyticsPlan } from "../analytics-engine";

export function routeQuestion(question: string, plan: AnalyticsPlan): { route: string; context: unknown } {
  // TODO: Route user questions to missingness, quality, visual, export, or narrative engines.
  const normalized = question.toLowerCase();
  if (normalized.includes("missing")) return { route: "missing", context: plan.missingProfile };
  if (normalized.includes("quality")) return { route: "quality", context: plan.qualityProfile };
  return { route: "summary", context: plan.datasetProfile };
}
