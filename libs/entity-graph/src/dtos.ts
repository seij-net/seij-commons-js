export interface EntityDefinitionDto<T> {
  code: string;
  displayName: string;
  propertyList: PropertyDefinitionDtoList<T>;
}

export interface PropertyDefinitionDto<T> {
  id: keyof T;
  name: string;
  description: string | null;
  type: string;
  required: boolean;
  create: boolean;
  defaultValue?: unknown | undefined | null;
  relationship?: {
    code: string;
    from: string;
  };

}

export type PropertyDefinitionDtoList<T> = PropertyDefinitionDto<T>[];

export interface RelationshipCardinalityDto {
  min: number;
  max: number | null;
}

export interface RelationshipDefinitionDto {
  code: string;
  fromEntity: string;
  fromCardinality: RelationshipCardinalityDto;
  toEntity: string;
  toCardinality: RelationshipCardinalityDto;
}
