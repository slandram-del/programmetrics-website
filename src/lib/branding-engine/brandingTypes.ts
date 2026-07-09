export type CoverStyle = "minimal" | "executive" | "modern" | "government-report";
export type ChartThemeName = "professional" | "executive" | "high-contrast" | "print-friendly";
export type ApprovedFont = "Inter" | "Arial" | "Georgia" | "Times New Roman" | "Calibri" | "system sans-serif" | "system serif";

export interface BrandAsset {
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
  dataUrl?: string;
  altText?: string;
}

export interface BrandingProfile {
  id: string;
  profileName: string;
  organizationName: string;
  programName?: string;
  reportTitle: string;
  reportSubtitle?: string;
  preparedFor?: string;
  preparedBy?: string;
  reportDate?: string;
  primaryLogo?: BrandAsset;
  secondaryLogo?: BrandAsset;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: ApprovedFont;
  bodyFont: ApprovedFont;
  confidentialFooter?: string;
  contactName?: string;
  contactEmail?: string;
  phone?: string;
  website?: string;
  address?: string;
  missionStatement?: string;
  executiveSummaryNotes?: string;
  defaultReportFooter: string;
  defaultCoverStyle: CoverStyle;
  chartTheme: ChartThemeName;
  createdAt: string;
  updatedAt: string;
}

export type BrandingProfileInput = Partial<BrandingProfile> & Record<string, unknown>;

export interface ValidationMessage {
  field: string;
  severity: "error" | "warning" | "info";
  message: string;
}

export interface BrandingValidationResult {
  valid: boolean;
  messages: ValidationMessage[];
}

export interface BrandTheme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    mutedText: string;
    border: string;
    focus: string;
    watermark: string;
  };
  typography: {
    display: string;
    heading: string;
    subheading: string;
    body: string;
    caption: string;
    table: string;
    footer: string;
    titleSize: string;
    headingSize: string;
    bodySize: string;
  };
  spacing: Record<string, string>;
  borderRadius: string;
  shadows: Record<string, string>;
  chartPalette: string[];
  reportHeader: Record<string, string>;
  reportFooter: Record<string, string>;
}

export interface ChartTheme {
  palette: string[];
  axisText: string;
  grid: string;
  tooltipBackground: string;
  tooltipText: string;
  legendText: string;
  missingValueColor: string;
  warningColor: string;
  positiveColor: string;
  neutralColor: string;
  printPalette: string[];
}

export interface CoverPageModel {
  style: CoverStyle;
  title: string;
  subtitle?: string;
  organizationName: string;
  programName?: string;
  preparedFor?: string;
  preparedBy?: string;
  reportDate: string;
  confidentialityLabel: string;
  primaryLogo?: BrandAsset;
  secondaryLogo?: BrandAsset;
  accentColor: string;
}

export interface FooterModel {
  organizationName: string;
  confidentialityLabel: string;
  reportDate: string;
  pageNumberPlaceholder: string;
  attribution: string;
  copyright: string;
  contact?: string;
}

export interface BrandingPreviewModel {
  dashboardHeader: Record<string, string>;
  kpiCard: Record<string, string>;
  chartCard: Record<string, string | string[]>;
  reportCover: CoverPageModel;
  sectionHeading: Record<string, string>;
  footer: FooterModel;
  views: Array<{ id: string; label: string; description: string }>;
  validation: BrandingValidationResult;
  theme: BrandTheme;
}
