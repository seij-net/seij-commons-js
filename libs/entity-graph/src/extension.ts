import { ValidationResult } from "@seij/common-validation";
import { ContributionPoint, Extension, ExtensionContext } from "@seij/extension-platform";
import { EntityDefinitionDto, RelationshipDefinitionDto } from "./dtos";
import { EntityPropertyDefinition } from "./interfaces";
import { EntityGraph, EntityGraphServiceRef } from "./internal/EntityGraphImpl";
import { TypeRegistry, TypeRegistryServiceRef } from "./internal/TypeRegistry";

export class EntityGraphExtension implements Extension {
  name = "seij.entity-graph";
  activate(context: ExtensionContext): void {
    context.registerService(TypeRegistryServiceRef, TypeRegistry);
    context.registerService(EntityGraphServiceRef, EntityGraph);
    context.registerContributionPoint(TypeContributions);
    context.registerContributionPoint(RelationshipContributions);
    context.registerContributionPoint(EntityContributions);
  }
}
export interface TypeExtension {
  code: string;
  validate: (propertyDefinition: EntityPropertyDefinition<any>, value: any) => ValidationResult;
}

export const TypeContributions: ContributionPoint<TypeExtension> = {
  code: "seij.entity-graph.TypeContributions",
};

export const RelationshipContributions: ContributionPoint<RelationshipDefinitionDto> = {
  code: "seij.entity-graph.RelationshipContributions",
};

export const EntityContributions: ContributionPoint<EntityDefinitionDto<any>> = {
  code: "seij.entity-graph.EntityContributions",
};
