import type { AnalyticsPlan, DatasetTypeProfile } from "../analytics-engine";

export type AnalyticsPackageId =
  | "data-foundation"
  | "management-insights"
  | "professional-analytics"
  | "executive-intelligence"
  | "enterprise-intelligence";

export type OutputLevelId = "essential" | "professional" | "premium" | "executive";

export type PermissionStatus = "included" | "previewOnly" | "upgradeRequired" | "enterpriseOnly";

export type IndustryContext =
  | "survey"
  | "housing"
  | "behavioralHealth"
  | "education"
  | "healthcare"
  | "finance"
  | "crm"
  | "caseManagement"
  | "government"
  | "research"
  | "generic";

export interface PackageOrchestratorRequest {
  packageId: string;
  outputLevel: string;
  unlockedPackageId?: string;
  unlockedOutputLevel?: string;
  analyticsPlan?: AnalyticsPlan;
  datasetType?: DatasetTypeProfile;
  brandingRequested?: boolean;
}

export interface OutputLevelDefinition {
  id: OutputLevelId;
  name: string;
  rank: number;
  inherits: OutputLevelId[];
  description: string;
}

export interface DeliverableDefinition {
  id: string;
  name: string;
  description: string;
  format: "csv" | "xlsx" | "html" | "pdf" | "docx" | "pptx" | "png" | "svg" | "json" | "zip" | "txt";
  category: "data" | "report" | "dashboard" | "presentation" | "metadata" | "workflow" | "enterprise";
  minimumLevel: OutputLevelId;
  estimatedPages?: number;
  generationTime: string;
  thumbnail: string;
  sections: string[];
  exports: string[];
}

export interface DashboardDefinition {
  id: string;
  name: string;
  description: string;
  minimumLevel: OutputLevelId;
  sections: string[];
}

export interface PackageDefinition {
  id: AnalyticsPackageId;
  name: string;
  shortName: string;
  description: string;
  startingPrice: number | null;
  displayStartingPrice?: string;
  rank: number;
  deliverables: DeliverableDefinition[];
  dashboards: DashboardDefinition[];
  baseSections: string[];
  enterpriseCapabilities?: string[];
}

export interface DeliverableManifestItem extends DeliverableDefinition {
  included: boolean;
  previewAvailable: boolean;
  exportAvailable: boolean;
  locked: boolean;
  watermark: boolean;
  maxPreviewPages: number;
  maxPreviewCharts: number;
  permission: PermissionStatus;
  requiredPackageId: AnalyticsPackageId;
  requiredLevel: OutputLevelId;
}

export interface SectionManifestItem {
  id: string;
  title: string;
  included: boolean;
  previewAvailable: boolean;
  locked: boolean;
  source: "package" | "deliverable" | "industry" | "enterprise";
}

export interface DashboardManifestItem extends DashboardDefinition {
  included: boolean;
  previewAvailable: boolean;
  exportAvailable: boolean;
  locked: boolean;
  watermark: boolean;
}

export interface BrandingManifest {
  available: boolean;
  exportAvailable: boolean;
  requiredLevel: OutputLevelId;
  fields: string[];
  lockedFields: string[];
  defaultsApplied: string[];
}

export interface IndustryManifest {
  context: IndustryContext;
  confidence: number;
  optionalSections: SectionManifestItem[];
  recommendedDashboards: string[];
}

export interface PermissionManifest {
  status: PermissionStatus;
  includedFeatures: string[];
  previewOnlyFeatures: string[];
  lockedFeatures: string[];
  enterpriseOnlyFeatures: string[];
}

export interface CheckoutManifest {
  selectedPrice: number | null;
  upgradePrice: number | null;
  packageComparison: Array<{ packageId: AnalyticsPackageId; name: string; startingPrice: number | null; available: boolean }>;
  availableUpgrades: Array<{ packageId: AnalyticsPackageId; level: OutputLevelId; label: string; price: number | null }>;
}

export interface PackageManifest {
  package: PackageDefinition;
  outputLevel: OutputLevelDefinition;
  inheritedLevels: OutputLevelDefinition[];
  deliverables: DeliverableManifestItem[];
  reportSections: SectionManifestItem[];
  dashboards: DashboardManifestItem[];
  exports: string[];
  branding: BrandingManifest;
  industry: IndustryManifest;
  lockedFeatures: string[];
  previewFeatures: string[];
  permissions: PermissionManifest;
  checkout: CheckoutManifest;
  futureEnterpriseSupport: string[];
  generatedAt: string;
}
