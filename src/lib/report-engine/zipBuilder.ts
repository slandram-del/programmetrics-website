import type { AnalyticsPlan } from "../analytics-engine";

export function buildZipPackage(plan: AnalyticsPlan) {
  // TODO: Assemble reports, data, images, metadata, and README into a ZIP.
  return { format: "zip", deliverables: plan.recommendedDeliverables };
}
