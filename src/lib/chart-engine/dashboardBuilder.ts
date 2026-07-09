import type { AnalyticsPlan, DataRow, RecommendedDeliverable, RecommendedInsight, RecommendedKpi } from "../analytics-engine";
import { buildChartData, type BuiltChartData } from "./chartDataBuilder";
import { normalizeDashboardTab, selectCharts, type ChartSelectionOptions } from "./chartSelector";

export const DASHBOARD_TABS = [
  "Overview",
  "Visual Analytics",
  "Data Quality",
  "Descriptive Statistics",
  "Missing Values",
  "Recommendations",
  "Deliverables"
] as const;

export type DashboardTabName = typeof DASHBOARD_TABS[number] | "Advanced Analytics";

export interface DashboardKpiCard extends RecommendedKpi {
  tab: DashboardTabName;
  clickable: boolean;
}

export interface DashboardInsightCard extends RecommendedInsight {
  tab: DashboardTabName;
}

export interface DashboardDeliverableCard extends RecommendedDeliverable {
  tab: DashboardTabName;
  actionLabel: string;
}

export interface DashboardTab {
  id: string;
  label: DashboardTabName;
  kpis: DashboardKpiCard[];
  visuals: BuiltChartData[];
  insights: DashboardInsightCard[];
  deliverables: DashboardDeliverableCard[];
  emptyState: string;
}

export interface DashboardBuildOptions extends ChartSelectionOptions {
  rows?: DataRow[];
  locked?: boolean;
}

export interface BuiltDashboard {
  tabs: DashboardTab[];
  activeTab: DashboardTabName;
  kpis: DashboardKpiCard[];
  visuals: BuiltChartData[];
  insights: DashboardInsightCard[];
  deliverables: DashboardDeliverableCard[];
  locked: boolean;
  watermark?: string;
  summary: {
    recordCount: number;
    fieldCount: number;
    qualityScore: number;
    confidenceScore: number;
    missingCells: number;
    missingPercent: number;
    datasetType: string;
  };
}

function tabId(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function emptyStateForTab(label: DashboardTabName): string {
  switch (label) {
    case "Overview":
      return "Upload and analyze a file to see KPIs, scorecards, and top insights.";
    case "Visual Analytics":
      return "No recommended visuals were available for this dataset.";
    case "Data Quality":
      return "No quality visuals were available for this dataset.";
    case "Descriptive Statistics":
      return "No descriptive statistics were available for this dataset.";
    case "Missing Values":
      return "No missing-value issues were detected.";
    case "Recommendations":
      return "No recommendations were generated yet.";
    case "Deliverables":
      return "No deliverables are configured for this package yet.";
    default:
      return "No dashboard content is available yet.";
  }
}

function kpiTab(kpi: RecommendedKpi): DashboardTabName {
  const key = `${kpi.id} ${kpi.title} ${kpi.detailPanelType}`.toLowerCase();
  if (key.includes("missing")) return "Missing Values";
  if (key.includes("quality") || key.includes("confidence") || key.includes("duplicate")) return "Data Quality";
  return "Overview";
}

function insightTab(insight: RecommendedInsight): DashboardTabName {
  const key = `${insight.title} ${insight.text} ${insight.recommendedAction}`.toLowerCase();
  if (key.includes("missing") || key.includes("blank")) return "Missing Values";
  if (key.includes("quality") || key.includes("duplicate") || key.includes("format")) return "Data Quality";
  return "Recommendations";
}

function deliverableAction(deliverable: RecommendedDeliverable, locked: boolean): string {
  if (locked || deliverable.locked || !deliverable.exportAvailable) return "Upgrade to export";
  if (deliverable.format === "zip") return "Export package";
  return `Download ${deliverable.format.toUpperCase()}`;
}

function createTabs(): Map<DashboardTabName, DashboardTab> {
  return new Map(DASHBOARD_TABS.map((label) => [
    label,
    { id: tabId(label), label, kpis: [], visuals: [], insights: [], deliverables: [], emptyState: emptyStateForTab(label) }
  ]));
}

function getOrCreateTab(tabs: Map<DashboardTabName, DashboardTab>, label: string): DashboardTab {
  const normalized = normalizeDashboardTab(label) as DashboardTabName;
  if (!tabs.has(normalized)) {
    tabs.set(normalized, { id: tabId(normalized), label: normalized, kpis: [], visuals: [], insights: [], deliverables: [], emptyState: emptyStateForTab(normalized) });
  }
  return tabs.get(normalized)!;
}

export function buildDashboard(plan: AnalyticsPlan, options: DashboardBuildOptions = {}): BuiltDashboard {
  const locked = options.locked ?? false;
  const rows = (options.rows || []) as Record<string, unknown>[];
  const tabs = createTabs();
  const kpis: DashboardKpiCard[] = (plan.recommendedKpis || []).map((kpi) => ({ ...kpi, tab: kpiTab(kpi), clickable: true }));
  const selectedVisuals = selectCharts(plan.recommendedVisuals || [], options);
  const visuals = selectedVisuals.map((visual) => {
    const chart = buildChartData(visual, plan, rows);
    chart.metadata = { ...chart.metadata, tab: visual.normalizedTab, locked: locked || visual.locked, component: visual.component };
    return chart;
  });
  const insights: DashboardInsightCard[] = (plan.recommendedInsights || []).map((insight) => ({ ...insight, tab: insightTab(insight) }));
  const deliverables: DashboardDeliverableCard[] = (plan.recommendedDeliverables || []).map((deliverable) => ({
    ...deliverable,
    tab: "Deliverables",
    actionLabel: deliverableAction(deliverable, locked)
  }));

  kpis.forEach((kpi) => getOrCreateTab(tabs, kpi.tab).kpis.push(kpi));
  visuals.forEach((visual) => getOrCreateTab(tabs, normalizeDashboardTab(String(visual.metadata.tab || selectedVisuals.find((item) => item.id === visual.visualId)?.normalizedTab || "Visual Analytics"))).visuals.push(visual));
  insights.forEach((insight) => getOrCreateTab(tabs, insight.tab).insights.push(insight));
  deliverables.forEach((deliverable) => getOrCreateTab(tabs, deliverable.tab).deliverables.push(deliverable));

  const orderedTabs = Array.from(tabs.values()).filter((tab) => (
    DASHBOARD_TABS.includes(tab.label as typeof DASHBOARD_TABS[number]) || tab.visuals.length || tab.kpis.length || tab.insights.length || tab.deliverables.length
  ));

  return {
    tabs: orderedTabs,
    activeTab: "Overview",
    kpis,
    visuals,
    insights,
    deliverables,
    locked,
    watermark: locked ? "ProgramMetrics Preview" : undefined,
    summary: {
      recordCount: plan.datasetProfile.totalRecords,
      fieldCount: plan.datasetProfile.totalFields,
      qualityScore: plan.qualityProfile.overallScore,
      confidenceScore: plan.confidenceProfile.overallConfidence,
      missingCells: plan.missingProfile.missingCells,
      missingPercent: plan.missingProfile.missingPercent,
      datasetType: plan.datasetType.primaryType
    }
  };
}
