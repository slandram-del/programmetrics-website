import { engineVersions } from "./engineVersions";

export interface VersionMetadata {
  analyticsEngineVersion: string;
  intelligenceEngineVersion: string;
  packageOrchestratorVersion: string;
  deliverablesPlatformVersion: string;
  brandingVersion: string;
  reportGeneratorVersion: string;
  exportEngineVersion: string;
  generatedDate: string;
  programMetricsVersion: string;
}

export function buildVersionMetadata(generatedDate = new Date().toISOString()): VersionMetadata {
  return {
    analyticsEngineVersion: engineVersions.analyticsEngineVersion,
    intelligenceEngineVersion: engineVersions.intelligenceEngineVersion,
    packageOrchestratorVersion: engineVersions.packageOrchestratorVersion,
    deliverablesPlatformVersion: engineVersions.deliverablesPlatformVersion,
    brandingVersion: engineVersions.brandingVersion,
    reportGeneratorVersion: engineVersions.reportGeneratorVersion,
    exportEngineVersion: engineVersions.exportEngineVersion,
    generatedDate,
    programMetricsVersion: engineVersions.programMetricsVersion
  };
}
