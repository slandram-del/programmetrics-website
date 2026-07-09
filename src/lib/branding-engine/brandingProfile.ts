import { brandingDefaults } from "../../config";
import type { BrandingProfile, BrandingProfileInput } from "./brandingTypes";
import { normalizeHexColor, suggestAccessibleTextColor } from "./colorPalette";
import { sanitizeLogoForPreview } from "./logoProcessor";
import { resolveApprovedFont } from "./typographyResolver";

function now(): string {
  return new Date().toISOString();
}

function text(value: unknown, fallback = ""): string {
  return String(value || fallback).trim();
}

function resolveCoverStyle(value: unknown): BrandingProfile["defaultCoverStyle"] {
  const normalized = text(value, "modern").toLowerCase().replace(/\s+/g, "-");
  if (normalized === "minimal" || normalized === "executive" || normalized === "modern" || normalized === "government-report") return normalized;
  return "modern";
}

function resolveChartTheme(value: unknown): BrandingProfile["chartTheme"] {
  const normalized = text(value, "professional").toLowerCase();
  if (normalized === "executive" || normalized === "high-contrast" || normalized === "print-friendly" || normalized === "professional") return normalized;
  return "professional";
}

export function normalizeBrandingProfile(input: BrandingProfileInput = {}): BrandingProfile {
  const createdAt = text(input.createdAt) || now();
  const backgroundColor = normalizeHexColor(input.backgroundColor as string, "#ffffff");
  const textColor = suggestAccessibleTextColor(normalizeHexColor(input.textColor as string, "#0f172a"), backgroundColor);
  const organizationName = text(input.organizationName || input.organization || input.reportName, brandingDefaults.organizationName);
  const reportTitle = text(input.reportTitle || input.reportName, brandingDefaults.reportTitle);

  return {
    id: text(input.id, "session-brand-profile"),
    profileName: text(input.profileName, organizationName || "ProgramMetrics Default"),
    organizationName,
    programName: text(input.programName),
    reportTitle,
    reportSubtitle: text(input.reportSubtitle || input.subtitle),
    preparedFor: text(input.preparedFor),
    preparedBy: text(input.preparedBy),
    reportDate: text(input.reportDate) || new Date().toISOString().slice(0, 10),
    primaryLogo: sanitizeLogoForPreview(input.primaryLogo as BrandingProfile["primaryLogo"] || (input.logoDataUrl ? { dataUrl: String(input.logoDataUrl), altText: `${organizationName} logo` } : undefined)),
    secondaryLogo: sanitizeLogoForPreview(input.secondaryLogo as BrandingProfile["secondaryLogo"]),
    primaryColor: normalizeHexColor(input.primaryColor as string, brandingDefaults.primaryColor),
    secondaryColor: normalizeHexColor(input.secondaryColor as string, brandingDefaults.secondaryColor),
    accentColor: normalizeHexColor(input.accentColor as string, brandingDefaults.accentColor),
    backgroundColor,
    textColor,
    headingFont: resolveApprovedFont(input.headingFont || input.font, "Inter"),
    bodyFont: resolveApprovedFont(input.bodyFont || input.font, "Arial"),
    confidentialFooter: text(input.confidentialFooter, "Confidential - prepared for authorized review"),
    contactName: text(input.contactName || input.contact),
    contactEmail: text(input.contactEmail),
    phone: text(input.phone),
    website: text(input.website),
    address: text(input.address),
    missionStatement: text(input.missionStatement || input.mission),
    executiveSummaryNotes: text(input.executiveSummaryNotes || input.executiveNotes),
    defaultReportFooter: text(input.defaultReportFooter || input.footerNote, brandingDefaults.confidentialFooter),
    defaultCoverStyle: resolveCoverStyle(input.defaultCoverStyle || input.style),
    chartTheme: resolveChartTheme(input.chartTheme),
    createdAt,
    updatedAt: text(input.updatedAt) || now()
  };
}

export const programMetricsBrandProfile = normalizeBrandingProfile({
  id: "programmetrics-default",
  profileName: "ProgramMetrics Default",
  organizationName: "ProgramMetrics",
  reportTitle: "ProgramMetrics Analytics Report",
  reportSubtitle: "Professional analytics deliverable",
  primaryColor: brandingDefaults.primaryColor,
  secondaryColor: brandingDefaults.secondaryColor,
  accentColor: brandingDefaults.accentColor,
  defaultReportFooter: "Copyright (c) 2026 ProgramMetrics. All Rights Reserved."
});
