import type { DeliverableManifestItem, PermissionManifest } from "./packageTypes";

export function buildFeatureAvailability(deliverables: DeliverableManifestItem[]): PermissionManifest {
  return {
    status: deliverables.some((item) => item.permission === "upgradeRequired")
      ? "upgradeRequired"
      : deliverables.some((item) => item.permission === "previewOnly")
        ? "previewOnly"
        : "included",
    includedFeatures: deliverables.filter((item) => item.included).map((item) => item.name),
    previewOnlyFeatures: deliverables.filter((item) => item.permission === "previewOnly").map((item) => item.name),
    lockedFeatures: deliverables.filter((item) => item.locked).map((item) => item.name),
    enterpriseOnlyFeatures: deliverables.filter((item) => item.permission === "enterpriseOnly").map((item) => item.name)
  };
}
