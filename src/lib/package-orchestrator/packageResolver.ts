import { getPackageDefinition, listPackageDefinitions } from "./packageRegistry";
import type { AnalyticsPackageId, PackageDefinition } from "./packageTypes";

export function resolvePackageSelection(packageId: string | undefined): PackageDefinition {
  return getPackageDefinition(packageId);
}

export function packageMeetsMinimum(selectedPackageId: string | undefined, requiredPackageId: AnalyticsPackageId): boolean {
  const selected = getPackageDefinition(selectedPackageId);
  const required = getPackageDefinition(requiredPackageId);
  return selected.rank >= required.rank;
}

export function listAvailablePackageUpgrades(packageId: string | undefined): PackageDefinition[] {
  const selected = getPackageDefinition(packageId);
  return listPackageDefinitions().filter((pkg) => pkg.rank > selected.rank);
}
