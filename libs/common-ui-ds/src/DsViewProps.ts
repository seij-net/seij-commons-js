import type { DsItem } from "./DsItem";
import type { DsDataFetcher } from "./DsDataFetcher";
import type { DsFilterableField, DsQuerySnapshot, DsQueryStorage } from "./DsQuery";

/**
 * Properties for DsView-like components common to all DsView components
 *
 * @typeParam TItem - Type of the base item to display.
 * @typeParam TRefs - Type of the companion object that contains references to external items.
 */
export interface DsViewProps<TItem extends DsItem, TRefs = unknown> {
  /**
   * If present, indicates the user wants to navigate to this item.
   */
  onNavigateItem?: (itemId: string) => void;
  /**
   * Message displayed when there are no items in the datasource to display
   */
  emptyMessage: string;
  /**
   * Tooling to fetch the data
   */
  source: DsDataFetcher<TItem, TRefs>;
  /**
   * Number of items requested for each page. Pagination is never persisted in
   * snapshots; this is a technical loading parameter owned by the view.
   */
  pageSize?: number;
  /**
   * When present, the toolbar will display a sort control.
   * Each entry declares a field the user can sort on.
   */
  sortable?: { id: string; label: string }[];
  /**
   * When present, the toolbar will display a filter control.
   * Each entry declares a field the user can filter on, along with its type and options.
   */
  filterable?: DsFilterableField[];
  /**
   * When present, the view reads its initial query state (filters, sort, search)
   * from the storage and writes back on every change. Pagination is never persisted.
   */
  queryStorage?: DsQueryStorage;
  /**
   * Default query state (filters, sort, search) used when the storage has no
   * saved query yet (or when no storage is provided).
   */
  queryDefaults?: DsQuerySnapshot;
}
