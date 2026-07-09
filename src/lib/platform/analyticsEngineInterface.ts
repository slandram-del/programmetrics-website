import { buildAnalyticsIntelligence, generateAnalyticsPlan, type AnalyticsIntelligence, type AnalyticsPlan, type BrandingConfig, type DataRow, type SelectedLevel, type SelectedPackage, type SetupConfig } from "../analytics-engine";
import { buildDashboard, type BuiltDashboard, type DashboardBuildOptions } from "../chart-engine";
import { PROTECTED_ARCHITECTURE_NOTICE } from "./protectedServices";

export interface AnalyticsStudioRequest {
  rawRows: DataRow[] | unknown[][];
  setupConfig?: SetupConfig;
  selectedPackage?: string | SelectedPackage;
  selectedLevel?: string | SelectedLevel;
  brandingConfig?: BrandingConfig;
  locked?: boolean;
  dashboardOptions?: Omit<DashboardBuildOptions, "locked">;
}

export interface AnalyticsStudioResponse {
  analyticsPlan: AnalyticsPlan;
  kpis: AnalyticsPlan["recommendedKpis"];
  visuals: AnalyticsPlan["recommendedVisuals"];
  insights: AnalyticsPlan["recommendedInsights"];
  deliverables: AnalyticsPlan["recommendedDeliverables"];
  qualityProfile: AnalyticsPlan["qualityProfile"];
  confidenceProfile: AnalyticsPlan["confidenceProfile"];
  intelligence: AnalyticsIntelligence;
  dashboard: BuiltDashboard;
  protectedNotice: string;
}

export interface PublicAnalyticsSummary {
  recordCount: number;
  fieldCount: number;
  missingCells: number;
  missingPercent: number;
  qualityScore: number;
  confidenceScore: number;
  confidenceLabel: AnalyticsPlan["confidenceProfile"]["label"];
  datasetType: AnalyticsPlan["datasetType"]["primaryType"];
  insights: string[];
  warnings: string[];
}

export function createAnalyticsStudioResponse(request: AnalyticsStudioRequest): AnalyticsStudioResponse {
  const analyticsPlan = generateAnalyticsPlan({
    rawRows: request.rawRows,
    setupConfig: request.setupConfig,
    selectedPackage: request.selectedPackage,
    selectedLevel: request.selectedLevel,
    brandingConfig: request.brandingConfig
  });

  const intelligence = buildAnalyticsIntelligence(analyticsPlan);
  const dashboard = buildDashboard(analyticsPlan, {
    ...(request.dashboardOptions || {}),
    locked: request.locked
  });

  return {
    analyticsPlan,
    kpis: analyticsPlan.recommendedKpis,
    visuals: analyticsPlan.recommendedVisuals,
    insights: analyticsPlan.recommendedInsights,
    deliverables: analyticsPlan.recommendedDeliverables,
    qualityProfile: analyticsPlan.qualityProfile,
    confidenceProfile: analyticsPlan.confidenceProfile,
    intelligence,
    dashboard,
    protectedNotice: PROTECTED_ARCHITECTURE_NOTICE
  };
}

export function createPublicAnalyticsSummary(plan: AnalyticsPlan): PublicAnalyticsSummary {
  return {
    recordCount: plan.datasetProfile.totalRecords,
    fieldCount: plan.datasetProfile.totalFields,
    missingCells: plan.missingProfile.missingCells,
    missingPercent: plan.missingProfile.missingPercent,
    qualityScore: plan.qualityProfile.overallScore,
    confidenceScore: plan.confidenceProfile.overallConfidence,
    confidenceLabel: plan.confidenceProfile.label,
    datasetType: plan.datasetType.primaryType,
    insights: plan.recommendedInsights.map((insight) => insight.text),
    warnings: plan.warnings
  };
}
