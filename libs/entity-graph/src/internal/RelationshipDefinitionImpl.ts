import { RelationshipCardinalityDto, RelationshipDefinitionDto } from "../dtos";
import { RelationshipDefinition } from "../interfaces";

interface RelationshipSide {
  entity: string;
  cardinality: RelationshipCardinalityDto;
}

export class RelationshipDefinitionImpl implements RelationshipDefinition {
  code: string;
  sideA: RelationshipSide;
  sideB: RelationshipSide;

  public constructor(dto: RelationshipDefinitionDto) {
    this.code = dto.code;

    this.sideA = { entity: dto.fromEntity, cardinality: dto.fromCardinality };
    this.sideB = { entity: dto.toEntity, cardinality: dto.toCardinality };
  }

  public isToOne(from: string): boolean {
    const other = this.sideA.entity === from ? this.sideB : this.sideA;
    return other.cardinality.max === 1;
  }

  public otherEntity(entity: string): string {
    return this.sideA.entity === entity ? this.sideB.entity : this.sideA.entity;
  }
}
