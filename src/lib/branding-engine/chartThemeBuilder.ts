import type { BrandingProfile, ChartTheme } from "./brandingTypes";
import { generateChartPalette, shade, tint } from "./colorPalette";

export function buildChartTheme(profile: BrandingProfile): ChartTheme {
  const palette = generateChartPalette(profile.primaryColor, profile.secondaryColor, profile.accentColor);
  return {
    palette,
    axisText: profile.textColor,
    grid: tint(profile.secondaryColor, 0.82),
    tooltipBackground: shade(profile.secondaryColor, 0.1),
    tooltipText: "#ffffff",
    legendText: profile.textColor,
    missingValueColor: "#f59e0b",
    warningColor: "#dc2626",
    positiveColor: "#10b981",
    neutralColor: "#64748b",
    printPalette: ["#111827", "#4b5563", "#6b7280", "#9ca3af", "#d1d5db"]
  };
}
