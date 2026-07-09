import type { BrandingProfile, CoverPageModel } from "./brandingTypes";

export function buildCoverPage(profile: BrandingProfile): CoverPageModel {
  return {
    style: profile.defaultCoverStyle,
    title: profile.reportTitle,
    subtitle: profile.reportSubtitle,
    organizationName: profile.organizationName,
    programName: profile.programName,
    preparedFor: profile.preparedFor,
    preparedBy: profile.preparedBy,
    reportDate: profile.reportDate || new Date().toISOString().slice(0, 10),
    confidentialityLabel: profile.confidentialFooter || "Confidential",
    primaryLogo: profile.primaryLogo,
    secondaryLogo: profile.secondaryLogo,
    accentColor: profile.accentColor
  };
}
