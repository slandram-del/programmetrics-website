import type { AnalyticsStudioRequest, AnalyticsStudioResponse } from "../platform";
import { analyzeDataset } from "./analyticsService";
import { timeDiagnostic } from "../shared";

export interface PreviewRequest extends AnalyticsStudioRequest {
  previewOnly?: boolean;
}

export interface PreviewResponse extends AnalyticsStudioResponse {
  previewOnly: boolean;
  watermark?: string;
}

export function buildPreview(request: PreviewRequest): PreviewResponse {
  return timeDiagnostic("service", "previewService.buildPreview", () => {
    const response = analyzeDataset(request);
    return {
      ...response,
      previewOnly: request.previewOnly ?? Boolean(request.locked),
      watermark: request.locked ? "ProgramMetrics Preview" : undefined
    };
  });
}
