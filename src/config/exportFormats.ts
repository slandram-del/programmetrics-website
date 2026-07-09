export const exportFormats = [
  { id: "csv", label: "Cleaned Data CSV", extension: "csv", mimeType: "text/csv", packageMinimum: "Data Foundation Package" },
  { id: "missing_csv", label: "Missing Value Report CSV", extension: "csv", mimeType: "text/csv", packageMinimum: "Data Foundation Package" },
  { id: "duplicate_csv", label: "Duplicate Review CSV", extension: "csv", mimeType: "text/csv", packageMinimum: "Data Foundation Package" },
  { id: "xlsx", label: "Excel Workbook", extension: "xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", packageMinimum: "Data Foundation Package" },
  { id: "html", label: "Interactive Dashboard HTML", extension: "html", mimeType: "text/html", packageMinimum: "Management Insights Package" },
  { id: "pdf", label: "Executive PDF", extension: "pdf", mimeType: "application/pdf", packageMinimum: "Management Insights Package" },
  { id: "docx", label: "Word Report", extension: "docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", packageMinimum: "Management Insights Package" },
  { id: "pptx", label: "PowerPoint", extension: "pptx", mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", packageMinimum: "Professional Analytics Package" },
  { id: "png", label: "Dashboard Images PNG", extension: "png", mimeType: "image/png", packageMinimum: "Professional Analytics Package" },
  { id: "json", label: "JSON Metadata", extension: "json", mimeType: "application/json", packageMinimum: "Data Foundation Package" },
  { id: "zip", label: "Complete ZIP Package", extension: "zip", mimeType: "application/zip", packageMinimum: "Executive Intelligence Suite" }
] as const;

export type ExportFormatId = typeof exportFormats[number]["id"];

export function getExportFormat(formatId: string) {
  return exportFormats.find((format) => format.id === formatId);
}
