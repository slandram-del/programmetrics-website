// Protected business logic: expose result contracts through src/lib/platform
// for UI and future API callers. Keep internal formulas and recommendation
// heuristics inside analytics-engine modules.
export * from "./analyticsRecommendationEngine";
export * from "./analyticsConfidenceScore";
export * from "./datasetClassifier";
export * from "./datasetProfiler";
export * from "./descriptiveStatistics";
export * from "./deliverableRecommendation";
export * from "./duplicateAnalyzer";
export * from "./fieldProfiler";
export * from "./fieldRoleDetector";
export * from "./fieldTypeDetector";
export * from "./insightGenerator";
export * from "./kpiRecommendationEngine";
export * from "./missingValueAnalyzer";
export * from "./qualityScoreEngine";
export * from "./recommendationGenerator";
export * from "./setupRows";
export * from "./types";
export * from "./visualRecommendationEngine";
