import type { AnalyticsPlan, FieldProfile, RecommendedVisual, TopValue } from "../analytics-engine";
import { getChartRenderer, type ChartComponentName } from "./chartRegistry";
import { getLayoutForChart, type ChartLayoutSpec } from "./chartLayouts";

export interface ChartPoint {
  label: string;
  value: number;
  percent?: number;
  group?: string;
  color?: string;
  tooltip?: string;
  raw?: unknown;
}

export interface ChartAxisConfig {
  xLabel?: string;
  yLabel?: string;
  valueLabel?: string;
  categoryLabel?: string;
}

export interface ChartLegendItem {
  label: string;
  color: string;
  value?: number;
}

export interface BuiltChartData {
  visualId: string;
  type: RecommendedVisual["type"];
  component: ChartComponentName;
  title: string;
  description: string;
  fieldNames: string[];
  data: ChartPoint[];
  tableRows?: Record<string, unknown>[];
  score?: number;
  components?: Record<string, number>;
  stats?: Record<string, unknown>;
  axes: ChartAxisConfig;
  legend: ChartLegendItem[];
  layout: ChartLayoutSpec;
  tooltip: string;
  ariaLabel: string;
  insight: string;
  confidence: number;
  empty: boolean;
  emptyState: string;
  metadata: Record<string, unknown>;
}

const palette = ["#14b8a6", "#2563eb", "#7c3aed", "#f59e0b", "#ef4444", "#0f766e", "#475569", "#06b6d4", "#84cc16", "#f97316"];

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value.replace(/,/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function cleanLabel(value: unknown, fallback = "Value"): string {
  const label = String(value ?? "").trim();
  return label || fallback;
}

function fieldProfile(plan: AnalyticsPlan | undefined, fieldName: string): FieldProfile | undefined {
  return plan?.fieldProfiles.find((field) => field.fieldName === fieldName || field.displayLabel === fieldName);
}

function labelForField(plan: AnalyticsPlan | undefined, fieldName: string): string {
  return fieldProfile(plan, fieldName)?.displayLabel || fieldName;
}

function withVisualPolish(points: ChartPoint[]): ChartPoint[] {
  return points.map((point, index) => ({
    ...point,
    color: point.color || palette[index % palette.length],
    tooltip: point.tooltip || `${point.label}: ${point.value}${point.percent !== undefined ? ` (${Math.round(point.percent * 10) / 10}%)` : ""}`
  }));
}

function limitTopValues(values: TopValue[], top = 10, groupRareValues = true): ChartPoint[] {
  const safeTop = Math.max(1, Math.min(top, 10));
  const visible = values.slice(0, safeTop);
  const remainder = values.slice(safeTop);
  const points = visible.map((item) => ({ label: cleanLabel(item.value, "Blank"), value: item.count, percent: item.percent }));
  if (groupRareValues && remainder.length) {
    points.push({
      label: "Other",
      value: remainder.reduce((sum, item) => sum + item.count, 0),
      percent: remainder.reduce((sum, item) => sum + item.percent, 0)
    });
  }
  return withVisualPolish(points);
}

function buildFromConfigData(configData: unknown): ChartPoint[] {
  if (!configData) return [];
  if (Array.isArray(configData)) {
    return withVisualPolish(configData.map((item, index) => {
      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        return {
          label: cleanLabel(record.label ?? record.name ?? record.value ?? record.month ?? record.period ?? record.field, `Item ${index + 1}`),
          value: toNumber(record.count ?? record.value ?? record.total ?? record.y ?? record.score),
          percent: record.percent === undefined ? undefined : toNumber(record.percent),
          group: record.group === undefined ? undefined : String(record.group),
          raw: item
        };
      }
      return { label: cleanLabel(item), value: toNumber(item) };
    }));
  }
  if (typeof configData === "object") {
    return withVisualPolish(Object.entries(configData as Record<string, unknown>).map(([label, value]) => ({ label, value: toNumber(value), raw: value })));
  }
  return [];
}

function buildTopValuesFromRows(rows: Record<string, unknown>[], fieldName: string, top = 10, groupRareValues = true): ChartPoint[] {
  if (!fieldName || !rows.length) return [];
  const counts = new Map<string, number>();
  rows.forEach((row) => {
    const label = cleanLabel(row[fieldName], "Blank");
    counts.set(label, (counts.get(label) || 0) + 1);
  });
  const total = rows.length || 1;
  const values = Array.from(counts.entries()).map(([value, count]) => ({ value, count, percent: (count / total) * 100 })).sort((a, b) => b.count - a.count);
  return limitTopValues(values, top, groupRareValues);
}

function numericValuesFromRows(rows: Record<string, unknown>[], fieldName: string): number[] {
  return rows.map((row) => row[fieldName]).map((value) => typeof value === "number" ? value : Number(String(value ?? "").replace(/,/g, ""))).filter((value) => Number.isFinite(value));
}

function parseDateValue(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  const parsed = new Date(String(value ?? ""));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function quarterKey(date: Date): string {
  return `${date.getFullYear()} Q${Math.floor(date.getMonth() / 3) + 1}`;
}

function buildDateTrendFromRows(rows: Record<string, unknown>[], fieldName: string, grain = "month"): ChartPoint[] {
  const counts = new Map<string, number>();
  rows.forEach((row) => {
    const date = parseDateValue(row[fieldName]);
    if (!date) return;
    const key = grain === "quarter" ? quarterKey(date) : monthKey(date);
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return withVisualPolish(Array.from(counts.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([label, value]) => ({ label, value })));
}

function buildLineData(plan: AnalyticsPlan | undefined, visual: RecommendedVisual, rows: Record<string, unknown>[]): ChartPoint[] {
  const configData = buildFromConfigData(visual.chartConfig?.data);
  if (configData.length) return configData.sort((a, b) => a.label.localeCompare(b.label));
  const fieldName = visual.fieldNames[0];
  const stats = plan?.descriptiveStats.date.find((field) => field.fieldName === fieldName);
  if (stats?.recordsByMonth && Object.keys(stats.recordsByMonth).length) return buildFromConfigData(stats.recordsByMonth).sort((a, b) => a.label.localeCompare(b.label));
  if (stats?.recordsByQuarter && Object.keys(stats.recordsByQuarter).length) return buildFromConfigData(stats.recordsByQuarter).sort((a, b) => a.label.localeCompare(b.label));
  return buildDateTrendFromRows(rows, fieldName, String(visual.chartConfig?.grain || "month"));
}

function buildMissingData(plan: AnalyticsPlan | undefined, byPercent = false): ChartPoint[] {
  const fields = byPercent ? plan?.missingProfile.topMissingFieldsByPercent : plan?.missingProfile.topMissingFieldsByCount;
  return withVisualPolish((fields || []).slice(0, 10).map((field) => ({ label: field.displayLabel || field.fieldName, value: field.missingCount, percent: field.missingPercent })));
}

function buildCompletenessData(plan: AnalyticsPlan | undefined, fieldNames: string[]): ChartPoint[] {
  const fields = fieldNames.length ? fieldNames : (plan?.fieldProfiles || []).map((field) => field.fieldName);
  return withVisualPolish(fields.slice(0, 40).map((fieldName) => {
    const profile = fieldProfile(plan, fieldName);
    const completeness = profile ? Math.max(0, 100 - profile.missingPercent) : 0;
    return { label: profile?.displayLabel || fieldName, value: Math.round(completeness * 10) / 10, percent: completeness };
  }));
}

function buildHistogramData(plan: AnalyticsPlan | undefined, visual: RecommendedVisual, rows: Record<string, unknown>[]): ChartPoint[] {
  const fieldName = visual.fieldNames[0];
  const stats = plan?.descriptiveStats.numeric.find((field) => field.fieldName === fieldName);
  const values = numericValuesFromRows(rows, fieldName);
  const min = values.length ? Math.min(...values) : stats?.min;
  const max = values.length ? Math.max(...values) : stats?.max;
  if (min === null || min === undefined || max === null || max === undefined || min === max) return [];
  const bins = Math.max(4, Math.min(toNumber(visual.chartConfig?.bins, 10), 18));
  const step = (max - min) / bins;
  const counts = Array.from({ length: bins }, () => 0);
  values.forEach((value) => {
    const bucket = Math.min(bins - 1, Math.max(0, Math.floor((value - min) / step)));
    counts[bucket] += 1;
  });
  return withVisualPolish(counts.map((count, index) => {
    const start = min + step * index;
    const end = index === bins - 1 ? max : start + step;
    return { label: `${start.toFixed(1)}-${end.toFixed(1)}`, value: count };
  }));
}

function buildBoxPlotStats(plan: AnalyticsPlan | undefined, visual: RecommendedVisual): Record<string, unknown> | undefined {
  const fieldName = visual.fieldNames[0];
  const stats = plan?.descriptiveStats.numeric.find((field) => field.fieldName === fieldName);
  if (!stats) return undefined;
  return { fieldName, label: labelForField(plan, fieldName), min: stats.min, q1: stats.q1, median: stats.median, q3: stats.q3, max: stats.max, outlierCount: stats.outlierCount, outlierPercent: stats.outlierPercent };
}

function legendFromPoints(points: ChartPoint[], maxItems = 8): ChartLegendItem[] {
  return points.slice(0, maxItems).map((point) => ({ label: point.label, color: point.color || palette[0], value: point.value }));
}

function axesForVisual(plan: AnalyticsPlan | undefined, visual: RecommendedVisual): ChartAxisConfig {
  const fieldLabel = visual.fieldNames[0] ? labelForField(plan, visual.fieldNames[0]) : undefined;
  switch (visual.type) {
    case "line":
      return { xLabel: "Time period", yLabel: "Records", valueLabel: "Records" };
    case "histogram":
      return { xLabel: fieldLabel || "Value range", yLabel: "Records", valueLabel: "Records" };
    case "bar":
    case "horizontalBar":
      return { categoryLabel: fieldLabel || "Category", valueLabel: "Records" };
    case "boxplot":
      return { xLabel: fieldLabel || "Numeric field", yLabel: "Value" };
    default:
      return { categoryLabel: fieldLabel, valueLabel: "Value" };
  }
}

export function buildChartData(visual: RecommendedVisual, plan?: AnalyticsPlan, rows: Record<string, unknown>[] = []): BuiltChartData {
  const renderer = getChartRenderer(visual.type);
  const top = toNumber(visual.chartConfig?.top, 10);
  const groupRareValues = visual.chartConfig?.groupRareValues !== false;
  let data: ChartPoint[] = [];
  let tableRows: Record<string, unknown>[] | undefined;
  let score: number | undefined;
  let components: Record<string, number> | undefined;
  let stats: Record<string, unknown> | undefined;

  if (!renderer.implemented) data = buildFromConfigData(visual.chartConfig?.data);
  else {
    switch (visual.type) {
      case "line":
        data = buildLineData(plan, visual, rows);
        break;
      case "horizontalBar":
      case "bar":
      case "donut": {
        if (visual.id.includes("missing") || /missing/i.test(visual.title)) data = buildMissingData(plan);
        else {
          const profile = fieldProfile(plan, visual.fieldNames[0]);
          data = profile ? limitTopValues(profile.topValues, top, groupRareValues) : buildTopValuesFromRows(rows, visual.fieldNames[0], top, groupRareValues);
          if (!data.length) data = buildFromConfigData(visual.chartConfig?.data);
        }
        break;
      }
      case "heatmap":
        data = buildCompletenessData(plan, visual.fieldNames);
        break;
      case "histogram":
        data = buildHistogramData(plan, visual, rows);
        stats = buildBoxPlotStats(plan, visual);
        break;
      case "boxplot":
        stats = buildBoxPlotStats(plan, visual);
        data = stats ? withVisualPolish(["min", "q1", "median", "q3", "max"].map((key) => ({ label: key, value: toNumber(stats?.[key]) }))) : [];
        break;
      case "gauge":
        score = toNumber(visual.chartConfig?.score, plan?.qualityProfile.overallScore || plan?.confidenceProfile.overallConfidence || 0);
        components = (visual.chartConfig?.components as Record<string, number> | undefined) || plan?.qualityProfile.components;
        data = withVisualPolish(Object.entries(components || {}).map(([label, value]) => ({ label, value: toNumber(value) })));
        break;
      case "table":
        tableRows = rows.slice(0, toNumber(visual.chartConfig?.limit, 25));
        break;
      case "insightCard":
        data = visual.insight ? withVisualPolish([{ label: visual.title, value: Math.round(visual.confidence * 100), raw: visual.insight }]) : [];
        break;
      case "kpi":
        data = buildFromConfigData(visual.chartConfig?.data);
        break;
      default:
        data = buildFromConfigData(visual.chartConfig?.data);
    }
  }

  const layout = getLayoutForChart(renderer.layout);
  const legend = renderer.supportsLegend ? legendFromPoints(data) : [];
  const axes = renderer.supportsAxes ? axesForVisual(plan, visual) : axesForVisual(plan, visual);
  const empty = !data.length && !tableRows?.length && score === undefined && !stats;

  return {
    visualId: visual.id,
    type: visual.type,
    component: renderer.implemented ? renderer.component : "ComingSoonChart",
    title: visual.title,
    description: visual.description || renderer.description,
    fieldNames: visual.fieldNames,
    data,
    tableRows,
    score,
    components,
    stats,
    axes,
    legend,
    layout,
    tooltip: visual.insight || renderer.description,
    ariaLabel: `${visual.title}. ${visual.description || renderer.description}`,
    insight: visual.insight,
    confidence: visual.confidence,
    empty,
    emptyState: renderer.implemented ? renderer.emptyState : renderer.emptyState,
    metadata: { implemented: renderer.implemented, packageMinimum: visual.packageMinimum, levelMinimum: visual.levelMinimum, rendererLabel: renderer.label, supportsTooltip: renderer.supportsTooltip }
  };
}
