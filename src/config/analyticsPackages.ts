export type OutputLevelId = "essential" | "professional" | "premium" | "complete" | "executive" | "custom";
export type AnalyticsPackageId = "data-foundation" | "management-insights" | "professional-analytics" | "executive-intelligence" | "enterprise-intelligence";

export interface OutputLevelConfig {
  id: OutputLevelId;
  name: string;
  price: number | null;
  displayPrice?: string;
  deliverables: string[];
  exports: string[];
  insightPromise: string;
}

export interface AnalyticsPackageConfig {
  id: AnalyticsPackageId;
  name: string;
  shortName: string;
  startingPrice: number | null;
  displayStartingPrice?: string;
  description: string;
  bestFor: string[];
  previewFocus: string;
  levels: OutputLevelConfig[];
}

export const analyticsPackages: AnalyticsPackageConfig[] = [
  {
    id: "data-foundation",
    name: "Data Foundation Package",
    shortName: "Data Foundation",
    startingPrice: 49,
    description: "Prepare messy files for reliable reporting.",
    bestFor: ["cleaned data", "missing values", "duplicates", "data dictionary"],
    previewFocus: "Clean data readiness, validation, missingness, duplicates, data dictionary, and reporting foundation.",
    levels: [
      { id: "essential", name: "Essential", price: 49, deliverables: ["Clean CSV", "Missing value report", "Duplicate report", "Data quality score", "Validation summary"], exports: ["csv", "missing_csv", "duplicate_csv", "json", "summary"], insightPromise: "Identify core data issues." },
      { id: "professional", name: "Professional", price: 59, deliverables: ["Excel workbook", "Data dictionary", "Missing value coding report", "Field type analysis", "Cleaning recommendations"], exports: ["xlsx", "dictionary_xlsx", "missing_csv", "json", "summary"], insightPromise: "Prepare reporting-ready structure." },
      { id: "premium", name: "Premium", price: 69, deliverables: ["Interactive cleaning dashboard", "Before/after comparisons", "Downloadable quality report", "Data profile report", "Branded PDF summary"], exports: ["html", "pdf", "png", "json", "summary"], insightPromise: "Package data readiness for review." },
      { id: "complete", name: "Complete", price: 79, deliverables: ["Interactive HTML dashboard", "Executive data quality summary", "Audit trail", "Processing log", "ZIP package"], exports: ["zip", "html", "pdf", "csv", "missing_csv", "duplicate_csv", "dictionary_xlsx", "json", "summary"], insightPromise: "Export a complete data foundation package." }
    ]
  },
  {
    id: "management-insights",
    name: "Management Insights Package",
    shortName: "Management Insights",
    startingPrice: 199,
    description: "Turn uploaded files into dashboard-ready management views.",
    bestFor: ["KPIs", "dashboards", "executive PDF", "recommendations"],
    previewFocus: "Executive dashboards, KPIs, top categories, trends, management narrative, and recommendations.",
    levels: [
      { id: "essential", name: "Essential", price: 199, deliverables: ["Interactive dashboard", "Executive PDF", "Word report", "KPI summary", "Dashboard images"], exports: ["html", "pdf", "docx", "png", "summary"], insightPromise: "Create the first management dashboard." },
      { id: "professional", name: "Professional", price: 229, deliverables: ["Multiple dashboard pages", "Additional charts", "Organization branding", "Executive summary", "Recommendations"], exports: ["html", "pdf", "docx", "pptx", "png", "json"], insightPromise: "Expand dashboards and recommendations." },
      { id: "premium", name: "Premium", price: 249, deliverables: ["Presentation graphics", "Executive infographic", "Dashboard thumbnails", "Interactive navigation", "Expanded analytics"], exports: ["zip", "html", "pdf", "docx", "pptx", "png", "json"], insightPromise: "Prepare presentation-ready management outputs." }
    ]
  },
  {
    id: "professional-analytics",
    name: "Professional Analytics Package",
    shortName: "Professional Analytics",
    startingPrice: 499,
    description: "Add deeper statistical analysis and advanced reporting.",
    bestFor: ["statistics", "trends", "outliers", "forecast previews"],
    previewFocus: "Descriptive statistics, advanced trends, outlier review, forecasts, correlations, and statistical appendix.",
    levels: [
      { id: "essential", name: "Essential", price: 499, deliverables: ["Statistical analysis", "Trend analysis", "Forecasts", "Descriptive statistics", "Recommendations"], exports: ["html", "pdf", "xlsx", "json", "summary"], insightPromise: "Add statistical readiness and trend interpretation." },
      { id: "professional", name: "Professional", price: 599, deliverables: ["Correlation analysis", "Advanced charts", "Outlier review", "Benchmark comparisons", "Expanded narrative"], exports: ["zip", "html", "pdf", "docx", "xlsx", "png", "json"], insightPromise: "Generate deeper analytical reporting." },
      { id: "premium", name: "Premium", price: 699, deliverables: ["Predictive insights", "Multi-page analytics workbook", "Advanced statistical appendix", "Publication-quality graphics", "Reusable workflow template"], exports: ["zip", "html", "pdf", "docx", "pptx", "xlsx", "png", "json", "summary"], insightPromise: "Prepare a professional analytics package." }
    ]
  },
  {
    id: "executive-intelligence",
    name: "Executive Intelligence Suite",
    shortName: "Executive Intelligence",
    startingPrice: 1999,
    description: "Create board-ready executive analytics deliverables.",
    bestFor: ["board reports", "PowerPoint", "AI narrative", "complete ZIP package"],
    previewFocus: "AI executive narrative, PowerPoint, executive dashboards, publication graphics, metadata, processing audit, and complete ZIP packages.",
    levels: [
      { id: "essential", name: "Essential", price: 1999, deliverables: ["Board-ready dashboard", "Executive PDF", "PowerPoint", "Word report", "HTML dashboard", "AI Executive Narrative"], exports: ["zip", "html", "pdf", "docx", "pptx", "png", "json"], insightPromise: "Create board-ready executive deliverables." },
      { id: "professional", name: "Professional", price: 2499, deliverables: ["Executive briefing", "Board presentation", "Strategic recommendations", "Advanced branding", "Multi-report package"], exports: ["zip", "html", "pdf", "docx", "pptx", "xlsx", "png", "json"], insightPromise: "Expand executive narrative and strategy." },
      { id: "premium", name: "Premium", price: 2999, deliverables: ["Publication graphics", "Enhanced executive storytelling", "Multiple dashboard themes", "Presentation-ready visuals", "Expanded appendix"], exports: ["zip", "html", "pdf", "docx", "pptx", "xlsx", "png", "json", "summary"], insightPromise: "Polish publication-quality leadership outputs." },
      { id: "executive", name: "Executive", price: 3500, deliverables: ["Unlimited export formats", "Complete branded reporting suite", "Multi-file analytics", "Workflow templates", "Metadata package", "Processing audit", "Consulting-grade deliverables", "Enterprise-ready ZIP package"], exports: ["zip", "html", "pdf", "docx", "pptx", "xlsx", "csv", "missing_csv", "duplicate_csv", "dictionary_xlsx", "png", "json", "summary"], insightPromise: "Export a complete executive intelligence package." }
    ]
  },
  {
    id: "enterprise-intelligence",
    name: "Enterprise Intelligence Platform",
    shortName: "Enterprise Intelligence",
    startingPrice: null,
    displayStartingPrice: "$3,500+",
    description: "Plan custom recurring analytics systems and enterprise workflows.",
    bestFor: ["custom reporting", "white labeling", "API planning", "multi-file analytics"],
    previewFocus: "Custom executive analytics system planning, workflow design, multi-file strategy, and enterprise package scoping.",
    levels: [
      { id: "custom", name: "Custom Quote", price: null, displayPrice: "$3,500+", deliverables: ["Custom branded analytics system", "Recurring reporting", "Multi-file analysis", "Consulting-grade deliverables", "White labeling", "API planning", "Unlimited exports"], exports: ["zip", "html", "pdf", "docx", "pptx", "xlsx", "png", "json", "summary"], insightPromise: "Scope an enterprise analytics platform." }
    ]
  }
];

export function getAnalyticsPackage(packageId: string): AnalyticsPackageConfig | undefined {
  return analyticsPackages.find((pkg) => pkg.id === packageId);
}

export function getOutputLevel(packageId: string, levelId: string): OutputLevelConfig | undefined {
  return getAnalyticsPackage(packageId)?.levels.find((level) => level.id === levelId);
}
