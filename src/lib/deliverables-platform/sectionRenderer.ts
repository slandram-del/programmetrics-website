import type { AnalyticsPlan } from "../analytics-engine";
import type { PackageManifest } from "../package-orchestrator";
import { buildVersionMetadata, type VersionMetadata } from "../versioning";
import { getSectionDefinition } from "./sectionRegistry";

export interface BrandingProfile {
  logoUrl?: string;
  organization?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  footer?: string;
  preparedFor?: string;
  preparedBy?: string;
  reportDate?: string;
  missionStatement?: string;
  website?: string;
}

export interface RenderedReportSection {
  id: string;
  title: string;
  description: string;
  order: number;
  contentBlocks: string[];
  dataRefs: string[];
  hidden?: boolean;
}

export interface SectionRenderContext {
  plan: AnalyticsPlan;
  manifest: PackageManifest;
  branding?: BrandingProfile;
  versionMetadata?: VersionMetadata;
}

function formatNumber(value: number): string {
  return value.toLocaleString();
}

export function renderSection(sectionId: string, context: SectionRenderContext): RenderedReportSection {
  const definition = getSectionDefinition(sectionId);
  const plan = context.plan;
  const version = context.versionMetadata || buildVersionMetadata();
  const organization = context.branding?.organization || "ProgramMetrics";
  const blocks: string[] = [];
  const refs: string[] = [];

  switch (definition.id) {
    case "cover":
      blocks.push(`${context.branding?.reportDate || new Date().toLocaleDateString()} | ${organization}`);
      blocks.push(context.branding?.preparedFor ? `Prepared for ${context.branding.preparedFor}` : "Prepared for review");
      blocks.push(context.branding?.preparedBy ? `Prepared by ${context.branding.preparedBy}` : "Prepared by ProgramMetrics");
      refs.push("branding", "packageManifest");
      break;
    case "executive-summary":
      blocks.push(`This report summarizes ${formatNumber(plan.datasetProfile.totalRecords)} records across ${formatNumber(plan.datasetProfile.totalFields)} fields.`);
      blocks.push(plan.qualityProfile.explanation);
      blocks.push(plan.confidenceProfile.explanation);
      refs.push("datasetProfile", "qualityProfile", "confidenceProfile");
      break;
    case "dataset-overview":
      blocks.push(`Dataset type: ${plan.datasetType.primaryType} (${Math.round(plan.datasetType.confidence * 100)}% confidence).`);
      blocks.push(`Detected ${plan.datasetProfile.detectedDateFields.length} date fields, ${plan.datasetProfile.detectedNumericFields.length} numeric fields, and ${plan.datasetProfile.detectedCategoricalFields.length} categorical fields.`);
      refs.push("datasetProfile", "datasetType");
      break;
    case "dataset-confidence":
      blocks.push(`Analytics confidence is ${plan.confidenceProfile.label} at ${plan.confidenceProfile.overallConfidence}.`);
      blocks.push(...plan.confidenceProfile.confidenceDrivers.slice(0, 3));
      blocks.push(...plan.confidenceProfile.confidenceConcerns.slice(0, 3));
      refs.push("confidenceProfile");
      break;
    case "quality-review":
      blocks.push(`Quality score: ${plan.qualityProfile.overallScore} (${plan.qualityProfile.grade}).`);
      blocks.push(...plan.qualityProfile.strengths.slice(0, 3));
      blocks.push(...plan.qualityProfile.concerns.slice(0, 3));
      refs.push("qualityProfile");
      break;
    case "missing-values":
      blocks.push(`${formatNumber(plan.missingProfile.missingRows)} rows contain at least one missing value.`);
      blocks.push(`${formatNumber(plan.missingProfile.missingCells)} missing cells were detected across ${formatNumber(plan.missingProfile.fieldsWithBlanks)} fields.`);
      blocks.push(plan.missingProfile.explanation);
      refs.push("missingProfile");
      break;
    case "duplicate-review":
      blocks.push(`${formatNumber(plan.duplicateProfile.exactDuplicateRows)} exact duplicate rows were detected.`);
      blocks.push(plan.duplicateProfile.explanation);
      refs.push("duplicateProfile");
      break;
    case "visual-analytics":
      blocks.push(`${plan.recommendedVisuals.length} visuals are recommended for this dataset.`);
      blocks.push(...plan.recommendedVisuals.slice(0, 5).map((visual) => `${visual.title}: ${visual.insight}`));
      refs.push("recommendedVisuals");
      break;
    case "descriptive-statistics":
      blocks.push(`${plan.descriptiveStats.numeric.length} numeric fields, ${plan.descriptiveStats.categorical.length} categorical fields, and ${plan.descriptiveStats.date.length} date fields have descriptive summaries.`);
      refs.push("descriptiveStats");
      break;
    case "key-findings":
      blocks.push(...plan.recommendedInsights.slice(0, 5).map((insight) => `${insight.title}: ${insight.text}`));
      refs.push("recommendedInsights");
      break;
    case "recommendations":
      blocks.push(...plan.recommendedInsights.slice(0, 5).map((insight) => insight.recommendedAction));
      blocks.push(...plan.qualityProfile.recommendations.slice(0, 3));
      refs.push("recommendedInsights", "qualityProfile");
      break;
    case "opportunities":
      blocks.push(...plan.recommendedVisuals.slice(0, 4).map((visual) => `Use ${visual.title} to support ${visual.tab}.`));
      refs.push("recommendedVisuals");
      break;
    case "warnings":
      blocks.push(...(plan.warnings.length ? plan.warnings : ["No major engine warnings were generated for this dataset."]));
      refs.push("warnings");
      break;
    case "methodology":
      blocks.push("ProgramMetrics assembled this report from Analytics Engine outputs, Analytics Intelligence outputs, and Package Orchestrator manifest rules.");
      blocks.push("This layer does not perform analytics calculations; it only organizes approved results into reusable report sections.");
      refs.push("analyticsPlan", "packageManifest");
      break;
    case "limitations":
      blocks.push(...(plan.assumptions.length ? plan.assumptions : ["Interpret results according to the uploaded file structure and available fields."]));
      refs.push("assumptions");
      break;
    case "data-dictionary":
      blocks.push(...plan.fieldProfiles.slice(0, 10).map((field) => `${field.displayLabel}: ${field.type}, ${field.role}, ${Math.round(100 - field.missingPercent)}% complete.`));
      refs.push("fieldProfiles");
      break;
    case "processing-notes":
      blocks.push("Uploaded files are processed in-session and should be downloaded before the session ends.");
      blocks.push(`Package: ${context.manifest.package.name}; Output level: ${context.manifest.outputLevel.name}.`);
      refs.push("packageManifest");
      break;
    case "version-metadata":
      blocks.push(`Analytics Engine v${version.analyticsEngineVersion}`);
      blocks.push(`Analytics Intelligence v${version.intelligenceEngineVersion}`);
      blocks.push(`Package Orchestrator v${version.packageOrchestratorVersion}`);
      blocks.push(`Deliverables Platform v${version.deliverablesPlatformVersion}`);
      blocks.push(`Generated ${version.generatedDate}`);
      refs.push("versionMetadata");
      break;
    default:
      blocks.push(definition.description);
      refs.push("packageManifest");
      break;
  }

  return {
    id: sectionId,
    title: definition.title,
    description: definition.description,
    order: definition.defaultOrder,
    contentBlocks: blocks.filter(Boolean),
    dataRefs: refs,
    hidden: definition.id === "version-metadata"
  };
}
