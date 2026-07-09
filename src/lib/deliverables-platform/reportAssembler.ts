import type { AnalyticsPlan } from "../analytics-engine";
import type { PackageManifest } from "../package-orchestrator";
import { buildProfessionalReport, type ProfessionalReport } from "./reportBuilder";
import type { BrandingProfile } from "./sectionRenderer";

export interface ReportAssemblyResult {
  reports: ProfessionalReport[];
  includedReports: ProfessionalReport[];
  previewOnlyReports: ProfessionalReport[];
  lockedReports: ProfessionalReport[];
}

export function assembleReports(options: {
  plan: AnalyticsPlan;
  manifest: PackageManifest;
  branding?: BrandingProfile;
}): ReportAssemblyResult {
  const reports = options.manifest.deliverables.map((deliverable) =>
    buildProfessionalReport({
      plan: options.plan,
      manifest: options.manifest,
      deliverableId: deliverable.id,
      branding: options.branding
    })
  );

  return {
    reports,
    includedReports: reports.filter((report) => report.exportAvailable),
    previewOnlyReports: reports.filter((report) => report.previewAvailable && !report.exportAvailable),
    lockedReports: reports.filter((report) => report.locked)
  };
}
