import type { DatasetTypeProfile } from "../analytics-engine";
import type { IndustryContext, IndustryManifest, SectionManifestItem } from "./packageTypes";

function normalizeIndustry(datasetType?: DatasetTypeProfile): IndustryContext {
  switch (datasetType?.primaryType) {
    case "survey":
      return "survey";
    case "housingOrShelter":
      return "housing";
    case "behavioralHealth":
      return "behavioralHealth";
    case "education":
      return "education";
    case "healthcare":
      return "healthcare";
    case "finance":
      return "finance";
    case "crm":
      return "crm";
    case "caseManagement":
      return "caseManagement";
    case "referralOrDenial":
    case "programEvaluation":
      return "research";
    default:
      return "generic";
  }
}

export function buildIndustryManifest(datasetType?: DatasetTypeProfile): IndustryManifest {
  const context = normalizeIndustry(datasetType);
  const confidence = datasetType?.confidence || 0;
  const optionalSections: SectionManifestItem[] = [];
  const recommendedDashboards: string[] = [];

  if (context === "survey" || context === "research") {
    optionalSections.push({ id: "response-quality", title: "Response Quality", included: true, previewAvailable: true, locked: false, source: "industry" });
    recommendedDashboards.push("Survey Response Dashboard");
  }
  if (context === "housing" || context === "caseManagement") {
    optionalSections.push({ id: "client-program-flow", title: "Client / Program Flow", included: true, previewAvailable: true, locked: false, source: "industry" });
    recommendedDashboards.push("Program Flow Dashboard");
  }
  if (context === "government") {
    optionalSections.push({ id: "compliance-review", title: "Compliance Review", included: true, previewAvailable: true, locked: false, source: "industry" });
    recommendedDashboards.push("Compliance Dashboard");
  }

  return { context, confidence, optionalSections, recommendedDashboards };
}
