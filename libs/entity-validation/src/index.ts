import { valid, ValidationResult } from "@seij/common-validation";
import { EntityGraph, EntityGraphServiceRef, TypeRegistry, TypeRegistryServiceRef } from "@seij/entity-graph";
import { Extension, ExtensionContext, ServiceConstructorProps, serviceRef } from "@seij/extension-platform";

export class EntityValidationExtension implements Extension {
  name = "seij.entity-validation";
  activate(context: ExtensionContext) {
    context.registerService(EntityValidationServiceRef, EntityValidationService);
  }
}

export const EntityValidationServiceRef = serviceRef<EntityValidationService>("EntityValidation");

export class EntityValidationService {
  private entityGraph: EntityGraph;
  private typeRegistry: TypeRegistry;
  constructor(props: ServiceConstructorProps) {
    this.typeRegistry = props.serviceRegistry.resolve(TypeRegistryServiceRef);
    this.entityGraph = props.serviceRegistry.resolve(EntityGraphServiceRef);
  }
  getValidationForCreation<T>(entityName: string): ((item: T) => ValidationResult)[] {
    const entity = this.entityGraph.findEntity(entityName);
    const defs = entity.findCreateProperties();
    const validations = defs.map((def) => {
      const typeExtension = this.typeRegistry.findExtensionByCodeOptional(def.type);
      if (typeExtension) {
        return (item: T) => {
          const result = typeExtension.validate(def, def.getValueAsAny(item));
          return { ...result, error: result.error ? def.name + ": " + result.error : result.error };
        };
      } else {
        return (_: T) => valid;
      }
    });
    return validations;
  }
}
