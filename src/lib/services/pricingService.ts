import { analyticsPackages, getAnalyticsPackage, getOutputLevel, type AnalyticsPackageConfig, type OutputLevelConfig } from "../../config";
import { ConfigurationError } from "../shared";

export interface PricingSelection {
  packageId: string;
  levelId: string;
}

export interface PricingPlan {
  package: AnalyticsPackageConfig;
  level: OutputLevelConfig;
  price: number | null;
  displayPrice: string;
}

export function listPricingPackages(): AnalyticsPackageConfig[] {
  return analyticsPackages;
}

export function getPricingPlan(selection: PricingSelection): PricingPlan {
  const pkg = getAnalyticsPackage(selection.packageId);
  const level = getOutputLevel(selection.packageId, selection.levelId);
  if (!pkg || !level) throw new ConfigurationError("Unknown ProgramMetrics package or output level.", selection);
  return {
    package: pkg,
    level,
    price: level.price,
    displayPrice: level.displayPrice || (level.price == null ? pkg.displayStartingPrice || "Custom quote" : `$${level.price.toLocaleString()}`)
  };
}

export function calculateUpgradePrice(current: PricingSelection | undefined, next: PricingSelection): number | null {
  const nextPlan = getPricingPlan(next);
  if (!current) return nextPlan.price;
  const currentPlan = getPricingPlan(current);
  if (nextPlan.price == null || currentPlan.price == null) return null;
  return Math.max(0, nextPlan.price - currentPlan.price);
}
