import type {
  DsFilterableField,
  DsQuery,
  DsQueryFilters,
  DsQuerySnapshot,
  DsQuerySorting,
  DsQueryStorage,
} from "./DsQuery.ts";
import { useState, type ReactNode } from "react";
import { makeStyles, SearchBox, tokens } from "@fluentui/react-components";
import { DsToolbarSortable } from "./DsToolbarSortable";
import { DsToolbarFilterable } from "./DsToolbarFilterable";
import { DsToolbarSavedFilters } from "./DsToolbarSavedFilters";
import { DsToolbarChips } from "./DsToolbarChips";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXXS,
    marginBottom: tokens.spacingVerticalM,
  },
  mainRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    gap: tokens.spacingHorizontalS,
  },
});

export function DsToolbar({
  defaultQuery,
  onChange,
  sortable,
  filterable,
  queryStorage,
  queryDefaults,
  onApplySnapshot,
  activeFilterName,
  viewControls,
  completeSnapshot,
}: {
  defaultQuery: DsQuery;
  onChange: (value: DsQuery) => void;
  sortable?: { id: string; label: string }[];
  filterable?: DsFilterableField[];
  queryStorage?: DsQueryStorage;
  queryDefaults?: DsQuerySnapshot;
  onApplySnapshot?: (snapshot: DsQuerySnapshot, name?: string) => void;
  activeFilterName?: string | null;
  viewControls?: ReactNode;
  completeSnapshot?: (snapshot: DsQuerySnapshot) => DsQuerySnapshot;
}) {
  const styles = useStyles();
  const [search, setSearch] = useState(defaultQuery.search);

  const handleChangeSearch = (value: string) => {
    setSearch(value);
    onChange({ ...defaultQuery, search: value });
  };

  const handleSortingChange = (sorting: DsQuerySorting[]) => {
    onChange({ ...defaultQuery, sorting });
  };

  const handleFiltersChange = (filters: DsQueryFilters) => {
    onChange({ ...defaultQuery, filters });
  };

  const handleRemoveSort = (id: string) => {
    handleSortingChange(defaultQuery.sorting.filter((s) => s.id !== id));
  };

  const handleRemoveFilter = (id: string) => {
    handleFiltersChange({
      ...defaultQuery.filters,
      items: defaultQuery.filters.items.filter((f) => f.id !== id),
    });
  };

  const currentSnapshot = completeSnapshot?.({
    search: defaultQuery.search,
    sorting: defaultQuery.sorting,
    filters: defaultQuery.filters,
  }) ?? {
    search: defaultQuery.search,
    sorting: defaultQuery.sorting,
    filters: defaultQuery.filters,
  };

  return (
    <div className={styles.root}>
      <div className={styles.mainRow}>
        <SearchBox value={search} onChange={(_, data) => handleChangeSearch(data.value)} />
        {sortable && sortable.length > 0 && (
          <DsToolbarSortable sortable={sortable} sorting={defaultQuery.sorting} onChange={handleSortingChange} />
        )}
        {filterable && filterable.length > 0 && (
          <DsToolbarFilterable filterable={filterable} filters={defaultQuery.filters} onChange={handleFiltersChange} />
        )}
        {viewControls}
        {queryStorage && onApplySnapshot && (
          <DsToolbarSavedFilters
            queryStorage={queryStorage}
            queryDefaults={queryDefaults}
            currentSnapshot={currentSnapshot}
            onApply={onApplySnapshot}
            activeFilterName={activeFilterName ?? null}
          />
        )}
      </div>
      <DsToolbarChips
        sorting={defaultQuery.sorting}
        filters={defaultQuery.filters}
        sortable={sortable}
        filterable={filterable}
        onRemoveSort={handleRemoveSort}
        onRemoveFilter={handleRemoveFilter}
      />
    </div>
  );
}
