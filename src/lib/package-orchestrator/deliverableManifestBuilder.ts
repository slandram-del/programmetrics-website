import { getPackageDefinition } from "./packageRegistry";
import { resolvePermission } from "./permissionResolver";
import { buildPreviewAvailability } from "./previewAvailability";
import type { DeliverableManifestItem, PackageDefinition } from "./packageTypes";

export function buildDeliverableManifest(pkg: PackageDefinition, selectedLevel: string): DeliverableManifestItem[] {
  return pkg.deliverables.map((deliverable) => {
    const permission = resolvePermission({
      selectedPackageId: pkg.id,
      selectedLevel,
      requiredPackageId: pkg.id,
      requiredLevel: deliverable.minimumLevel,
      enterpriseOnly: deliverable.category === "enterprise" && pkg.id !== "enterprise-intelligence"
    });
    const preview = buildPreviewAvailability({
      deliverable,
      permission,
      requiredPackageId: pkg.id,
      requiredLevel: deliverable.minimumLevel
    });
    const included = permission === "included";

    return {
      ...deliverable,
      ...preview,
      included,
      permission,
      requiredPackageId: pkg.id,
      requiredLevel: deliverable.minimumLevel
    };
  });
}

export function buildCrossPackageDeliverableManifest(selectedPackageId: string, selectedLevel: string): DeliverableManifestItem[] {
  const selected = getPackageDefinition(selectedPackageId);
  return selected.deliverables.map((deliverable) => {
    const permission = resolvePermission({
      selectedPackageId: selected.id,
      selectedLevel,
      requiredPackageId: selected.id,
      requiredLevel: deliverable.minimumLevel
    });
    return {
      ...deliverable,
      ...buildPreviewAvailability({ deliverable, permission, requiredPackageId: selected.id, requiredLevel: deliverable.minimumLevel }),
      included: permission === "included",
      permission,
      requiredPackageId: selected.id,
      requiredLevel: deliverable.minimumLevel
    };
  });
}
