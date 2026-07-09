export interface SecurityReviewItem {
  area: string;
  status: "pass" | "watch" | "planned";
  note: string;
}

export const protectedLogicBoundaries = [
  "analytics-engine",
  "analytics-engine/intelligence",
  "package-orchestrator",
  "deliverables-platform",
  "branding-engine",
  "ai-engine"
] as const;

export function getSecurityReviewChecklist(): SecurityReviewItem[] {
  return [
    { area: "Secrets", status: "watch", note: "Keep API keys, payment secrets, and access tokens out of static files and public docs." },
    { area: "Protected analytics", status: "pass", note: "Protected engines should return structured outputs, not formulas or scoring weights." },
    { area: "Package rules", status: "pass", note: "Package rules should be consumed as manifests through services." },
    { area: "Report assembly", status: "pass", note: "UI should receive report objects and preview metadata, not assembly rules." },
    { area: "Exports", status: "planned", note: "Future export adapters must enforce manifest permissions server-side, not only through hidden buttons." }
  ];
}

export function isProtectedBoundary(path: string): boolean {
  const normalized = path.replace(/\\/g, "/").toLowerCase();
  return protectedLogicBoundaries.some((boundary) => normalized.includes(`/src/lib/${boundary}`));
}
