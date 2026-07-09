import type { DeliverableManifestItem } from "./packageTypes";

export interface DeliverableCardModel {
  id: string;
  thumbnail: string;
  name: string;
  description: string;
  estimatedPages: number | null;
  generationTime: string;
  included: boolean;
  preview: boolean;
  locked: boolean;
  export: boolean;
}

export function buildDeliverableCards(deliverables: DeliverableManifestItem[]): DeliverableCardModel[] {
  return deliverables.map((deliverable) => ({
    id: deliverable.id,
    thumbnail: deliverable.thumbnail,
    name: deliverable.name,
    description: deliverable.description,
    estimatedPages: deliverable.estimatedPages ?? null,
    generationTime: deliverable.generationTime,
    included: deliverable.included,
    preview: deliverable.previewAvailable,
    locked: deliverable.locked,
    export: deliverable.exportAvailable
  }));
}
