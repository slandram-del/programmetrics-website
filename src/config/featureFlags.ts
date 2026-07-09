export const featureFlags = {
  advancedAnalytics: true,
  executiveNarrative: true,
  forecasting: false,
  brandingProfiles: true,
  industryTemplates: false,
  aiAnalyst: false,
  enterpriseFeatures: false,
  serverSideEngines: false,
  diagnosticsOverlay: false
} as const;

export type FeatureFlagName = keyof typeof featureFlags;

export function isFeatureEnabled(flag: FeatureFlagName): boolean {
  return Boolean(featureFlags[flag]);
}
