import { listPackageDefinitions } from "./packageRegistry";
import { packageMeetsMinimum } from "./packageResolver";
import { getOutputLevelDefinition, levelMeetsMinimum } from "./outputLevelResolver";
import type { AnalyticsPackageId, CheckoutManifest, OutputLevelId, PackageDefinition, PermissionManifest, PermissionStatus } from "./packageTypes";

export function resolvePermission(options: {
  selectedPackageId: string;
  selectedLevel: string;
  requiredPackageId: AnalyticsPackageId;
  requiredLevel: OutputLevelId;
  enterpriseOnly?: boolean;
}): PermissionStatus {
  if (options.enterpriseOnly && options.selectedPackageId !== "enterprise-intelligence") return "enterpriseOnly";
  if (!packageMeetsMinimum(options.selectedPackageId, options.requiredPackageId)) return "upgradeRequired";
  if (!levelMeetsMinimum(options.selectedLevel, options.requiredLevel)) return "previewOnly";
  return "included";
}

export function buildPermissionManifest(groups: {
  included: string[];
  previewOnly: string[];
  locked: string[];
  enterpriseOnly: string[];
}): PermissionManifest {
  const status: PermissionStatus = groups.enterpriseOnly.length
    ? "enterpriseOnly"
    : groups.locked.length
      ? "upgradeRequired"
      : groups.previewOnly.length
        ? "previewOnly"
        : "included";

  return {
    status,
    includedFeatures: groups.included,
    previewOnlyFeatures: groups.previewOnly,
    lockedFeatures: groups.locked,
    enterpriseOnlyFeatures: groups.enterpriseOnly
  };
}

export function buildCheckoutManifest(pkg: PackageDefinition, selectedLevel: string): CheckoutManifest {
  const level = getOutputLevelDefinition(selectedLevel);
  const selectedPrice = pkg.startingPrice == null ? null : pkg.startingPrice;
  const upgrades = listPackageDefinitions()
    .filter((candidate) => candidate.rank > pkg.rank || candidate.id === pkg.id)
    .map((candidate) => ({
      packageId: candidate.id,
      level: level.id,
      label: `${candidate.shortName} ${level.name}`,
      price: candidate.startingPrice
    }));

  const nextPackage = listPackageDefinitions().find((candidate) => candidate.rank > pkg.rank);
  const upgradePrice = selectedPrice == null || nextPackage?.startingPrice == null ? null : Math.max(0, nextPackage.startingPrice - selectedPrice);

  return {
    selectedPrice,
    upgradePrice,
    packageComparison: listPackageDefinitions().map((candidate) => ({
      packageId: candidate.id,
      name: candidate.name,
      startingPrice: candidate.startingPrice,
      available: candidate.rank <= pkg.rank
    })),
    availableUpgrades: upgrades
  };
}
