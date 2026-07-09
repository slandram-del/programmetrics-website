import type { PrioritizedRecommendation, IntelligenceWarning, ActionPlanItem } from "./analyticsIntelligenceEngine";

export function buildActionPlan(recommendations: PrioritizedRecommendation[], warnings: IntelligenceWarning[]): ActionPlanItem[] {
  const actions: ActionPlanItem[] = [];
  recommendations.slice(0, 10).forEach((recommendation) => {
    const priority: ActionPlanItem["priority"] = recommendation.rank === "Critical"
      ? "Fix immediately"
      : recommendation.rank === "High"
        ? "Review before reporting"
        : recommendation.category === "Monitor"
          ? "Monitor monthly"
          : recommendation.category === "Collect"
            ? "Recommended future collection"
            : "Optional improvement";

    actions.push({
      id: `action-${recommendation.id}`,
      priority,
      title: recommendation.title,
      description: recommendation.recommendedAction,
      estimatedEffort: recommendation.estimatedEffort,
      expectedImpact: recommendation.expectedImpact,
      relatedRecommendations: [recommendation.id]
    });
  });

  warnings.filter((warning) => warning.severity === "critical").forEach((warning) => {
    if (!actions.some((action) => action.title === warning.title)) {
      actions.unshift({
        id: `action-warning-${warning.id}`,
        priority: "Fix immediately",
        title: warning.title,
        description: warning.recommendedFixes[0] || warning.description,
        estimatedEffort: warning.affectedFields.length > 5 ? "High" : "Medium",
        expectedImpact: "High",
        relatedRecommendations: [`fix-${warning.id}`]
      });
    }
  });

  return actions.slice(0, 10);
}
