import type { BrandingPreviewModel, BrandingProfile } from "./brandingTypes";
import { validateBrandingProfile } from "./brandingProfileValidator";
import { buildChartTheme } from "./chartThemeBuilder";
import { buildCoverPage } from "./coverPageBuilder";
import { buildFooter } from "./footerBuilder";
import { buildTheme } from "./themeBuilder";

export function buildBrandingPreview(profile: BrandingProfile): BrandingPreviewModel {
  const theme = buildTheme(profile);
  const chartTheme = buildChartTheme(profile);
  return {
    dashboardHeader: { title: profile.reportTitle, subtitle: profile.reportSubtitle || "Dashboard preview", organization: profile.organizationName, primaryColor: profile.primaryColor },
    kpiCard: { label: "Example KPI", value: "92%", accentColor: profile.accentColor, textColor: profile.textColor },
    chartCard: { title: "Example Chart", palette: chartTheme.palette.slice(0, 5), axisText: chartTheme.axisText, grid: chartTheme.grid },
    reportCover: buildCoverPage(profile),
    sectionHeading: { title: "Section Heading", font: theme.typography.heading, color: profile.primaryColor },
    footer: buildFooter(profile),
    views: [
      { id: "dashboard", label: "Dashboard", description: "Header, KPI, chart card, and dashboard footer." },
      { id: "executive-report", label: "Executive report", description: "Cover, section heading, narrative block, and footer." },
      { id: "powerpoint", label: "PowerPoint title slide", description: "Title slide-ready logo, title, subtitle, and accent design." },
      { id: "word-report", label: "Word report", description: "Editable report heading and footer tokens." },
      { id: "chart-image", label: "Chart image", description: "Chart palette, axis, legend, and tooltip styling." }
    ],
    validation: validateBrandingProfile(profile),
    theme
  };
}
