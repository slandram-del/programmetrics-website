import type { PackageManifest } from "../package-orchestrator";
import { buildDeliverableMetadata, type DeliverableMetadata } from "./deliverableMetadata";

export interface ProfessionalDeliverableManifest {
  packageId: string;
  packageName: string;
  outputLevel: string;
  deliverables: DeliverableMetadata[];
  reportSections: string[];
  dashboards: string[];
  exports: string[];
  lockedDeliverables: string[];
  previewDeliverables: string[];
}

export function buildProfessionalDeliverableManifest(manifest: PackageManifest): ProfessionalDeliverableManifest {
  const deliverables = manifest.deliverables.map((deliverable) => buildDeliverableMetadata(deliverable, manifest));
  return {
    packageId: manifest.package.id,
    packageName: manifest.package.name,
    outputLevel: manifest.outputLevel.name,
    deliverables,
    reportSections: manifest.reportSections.map((section) => section.title),
    dashboards: manifest.dashboards.map((dashboard) => dashboard.name),
    exports: manifest.exports,
    lockedDeliverables: deliverables.filter((item) => item.locked).map((item) => item.name),
    previewDeliverables: deliverables.filter((item) => item.previewAvailable).map((item) => item.name)
  };
}
