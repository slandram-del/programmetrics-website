import { levelMeetsMinimum } from "./outputLevelResolver";
import type { BrandingManifest, PackageDefinition } from "./packageTypes";

const brandingFields = [
  "Logo",
  "Color Palette",
  "Fonts",
  "Prepared For",
  "Prepared By",
  "Footer",
  "Organization",
  "Mission",
  "Contact Information"
];

export function buildBrandingManifest(pkg: PackageDefinition, selectedLevel: string, brandingRequested = false): BrandingManifest {
  const packageAllowsBranding = pkg.rank >= 2;
  const exportAvailable = packageAllowsBranding && levelMeetsMinimum(selectedLevel, "professional");
  return {
    available: packageAllowsBranding || brandingRequested,
    exportAvailable,
    requiredLevel: "professional",
    fields: brandingFields,
    lockedFields: exportAvailable ? [] : brandingFields,
    defaultsApplied: ["ProgramMetrics default header", "ProgramMetrics default footer", "Default report color palette"]
  };
}
