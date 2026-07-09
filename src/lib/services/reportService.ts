import type { AnalyticsPlan } from "../analytics-engine";
import { buildExecutiveReport, buildHtmlDashboard, buildPdfReport, buildPowerPoint, buildWordReport, buildZipPackage } from "../report-engine";
import { ReportGenerationError, timeDiagnostic } from "../shared";

export type ReportOutputType = "executive" | "html" | "pdf" | "docx" | "pptx" | "zip";

export function buildReportOutput(plan: AnalyticsPlan, outputType: ReportOutputType) {
  return timeDiagnostic("service", "reportService.buildReportOutput", () => {
    try {
      switch (outputType) {
        case "executive": return buildExecutiveReport(plan);
        case "html": return buildHtmlDashboard(plan);
        case "pdf": return buildPdfReport(plan);
        case "docx": return buildWordReport(plan);
        case "pptx": return buildPowerPoint(plan);
        case "zip": return buildZipPackage(plan);
        default: throw new ReportGenerationError("Unsupported report output type.", { outputType });
      }
    } catch (error) {
      if (error instanceof ReportGenerationError) throw error;
      throw new ReportGenerationError("ProgramMetrics could not build the requested report output.", { outputType }, error);
    }
  }, { outputType });
}
