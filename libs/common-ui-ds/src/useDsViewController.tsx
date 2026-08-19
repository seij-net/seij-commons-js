import { ErrorBox, Loader } from "@seij/common-ui";
import { toProblem } from "@seij/common-types";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Text, tokens } from "@fluentui/react-components";
import type { DsDataFetcherStatus } from "./DsDataFetcher";
import type { DsItem } from "./DsItem";
import type { DsViewProps } from "./DsViewProps";
import type { DsQuery, DsQuerySnapshot } from "./DsQuery";
import { DsToolbar } from "./DsToolbar";

const DEFAULT_PAGE_SIZE = 50;

export type DsViewController<T extends DsItem, TRefs = unknown> = {
  activeFilterName: string | null;
  handleQueryChange: (value: DsQuery) => void;
  items: T[];
  paddingBottom: number;
  paddingTop: number;
  parentRef: React.RefObject<HTMLDivElement | null>;
  query: DsQuery;
  result: DsDataFetcherStatus<T, TRefs>;
  renderStatus: () => ReactNode;
  renderToolbar: (viewControls?: ReactNode) => ReactNode;
  rowVirtualizer: ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>;
  snapshotKey: number;
  virtualItems: ReturnType<ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>["getVirtualItems"]>;
};

export function useDsViewController<T extends DsItem, TRefs = unknown>({
  source,
  emptyMessage,
  pageSize = DEFAULT_PAGE_SIZE,
  sortable,
  filterable,
  queryStorage,
  queryDefaults,
  completeSnapshot,
  onApplySnapshot,
}: Pick<
  DsViewProps<T, TRefs>,
  "source" | "emptyMessage" | "pageSize" | "sortable" | "filterable" | "queryStorage" | "queryDefaults"
> & {
  completeSnapshot?: (snapshot: DsQuerySnapshot) => DsQuerySnapshot;
  onApplySnapshot?: (snapshot: DsQuerySnapshot) => void;
}): DsViewController<T, TRefs> {
  const parentRef = useRef<HTMLDivElement>(null);

  const [snapshotKey, setSnapshotKey] = useState(0);
  const [activeFilterName, setActiveFilterName] = useState<string | null>(null);
  const [query, setQuery] = useState<DsQuery>(() => {
    const snapshot = queryStorage?.loadQuery() ?? queryDefaults;
    return toQuery(snapshot, pageSize);
  });

  const result = source(query);
  const items = result.items;

  const buildSnapshot = useCallback(
    (value: DsQuery): DsQuerySnapshot => {
      const snapshot: DsQuerySnapshot = {
        search: value.search,
        sorting: value.sorting,
        filters: value.filters,
      };
      return completeSnapshot ? completeSnapshot(snapshot) : snapshot;
    },
    [completeSnapshot],
  );

  const handleQueryChange = useCallback(
    (value: DsQuery) => {
      setQuery(value);
      setActiveFilterName(null);
      queryStorage?.saveQuery(buildSnapshot(value));
    },
    [buildSnapshot, queryStorage],
  );

  const handleApplySnapshot = useCallback(
    (snapshot: DsQuerySnapshot, name?: string) => {
      setQuery(toQuery(snapshot, pageSize));
      setActiveFilterName(name ?? null);
      onApplySnapshot?.(snapshot);
      queryStorage?.saveQuery(snapshot);
      setSnapshotKey((k) => k + 1);
    },
    [onApplySnapshot, pageSize, queryStorage],
  );

  const count = result.hasNextPage ? items.length + 1 : items.length;

  const rowVirtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const paddingTop = virtualItems.length > 0 ? virtualItems[0].start : 0;
  const paddingBottom =
    virtualItems.length > 0 ? rowVirtualizer.getTotalSize() - virtualItems[virtualItems.length - 1].end : 0;

  useEffect(() => {
    const lastVirtualItem = virtualItems[virtualItems.length - 1];
    if (!lastVirtualItem) return;
    if (lastVirtualItem.index >= items.length - 1 && result.hasNextPage && !result.isFetchingNextPage) {
      result.fetchNextPage();
    }
  }, [virtualItems, items.length, result.hasNextPage, result.isFetchingNextPage, result.fetchNextPage]);

  return {
    activeFilterName,
    handleQueryChange,
    items,
    paddingBottom,
    paddingTop,
    parentRef,
    query,
    result,
    rowVirtualizer,
    snapshotKey,
    virtualItems,
    renderStatus: () => (
      <>
        {result.error ? (
          <div>
            <ErrorBox error={toProblem(result.error)} />
          </div>
        ) : null}
        {result.isPending ? <Loader loading={true} /> : null}
        {items.length === 0 && !result.isPending && (
          <p style={{ paddingTop: tokens.spacingVerticalM }}>
            <Text italic>{emptyMessage}</Text>
          </p>
        )}
      </>
    ),
    renderToolbar: (viewControls?: ReactNode) => (
      <div>
        <DsToolbar
          key={snapshotKey}
          defaultQuery={query}
          onChange={handleQueryChange}
          sortable={sortable}
          filterable={filterable}
          queryStorage={queryStorage}
          queryDefaults={queryDefaults}
          onApplySnapshot={handleApplySnapshot}
          activeFilterName={activeFilterName}
          viewControls={viewControls}
          completeSnapshot={completeSnapshot}
        />
      </div>
    ),
  };
}

function toQuery(snapshot: DsQuerySnapshot | undefined | null, pageSize: number): DsQuery {
  return {
    search: snapshot?.search ?? "",
    sorting: snapshot?.sorting ?? [],
    pagination: { limit: pageSize, offset: 0 },
    filters: snapshot?.filters ?? { operator: "and", items: [] },
  };
}
