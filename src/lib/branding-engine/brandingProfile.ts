import type { BrandingConfig } from "../analytics-engine";

export function normalizeBrandingProfile(branding: BrandingConfig = {}): BrandingConfig {
  // TODO: Validate logos, fonts, and color tokens.
  return { primaryColor: "#12bfae", accentColor: "#2563eb", ...branding };
}
