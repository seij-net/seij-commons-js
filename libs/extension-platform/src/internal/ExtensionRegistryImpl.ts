import { searchOnDuplicates } from "@seij/extension-tooling";
import {
  ContributionPoint,
  ContributionWithOrigin,
  Extension,
  ExtensionRegistry,
  ServiceContributions,
} from "../interfaces";
import { createPlatformError, PlatformError } from "./errors";

/**
 * Base implementation the registry
 */
export class ExtensionRegistryImpl implements ExtensionRegistry {
  public contributionStorageWithOrigin: Record<string, ContributionWithOrigin[]> = {};
  public contributionStorageFlat: Record<string, any[]> = {};
  public contributionPoints: Record<string, ContributionPoint<any>> = {};
  public platformErrors: PlatformError[] = [];
  private extensionMap: Record<string, Extension>;
  public constructor(private readonly extensionList: Extension[]) {
    this.extensionMap = Object.fromEntries(extensionList.map((it) => [it.name, it]));
  }
  init() {
    searchOnDuplicates(
      this.extensionList,
      (it) => it.name,
      (curr, _) => {
        this.platformErrors.push(createPlatformError(curr.name, `Another extension has the same identifier.`));
      },
    );
    this.extensionList.forEach((ext) =>
      ext.activate({
        register: (contributionPoint, contribution) => {
          this.registerContribution(ext.name, contributionPoint, contribution);
        },
        registerContributionPoint: (c) => {
          this.registerContributionPoint(ext, c, (msg) => this.platformErrors.push(createPlatformError(ext.name, msg)));
        },
        registerService: (ref, s) => {
          this.registerContribution(ext.name, ServiceContributions, {
            id: ref.id,
            constructor: s,
          });
        },
      }),
    );
    if (this.platformErrors.length > 0) {
      if (console) {
        this.platformErrors.forEach((it) => console.error(`Error in extension [${it.extensionId}]: ${it.message}`));
      }
      throw new Error("Extension Platform could not start due to errors: " + JSON.stringify(this.platformErrors));
    }
  }

  registerContributionPoint<EXT>(ext: Extension, c: ContributionPoint<EXT>, onError: (msg: string) => void) {
    if (!c.code.startsWith(ext.name)) {
      onError(
        `Contribution point [${c.code}] must have an identifier starting exactly with extension id [${ext.name}] to prevent further errors and extension point collisions.`,
      );
    }
    const existing = this.contributionPoints[c.code];
    if (!existing) this.contributionPoints[c.code] = c;
    else
      onError(
        `Error while declaring contribution point [${c.code}]. Another contribution point has already been declared with the same code.`,
      );
  }

  registerCoreContributionPoint<EXT>(ext: Extension, c: ContributionPoint<EXT>) {
    this.registerContributionPoint(ext, c, (msg) => this.platformErrors.push(createPlatformError(ext.name, msg)));
  }

  private registerContribution<EXT>(extensionId: string, e: ContributionPoint<EXT>, contribution: EXT) {
    // Standard version

    if (this.contributionStorageWithOrigin[e.code] === undefined) {
      this.contributionStorageWithOrigin[e.code] = [];
    }
    this.contributionStorageWithOrigin[e.code].push({ extensionId: extensionId, item: contribution });

    // Fast version

    if (this.contributionStorageFlat[e.code] === undefined) {
      this.contributionStorageFlat[e.code] = [];
    }
    this.contributionStorageFlat[e.code].push(contribution);
  }

  findContributionsFlat<EXT>(extensionPoint: ContributionPoint<EXT>): EXT[] {
    if (this.contributionPoints[extensionPoint.code] === undefined) {
      console.warn(`Contribution point ${extensionPoint.code} not declared`);
    }
    const ep = this.contributionStorageFlat[extensionPoint.code];
    if (ep === undefined) return [];
    return ep as EXT[];
  }

  findContributionsWithOrigin<EXT>(extensionPoint: ContributionPoint<EXT>): ContributionWithOrigin<EXT>[] {
    if (this.contributionPoints[extensionPoint.code] === undefined) {
      console.warn(`Contribution point ${extensionPoint.code} not declared`);
    }
    const ep = this.contributionStorageWithOrigin[extensionPoint.code];
    if (ep === undefined) return [];
    return ep as ContributionWithOrigin<EXT>[];
  }
}
