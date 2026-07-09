import type { BrandingConfig } from "../analytics-engine";

export function renderBrandingHeader(branding: BrandingConfig = {}): string {
  // TODO: Render brand-safe HTML headers for dashboards and reports.
  return String(branding.reportTitle || branding.organizationName || "ProgramMetrics Report");
}
