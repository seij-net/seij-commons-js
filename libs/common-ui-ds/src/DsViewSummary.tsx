import { makeStyles, mergeClasses, Table, TableBody, TableCell, TableRow, tokens } from "@fluentui/react-components";
import type { Row } from "@tanstack/react-table";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Loader } from "@seij/common-ui";
import { useMemo } from "react";
import type { DsViewSummaryProps } from "./DsViewSummaryProps";
import { useDsViewController } from "./useDsViewController";
import "./ds-table-meta";

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
  pageSize,
  sortable,
  filterable,
  queryStorage,
  queryDefaults,
  predefinedFilters,
}: DsViewSummaryProps<T, TRefs>) {
  const styles = useStyles();
  const controller = useDsViewController({
    source,
    emptyMessage,
    pageSize,
    sortable,
    filterable,
    queryStorage,
    queryDefaults,
    predefinedFilters,
  });

  const columns = useMemo(
    () =>
      contentSlots.map((summaryItem) =>
        createColumnHelper<T>().display({
          id: summaryItem.id,
          cell: ({ row }) => summaryItem.cell({ item: row.original, refs: controller.result.refs }),
          meta: { className: summaryItem.className, navigable: summaryItem.navigable },
        }),
      ),
    [contentSlots, controller.result.refs],
  );

  const table = useReactTable({
    data: controller.items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (item) => item.id,
  });

  const rows = table.getRowModel().rows;

  return (
    <div className={styles.root}>
      {controller.renderToolbar()}
      {controller.renderStatus()}
      <div ref={controller.parentRef} className={styles.scrollContainer}>
        <Table style={{ tableLayout: "fixed", width: "100%" }}>
          <colgroup>
            {contentSlots.map((slot) => (
              <col key={slot.id} className={slot.className} />
            ))}
          </colgroup>
          <TableBody>
            {controller.paddingTop > 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} style={{ height: `${controller.paddingTop}px`, padding: 0 }} />
              </TableRow>
            )}
            {controller.virtualItems.map((virtualRow) => {
              const isLoader = virtualRow.index >= rows.length;
              if (isLoader) {
                return (
                  <TableRow
                    key="loader"
                    ref={controller.rowVirtualizer.measureElement}
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
                  onClick={onNavigateItem}
                  measureElement={controller.rowVirtualizer.measureElement}
                  index={virtualRow.index}
                />
              );
            })}
            {controller.paddingBottom > 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} style={{ height: `${controller.paddingBottom}px`, padding: 0 }} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function VirtualTableRow<T extends { id: string }>({
  row,
  onClick,
  measureElement,
  index,
}: {
  row: Row<T>;
  onClick?: (itemId: string) => void;
  measureElement: (el: Element | null) => void;
  index: number;
}) {
  const styles = useStyles();

  return (
    <TableRow ref={measureElement} data-index={index} style={{ border: "1px solid " + tokens.colorNeutralStroke2 }}>
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          className={mergeClasses(styles.titleCell, cell.column.columnDef.meta?.className)}
          onClick={onClick && cell.column.columnDef.meta?.navigable !== false ? () => onClick(row.id) : undefined}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
