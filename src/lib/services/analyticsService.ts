import type { AnalyticsStudioRequest, AnalyticsStudioResponse } from "../platform";
import { createAnalyticsStudioResponse } from "../platform";
import { AnalyticsError, timeDiagnostic } from "../shared";

export interface AnalyticsService {
  analyze(request: AnalyticsStudioRequest): AnalyticsStudioResponse;
}

export const analyticsService: AnalyticsService = {
  analyze(request) {
    return timeDiagnostic("service", "analyticsService.analyze", () => {
      try {
        return createAnalyticsStudioResponse(request);
      } catch (error) {
        throw new AnalyticsError("ProgramMetrics could not analyze the uploaded dataset.", { service: "analyticsService" }, error);
      }
    }, { rowSource: Array.isArray(request.rawRows) ? "in-memory" : "unknown" });
  }
};

export function analyzeDataset(request: AnalyticsStudioRequest): AnalyticsStudioResponse {
  return analyticsService.analyze(request);
}
