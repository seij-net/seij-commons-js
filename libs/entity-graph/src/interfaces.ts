import { PropertyDefinitionDto } from "./dtos";

export interface EntityDefinition<T> {
  code: string;
  displayName: string;
  findProperty(property: string): EntityPropertyDefinition<T>;
  findCreateProperties(): EntityPropertyDefinition<T>[];
  findProperties(): EntityPropertyDefinition<T>[];
  defaultValueForCreation(): any;
}

export interface EntityPropertyDefinition<T> {
  type: PropertyDefinitionDto<T>["type"];
  required: boolean;
  create: boolean;
  id: string;
  defaultValue: unknown;
  name: string;
  description: string | null;
  relationship: PropertyDefinitionDto<T>["relationship"];
  dto: PropertyDefinitionDto<T>;
  getValueAsAny(instance: T): any;
  getValueAsString(instance: T): string | null | undefined;
}
export interface RelationshipDefinition {
  code: string;
  isToOne(from: string): boolean;
  otherEntity(entity: string): string;
}
