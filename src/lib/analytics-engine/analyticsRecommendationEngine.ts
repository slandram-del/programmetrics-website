import type { AnalyticsPlan, BrandingConfig, DataRow, SelectedLevel, SelectedPackage, SetupConfig } from "./types";
import { calculateAnalyticsConfidence } from "./analyticsConfidenceScore";
import { classifyDataset } from "./datasetClassifier";
import { profileDataset } from "./datasetProfiler";
import { analyzeDuplicates } from "./duplicateAnalyzer";
import { calculateDescriptiveStatistics } from "./descriptiveStatistics";
import { recommendDeliverables } from "./deliverableRecommendation";
import { profileFields } from "./fieldProfiler";
import { generateInsights } from "./insightGenerator";
import { recommendKpis } from "./kpiRecommendationEngine";
import { analyzeMissingValues } from "./missingValueAnalyzer";
import { calculateQualityScore } from "./qualityScoreEngine";
import { generateRecommendations } from "./recommendationGenerator";
import { prepareRows } from "./setupRows";
import { recommendVisuals } from "./visualRecommendationEngine";

export function generateAnalyticsPlan({
  rawRows,
  setupConfig = {},
  selectedPackage,
  selectedLevel,
  brandingConfig = {}
}: {
  rawRows: DataRow[] | unknown[][];
  setupConfig?: SetupConfig;
  selectedPackage?: string | SelectedPackage;
  selectedLevel?: string | SelectedLevel;
  brandingConfig?: BrandingConfig;
}): AnalyticsPlan {
  const prepared = prepareRows(rawRows, setupConfig);
  const fieldProfiles = profileFields(prepared.rows, { ...prepared.labelMap, ...(setupConfig.labelMap || {}) }, setupConfig);
  const datasetProfile = profileDataset(fieldProfiles, prepared.rows.length);
  const datasetType = classifyDataset(fieldProfiles);
  const missingProfile = analyzeMissingValues(prepared.rows, fieldProfiles, setupConfig);
  const duplicateProfile = analyzeDuplicates(prepared.rows, fieldProfiles);
  const descriptiveStats = calculateDescriptiveStatistics(prepared.rows, fieldProfiles, setupConfig);
  const qualityProfile = calculateQualityScore(datasetProfile, fieldProfiles, missingProfile, duplicateProfile, descriptiveStats);
  const warnings = fieldProfiles.flatMap((field) => field.warnings.map((warning) => `${field.displayLabel}: ${warning}`)).slice(0, 20);
  const confidenceProfile = calculateAnalyticsConfidence(datasetProfile, fieldProfiles, missingProfile, duplicateProfile, qualityProfile, datasetType, prepared.assumptions);
  const recommendedKpis = recommendKpis(datasetProfile, missingProfile, duplicateProfile, qualityProfile, confidenceProfile);
  const recommendedVisuals = recommendVisuals(datasetProfile, fieldProfiles, missingProfile, qualityProfile, descriptiveStats);
  const recommendedInsights = generateInsights(datasetProfile, fieldProfiles, datasetType, missingProfile, duplicateProfile, qualityProfile, confidenceProfile);
  generateRecommendations(recommendedInsights).forEach((recommendation) => warnings.includes(recommendation) ? null : null);

  return {
    datasetProfile,
    fieldProfiles,
    datasetType,
    qualityProfile,
    confidenceProfile,
    missingProfile,
    duplicateProfile,
    descriptiveStats,
    recommendedKpis,
    recommendedVisuals,
    recommendedInsights,
    recommendedDeliverables: recommendDeliverables(selectedPackage, selectedLevel),
    warnings,
    assumptions: [...prepared.assumptions, ...(Object.keys(brandingConfig).length ? [] : ["Branding defaults will be used until a branding profile is supplied."])]
  };
}
