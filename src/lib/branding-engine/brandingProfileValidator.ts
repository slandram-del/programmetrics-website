import type { BrandingProfile, BrandingValidationResult, ValidationMessage } from "./brandingTypes";
import { contrastRatio, isValidHexColor, readableTextColor } from "./colorPalette";
import { validateLogo } from "./logoProcessor";
import { approvedFonts } from "./typographyResolver";

export function validateBrandingProfile(profile: BrandingProfile): BrandingValidationResult {
  const messages: ValidationMessage[] = [];
  const colorFields: Array<keyof BrandingProfile> = ["primaryColor", "secondaryColor", "accentColor", "backgroundColor", "textColor"];
  colorFields.forEach((field) => {
    if (!isValidHexColor(String(profile[field] || ""))) messages.push({ field, severity: "error", message: `${field} must be a valid hex color.` });
  });
  if (contrastRatio(profile.textColor, profile.backgroundColor) < 4.5) {
    messages.push({ field: "textColor", severity: "warning", message: `Text/background contrast is low. Suggested text color: ${readableTextColor(profile.backgroundColor)}.` });
  }
  if (contrastRatio("#ffffff", profile.primaryColor) < 3 && contrastRatio("#0f172a", profile.primaryColor) < 3) {
    messages.push({ field: "primaryColor", severity: "warning", message: "Primary color may not provide enough contrast for labels or locked watermarks." });
  }
  if (!approvedFonts.includes(profile.headingFont)) messages.push({ field: "headingFont", severity: "error", message: "Heading font must be selected from approved web-safe fonts." });
  if (!approvedFonts.includes(profile.bodyFont)) messages.push({ field: "bodyFont", severity: "error", message: "Body font must be selected from approved web-safe fonts." });
  if (profile.contactEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(profile.contactEmail)) messages.push({ field: "contactEmail", severity: "warning", message: "Contact email does not look like a valid email address." });
  messages.push(...validateLogo(profile.primaryLogo, "primaryLogo"), ...validateLogo(profile.secondaryLogo, "secondaryLogo"));
  return { valid: !messages.some((message) => message.severity === "error"), messages };
}
