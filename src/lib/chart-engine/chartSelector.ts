import type { AnalyticsPlan, RecommendedVisual } from "../analytics-engine";
import { getChartRenderer } from "./chartRegistry";

const canonicalTabNames: Record<string, string> = {
  overview: "Overview",
  "visual analytics": "Visual Analytics",
  visuals: "Visual Analytics",
  "data quality": "Data Quality",
  quality: "Data Quality",
  "descriptive statistics": "Descriptive Statistics",
  statistics: "Descriptive Statistics",
  stats: "Descriptive Statistics",
  "missing values": "Missing Values",
  missing: "Missing Values",
  recommendations: "Recommendations",
  deliverables: "Deliverables",
  exports: "Deliverables",
  "advanced analytics": "Advanced Analytics"
};

export interface ChartSelectionOptions {
  maxVisuals?: number;
  includeComingSoon?: boolean;
  packageRank?: number;
  requiredTabs?: string[];
}

export interface SelectedChartVisual extends RecommendedVisual {
  normalizedTab: string;
  component: string;
  implemented: boolean;
  locked: boolean;
}

export function normalizeDashboardTab(tab?: string): string {
  const key = String(tab || "Visual Analytics").trim().toLowerCase();
  return canonicalTabNames[key] || tab || "Visual Analytics";
}

function packageWeight(packageMinimum?: string): number {
  const key = String(packageMinimum || "").toLowerCase();
  if (key.includes("enterprise")) return 5;
  if (key.includes("executive")) return 4;
  if (key.includes("professional")) return 3;
  if (key.includes("management")) return 2;
  if (key.includes("foundation")) return 1;
  return 1;
}

export function selectCharts(recommendedVisuals: RecommendedVisual[], options: ChartSelectionOptions = {}): SelectedChartVisual[] {
  const allowedTabs = new Set((options.requiredTabs || []).map(normalizeDashboardTab));
  const includeComingSoon = options.includeComingSoon ?? true;
  const maxVisuals = options.maxVisuals ?? recommendedVisuals.length;
  const packageRank = options.packageRank ?? Number.POSITIVE_INFINITY;

  return recommendedVisuals
    .map((visual) => {
      const renderer = getChartRenderer(visual.type);
      const normalizedTab = normalizeDashboardTab(visual.tab || renderer.preferredTabs[0]);
      return {
        ...visual,
        normalizedTab,
        component: renderer.implemented ? renderer.component : "ComingSoonChart",
        implemented: renderer.implemented,
        locked: packageWeight(visual.packageMinimum) > packageRank
      };
    })
    .filter((visual) => includeComingSoon || visual.implemented)
    .filter((visual) => !allowedTabs.size || allowedTabs.has(visual.normalizedTab))
    .sort((a, b) => a.priority - b.priority || b.confidence - a.confidence)
    .slice(0, maxVisuals);
}

export function selectChartsForPlan(plan: AnalyticsPlan, options: ChartSelectionOptions = {}): SelectedChartVisual[] {
  return selectCharts(plan.recommendedVisuals || [], options);
}
