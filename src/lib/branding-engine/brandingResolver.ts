import type { PackageManifest } from "../package-orchestrator";
import type { BrandingProfileInput } from "./brandingTypes";
import { normalizeBrandingProfile, programMetricsBrandProfile } from "./brandingProfile";
import { validateBrandingProfile } from "./brandingProfileValidator";

export function resolveBrandingProfile(input: BrandingProfileInput | undefined, manifest?: PackageManifest) {
  const profile = normalizeBrandingProfile(input || programMetricsBrandProfile);
  const validation = validateBrandingProfile(profile);
  const available = manifest ? manifest.branding.available : true;
  const exportAvailable = manifest ? manifest.branding.exportAvailable : false;
  return {
    profile,
    validation,
    permissions: {
      available,
      exportAvailable,
      previewOnly: available && !exportAvailable,
      lockedFields: manifest?.branding.lockedFields || []
    }
  };
}
