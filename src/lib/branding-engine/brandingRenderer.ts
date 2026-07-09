import type { BrandingProfile } from "./brandingTypes";
import { buildBrandingPreview } from "./brandingPreviewBuilder";
import { buildTheme } from "./themeBuilder";

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
}

export function renderBrandingHeader(profile: BrandingProfile): string {
  const theme = buildTheme(profile);
  return `<header class="pm-branded-header" style="border-top:${theme.reportHeader.borderTop};font-family:${escapeHtml(theme.typography.heading)}"><h1>${escapeHtml(profile.reportTitle)}</h1><p>${escapeHtml(profile.organizationName)}</p></header>`;
}

export function renderBrandingPreviewHtml(profile: BrandingProfile): string {
  const preview = buildBrandingPreview(profile);
  return `<section class="pm-brand-preview"><h2>${escapeHtml(preview.dashboardHeader.title)}</h2><p>${escapeHtml(preview.dashboardHeader.organization)}</p><div>${preview.chartCard.palette.map((color) => `<span style="background:${escapeHtml(color)}"></span>`).join("")}</div><footer>${escapeHtml(preview.footer.copyright)}</footer></section>`;
}
