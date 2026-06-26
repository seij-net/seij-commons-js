import {
  makeStyles,
  mergeClasses,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Text,
  tokens,
} from "@fluentui/react-components";
import type {Row, RowData} from "@tanstack/react-table";
import {createColumnHelper, flexRender, getCoreRowModel, useReactTable,} from "@tanstack/react-table";
import {ErrorBox, Loader} from "@seij/common-ui";
import {toProblem} from "@seij/common-types";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import type {DsQuery, DsQuerySnapshot} from "./DsQuery";
import {useVirtualizer} from "@tanstack/react-virtual";
import type {DsViewSummaryProps} from "./DsViewSummaryProps";
import {DsToolbar} from "./DsToolbar";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
    navigable?: boolean;
  }
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
  },
  titleCell: {
    cursor: "pointer",
  },
  scrollContainer: {
    flex: 1,
    overflowY: "auto",
    minHeight: 0,
  },
});

export function DsViewSummary<T extends { id: string }, TRefs = unknown>({
  source,
  emptyMessage,
  onNavigateItem,
  contentSlots,
  sortable,
  filterable,
  queryStorage,
  queryDefaults,
}: DsViewSummaryProps<T, TRefs>) {
  const styles = useStyles();
  const parentRef = useRef<HTMLDivElement>(null);

  const [snapshotKey, setSnapshotKey] = useState(0);
  const [activeFilterName, setActiveFilterName] = useState<string | null>(null);
  const [query, setQuery] = useState<DsQuery>(() => {
    const snapshot = queryStorage?.loadQuery() ?? queryDefaults;
    return {
      search: snapshot?.search ?? "",
      sorting: snapshot?.sorting ?? [],
      pagination: { limit: 10, offset: 0 },
      filters: snapshot?.filters ?? { operator: "and", items: [] },
    };
  });

  const result = source(query);
  const items = result.items;

  const handleQueryChange = useCallback(
    (value: DsQuery) => {
      setQuery(value);
      setActiveFilterName(null);
      queryStorage?.saveQuery({
        search: value.search,
        sorting: value.sorting,
        filters: value.filters,
      });
    },
    [queryStorage],
  );

  const handleApplySnapshot = useCallback(
    (snapshot: DsQuerySnapshot, name?: string) => {
      const newQuery: DsQuery = {
        search: snapshot.search ?? "",
        sorting: snapshot.sorting,
        pagination: { limit: 10, offset: 0 },
        filters: snapshot.filters,
      };
      setQuery(newQuery);
      setActiveFilterName(name ?? null);
      queryStorage?.saveQuery(snapshot);
      setSnapshotKey((k) => k + 1);
    },
    [queryStorage],
  );

  const columns = useMemo(
    () =>
      contentSlots.map((summaryItem) =>
        createColumnHelper<T>().display({
          id: summaryItem.id,
          cell: ({ row }) =>
            summaryItem.cell({ item: row.original, refs: result.refs }),
          meta: { className: summaryItem.className, navigable: summaryItem.navigable },
        }),
      ),
    [contentSlots, result.refs],
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (item) => item.id,
  });

  const rows = table.getRowModel().rows;
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
    virtualItems.length > 0
      ? rowVirtualizer.getTotalSize() -
        virtualItems[virtualItems.length - 1].end
      : 0;

  useEffect(() => {
    const lastVirtualItem = virtualItems[virtualItems.length - 1];
    if (!lastVirtualItem) return;
    if (
      lastVirtualItem.index >= items.length - 1 &&
      result.hasNextPage &&
      !result.isFetchingNextPage
    ) {
      result.fetchNextPage();
    }
  }, [
    virtualItems,
    items.length,
    result.hasNextPage,
    result.isFetchingNextPage,
    result.fetchNextPage,
  ]);

  return (
    <div className={styles.root}>
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
        />
      </div>
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
      <div ref={parentRef} className={styles.scrollContainer}>
        <Table style={{ tableLayout: "fixed", width: "100%" }}>
          <colgroup>
            {contentSlots.map((slot) => (
              <col key={slot.id} className={slot.className} />
            ))}
          </colgroup>
          <TableBody>
            {paddingTop > 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  style={{ height: `${paddingTop}px`, padding: 0 }}
                />
              </TableRow>
            )}
            {virtualItems.map((virtualRow) => {
              const isLoader = virtualRow.index >= rows.length;
              if (isLoader) {
                return (
                  <TableRow
                    key="loader"
                    ref={rowVirtualizer.measureElement}
                    data-index={virtualRow.index}
                    style={{ height: `${virtualRow.size}px` }}
                  >
                    <TableCell colSpan={columns.length}>
                      <Loader loading={true} />
                    </TableCell>
                  </TableRow>
                );
              }
              return (
                <VirtualTableRow
                  key={rows[virtualRow.index].id}
                  row={rows[virtualRow.index]}
                  refs={result.refs}
                  onClick={onNavigateItem}
                  measureElement={rowVirtualizer.measureElement}
                  index={virtualRow.index}
                />
              );
            })}
            {paddingBottom > 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  style={{ height: `${paddingBottom}px`, padding: 0 }}
                />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function VirtualTableRow<T extends { id: string }, TRefs = unknown>({
  row,
  refs,
  onClick,
  measureElement,
  index,
}: {
  row: Row<T>;
  refs: TRefs | undefined;
  onClick?: (itemId: string) => void;
  measureElement: (el: Element | null) => void;
  index: number;
}) {
  const styles = useStyles();

  return (
    <TableRow
      ref={measureElement}
      data-index={index}
      style={{ border: "1px solid " + tokens.colorNeutralStroke2 }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          className={mergeClasses(
            styles.titleCell,
            cell.column.columnDef.meta?.className,
          )}
          onClick={
            onClick && cell.column.columnDef.meta?.navigable !== false
              ? () => onClick(row.id)
              : undefined
          }
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
