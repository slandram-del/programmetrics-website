export const engineVersions = {
  analyticsEngineVersion: "1.0.0",
  intelligenceEngineVersion: "1.0.0",
  packageOrchestratorVersion: "1.0.0",
  deliverablesPlatformVersion: "1.0.0",
  brandingVersion: "1.0.0",
  reportGeneratorVersion: "1.0.0",
  exportEngineVersion: "1.0.0",
  programMetricsVersion: "1.0.0"
} as const;

export type EngineVersionKey = keyof typeof engineVersions;
