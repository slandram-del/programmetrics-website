import { exportFormats, getExportFormat } from "../../config";
import type { AnalyticsPlan, RecommendedDeliverable } from "../analytics-engine";
import { recommendDeliverables } from "../analytics-engine";
import { buildPackageManifest, type PackageManifest } from "../package-orchestrator";
import { timeDiagnostic } from "../shared";

export interface DeliverablesRequest {
  plan?: AnalyticsPlan;
  selectedPackage?: string;
  selectedLevel?: string;
}

export function listExportFormats() {
  return exportFormats;
}

export function getDeliverables(request: DeliverablesRequest): RecommendedDeliverable[] {
  return timeDiagnostic("service", "deliverablesService.getDeliverables", () => {
    if (request.plan) return request.plan.recommendedDeliverables;
    return recommendDeliverables(request.selectedPackage, request.selectedLevel);
  });
}

export function canExportFormat(formatId: string, deliverables: RecommendedDeliverable[]): boolean {
  const format = getExportFormat(formatId);
  if (!format) return false;
  return deliverables.some((deliverable) => deliverable.format === format.extension || deliverable.id === format.id) || deliverables.some((deliverable) => deliverable.exportAvailable && deliverable.format === format.extension);
}

export function getPackageDeliverableManifest(request: DeliverablesRequest): PackageManifest {
  return timeDiagnostic("service", "deliverablesService.getPackageDeliverableManifest", () =>
    buildPackageManifest({
      packageId: request.selectedPackage || "data-foundation",
      outputLevel: request.selectedLevel || "essential",
      analyticsPlan: request.plan,
      datasetType: request.plan?.datasetType
    })
  );
}
