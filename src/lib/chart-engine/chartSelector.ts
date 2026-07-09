import type { AnalyticsPlan, RecommendedVisual } from "../analytics-engine";
import { getChartRenderer } from "./chartRegistry";

const canonicalTabNames: Record<string, string> = {
  overview: "Overview",
  "visual analytics": "Visual Analytics",
  visuals: "Visual Analytics",
  dashboard: "Visual Analytics",
  "data quality": "Data Quality",
  quality: "Data Quality",
  "descriptive statistics": "Descriptive Statistics",
  statistics: "Descriptive Statistics",
  stats: "Descriptive Statistics",
  "missing values": "Missing Values",
  missing: "Missing Values",
  recommendations: "Recommendations",
  recommendation: "Recommendations",
  deliverables: "Deliverables",
  exports: "Deliverables",
  export: "Deliverables",
  "advanced analytics": "Advanced Analytics",
  forecasting: "Advanced Analytics"
};

export interface ChartSelectionOptions {
  maxVisuals?: number;
  includeUnsupported?: boolean;
  packageRank?: number;
  requiredTabs?: string[];
  prioritizeSupported?: boolean;
}

export interface SelectedChartVisual extends RecommendedVisual {
  normalizedTab: string;
  component: string;
  implemented: boolean;
  locked: boolean;
  rendererLabel: string;
  sortScore: number;
}

export function normalizeDashboardTab(tab?: string): string {
  const key = String(tab || "Visual Analytics").trim().toLowerCase().replace(/\s+/g, " ");
  return canonicalTabNames[key] || tab || "Visual Analytics";
}

function packageWeight(packageMinimum?: string): number {
  const key = String(packageMinimum || "").toLowerCase();
  if (key.includes("enterprise")) return 5;
  if (key.includes("executive")) return 4;
  if (key.includes("professional")) return 3;
  if (key.includes("management")) return 2;
  if (key.includes("foundation") || key.includes("data")) return 1;
  return 1;
}

function visualSortScore(visual: RecommendedVisual, implemented: boolean): number {
  const priorityScore = Math.max(0, 1000 - (Number(visual.priority) || 999));
  const confidenceScore = Math.round((Number(visual.confidence) || 0) * 100);
  const supportScore = implemented ? 100 : 0;
  return priorityScore + confidenceScore + supportScore;
}

export function selectCharts(recommendedVisuals: RecommendedVisual[], options: ChartSelectionOptions = {}): SelectedChartVisual[] {
  const allowedTabs = new Set((options.requiredTabs || []).map(normalizeDashboardTab));
  const includeUnsupported = options.includeUnsupported ?? true;
  const maxVisuals = options.maxVisuals ?? recommendedVisuals.length;
  const packageRank = options.packageRank ?? Number.POSITIVE_INFINITY;
  const prioritizeSupported = options.prioritizeSupported ?? false;

  return recommendedVisuals
    .map((visual) => {
      const renderer = getChartRenderer(visual.type);
      const normalizedTab = normalizeDashboardTab(visual.tab || renderer.preferredTabs[0]);
      const implemented = renderer.implemented;
      return {
        ...visual,
        normalizedTab,
        component: implemented ? renderer.component : "ComingSoonChart",
        implemented,
        locked: packageWeight(visual.packageMinimum) > packageRank,
        rendererLabel: renderer.label,
        sortScore: visualSortScore(visual, implemented)
      };
    })
    .filter((visual) => includeUnsupported || visual.implemented)
    .filter((visual) => !allowedTabs.size || allowedTabs.has(visual.normalizedTab))
    .sort((a, b) => {
      if (prioritizeSupported && a.implemented !== b.implemented) return a.implemented ? -1 : 1;
      return a.priority - b.priority || b.sortScore - a.sortScore;
    })
    .slice(0, maxVisuals);
}

export function selectChartsForPlan(plan: AnalyticsPlan, options: ChartSelectionOptions = {}): SelectedChartVisual[] {
  return selectCharts(plan.recommendedVisuals || [], options);
}
