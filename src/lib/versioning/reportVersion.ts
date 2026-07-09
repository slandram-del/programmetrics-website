import { buildVersionMetadata, type VersionMetadata } from "./versionMetadata";

export interface ReportVersionEnvelope {
  reportId: string;
  reportType: string;
  version: VersionMetadata;
}

export function buildReportVersion(reportId: string, reportType: string): ReportVersionEnvelope {
  return {
    reportId,
    reportType,
    version: buildVersionMetadata()
  };
}
