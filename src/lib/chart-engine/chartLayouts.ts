export type ChartLayoutKind = "kpi" | "score" | "standard" | "wide" | "narrative" | "table" | "compact";

export interface ChartLayoutSpec {
  kind: ChartLayoutKind;
  columns: number;
  minHeight: number;
  aspectRatio?: string;
  className: string;
  density: "compact" | "standard" | "spacious";
}

export interface DashboardLayoutSpec {
  canvasClassName: string;
  gridClassName: string;
  columns: number;
  gap: number;
  maxWidth: number;
  cardRadius: number;
  shadow: string;
  layouts: Record<ChartLayoutKind, ChartLayoutSpec>;
  responsiveBreakpoints: Array<{ maxWidth: number; columns: number; gap: number }>;
}

export const defaultDashboardLayout: DashboardLayoutSpec = {
  canvasClassName: "pm-dashboard-canvas",
  gridClassName: "pm-dashboard-grid",
  columns: 12,
  gap: 18,
  maxWidth: 1440,
  cardRadius: 12,
  shadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
  layouts: {
    kpi: { kind: "kpi", columns: 3, minHeight: 132, className: "pm-chart-card pm-chart-card-kpi", density: "compact" },
    score: { kind: "score", columns: 4, minHeight: 260, aspectRatio: "1 / 1", className: "pm-chart-card pm-chart-card-score", density: "standard" },
    standard: { kind: "standard", columns: 6, minHeight: 320, aspectRatio: "16 / 10", className: "pm-chart-card pm-chart-card-standard", density: "standard" },
    wide: { kind: "wide", columns: 12, minHeight: 360, aspectRatio: "21 / 9", className: "pm-chart-card pm-chart-card-wide", density: "spacious" },
    narrative: { kind: "narrative", columns: 6, minHeight: 220, className: "pm-chart-card pm-chart-card-narrative", density: "standard" },
    table: { kind: "table", columns: 12, minHeight: 320, className: "pm-chart-card pm-chart-card-table", density: "spacious" },
    compact: { kind: "compact", columns: 4, minHeight: 220, className: "pm-chart-card pm-chart-card-compact", density: "compact" }
  },
  responsiveBreakpoints: [
    { maxWidth: 1200, columns: 8, gap: 16 },
    { maxWidth: 860, columns: 4, gap: 14 },
    { maxWidth: 560, columns: 1, gap: 12 }
  ]
};

export function getDefaultChartLayouts(): DashboardLayoutSpec {
  return defaultDashboardLayout;
}

export function getLayoutForChart(kind: ChartLayoutKind = "standard"): ChartLayoutSpec {
  return defaultDashboardLayout.layouts[kind] || defaultDashboardLayout.layouts.standard;
}

export function getChartGridColumnStyle(kind: ChartLayoutKind = "standard"): string {
  const layout = getLayoutForChart(kind);
  return `span ${Math.max(1, Math.min(defaultDashboardLayout.columns, layout.columns))}`;
}

export function getDashboardCssVariables(layout: DashboardLayoutSpec = defaultDashboardLayout): Record<string, string | number> {
  return {
    "--pm-dashboard-columns": layout.columns,
    "--pm-dashboard-gap": `${layout.gap}px`,
    "--pm-dashboard-max-width": `${layout.maxWidth}px`,
    "--pm-card-radius": `${layout.cardRadius}px`,
    "--pm-card-shadow": layout.shadow
  };
}
