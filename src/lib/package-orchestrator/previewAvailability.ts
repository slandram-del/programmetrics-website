import type { DeliverableDefinition, DeliverableManifestItem, OutputLevelId, PermissionStatus } from "./packageTypes";

export function buildPreviewAvailability(options: {
  deliverable: DeliverableDefinition;
  permission: PermissionStatus;
  requiredPackageId: DeliverableManifestItem["requiredPackageId"];
  requiredLevel: OutputLevelId;
}): Pick<DeliverableManifestItem, "previewAvailable" | "exportAvailable" | "locked" | "watermark" | "maxPreviewPages" | "maxPreviewCharts"> {
  const included = options.permission === "included";
  return {
    previewAvailable: true,
    exportAvailable: included,
    locked: !included,
    watermark: !included,
    maxPreviewPages: included ? 99 : Math.min(options.deliverable.estimatedPages || 3, 3),
    maxPreviewCharts: included ? 99 : 4
  };
}
