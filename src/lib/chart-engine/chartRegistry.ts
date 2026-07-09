import type { RecommendedVisual, VisualType } from "../analytics-engine";
import type { ChartLayoutKind } from "./chartLayouts";

export type ChartComponentName =
  | "KpiCard"
  | "LineChart"
  | "BarChart"
  | "HorizontalBarChart"
  | "DonutChart"
  | "HistogramChart"
  | "BoxPlotSummary"
  | "GaugeChart"
  | "DataTable"
  | "HeatmapPlaceholder"
  | "InsightCard"
  | "ComingSoonChart";

export interface ChartRendererDefinition {
  type: VisualType;
  component: ChartComponentName;
  label: string;
  implemented: boolean;
  preferredTabs: string[];
  layout: ChartLayoutKind;
  supportsLegend: boolean;
  supportsAxes: boolean;
  supportsTooltip: boolean;
  emptyState: string;
  description: string;
}

const chartRegistry: Record<VisualType, ChartRendererDefinition> = {
  kpi: {
    type: "kpi",
    component: "KpiCard",
    label: "KPI card",
    implemented: true,
    preferredTabs: ["Overview"],
    layout: "kpi",
    supportsLegend: false,
    supportsAxes: false,
    supportsTooltip: true,
    emptyState: "No KPI value was available for this metric.",
    description: "Single metric with supporting detail panel."
  },
  line: {
    type: "line",
    component: "LineChart",
    label: "Line chart",
    implemented: true,
    preferredTabs: ["Overview", "Visual Analytics"],
    layout: "wide",
    supportsLegend: true,
    supportsAxes: true,
    supportsTooltip: true,
    emptyState: "No date trend data was available.",
    description: "Monthly, quarterly, or yearly trend line."
  },
  bar: {
    type: "bar",
    component: "BarChart",
    label: "Bar chart",
    implemented: true,
    preferredTabs: ["Visual Analytics"],
    layout: "standard",
    supportsLegend: true,
    supportsAxes: true,
    supportsTooltip: true,
    emptyState: "No grouped values were available.",
    description: "Vertical ranked category chart."
  },
  horizontalBar: {
    type: "horizontalBar",
    component: "HorizontalBarChart",
    label: "Horizontal bar chart",
    implemented: true,
    preferredTabs: ["Visual Analytics", "Data Quality", "Missing Values"],
    layout: "wide",
    supportsLegend: true,
    supportsAxes: true,
    supportsTooltip: true,
    emptyState: "No ranked values were available.",
    description: "Readable top-category or missing-field ranking."
  },
  donut: {
    type: "donut",
    component: "DonutChart",
    label: "Donut chart",
    implemented: true,
    preferredTabs: ["Visual Analytics"],
    layout: "standard",
    supportsLegend: true,
    supportsAxes: false,
    supportsTooltip: true,
    emptyState: "No category distribution was available.",
    description: "Compact part-to-whole distribution for low-cardinality fields."
  },
  treemap: {
    type: "treemap",
    component: "ComingSoonChart",
    label: "Treemap",
    implemented: false,
    preferredTabs: ["Visual Analytics"],
    layout: "wide",
    supportsLegend: true,
    supportsAxes: false,
    supportsTooltip: true,
    emptyState: "Treemap rendering is not implemented yet.",
    description: "Future hierarchical category visual."
  },
  heatmap: {
    type: "heatmap",
    component: "HeatmapPlaceholder",
    label: "Heatmap placeholder",
    implemented: true,
    preferredTabs: ["Data Quality", "Missing Values"],
    layout: "wide",
    supportsLegend: true,
    supportsAxes: false,
    supportsTooltip: true,
    emptyState: "No field completeness data was available.",
    description: "Field completeness heatmap placeholder with real completeness values."
  },
  histogram: {
    type: "histogram",
    component: "HistogramChart",
    label: "Histogram",
    implemented: true,
    preferredTabs: ["Descriptive Statistics"],
    layout: "standard",
    supportsLegend: false,
    supportsAxes: true,
    supportsTooltip: true,
    emptyState: "No numeric distribution was available.",
    description: "Numeric distribution with bin counts."
  },
  boxplot: {
    type: "boxplot",
    component: "BoxPlotSummary",
    label: "Box plot summary",
    implemented: true,
    preferredTabs: ["Descriptive Statistics", "Advanced Analytics"],
    layout: "standard",
    supportsLegend: false,
    supportsAxes: true,
    supportsTooltip: true,
    emptyState: "No quartile statistics were available.",
    description: "Five-number summary and outlier count."
  },
  scatter: {
    type: "scatter",
    component: "ComingSoonChart",
    label: "Scatter plot",
    implemented: false,
    preferredTabs: ["Advanced Analytics"],
    layout: "wide",
    supportsLegend: true,
    supportsAxes: true,
    supportsTooltip: true,
    emptyState: "Scatter plot rendering is not implemented yet.",
    description: "Future numeric relationship visual."
  },
  gauge: {
    type: "gauge",
    component: "GaugeChart",
    label: "Gauge",
    implemented: true,
    preferredTabs: ["Overview", "Data Quality"],
    layout: "score",
    supportsLegend: false,
    supportsAxes: false,
    supportsTooltip: true,
    emptyState: "No score was available.",
    description: "Quality, confidence, or component score gauge."
  },
  table: {
    type: "table",
    component: "DataTable",
    label: "Table",
    implemented: true,
    preferredTabs: ["Descriptive Statistics", "Deliverables"],
    layout: "wide",
    supportsLegend: false,
    supportsAxes: false,
    supportsTooltip: false,
    emptyState: "No table rows were available.",
    description: "Preview table or review table."
  },
  insightCard: {
    type: "insightCard",
    component: "InsightCard",
    label: "Insight card",
    implemented: true,
    preferredTabs: ["Overview", "Recommendations"],
    layout: "narrative",
    supportsLegend: false,
    supportsAxes: false,
    supportsTooltip: true,
    emptyState: "No insight text was available.",
    description: "Narrative insight with confidence and recommended action context."
  }
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
    layout: "standard",
    supportsLegend: false,
    supportsAxes: false,
    supportsTooltip: true,
    emptyState: "This visual type is not implemented yet.",
    description: "Fallback renderer for unsupported analytics recommendations."
  };
}

export function isSupportedChartType(type: VisualType): boolean {
  return getChartRenderer(type).implemented;
}

export function resolveChartComponent(visual: RecommendedVisual): ChartComponentName {
  const renderer = getChartRenderer(visual.type);
  return renderer.implemented ? renderer.component : "ComingSoonChart";
}
