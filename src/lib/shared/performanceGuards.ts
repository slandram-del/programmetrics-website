export type DatasetScale = "small" | "medium" | "large" | "enterprise";

export interface DatasetPerformanceProfile {
  rows: number;
  fields: number;
  cells: number;
  scale: DatasetScale;
  previewRowLimit: number;
  shouldSample: boolean;
  shouldUseBackgroundProcessing: boolean;
  recommendations: string[];
}

export function getDatasetPerformanceProfile(rows: number, fields: number): DatasetPerformanceProfile {
  const safeRows = Math.max(0, Number.isFinite(rows) ? rows : 0);
  const safeFields = Math.max(0, Number.isFinite(fields) ? fields : 0);
  const cells = safeRows * safeFields;
  const scale: DatasetScale = safeRows >= 100000 ? "enterprise" : safeRows >= 50000 ? "large" : safeRows >= 10000 ? "medium" : "small";
  const shouldSample = safeRows >= 10000;
  const shouldUseBackgroundProcessing = safeRows >= 50000 || cells >= 1000000;
  const previewRowLimit = scale === "small" ? Math.min(safeRows, 250) : scale === "medium" ? 250 : 100;
  const recommendations = [
    shouldSample ? "Use sampled previews and aggregate charts for large datasets." : "Full in-browser preview is acceptable for current dataset size.",
    shouldUseBackgroundProcessing ? "Route future production processing through background jobs or server-side workers." : "Synchronous session processing is acceptable for MVP-size files.",
    cells >= 500000 ? "Avoid storing full row objects in UI state; keep summaries, pages, and manifest outputs." : "Current cell volume is within normal browser preview limits."
  ];

  return { rows: safeRows, fields: safeFields, cells, scale, previewRowLimit, shouldSample, shouldUseBackgroundProcessing, recommendations };
}

export function getPreviewRowLimit(rows: number, fields: number, locked = false): number {
  const profile = getDatasetPerformanceProfile(rows, fields);
  if (locked) return Math.min(profile.previewRowLimit, 25);
  return profile.previewRowLimit;
}
