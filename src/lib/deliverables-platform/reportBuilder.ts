import type { AnalyticsPlan } from "../analytics-engine";
import type { PackageManifest } from "../package-orchestrator";
import { buildVersionMetadata, type VersionMetadata } from "../versioning";
import { buildDeliverableMetadata, type DeliverableMetadata } from "./deliverableMetadata";
import { renderSection, type BrandingProfile, type RenderedReportSection } from "./sectionRenderer";

export type ReportTemplateId = "executive-report" | "management-report" | "analytics-report" | "data-quality-report" | "technical-appendix" | "board-report";

export interface ReportTemplate {
  id: ReportTemplateId;
  name: string;
  description: string;
  defaultSections: string[];
}

export interface ProfessionalReport {
  id: string;
  templateId: ReportTemplateId;
  title: string;
  description: string;
  packageId: string;
  outputLevel: string;
  deliverable: DeliverableMetadata;
  branding: BrandingProfile;
  sections: RenderedReportSection[];
  versionMetadata: VersionMetadata;
  previewAvailable: boolean;
  exportAvailable: boolean;
  locked: boolean;
  watermark: boolean;
  preparedForExportFormats: string[];
}

export const reportTemplates: ReportTemplate[] = [
  { id: "executive-report", name: "Executive Report", description: "Leadership-ready summary, findings, recommendations, and appendix.", defaultSections: ["cover", "executive-summary", "dataset-overview", "quality-review", "key-findings", "recommendations", "limitations", "appendix", "version-metadata"] },
  { id: "management-report", name: "Management Report", description: "Operational dashboard narrative with KPIs, visuals, and next steps.", defaultSections: ["cover", "executive-summary", "dataset-overview", "visual-analytics", "quality-review", "recommendations", "processing-notes", "version-metadata"] },
  { id: "analytics-report", name: "Analytics Report", description: "Professional analytics report with statistics, visuals, and interpretation.", defaultSections: ["cover", "executive-summary", "dataset-overview", "dataset-confidence", "visual-analytics", "descriptive-statistics", "key-findings", "methodology", "limitations", "version-metadata"] },
  { id: "data-quality-report", name: "Data Quality Report", description: "Completeness, missing values, duplicates, quality score, and cleanup recommendations.", defaultSections: ["cover", "dataset-overview", "quality-review", "missing-values", "duplicate-review", "recommendations", "methodology", "version-metadata"] },
  { id: "technical-appendix", name: "Technical Appendix", description: "Field dictionary, processing notes, assumptions, and methodology support.", defaultSections: ["cover", "data-dictionary", "descriptive-statistics", "processing-notes", "methodology", "limitations", "version-metadata"] },
  { id: "board-report", name: "Board Report", description: "Board-ready narrative, concise KPIs, strategic findings, and recommendations.", defaultSections: ["cover", "executive-summary", "key-findings", "visual-analytics", "recommendations", "limitations", "version-metadata"] }
];

export function selectTemplate(deliverableFormat: string, category: string): ReportTemplate {
  if (category === "data" || category === "metadata") return reportTemplates.find((template) => template.id === "technical-appendix") || reportTemplates[4];
  if (deliverableFormat === "pdf" && category === "report") return reportTemplates[0];
  if (deliverableFormat === "html" || category === "dashboard") return reportTemplates[1];
  if (deliverableFormat === "pptx" || category === "presentation") return reportTemplates[5];
  if (category === "enterprise") return reportTemplates[0];
  return reportTemplates[2];
}

export function buildProfessionalReport(options: {
  plan: AnalyticsPlan;
  manifest: PackageManifest;
  deliverableId: string;
  branding?: BrandingProfile;
}): ProfessionalReport {
  const deliverable = options.manifest.deliverables.find((item) => item.id === options.deliverableId) || options.manifest.deliverables[0];
  const template = selectTemplate(deliverable.format, deliverable.category);
  const versionMetadata = buildVersionMetadata();
  const sectionIds = Array.from(new Set([...template.defaultSections, ...deliverable.sections, "version-metadata"]));
  const sections = sectionIds
    .map((sectionId) => renderSection(sectionId, { plan: options.plan, manifest: options.manifest, branding: options.branding, versionMetadata }))
    .sort((a, b) => a.order - b.order);

  return {
    id: `${deliverable.id}-${template.id}`,
    templateId: template.id,
    title: deliverable.name,
    description: deliverable.description,
    packageId: options.manifest.package.id,
    outputLevel: options.manifest.outputLevel.id,
    deliverable: buildDeliverableMetadata(deliverable, options.manifest),
    branding: options.branding || {},
    sections,
    versionMetadata,
    previewAvailable: deliverable.previewAvailable,
    exportAvailable: deliverable.exportAvailable,
    locked: deliverable.locked,
    watermark: deliverable.watermark,
    preparedForExportFormats: deliverable.exports
  };
}
