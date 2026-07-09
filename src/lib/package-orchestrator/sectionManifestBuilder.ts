import type { DeliverableManifestItem, PackageDefinition, SectionManifestItem } from "./packageTypes";

const sectionTitles: Record<string, string> = {
  cover: "Cover",
  "executive-summary": "Executive Summary",
  "dataset-overview": "Dataset Overview",
  "quality-review": "Quality Review",
  "missing-values": "Missing Values",
  "duplicate-review": "Duplicate Review",
  statistics: "Statistics",
  "visual-analytics": "Visual Analytics",
  findings: "Findings",
  recommendations: "Recommendations",
  appendix: "Appendix",
  methodology: "Methodology",
  limitations: "Limitations",
  "processing-notes": "Processing Notes",
  "data-dictionary": "Data Dictionary",
  "workflow-design": "Workflow Design",
  "enterprise-scope": "Enterprise Scope"
};

export function buildSectionManifest(pkg: PackageDefinition, deliverables: DeliverableManifestItem[], industrySections: SectionManifestItem[] = []): SectionManifestItem[] {
  const ids = new Set<string>(pkg.baseSections);
  deliverables.filter((item) => item.included || item.previewAvailable).forEach((item) => item.sections.forEach((section) => ids.add(section)));
  industrySections.forEach((section) => ids.add(section.id));

  return Array.from(ids).map((id) => {
    const included = deliverables.some((item) => item.included && item.sections.includes(id)) || pkg.baseSections.includes(id);
    const locked = deliverables.some((item) => item.locked && item.sections.includes(id)) && !included;
    return {
      id,
      title: sectionTitles[id] || id.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
      included,
      previewAvailable: true,
      locked,
      source: pkg.baseSections.includes(id) ? "package" : "deliverable"
    };
  });
}
