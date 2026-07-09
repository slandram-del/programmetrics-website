import type { PackageManifest } from "../package-orchestrator";
import { buildVersionMetadata, type VersionMetadata } from "./versionMetadata";

export interface PackageVersionEnvelope {
  packageId: string;
  outputLevel: string;
  version: VersionMetadata;
}

export function buildPackageVersion(manifest: PackageManifest): PackageVersionEnvelope {
  return {
    packageId: manifest.package.id,
    outputLevel: manifest.outputLevel.id,
    version: buildVersionMetadata()
  };
}
