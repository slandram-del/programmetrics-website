import { buildBrandingManifest } from "./brandingAvailability";
import { buildDeliverableManifest } from "./deliverableManifestBuilder";
import { buildFeatureAvailability } from "./featureAvailability";
import { buildIndustryManifest } from "./industryAvailability";
import { buildCheckoutManifest } from "./permissionResolver";
import { resolvePackageSelection } from "./packageResolver";
import { getInheritedOutputLevels, getOutputLevelDefinition } from "./outputLevelResolver";
import { buildSectionManifest } from "./sectionManifestBuilder";
import type { DashboardManifestItem, PackageManifest, PackageOrchestratorRequest } from "./packageTypes";

const futureEnterpriseSupport = [
  "White Label",
  "Recurring Reports",
  "Scheduled Reports",
  "Organization Defaults",
  "API Deliverables",
  "Multi-file Projects"
];

function buildDashboardManifest(request: PackageOrchestratorRequest): DashboardManifestItem[] {
  const pkg = resolvePackageSelection(request.packageId);
  const selectedLevel = getOutputLevelDefinition(request.outputLevel);
  return pkg.dashboards.map((dashboard) => {
    const included = selectedLevel.rank >= getOutputLevelDefinition(dashboard.minimumLevel).rank;
    return {
      ...dashboard,
      included,
      previewAvailable: true,
      exportAvailable: included,
      locked: !included,
      watermark: !included
    };
  });
}

export function buildPackageManifest(request: PackageOrchestratorRequest): PackageManifest {
  const pkg = resolvePackageSelection(request.packageId);
  const outputLevel = getOutputLevelDefinition(request.outputLevel);
  const inheritedLevels = getInheritedOutputLevels(outputLevel.id);
  const industry = buildIndustryManifest(request.datasetType || request.analyticsPlan?.datasetType);
  const deliverables = buildDeliverableManifest(pkg, outputLevel.id);
  const dashboards = buildDashboardManifest(request);
  const reportSections = buildSectionManifest(pkg, deliverables, industry.optionalSections);
  const permissions = buildFeatureAvailability(deliverables);
  const branding = buildBrandingManifest(pkg, outputLevel.id, request.brandingRequested);
  const exports = Array.from(new Set(deliverables.filter((item) => item.exportAvailable).flatMap((item) => item.exports)));

  return {
    package: pkg,
    outputLevel,
    inheritedLevels,
    deliverables,
    reportSections,
    dashboards,
    exports,
    branding,
    industry,
    lockedFeatures: permissions.lockedFeatures,
    previewFeatures: deliverables.filter((item) => item.previewAvailable).map((item) => item.name),
    permissions,
    checkout: buildCheckoutManifest(pkg, outputLevel.id),
    futureEnterpriseSupport,
    generatedAt: new Date().toISOString()
  };
}
