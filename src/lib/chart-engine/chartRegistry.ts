import type { RecommendedVisual, VisualType } from "../analytics-engine";

export type ChartComponentName =
  | "LineChart"
  | "BarChart"
  | "HorizontalBarChart"
  | "DonutChart"
  | "TreemapChart"
  | "HeatmapChart"
  | "HistogramChart"
  | "BoxPlotChart"
  | "ScatterPlotChart"
  | "GaugeChart"
  | "DataTable"
  | "InsightCard"
  | "KpiCard"
  | "ComingSoonChart";

export interface ChartRendererDefinition {
  type: VisualType;
  component: ChartComponentName;
  label: string;
  implemented: boolean;
  preferredTabs: string[];
  emptyState: string;
}

const chartRegistry: Record<VisualType, ChartRendererDefinition> = {
  kpi: { type: "kpi", component: "KpiCard", label: "KPI card", implemented: true, preferredTabs: ["Overview"], emptyState: "No KPI value was available for this metric." },
  line: { type: "line", component: "LineChart", label: "Trend line", implemented: true, preferredTabs: ["Overview", "Visual Analytics"], emptyState: "No date trend data was available." },
  bar: { type: "bar", component: "BarChart", label: "Bar chart", implemented: true, preferredTabs: ["Visual Analytics"], emptyState: "No grouped values were available." },
  horizontalBar: { type: "horizontalBar", component: "HorizontalBarChart", label: "Horizontal bar chart", implemented: true, preferredTabs: ["Visual Analytics", "Data Quality", "Missing Values"], emptyState: "No ranked values were available." },
  donut: { type: "donut", component: "DonutChart", label: "Donut chart", implemented: true, preferredTabs: ["Visual Analytics"], emptyState: "No category distribution was available." },
  treemap: { type: "treemap", component: "TreemapChart", label: "Treemap", implemented: false, preferredTabs: ["Visual Analytics"], emptyState: "Treemap rendering is coming soon." },
  heatmap: { type: "heatmap", component: "HeatmapChart", label: "Heatmap", implemented: true, preferredTabs: ["Data Quality", "Missing Values"], emptyState: "No field completeness data was available." },
  histogram: { type: "histogram", component: "HistogramChart", label: "Histogram", implemented: true, preferredTabs: ["Descriptive Statistics"], emptyState: "No numeric distribution was available." },
  boxplot: { type: "boxplot", component: "BoxPlotChart", label: "Box plot", implemented: true, preferredTabs: ["Descriptive Statistics", "Advanced Analytics"], emptyState: "No quartile statistics were available." },
  scatter: { type: "scatter", component: "ScatterPlotChart", label: "Scatter plot", implemented: false, preferredTabs: ["Advanced Analytics"], emptyState: "Scatter plot rendering is coming soon." },
  gauge: { type: "gauge", component: "GaugeChart", label: "Gauge", implemented: true, preferredTabs: ["Overview", "Data Quality"], emptyState: "No score was available." },
  table: { type: "table", component: "DataTable", label: "Table", implemented: true, preferredTabs: ["Descriptive Statistics", "Deliverables"], emptyState: "No table rows were available." },
  insightCard: { type: "insightCard", component: "InsightCard", label: "Insight card", implemented: true, preferredTabs: ["Overview", "Recommendations"], emptyState: "No insight text was available." }
};

export function getChartRegistry(): Record<VisualType, ChartRendererDefinition> {
  return chartRegistry;
}

export function getChartRenderer(type: VisualType): ChartRendererDefinition {
  return chartRegistry[type] || {
    type,
    component: "ComingSoonChart",
    label: "Coming soon",
    implemented: false,
    preferredTabs: ["Visual Analytics"],
    emptyState: "This visual type is not implemented yet."
  };
}

export function resolveChartComponent(visual: RecommendedVisual): ChartComponentName {
  const renderer = getChartRenderer(visual.type);
  return renderer.implemented ? renderer.component : "ComingSoonChart";
}
