export type StabilizationTestArea = "analytics" | "intelligence" | "orchestrator" | "deliverables" | "performance" | "security" | "accessibility" | "regression";

export interface StabilizationTestCase {
  id: string;
  area: StabilizationTestArea;
  target: string;
  assertion: string;
  priority: "critical" | "high" | "medium";
  status: "planned" | "manual" | "automatable";
}

export const stabilizationTestPlan: StabilizationTestCase[] = [
  { id: "analytics-missing-001", area: "analytics", target: "missingValueAnalyzer", assertion: "Missing rows, missing cells, fields with blanks, and missing percent match engine definitions after setup rows are omitted.", priority: "critical", status: "automatable" },
  { id: "analytics-duplicate-001", area: "analytics", target: "duplicateAnalyzer", assertion: "Exact duplicate rows are counted without treating omitted metadata rows as data.", priority: "high", status: "automatable" },
  { id: "analytics-quality-001", area: "analytics", target: "qualityScoreEngine", assertion: "Quality score returns a bounded score, grade, strengths, concerns, and recommendations.", priority: "critical", status: "automatable" },
  { id: "intelligence-summary-001", area: "intelligence", target: "Analytics Intelligence", assertion: "Executive narratives reference only evidence available in AnalyticsPlan outputs.", priority: "critical", status: "automatable" },
  { id: "orchestrator-permission-001", area: "orchestrator", target: "Package Orchestrator", assertion: "Output levels inherit lower levels and locked deliverables remain previewable but export-disabled.", priority: "critical", status: "automatable" },
  { id: "deliverables-preview-001", area: "deliverables", target: "Deliverables Platform", assertion: "Each ProfessionalReport includes reusable sections, preview metadata, lock flags, and version metadata.", priority: "critical", status: "automatable" },
  { id: "performance-large-001", area: "performance", target: "Studio preview", assertion: "Datasets at 10k+ rows use sampled previews, aggregate charts, and avoid storing unnecessary full-detail render objects.", priority: "high", status: "manual" },
  { id: "security-ip-001", area: "security", target: "Public UI/docs", assertion: "Customer-facing surfaces do not expose formulas, weights, recommendation heuristics, or package inheritance logic.", priority: "critical", status: "manual" },
  { id: "accessibility-keyboard-001", area: "accessibility", target: "Interactive Preview", assertion: "Upload, setup, package selection, tabs, KPI panels, and preview controls are keyboard reachable with visible focus.", priority: "high", status: "manual" },
  { id: "regression-studio-001", area: "regression", target: "Studio flow", assertion: "Upload file -> data setup -> package selection -> output level -> generate preview -> interactive preview continues to work.", priority: "critical", status: "manual" }
];

export function listStabilizationTests(area?: StabilizationTestArea): StabilizationTestCase[] {
  return area ? stabilizationTestPlan.filter((test) => test.area === area) : stabilizationTestPlan;
}
