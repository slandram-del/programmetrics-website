import type { BrandingConfig } from "../analytics-engine";

export function buildTheme(branding: BrandingConfig = {}) {
  // TODO: Convert branding profiles into dashboard, PDF, DOCX, and PPTX theme tokens.
  return { primaryColor: branding.primaryColor || "#12bfae", accentColor: branding.accentColor || "#2563eb" };
}
