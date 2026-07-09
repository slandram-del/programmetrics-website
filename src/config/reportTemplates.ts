export const reportTemplates = [
  { id: "executive-summary", name: "Executive Summary", sections: ["cover", "kpis", "findings", "recommendations", "limitations"] },
  { id: "data-quality", name: "Data Quality Report", sections: ["quality-score", "missing-values", "duplicates", "field-completeness", "cleanup-actions"] },
  { id: "dashboard-package", name: "Dashboard Package", sections: ["overview", "visual-analytics", "data-quality", "recommendations", "deliverables"] },
  { id: "board-briefing", name: "Board Briefing", sections: ["executive-overview", "trend-analysis", "key-risks", "strategic-actions", "appendix"] }
] as const;
