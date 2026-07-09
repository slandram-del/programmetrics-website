import type { BrandTheme, BrandingProfile } from "./brandingTypes";
import { generateChartPalette, shade, tint } from "./colorPalette";
import { buildTypographyTokens } from "./typographyResolver";

export function buildTheme(profile: BrandingProfile): BrandTheme {
  const chartPalette = generateChartPalette(profile.primaryColor, profile.secondaryColor, profile.accentColor);
  return {
    colors: {
      primary: profile.primaryColor,
      secondary: profile.secondaryColor,
      accent: profile.accentColor,
      background: profile.backgroundColor,
      surface: "#ffffff",
      text: profile.textColor,
      mutedText: "#53647f",
      border: tint(profile.secondaryColor, 0.78),
      focus: profile.accentColor,
      watermark: tint(profile.primaryColor, 0.72)
    },
    typography: buildTypographyTokens(profile.headingFont, profile.bodyFont),
    spacing: { xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "36px" },
    borderRadius: "8px",
    shadows: { card: "0 18px 42px rgba(15, 23, 42, 0.08)", panel: "0 22px 60px rgba(15, 23, 42, 0.12)" },
    chartPalette,
    reportHeader: { borderTop: `6px solid ${profile.primaryColor}`, background: profile.backgroundColor, color: profile.textColor },
    reportFooter: { borderTop: `1px solid ${tint(profile.secondaryColor, 0.72)}`, color: shade(profile.secondaryColor, 0.08) }
  };
}
