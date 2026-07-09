import type { AnalyticsPlan, BrandingConfig } from "../analytics-engine";

export function buildCoverPage(plan: AnalyticsPlan, branding: BrandingConfig = {}) {
  // TODO: Build report cover-page data for PDFs, Word reports, and decks.
  return { title: branding.reportTitle || "Analytics Report", recordCount: plan.datasetProfile.totalRecords };
}
