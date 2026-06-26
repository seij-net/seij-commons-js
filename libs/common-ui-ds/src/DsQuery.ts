export type {
  DsQueryTextFilterCondition,
  DsQueryTextFilter,
  DsFilterableTextField,
} from "./type-text";
export type {
  DsQuerySelectFilterCondition,
  DsQuerySelectFilter,
  DsFilterableSelectField,
} from "./type-select";
export type {
  DsQueryBooleanFilterCondition,
  DsQueryBooleanFilter,
  DsFilterableBooleanField,
} from "./type-boolean";
export type {
  DsQueryInstantFilterCondition,
  DsQueryInstantOptionalFilterCondition,
  DsQueryInstantFilter,
  DsQueryInstantOptionalFilter,
  DsFilterableInstantField,
} from "./type-instant";
export type {
  DsQueryLocalDateFilterCondition,
  DsQueryLocalDateOptionalFilterCondition,
  DsQueryLocalDateFilter,
  DsQueryLocalDateOptionalFilter,
  DsFilterableLocalDateField,
} from "./type-localdate";
export type {
  DsQueryDecimalFilterCondition,
  DsQueryDecimalOptionalFilterCondition,
  DsQueryDecimalFilter,
  DsQueryDecimalOptionalFilter,
  DsFilterableDecimalField,
} from "./type-decimal";

import type {DsFilterableTextField, DsQueryTextFilter} from "./type-text";
import type {DsFilterableSelectField, DsQuerySelectFilter, DsQuerySelectFilterCondition,} from "./type-select";
import type {DsFilterableBooleanField, DsQueryBooleanFilter} from "./type-boolean";
import type {DsFilterableInstantField, DsQueryInstantFilter, DsQueryInstantOptionalFilter,} from "./type-instant";
import type {
  DsFilterableLocalDateField,
  DsQueryLocalDateFilter,
  DsQueryLocalDateOptionalFilter,
} from "./type-localdate";
import type {DsFilterableDecimalField, DsQueryDecimalFilter, DsQueryDecimalOptionalFilter,} from "./type-decimal";

/**
 * A query to a datasource
 */
export type DsQuery = {
  search?: string;
  sorting: DsQuerySorting[];
  pagination: DsQueryPagination;
  filters: DsQueryFilters;
};

export type DsQueryPagination = {
  limit: number;
  offset: number;
};

export type DsQuerySorting = {
  id: string;
  desc: boolean;
};

export type DsQueryFilterOperator = "and" | "or";

/**
 * Discriminated union of all supported filter types.
 */
export type DsQueryFilter =
  | DsQueryTextFilter
  | DsQuerySelectFilter
  | DsQueryBooleanFilter
  | DsQueryInstantFilter
  | DsQueryInstantOptionalFilter
  | DsQueryLocalDateFilter
  | DsQueryLocalDateOptionalFilter
  | DsQueryDecimalFilter
  | DsQueryDecimalOptionalFilter;

export type DsQueryFilters = {
  operator: DsQueryFilterOperator;
  items: DsQueryFilter[];
};

export type DsQuerySnapshot = {
  search?: string;
  sorting: DsQuerySorting[];
  filters: DsQueryFilters;
};

export interface DsQueryStorage {
  loadQuery(): DsQuerySnapshot | null;
  saveQuery(snapshot: DsQuerySnapshot): void;
  listSavedQueries(): Array<{ name: string; query: DsQuerySnapshot }>;
  saveNamedQuery(name: string, query: DsQuerySnapshot): void;
  deleteNamedQuery(name: string): void;
}

export type DsFilterableRefField = {
  id: string;
  label: string;
  type: "ref";
  conditions?: DsQuerySelectFilterCondition[];
  useOptions: (params: {
    search: string;
    limit: number;
    selectedValues: string[];
  }) => {
    options: { value: string; label: string }[];
    selectedLabels: { value: string; label: string }[];
    isPending: boolean;
  };
};

/**
 * Discriminated union of all filterable field descriptors.
 */
export type DsFilterableField =
  | DsFilterableTextField
  | DsFilterableSelectField
  | DsFilterableRefField
  | DsFilterableBooleanField
  | DsFilterableInstantField
  | DsFilterableLocalDateField
  | DsFilterableDecimalField;
