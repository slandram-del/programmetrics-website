import { brandingDefaults } from "../../config";
import type { BrandingConfig } from "../analytics-engine";
import { normalizeBrandingProfile, buildTheme } from "../branding-engine";
import { timeDiagnostic } from "../shared";

export function getDefaultBranding(): BrandingConfig {
  return { ...brandingDefaults };
}

export function buildBrandingSettings(branding?: BrandingConfig) {
  return timeDiagnostic("service", "brandingService.buildBrandingSettings", () => {
    const merged = { ...brandingDefaults, ...(branding || {}) };
    const profile = normalizeBrandingProfile(merged);
    return { profile, theme: buildTheme(profile) };
  });
}
