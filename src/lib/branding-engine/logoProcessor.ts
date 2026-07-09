import type { BrandAsset, ValidationMessage } from "./brandingTypes";

const allowedLogoTypes = new Set(["image/png", "image/jpeg", "image/jpg"]);
const svgType = "image/svg+xml";
const maxLogoSizeBytes = 2 * 1024 * 1024;

export function validateLogo(asset: BrandAsset | undefined, field = "logo"): ValidationMessage[] {
  if (!asset) return [];
  const messages: ValidationMessage[] = [];
  const mimeType = String(asset.mimeType || "").toLowerCase();
  if (mimeType === svgType) {
    messages.push({ field, severity: "warning", message: "SVG logos require sanitization before rendering. Use PNG or JPG until SVG sanitization is enabled." });
  } else if (mimeType && !allowedLogoTypes.has(mimeType)) {
    messages.push({ field, severity: "error", message: "Logo must be PNG or JPG for safe preview rendering." });
  }
  if ((asset.sizeBytes || 0) > maxLogoSizeBytes) messages.push({ field, severity: "error", message: "Logo file is larger than 2 MB. Upload a smaller image for report previews." });
  if (asset.width && asset.height && (asset.width < 120 || asset.height < 60)) messages.push({ field, severity: "warning", message: "Logo dimensions look small and may appear blurry in exports." });
  if (asset.dataUrl && /^data:image\/svg/i.test(asset.dataUrl)) messages.push({ field, severity: "warning", message: "SVG data URLs are not rendered until sanitization is available." });
  return messages;
}

export function sanitizeLogoForPreview(asset: BrandAsset | undefined): BrandAsset | undefined {
  if (!asset) return undefined;
  const mimeType = String(asset.mimeType || "").toLowerCase();
  if (mimeType === svgType || /^data:image\/svg/i.test(String(asset.dataUrl || ""))) return { ...asset, dataUrl: undefined };
  return asset;
}
