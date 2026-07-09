import type { DeliverableManifestItem, PackageManifest } from "../package-orchestrator";

export interface DeliverableMetadata {
  id: string;
  name: string;
  description: string;
  format: string;
  category: string;
  packageId: string;
  packageName: string;
  outputLevel: string;
  estimatedPages: number | null;
  generationTime: string;
  included: boolean;
  previewAvailable: boolean;
  exportAvailable: boolean;
  locked: boolean;
  watermark: boolean;
}

export function buildDeliverableMetadata(deliverable: DeliverableManifestItem, manifest: PackageManifest): DeliverableMetadata {
  return {
    id: deliverable.id,
    name: deliverable.name,
    description: deliverable.description,
    format: deliverable.format,
    category: deliverable.category,
    packageId: manifest.package.id,
    packageName: manifest.package.name,
    outputLevel: manifest.outputLevel.name,
    estimatedPages: deliverable.estimatedPages ?? null,
    generationTime: deliverable.generationTime,
    included: deliverable.included,
    previewAvailable: deliverable.previewAvailable,
    exportAvailable: deliverable.exportAvailable,
    locked: deliverable.locked,
    watermark: deliverable.watermark
  };
}
