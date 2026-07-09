import type { OutputLevelDefinition, OutputLevelId } from "./packageTypes";

export const outputLevelRegistry: OutputLevelDefinition[] = [
  {
    id: "essential",
    name: "Essential",
    rank: 1,
    inherits: ["essential"],
    description: "Core cleaned data, validation, and preview-ready analytics."
  },
  {
    id: "professional",
    name: "Professional",
    rank: 2,
    inherits: ["essential", "professional"],
    description: "Adds reusable workbooks, richer reporting, and management-ready outputs."
  },
  {
    id: "premium",
    name: "Premium",
    rank: 3,
    inherits: ["essential", "professional", "premium"],
    description: "Adds branded dashboards, presentation-ready assets, and expanded analytics."
  },
  {
    id: "executive",
    name: "Executive",
    rank: 4,
    inherits: ["essential", "professional", "premium", "executive"],
    description: "Complete executive package with broad export, reporting, and enterprise-ready scope."
  }
];

const aliases: Record<string, OutputLevelId> = {
  complete: "executive",
  custom: "executive"
};

export function normalizeOutputLevel(levelId: string | undefined): OutputLevelId {
  const normalized = (levelId || "essential").toLowerCase();
  return (aliases[normalized] || normalized) as OutputLevelId;
}

export function getOutputLevelDefinition(levelId: string | undefined): OutputLevelDefinition {
  const normalized = normalizeOutputLevel(levelId);
  return outputLevelRegistry.find((level) => level.id === normalized) || outputLevelRegistry[0];
}

export function getInheritedOutputLevels(levelId: string | undefined): OutputLevelDefinition[] {
  const selected = getOutputLevelDefinition(levelId);
  return selected.inherits.map(getOutputLevelDefinition);
}

export function levelMeetsMinimum(selectedLevel: string | undefined, requiredLevel: OutputLevelId): boolean {
  return getOutputLevelDefinition(selectedLevel).rank >= getOutputLevelDefinition(requiredLevel).rank;
}
