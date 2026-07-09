import type { ProfessionalReport } from "./reportBuilder";

export interface DeliverablePreviewCard {
  id: string;
  thumbnail: string;
  title: string;
  description: string;
  estimatedPages: number | null;
  generationTime: string;
  packageIncluded: boolean;
  previewAvailable: boolean;
  exportLocked: boolean;
  watermark: boolean;
  actionLabel: string;
}

export interface DeliverablePreviewModel {
  reportId: string;
  title: string;
  sections: Array<{ title: string; blocks: string[]; hidden?: boolean }>;
  locked: boolean;
  watermark: boolean;
  exportAvailable: boolean;
  versionMetadata: ProfessionalReport["versionMetadata"];
}

export function buildPreviewCard(report: ProfessionalReport): DeliverablePreviewCard {
  return {
    id: report.id,
    thumbnail: report.deliverable.id.slice(0, 4).toUpperCase(),
    title: report.title,
    description: report.description,
    estimatedPages: report.deliverable.estimatedPages,
    generationTime: report.deliverable.generationTime,
    packageIncluded: report.exportAvailable,
    previewAvailable: report.previewAvailable,
    exportLocked: report.locked,
    watermark: report.watermark,
    actionLabel: report.exportAvailable ? "Prepare export" : "Preview only"
  };
}

export function buildReportPreview(report: ProfessionalReport): DeliverablePreviewModel {
  const visibleSections = report.sections.filter((section) => !section.hidden).slice(0, report.locked ? 5 : report.sections.length);
  return {
    reportId: report.id,
    title: report.title,
    sections: visibleSections.map((section) => ({
      title: section.title,
      blocks: report.locked ? section.contentBlocks.slice(0, 3) : section.contentBlocks,
      hidden: section.hidden
    })),
    locked: report.locked,
    watermark: report.watermark,
    exportAvailable: report.exportAvailable,
    versionMetadata: report.versionMetadata
  };
}
