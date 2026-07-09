import type { PackageManifest } from "../package-orchestrator";
import type { BrandingProfileInput } from "./brandingTypes";
import { buildBrandingPreview } from "./brandingPreviewBuilder";
import { resolveBrandingProfile } from "./brandingResolver";
import { buildChartTheme } from "./chartThemeBuilder";
import { buildCoverPage } from "./coverPageBuilder";
import { buildFooter } from "./footerBuilder";
import { buildTheme } from "./themeBuilder";

export function buildBrandingSystem(input?: BrandingProfileInput, manifest?: PackageManifest) {
  const resolved = resolveBrandingProfile(input, manifest);
  const profile = resolved.profile;
  return {
    profile,
    validation: resolved.validation,
    permissions: resolved.permissions,
    theme: buildTheme(profile),
    chartTheme: buildChartTheme(profile),
    coverPage: buildCoverPage(profile),
    footer: buildFooter(profile, !(manifest?.branding.exportAvailable)),
    preview: buildBrandingPreview(profile)
  };
}
