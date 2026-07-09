import type { DeliverablePreviewModel } from "./previewBuilder";

export interface PreviewRenderOutput {
  title: string;
  html: string;
  text: string;
  locked: boolean;
  watermark: boolean;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
}

export function renderPreview(preview: DeliverablePreviewModel): PreviewRenderOutput {
  const sections = preview.sections.map((section) => {
    const blocks = section.blocks.map((block) => `<p>${escapeHtml(block)}</p>`).join("");
    return `<section class="pm-report-section"><h3>${escapeHtml(section.title)}</h3>${blocks}</section>`;
  }).join("");
  const watermark = preview.watermark ? '<div class="pm-preview-watermark">ProgramMetrics Preview</div>' : "";
  const html = `<article class="pm-report-preview ${preview.locked ? "is-locked" : ""}"><h2>${escapeHtml(preview.title)}</h2>${watermark}${sections}</article>`;
  const text = [preview.title, ...preview.sections.flatMap((section) => [section.title, ...section.blocks])].join("\n");
  return { title: preview.title, html, text, locked: preview.locked, watermark: preview.watermark };
}
