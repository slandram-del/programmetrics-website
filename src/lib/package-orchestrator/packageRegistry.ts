import type { PackageDefinition } from "./packageTypes";

const commonFoundationSections = [
  "cover",
  "dataset-overview",
  "quality-review",
  "missing-values",
  "duplicate-review",
  "methodology",
  "processing-notes"
];

export const packageRegistry: PackageDefinition[] = [
  {
    id: "data-foundation",
    name: "Data Foundation Package",
    shortName: "Data Foundation",
    description: "Prepare uploaded files for reliable reporting, validation, and downstream analytics.",
    startingPrice: 49,
    rank: 1,
    baseSections: commonFoundationSections,
    dashboards: [
      {
        id: "data-quality-dashboard",
        name: "Data Quality Dashboard",
        description: "Quality, missingness, duplicate, and field usability review.",
        minimumLevel: "premium",
        sections: ["quality-review", "missing-values", "duplicate-review", "data-dictionary"]
      }
    ],
    deliverables: [
      { id: "clean-csv", name: "Clean CSV", description: "Cleaned tabular file for reporting.", format: "csv", category: "data", minimumLevel: "essential", generationTime: "Instant", thumbnail: "CSV", sections: ["dataset-overview"], exports: ["csv"] },
      { id: "validation-report", name: "Validation Report", description: "Core structure, field, and import validation notes.", format: "pdf", category: "report", minimumLevel: "essential", estimatedPages: 3, generationTime: "Under 1 minute", thumbnail: "VAL", sections: ["quality-review", "methodology"], exports: ["summary", "json"] },
      { id: "duplicate-review", name: "Duplicate Review", description: "Exact duplicate and likely duplicate review output.", format: "csv", category: "data", minimumLevel: "essential", generationTime: "Instant", thumbnail: "DUP", sections: ["duplicate-review"], exports: ["duplicate_csv"] },
      { id: "missing-value-report", name: "Missing Value Report", description: "Missing rows, missing cells, and top affected fields.", format: "csv", category: "data", minimumLevel: "essential", generationTime: "Instant", thumbnail: "MIS", sections: ["missing-values"], exports: ["missing_csv"] },
      { id: "excel-workbook", name: "Excel Workbook", description: "Workbook with cleaned data and support sheets.", format: "xlsx", category: "data", minimumLevel: "professional", generationTime: "1-2 minutes", thumbnail: "XLS", sections: ["dataset-overview", "missing-values", "duplicate-review"], exports: ["xlsx"] },
      { id: "data-dictionary", name: "Data Dictionary", description: "Field names, labels, types, roles, and usability notes.", format: "xlsx", category: "metadata", minimumLevel: "professional", generationTime: "1 minute", thumbnail: "DICT", sections: ["data-dictionary"], exports: ["dictionary_xlsx", "json"] },
      { id: "interactive-cleaning-dashboard", name: "Interactive Cleaning Dashboard", description: "Preview-ready dashboard for quality and field completeness.", format: "html", category: "dashboard", minimumLevel: "premium", estimatedPages: 1, generationTime: "2-3 minutes", thumbnail: "DASH", sections: ["quality-review", "missing-values", "duplicate-review"], exports: ["html", "png"] },
      { id: "data-profile", name: "Data Profile", description: "Expanded profile with field types, missingness, and statistics.", format: "pdf", category: "report", minimumLevel: "premium", estimatedPages: 8, generationTime: "2-3 minutes", thumbnail: "PRO", sections: ["dataset-overview", "statistics", "data-dictionary"], exports: ["pdf", "json"] },
      { id: "audit-report", name: "Audit Report", description: "Executive-ready data readiness audit and assumptions.", format: "pdf", category: "report", minimumLevel: "executive", estimatedPages: 10, generationTime: "3-5 minutes", thumbnail: "AUD", sections: ["executive-summary", "methodology", "limitations", "processing-notes"], exports: ["pdf"] },
      { id: "data-foundation-zip", name: "Data Foundation ZIP Package", description: "Complete data foundation package with reports, metadata, and exports.", format: "zip", category: "metadata", minimumLevel: "executive", generationTime: "3-5 minutes", thumbnail: "ZIP", sections: ["appendix"], exports: ["zip"] }
    ]
  },
  {
    id: "management-insights",
    name: "Management Insights Package",
    shortName: "Management Insights",
    description: "Turn uploaded files into management dashboards, KPIs, summaries, and recommendations.",
    startingPrice: 199,
    rank: 2,
    baseSections: [...commonFoundationSections, "visual-analytics", "findings", "recommendations"],
    dashboards: [
      { id: "overview-dashboard", name: "Overview Dashboard", description: "KPI and high-level visual overview.", minimumLevel: "essential", sections: ["dataset-overview", "visual-analytics"] },
      { id: "executive-dashboard", name: "Executive Dashboard", description: "Leadership-ready KPIs, findings, and recommendations.", minimumLevel: "premium", sections: ["executive-summary", "findings", "recommendations"] }
    ],
    deliverables: [
      { id: "interactive-dashboard", name: "Interactive Dashboard", description: "Browser-based dashboard with KPIs and primary visuals.", format: "html", category: "dashboard", minimumLevel: "essential", estimatedPages: 1, generationTime: "2-3 minutes", thumbnail: "DASH", sections: ["dataset-overview", "visual-analytics"], exports: ["html"] },
      { id: "executive-pdf", name: "Executive PDF", description: "Management-ready PDF summary with KPIs and recommendations.", format: "pdf", category: "report", minimumLevel: "essential", estimatedPages: 8, generationTime: "3-5 minutes", thumbnail: "PDF", sections: ["executive-summary", "findings", "recommendations"], exports: ["pdf"] },
      { id: "word-report", name: "Word Report", description: "Editable report narrative and support tables.", format: "docx", category: "report", minimumLevel: "essential", estimatedPages: 10, generationTime: "3-5 minutes", thumbnail: "DOC", sections: ["executive-summary", "findings", "recommendations", "appendix"], exports: ["docx"] },
      { id: "multi-page-dashboard", name: "Multiple Dashboard Pages", description: "Expanded dashboard tabs for quality, visuals, and recommendations.", format: "html", category: "dashboard", minimumLevel: "professional", estimatedPages: 4, generationTime: "3-5 minutes", thumbnail: "TABS", sections: ["visual-analytics", "quality-review", "recommendations"], exports: ["html", "png"] },
      { id: "powerpoint-summary", name: "PowerPoint Summary", description: "Presentation-ready management slide deck.", format: "pptx", category: "presentation", minimumLevel: "professional", estimatedPages: 6, generationTime: "5 minutes", thumbnail: "PPT", sections: ["executive-summary", "findings", "recommendations"], exports: ["pptx"] },
      { id: "executive-infographic", name: "Executive Infographic", description: "Single-page visual summary for leadership updates.", format: "png", category: "presentation", minimumLevel: "premium", estimatedPages: 1, generationTime: "3 minutes", thumbnail: "IMG", sections: ["executive-summary", "visual-analytics"], exports: ["png"] },
      { id: "management-zip", name: "Management Insights ZIP Package", description: "Dashboard, reports, images, and metadata packaged together.", format: "zip", category: "metadata", minimumLevel: "premium", generationTime: "5 minutes", thumbnail: "ZIP", sections: ["appendix", "processing-notes"], exports: ["zip"] }
    ]
  },
  {
    id: "professional-analytics",
    name: "Professional Analytics Package",
    shortName: "Professional Analytics",
    description: "Add descriptive statistics, advanced charts, outlier review, and forecasting previews.",
    startingPrice: 499,
    rank: 3,
    baseSections: [...commonFoundationSections, "statistics", "visual-analytics", "findings", "recommendations", "appendix"],
    dashboards: [
      { id: "visual-analytics-dashboard", name: "Visual Analytics Dashboard", description: "Expanded visual analysis and comparisons.", minimumLevel: "essential", sections: ["visual-analytics", "statistics"] },
      { id: "forecast-dashboard", name: "Forecast Dashboard", description: "Forecast and trend preview when dates support it.", minimumLevel: "premium", sections: ["statistics", "findings", "limitations"] },
      { id: "statistical-dashboard", name: "Statistical Dashboard", description: "Statistical summary, numeric distribution, and outlier review.", minimumLevel: "professional", sections: ["statistics", "appendix"] }
    ],
    deliverables: [
      { id: "statistical-analysis", name: "Statistical Analysis", description: "Descriptive statistics and analysis readiness output.", format: "pdf", category: "report", minimumLevel: "essential", estimatedPages: 10, generationTime: "5 minutes", thumbnail: "STAT", sections: ["statistics", "findings"], exports: ["pdf", "json"] },
      { id: "trend-analysis", name: "Trend Analysis", description: "Monthly, quarterly, or yearly trend analysis when date fields exist.", format: "html", category: "dashboard", minimumLevel: "essential", estimatedPages: 2, generationTime: "3-5 minutes", thumbnail: "LINE", sections: ["visual-analytics", "statistics"], exports: ["html", "png"] },
      { id: "analytics-workbook", name: "Analytics Workbook", description: "Workbook with descriptive statistics, field dictionary, and support tables.", format: "xlsx", category: "data", minimumLevel: "professional", generationTime: "5 minutes", thumbnail: "XLS", sections: ["statistics", "data-dictionary"], exports: ["xlsx"] },
      { id: "correlation-review", name: "Correlation Review", description: "Correlation and relationship readiness review for numeric fields.", format: "pdf", category: "report", minimumLevel: "professional", estimatedPages: 6, generationTime: "5 minutes", thumbnail: "COR", sections: ["statistics", "limitations"], exports: ["pdf", "json"] },
      { id: "forecast-preview", name: "Forecast Preview", description: "Forecast-ready trend preview with limitations and assumptions.", format: "html", category: "dashboard", minimumLevel: "premium", estimatedPages: 3, generationTime: "5 minutes", thumbnail: "FCST", sections: ["visual-analytics", "limitations"], exports: ["html", "png"] },
      { id: "professional-zip", name: "Professional Analytics ZIP Package", description: "Reports, workbook, dashboards, graphics, and metadata.", format: "zip", category: "metadata", minimumLevel: "premium", generationTime: "5-8 minutes", thumbnail: "ZIP", sections: ["appendix", "processing-notes"], exports: ["zip"] }
    ]
  },
  {
    id: "executive-intelligence",
    name: "Executive Intelligence Suite",
    shortName: "Executive Intelligence",
    description: "Create board-ready executive dashboards, reports, presentations, and complete packages.",
    startingPrice: 1999,
    rank: 4,
    baseSections: ["cover", "executive-summary", "dataset-overview", "quality-review", "visual-analytics", "findings", "recommendations", "methodology", "limitations", "appendix", "processing-notes"],
    dashboards: [
      { id: "executive-dashboard", name: "Executive Dashboard", description: "Board-ready KPI and insight dashboard.", minimumLevel: "essential", sections: ["executive-summary", "visual-analytics", "findings"] },
      { id: "advanced-analytics-dashboard", name: "Advanced Analytics Dashboard", description: "Advanced trends, quality, and segmentation review.", minimumLevel: "professional", sections: ["statistics", "visual-analytics", "recommendations"] },
      { id: "executive-package-dashboard", name: "Executive Package Dashboard", description: "Full executive package navigation and appendix preview.", minimumLevel: "executive", sections: ["executive-summary", "appendix", "processing-notes"] }
    ],
    deliverables: [
      { id: "board-dashboard", name: "Board-ready Dashboard", description: "Executive dashboard with KPIs, insights, and recommendations.", format: "html", category: "dashboard", minimumLevel: "essential", estimatedPages: 1, generationTime: "5 minutes", thumbnail: "EXEC", sections: ["executive-summary", "visual-analytics"], exports: ["html", "png"] },
      { id: "executive-report-pdf", name: "Executive Report PDF", description: "Board-ready PDF report with findings and recommendations.", format: "pdf", category: "report", minimumLevel: "essential", estimatedPages: 14, generationTime: "5-8 minutes", thumbnail: "PDF", sections: ["cover", "executive-summary", "findings", "recommendations"], exports: ["pdf"] },
      { id: "executive-presentation", name: "Executive Presentation", description: "PowerPoint presentation for leadership or board review.", format: "pptx", category: "presentation", minimumLevel: "essential", estimatedPages: 8, generationTime: "5-8 minutes", thumbnail: "PPT", sections: ["executive-summary", "findings", "recommendations"], exports: ["pptx"] },
      { id: "word-executive-report", name: "Word Executive Report", description: "Editable executive report with methodology and appendix.", format: "docx", category: "report", minimumLevel: "professional", estimatedPages: 18, generationTime: "5-8 minutes", thumbnail: "DOC", sections: ["methodology", "limitations", "appendix"], exports: ["docx"] },
      { id: "publication-graphics", name: "Publication Graphics", description: "Export-ready chart and dashboard images.", format: "png", category: "presentation", minimumLevel: "premium", generationTime: "5 minutes", thumbnail: "IMG", sections: ["visual-analytics"], exports: ["png", "svg"] },
      { id: "complete-executive-zip", name: "Complete Executive ZIP Package", description: "Complete branded suite with dashboard, reports, slides, data, images, and metadata.", format: "zip", category: "metadata", minimumLevel: "executive", generationTime: "8-10 minutes", thumbnail: "ZIP", sections: ["appendix", "processing-notes", "data-dictionary"], exports: ["zip", "html", "pdf", "docx", "pptx", "xlsx", "csv", "png", "json"] }
    ]
  },
  {
    id: "enterprise-intelligence",
    name: "Enterprise Intelligence Platform",
    shortName: "Enterprise Intelligence",
    description: "Scope custom recurring analytics systems, white labeling, API deliverables, and multi-file programs.",
    startingPrice: null,
    displayStartingPrice: "$3,500+",
    rank: 5,
    baseSections: ["cover", "executive-summary", "workflow-design", "enterprise-scope", "methodology", "limitations", "appendix"],
    enterpriseCapabilities: ["White Label", "Recurring Reports", "Scheduled Reports", "Organization Defaults", "API Deliverables", "Multi-file Projects"],
    dashboards: [
      { id: "enterprise-planning-dashboard", name: "Enterprise Planning Dashboard", description: "Scope planning dashboard for recurring reporting and API deliverables.", minimumLevel: "executive", sections: ["enterprise-scope", "workflow-design"] }
    ],
    deliverables: [
      { id: "enterprise-scope", name: "Enterprise Scope Manifest", description: "Custom platform scope, workflows, and deliverable roadmap.", format: "pdf", category: "enterprise", minimumLevel: "executive", estimatedPages: 12, generationTime: "Custom", thumbnail: "ENT", sections: ["enterprise-scope", "workflow-design"], exports: ["pdf", "docx"] },
      { id: "white-label-plan", name: "White Label Plan", description: "Branding and white-label implementation plan placeholder.", format: "pdf", category: "enterprise", minimumLevel: "executive", estimatedPages: 6, generationTime: "Custom", thumbnail: "WL", sections: ["enterprise-scope"], exports: ["pdf"] },
      { id: "api-deliverables-plan", name: "API Deliverables Plan", description: "API and integration deliverables placeholder for enterprise scoping.", format: "json", category: "enterprise", minimumLevel: "executive", generationTime: "Custom", thumbnail: "API", sections: ["enterprise-scope", "processing-notes"], exports: ["json"] },
      { id: "enterprise-zip", name: "Enterprise Planning ZIP Package", description: "Enterprise scope, recurring workflow plan, API deliverable plan, and metadata.", format: "zip", category: "enterprise", minimumLevel: "executive", generationTime: "Custom", thumbnail: "ZIP", sections: ["appendix"], exports: ["zip"] }
    ]
  }
];

export function listPackageDefinitions(): PackageDefinition[] {
  return packageRegistry;
}

export function getPackageDefinition(packageId: string | undefined): PackageDefinition {
  return packageRegistry.find((pkg) => pkg.id === packageId) || packageRegistry[0];
}
