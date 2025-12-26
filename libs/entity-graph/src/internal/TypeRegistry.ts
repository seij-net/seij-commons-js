import { throwError } from "@seij/common-types";
import { ServiceConstructorProps, serviceRef } from "@seij/extension-platform";
import { errorOnDuplicates } from "@seij/extension-tooling";
import { TypeContributions, TypeExtension } from "../extension";
export const TypeRegistryServiceRef = serviceRef<TypeRegistry>("TypeRegistry");
export class TypeRegistry {
  contributionsByTypeCode: Record<string, TypeExtension>;
  public constructor(props: ServiceConstructorProps) {
    const contributions = props.extensionRegistry.findContributionsFlat(TypeContributions);
    try {
      errorOnDuplicates(contributions, (it) => it.code);
    } catch (err) {
      throw new Error("Error in type registry, type defined by multiple extensions", { cause: err });
    }
    this.contributionsByTypeCode = Object.fromEntries(contributions.map((it) => [it.code, it]));
  }
  findExtensionByCodeOptional(code: string): TypeExtension | null {
    return this.contributionsByTypeCode[code] ?? null;
  }
  findExtensionByCode(code: string): TypeExtension {
    return this.findExtensionByCodeOptional(code) ?? throwError(`Can not find type ${code} in TypeRegistry`);
  }
}
