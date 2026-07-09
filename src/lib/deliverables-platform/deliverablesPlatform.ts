import type { AnalyticsPlan } from "../analytics-engine";
import type { PackageManifest } from "../package-orchestrator";
import { assembleReports, type ReportAssemblyResult } from "./reportAssembler";
import { buildProfessionalDeliverableManifest, type ProfessionalDeliverableManifest } from "./deliverableManifest";
import { buildPreviewCard, buildReportPreview, type DeliverablePreviewCard, type DeliverablePreviewModel } from "./previewBuilder";
import { renderPreview, type PreviewRenderOutput } from "./previewRenderer";
import type { BrandingProfile } from "./sectionRenderer";

export interface DeliverablesPlatformRequest {
  plan: AnalyticsPlan;
  manifest: PackageManifest;
  branding?: BrandingProfile;
}

export interface DeliverablesPlatformResult {
  manifest: ProfessionalDeliverableManifest;
  reportAssembly: ReportAssemblyResult;
  previewCards: DeliverablePreviewCard[];
  previews: DeliverablePreviewModel[];
  renderedPreviews: PreviewRenderOutput[];
}

export function buildDeliverablesPlatform(request: DeliverablesPlatformRequest): DeliverablesPlatformResult {
  const reportAssembly = assembleReports({ plan: request.plan, manifest: request.manifest, branding: request.branding });
  const previews = reportAssembly.reports.map(buildReportPreview);
  return {
    manifest: buildProfessionalDeliverableManifest(request.manifest),
    reportAssembly,
    previewCards: reportAssembly.reports.map(buildPreviewCard),
    previews,
    renderedPreviews: previews.map(renderPreview)
  };
}
