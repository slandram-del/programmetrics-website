import type { ApprovedFont } from "./brandingTypes";

export const approvedFonts: ApprovedFont[] = ["Inter", "Arial", "Georgia", "Times New Roman", "Calibri", "system sans-serif", "system serif"];

const fontStacks: Record<ApprovedFont, string> = {
  Inter: "Inter, Arial, sans-serif",
  Arial: "Arial, Helvetica, sans-serif",
  Georgia: "Georgia, 'Times New Roman', serif",
  "Times New Roman": "'Times New Roman', Times, serif",
  Calibri: "Calibri, Arial, sans-serif",
  "system sans-serif": "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  "system serif": "Georgia, 'Times New Roman', serif"
};

export function resolveApprovedFont(value: unknown, fallback: ApprovedFont = "Inter"): ApprovedFont {
  const match = approvedFonts.find((font) => font.toLowerCase() === String(value || "").trim().toLowerCase());
  return match || fallback;
}

export function buildTypographyTokens(headingFont: unknown, bodyFont: unknown) {
  const heading = resolveApprovedFont(headingFont, "Inter");
  const body = resolveApprovedFont(bodyFont, "Arial");
  return {
    display: fontStacks[heading],
    heading: fontStacks[heading],
    subheading: fontStacks[heading],
    body: fontStacks[body],
    caption: fontStacks[body],
    table: fontStacks[body],
    footer: fontStacks[body],
    titleSize: "32px",
    headingSize: "22px",
    bodySize: "16px"
  };
}
