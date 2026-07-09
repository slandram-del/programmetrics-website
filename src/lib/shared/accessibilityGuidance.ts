export interface AccessibilityRequirement {
  area: string;
  requirement: string;
  verification: string;
}

export const studioAccessibilityRequirements: AccessibilityRequirement[] = [
  { area: "Keyboard", requirement: "Every Studio action, tab, card, and modal control must be reachable by keyboard.", verification: "Tab through upload, setup, package selection, preview tabs, KPI panels, and export controls." },
  { area: "Focus", requirement: "Visible focus styles must be present on links, buttons, selects, inputs, cards, tabs, and modal controls.", verification: "Use keyboard-only navigation and confirm focus is visible at all times." },
  { area: "Modals", requirement: "Interactive preview and KPI panels must have clear labels, close controls, and Escape-key handling.", verification: "Open and close panels with keyboard and screen reader labels." },
  { area: "Charts", requirement: "Charts must include text summaries or table fallbacks for non-visual users.", verification: "Confirm every chart tile has an accessible title and summary." },
  { area: "Color", requirement: "Status and lock states cannot rely on color alone.", verification: "Confirm labels such as Available, Preview only, Locked, and Export disabled are visible." }
];
