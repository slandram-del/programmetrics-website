import type { AnalyticsPlan, FieldProfile, RecommendedVisual, TopValue } from "../analytics-engine";
import { getChartRenderer } from "./chartRegistry";

export interface ChartPoint {
  label: string;
  value: number;
  percent?: number;
  group?: string;
  raw?: unknown;
}

export interface BuiltChartData {
  visualId: string;
  type: RecommendedVisual["type"];
  component: string;
  title: string;
  description: string;
  fieldNames: string[];
  data: ChartPoint[];
  tableRows?: Record<string, unknown>[];
  score?: number;
  components?: Record<string, number>;
  stats?: Record<string, unknown>;
  insight: string;
  confidence: number;
  empty: boolean;
  emptyState: string;
  metadata: Record<string, unknown>;
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value.replace(/,/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function labelForField(plan: AnalyticsPlan | undefined, fieldName: string): string {
  const profile = plan?.fieldProfiles.find((field) => field.fieldName === fieldName);
  return profile?.displayLabel || fieldName;
}

function fieldProfile(plan: AnalyticsPlan | undefined, fieldName: string): FieldProfile | undefined {
  return plan?.fieldProfiles.find((field) => field.fieldName === fieldName);
}

function limitTopValues(values: TopValue[], top = 10, groupRareValues = true): ChartPoint[] {
  const safeTop = Math.max(1, Math.min(top, 25));
  const visible = values.slice(0, safeTop);
  const remainder = values.slice(safeTop);
  const points = visible.map((item) => ({ label: String(item.value || "Blank"), value: item.count, percent: item.percent }));
  if (groupRareValues && remainder.length) {
    points.push({
      label: "Other",
      value: remainder.reduce((sum, item) => sum + item.count, 0),
      percent: remainder.reduce((sum, item) => sum + item.percent, 0)
    });
  }
  return points;
}

function buildFromConfigData(configData: unknown): ChartPoint[] {
  if (!configData) return [];
  if (Array.isArray(configData)) {
    return configData.map((item, index) => {
      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        return {
          label: String(record.label ?? record.name ?? record.value ?? record.month ?? record.field ?? `Item ${index + 1}`),
          value: toNumber(record.count ?? record.value ?? record.total ?? record.y),
          percent: record.percent === undefined ? undefined : toNumber(record.percent),
          raw: item
        };
      }
      return { label: String(item), value: toNumber(item) };
    });
  }
  if (typeof configData === "object") {
    return Object.entries(configData as Record<string, unknown>).map(([label, value]) => ({ label, value: toNumber(value), raw: value }));
  }
  return [];
}
function buildTopValuesFromRows(rows: Record<string, unknown>[], fieldName: string, top = 10, groupRareValues = true): ChartPoint[] {
  if (!fieldName || !rows.length) return [];
  const counts = new Map<string, number>();
  rows.forEach((row) => {
    const raw = row[fieldName];
    const label = raw === null || raw === undefined || String(raw).trim() === "" ? "Blank" : String(raw).trim();
    counts.set(label, (counts.get(label) || 0) + 1);
  });
  const total = rows.length || 1;
  const values = Array.from(counts.entries())
    .map(([value, count]) => ({ value, count, percent: (count / total) * 100 }))
    .sort((a, b) => b.count - a.count);
  return limitTopValues(values, top, groupRareValues);
}

function numericValuesFromRows(rows: Record<string, unknown>[], fieldName: string): number[] {
  return rows
    .map((row) => row[fieldName])
    .map((value) => typeof value === "number" ? value : Number(String(value ?? "").replace(/,/g, "")))
    .filter((value) => Number.isFinite(value));
}

function buildLineData(visual: RecommendedVisual): ChartPoint[] {
  const data = buildFromConfigData(visual.chartConfig?.data);
  return data.sort((a, b) => a.label.localeCompare(b.label));
}

function buildMissingData(plan: AnalyticsPlan | undefined): ChartPoint[] {
  return (plan?.missingProfile.topMissingFieldsByCount || []).slice(0, 10).map((field) => ({
    label: field.displayLabel || field.fieldName,
    value: field.missingCount,
    percent: field.missingPercent
  }));
}

function buildCompletenessData(plan: AnalyticsPlan | undefined, fieldNames: string[]): ChartPoint[] {
  const fields = fieldNames.length ? fieldNames : (plan?.fieldProfiles || []).map((field) => field.fieldName);
  return fields.slice(0, 30).map((fieldName) => {
    const profile = fieldProfile(plan, fieldName);
    const completeness = profile ? Math.max(0, 100 - profile.missingPercent) : 0;
    return { label: profile?.displayLabel || fieldName, value: Math.round(completeness * 10) / 10 };
  });
}

function buildHistogramData(plan: AnalyticsPlan | undefined, visual: RecommendedVisual, rows: Record<string, unknown>[]): ChartPoint[] {
  const fieldName = visual.fieldNames[0];
  const stats = plan?.descriptiveStats.numeric.find((field) => field.fieldName === fieldName);
  const values = numericValuesFromRows(rows, fieldName);
  const min = values.length ? Math.min(...values) : stats?.min;
  const max = values.length ? Math.max(...values) : stats?.max;
  if (min === null || min === undefined || max === null || max === undefined || min === max) return [];
  const bins = Math.max(3, Math.min(toNumber(visual.chartConfig?.bins, 10), 30));
  const step = (max - min) / bins;
  const counts = Array.from({ length: bins }, () => 0);
  values.forEach((value) => {
    const bucket = Math.min(bins - 1, Math.max(0, Math.floor((value - min) / step)));
    counts[bucket] += 1;
  });
  return counts.map((count, index) => {
    const start = min + step * index;
    const end = index === bins - 1 ? max : start + step;
    return { label: `${start.toFixed(1)}-${end.toFixed(1)}`, value: count };
  });
}

function buildBoxPlotStats(plan: AnalyticsPlan | undefined, visual: RecommendedVisual): Record<string, unknown> | undefined {
  const fieldName = visual.fieldNames[0];
  const stats = plan?.descriptiveStats.numeric.find((field) => field.fieldName === fieldName);
  if (!stats) return undefined;
  return {
    fieldName,
    label: labelForField(plan, fieldName),
    min: stats.min,
    q1: stats.q1,
    median: stats.median,
    q3: stats.q3,
    max: stats.max,
    outlierCount: stats.outlierCount,
    outlierPercent: stats.outlierPercent
  };
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

  if (!renderer.implemented) {
    return {
      visualId: visual.id,
      type: visual.type,
      component: "ComingSoonChart",
      title: visual.title,
      description: visual.description,
      fieldNames: visual.fieldNames,
      data: [],
      insight: visual.insight,
      confidence: visual.confidence,
      empty: true,
      emptyState: renderer.emptyState,
      metadata: { implemented: false, packageMinimum: visual.packageMinimum, levelMinimum: visual.levelMinimum }
    };
  }

  switch (visual.type) {
    case "line":
      data = buildLineData(visual);
      break;
    case "horizontalBar":
    case "bar":
    case "donut": {
      if (visual.id.includes("missing")) data = buildMissingData(plan);
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
      data = stats ? ["min", "q1", "median", "q3", "max"].map((key) => ({ label: key, value: toNumber(stats?.[key]) })) : [];
      break;
    case "gauge":
      score = toNumber(visual.chartConfig?.score, plan?.qualityProfile.overallScore || 0);
      components = (visual.chartConfig?.components as Record<string, number> | undefined) || plan?.qualityProfile.components;
      data = Object.entries(components || {}).map(([label, value]) => ({ label, value: toNumber(value) }));
      break;
    case "table":
      tableRows = rows.slice(0, toNumber(visual.chartConfig?.limit, 25));
      break;
    case "insightCard":
      data = visual.insight ? [{ label: visual.title, value: Math.round(visual.confidence * 100), raw: visual.insight }] : [];
      break;
    case "kpi":
    case "scatter":
    case "treemap":
      data = buildFromConfigData(visual.chartConfig?.data);
      break;
    default:
      data = buildFromConfigData(visual.chartConfig?.data);
  }

  return {
    visualId: visual.id,
    type: visual.type,
    component: renderer.component,
    title: visual.title,
    description: visual.description,
    fieldNames: visual.fieldNames,
    data,
    tableRows,
    score,
    components,
    stats,
    insight: visual.insight,
    confidence: visual.confidence,
    empty: !data.length && !tableRows?.length && score === undefined && !stats,
    emptyState: renderer.emptyState,
    metadata: { implemented: renderer.implemented, packageMinimum: visual.packageMinimum, levelMinimum: visual.levelMinimum }
  };
}
