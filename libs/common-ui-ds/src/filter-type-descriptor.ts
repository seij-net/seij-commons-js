import type { ReactNode } from "react";
import type { DsFilterableField, DsQueryFilter } from "./DsQuery";

export type FilterTypeDescriptor = {
  isFilter: (f: { type: string }) => boolean;
  isField: (f: { type: string }) => boolean;
  createDefault: (
    base: { id: string; field: string },
    field: DsFilterableField,
  ) => DsQueryFilter;
  renderRow: (
    filter: DsQueryFilter,
    field: DsFilterableField,
    onUpdate: (patch: object) => void,
    onRemove: () => void,
  ) => ReactNode;
  formatChip: (
    filter: DsQueryFilter,
    field: DsFilterableField | undefined,
  ) => string;
};
