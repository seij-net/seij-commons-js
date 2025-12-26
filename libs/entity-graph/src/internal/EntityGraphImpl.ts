import { throwError } from "@seij/common-types";
import { valid, ValidationResult } from "@seij/common-validation";
import { ServiceConstructorProps, serviceRef } from "@seij/extension-platform";
import { errorOnDuplicates } from "@seij/extension-tooling";
import { isString } from "lodash-es";
import { EntityDefinitionDto, PropertyDefinitionDto, RelationshipDefinitionDto } from "../dtos";
import { EntityContributions, RelationshipContributions } from "../extension";
import { EntityDefinition, EntityPropertyDefinition, RelationshipDefinition } from "../interfaces";
import { RelationshipDefinitionImpl } from "./RelationshipDefinitionImpl";
import { TypeRegistry, TypeRegistryServiceRef } from "./TypeRegistry";
export const EntityGraphServiceRef = serviceRef<EntityGraph>("EntityGraph");
export class EntityGraph {
  private entityList: EntityDefinitionImpl<any>[];
  private entityMap: Record<string, EntityDefinitionImpl<any>>;
  private relationshipList: RelationshipDefinitionImpl[];
  private relationshipMap: Record<string, RelationshipDefinitionImpl>;

  public constructor(props: ServiceConstructorProps) {
    const typeRegistry: TypeRegistry = props.serviceRegistry.resolve(TypeRegistryServiceRef);
    const entityDtoList: EntityDefinitionDto<any>[] =
      props.extensionRegistry.findContributionsFlat(EntityContributions);
    const relationshipDtoList: RelationshipDefinitionDto[] =
      props.extensionRegistry.findContributionsFlat(RelationshipContributions);
    this.entityList = entityDtoList.map((it) => new EntityDefinitionImpl(typeRegistry, it));
    this.entityMap = Object.fromEntries(this.entityList.map((it) => [it.code, it]));
    this.relationshipList = relationshipDtoList.map((it) => new RelationshipDefinitionImpl(it));
    this.relationshipMap = Object.fromEntries(this.relationshipList.map((item) => [item.code, item]));
    this.validate();
  }

  public findEntity<T = unknown>(name: string): EntityDefinition<T> {
    return this.entityMap[name] ?? throwError(`Entity ${name} not found in registry`);
  }
  public findEntityOptional<T = unknown>(name: string): EntityDefinition<T> {
    return this.entityMap[name];
  }

  public findRelationship(name: string): RelationshipDefinition {
    return this.relationshipMap[name] ?? throwError(`Relationship ${name} not found in registry`);
  }

  private validate() {
    // Validate fields
    this.entityList.forEach((e) => e.validate());
    // Validate relationships
    this.entityList.forEach((e) =>
      e.findProperties().forEach((p) => {
        if (p.type === "Relationship") {
          const relationshipCode = p.relationship?.code;
          if (!relationshipCode) throw new Error(`${e.code}.${p.id} doesn't declare a correct relationship.`);
          const rel = this.relationshipMap[relationshipCode];
          if (!rel)
            throw new Error(
              `${e.code}.${p.id} declares relationship ${relationshipCode} that is not found in registry.`,
            );
        }
      }),
    );
  }
}

export class EntityDefinitionImpl<T> {
  code: string;
  displayName: string;
  propertyList: EntityPropertyDefinition<T>[];
  propertyMap: Record<string, EntityPropertyDefinition<T>>;

  constructor(
    private readonly typeRegistry: TypeRegistry,
    private readonly dto: EntityDefinitionDto<T>,
  ) {
    this.propertyList = dto.propertyList.map((it) => new EntityPropertyDefinitionImpl(this, it));
    this.propertyMap = Object.fromEntries(this.propertyList.map((it) => [it.id, it]));
    this.code = dto.code;
    this.displayName = dto.displayName;
  }
  findProperty(property: string): EntityPropertyDefinition<T> {
    return this.propertyMap[property] ?? throwError(`Property ${property} not found in entity ${this.code}`);
  }
  findCreateProperties(): EntityPropertyDefinition<T>[] {
    return this.propertyList.filter((it) => it.create);
  }
  findProperties(): EntityPropertyDefinition<T>[] {
    return this.propertyList;
  }
  defaultValueForCreation() {
    const defs = this.findCreateProperties();
    const defaultValue: any = {};
    defs.forEach((def) => {
      defaultValue[def.id] = def.defaultValue === undefined ? null : def.defaultValue;
    });
    return defaultValue;
  }
  getValidationForCreation(): ((item: T) => ValidationResult)[] {
    const defs = this.findCreateProperties();
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
  /**
   * Validates that all property definitions are correct
   */
  validate() {
    this.findProperties().forEach((propertyDefinition) => {
      const ext = this.typeRegistry.findExtensionByCodeOptional(propertyDefinition.type);
      if (ext === null) {
        throw new Error(
          `Property type ${propertyDefinition.type} found in ${this.code}.${propertyDefinition.id} not managed by an extension`,
        );
      }
    });
    try {
      errorOnDuplicates(this.findProperties(), (it) => it.id);
    } catch (err) {
      throw new Error(`Error in entity ${this.code}`, { cause: err });
    }
  }
}

export class EntityPropertyDefinitionImpl<T> implements EntityPropertyDefinition<T> {
  type: string;
  required: boolean;
  create: boolean;
  id: string;
  defaultValue: unknown;
  name: string;
  description: string | null;
  relationship: PropertyDefinitionDto<T>["relationship"];

  constructor(
    private readonly entity: EntityDefinition<T>,
    public readonly dto: PropertyDefinitionDto<T>,
  ) {
    this.id = dto.id as string;
    this.type = dto.type;
    this.required = dto.required;
    this.create = dto.create;
    this.defaultValue = dto.defaultValue;
    this.name = dto.name;
    this.description = dto.description;
    this.relationship = dto.relationship;
  }
  getValueAsAny(instance: T): any {
    const val = (instance as any)[this.id];
    return val;
  }
  getValueAsString(instance: T): string | null | undefined {
    const val = (instance as any)[this.id];
    if (val === null) return null;
    if (val === undefined) return undefined;
    if (!isString(val))
      throw Error(`Instance of entity ${this.entity.code} has property ${this.id} but of type ${typeof val}`);
    return val as string;
  }
}
