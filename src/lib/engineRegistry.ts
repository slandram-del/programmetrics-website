import { PROTECTED_ANALYTICS_SERVICES } from "./platform";

export type EngineKey =
  | "analyticsRecommendation"
  | "analyticsIntelligence"
  | "chart"
  | "deliverables"
  | "branding"
  | "workflow"
  | "ai";

export interface EngineDescriptor {
  key: EngineKey;
  name: string;
  layer: "engine";
  protected: boolean;
  serviceBoundary: string;
  outputOnly: boolean;
  notes: string;
}

export const engineRegistry: Record<EngineKey, EngineDescriptor> = {
  analyticsRecommendation: {
    key: "analyticsRecommendation",
    name: "Analytics Recommendation Engine",
    layer: "engine",
    protected: true,
    serviceBoundary: "analyticsService",
    outputOnly: true,
    notes: "Produces AnalyticsPlan outputs from prepared data. Do not expose formulas or recommendation heuristics."
  },
  analyticsIntelligence: {
    key: "analyticsIntelligence",
    name: "Analytics Intelligence Engine",
    layer: "engine",
    protected: true,
    serviceBoundary: "analyticsService",
    outputOnly: true,
    notes: "Produces observations, findings, warnings, recommendations, actions, and narratives from AnalyticsPlan."
  },
  chart: {
    key: "chart",
    name: "Chart Engine",
    layer: "engine",
    protected: false,
    serviceBoundary: "previewService",
    outputOnly: true,
    notes: "Converts recommendedVisuals into dashboard render models."
  },
  deliverables: {
    key: "deliverables",
    name: "Deliverables Engine",
    layer: "engine",
    protected: true,
    serviceBoundary: "deliverablesService",
    outputOnly: true,
    notes: "Determines package-aware deliverables and export availability."
  },
  branding: {
    key: "branding",
    name: "Branding Engine",
    layer: "engine",
    protected: false,
    serviceBoundary: "brandingService",
    outputOnly: true,
    notes: "Applies branding defaults and profiles to report render outputs."
  },
  workflow: {
    key: "workflow",
    name: "Workflow Engine",
    layer: "engine",
    protected: false,
    serviceBoundary: "workflowService",
    outputOnly: true,
    notes: "Prepares saved workflow and automation contracts for future persistence."
  },
  ai: {
    key: "ai",
    name: "AI Engine",
    layer: "engine",
    protected: true,
    serviceBoundary: "analyticsService",
    outputOnly: true,
    notes: "Future AI Analyst should consume grounded context rather than raw proprietary logic."
  }
};

export function getEngineDescriptor(key: EngineKey): EngineDescriptor {
  return engineRegistry[key];
}

export function listProtectedEngines(): EngineDescriptor[] {
  const protectedNames = new Set<string>(PROTECTED_ANALYTICS_SERVICES);
  return Object.values(engineRegistry).filter((engine) => engine.protected || protectedNames.has(engine.name));
}
