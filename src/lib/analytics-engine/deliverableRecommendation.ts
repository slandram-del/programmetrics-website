import type { RecommendedDeliverable, SelectedLevel, SelectedPackage } from "./types";

function rankPackage(selectedPackage?: string | SelectedPackage): number {
  const id = typeof selectedPackage === "string" ? selectedPackage : selectedPackage?.id;
  if (/enterprise|tier-4|executive/i.test(id || "")) return 4;
  if (/analytics|professional|tier-3/i.test(id || "")) return 3;
  if (/management|insights|tier-2/i.test(id || "")) return 2;
  return 1;
}

export function recommendDeliverables(selectedPackage?: string | SelectedPackage, selectedLevel?: string | SelectedLevel): RecommendedDeliverable[] {
  const rank = rankPackage(selectedPackage);
  const items: Array<Omit<RecommendedDeliverable, "included" | "locked" | "previewAvailable" | "exportAvailable"> & { min: number }> = [
    { id: "cleaned-csv", name: "Cleaned Data CSV", description: "Cleaned row-level data export.", format: "csv", min: 1 },
    { id: "missing-csv", name: "Missing Value Report CSV", description: "Field and row missingness report.", format: "csv", min: 1 },
    { id: "dashboard-html", name: "Interactive Dashboard HTML", description: "Browser-based dashboard package.", format: "html", min: 2 },
    { id: "executive-pdf", name: "Executive Summary PDF", description: "Board-ready executive report.", format: "pdf", min: 2 },
    { id: "word-report", name: "Word Executive Report", description: "Editable DOCX narrative report.", format: "docx", min: 3 },
    { id: "powerpoint", name: "PowerPoint Presentation", description: "Slide deck built from the analytics plan.", format: "pptx", min: 3 },
    { id: "dashboard-png", name: "Dashboard Images PNG", description: "Exportable dashboard images.", format: "png", min: 3 },
    { id: "metadata-json", name: "JSON Metadata", description: "Dataset profile, quality, confidence, and recommendation metadata.", format: "json", min: 1 },
    { id: "zip-package", name: "ZIP Package", description: "Complete package with reports, data, images, metadata, and README.", format: "zip", min: 4 }
  ];
  return items.map(({ min, ...item }) => ({ ...item, included: rank >= min, locked: rank < min, previewAvailable: true, exportAvailable: rank >= min }));
}
