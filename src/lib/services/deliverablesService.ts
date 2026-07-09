import { exportFormats, getExportFormat } from "../../config";
import type { AnalyticsPlan, RecommendedDeliverable } from "../analytics-engine";
import { recommendDeliverables } from "../analytics-engine";
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
