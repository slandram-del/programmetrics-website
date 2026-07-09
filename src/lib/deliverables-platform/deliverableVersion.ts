import { buildVersionMetadata, type VersionMetadata } from "../versioning";

export interface DeliverableVersionMetadata extends VersionMetadata {
  deliverableId: string;
  templateId: string;
}

export function buildDeliverableVersion(deliverableId: string, templateId: string): DeliverableVersionMetadata {
  return {
    ...buildVersionMetadata(),
    deliverableId,
    templateId
  };
}
