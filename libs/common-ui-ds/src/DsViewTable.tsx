import { makeStyles, mergeClasses, Text, tokens } from "@fluentui/react-components";
import type { Row } from "@tanstack/react-table";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Loader } from "@seij/common-ui";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { DsItem } from "./DsItem";
import type { DsQuerySnapshot } from "./DsQuery";
import type { DsViewColumn, DsViewTableProps } from "./DsViewTableProps";
import { DsColumnPicker } from "./DsColumnPicker";
import { useDsViewController } from "./useDsViewController";
import "./ds-table-meta";

const DEFAULT_COLUMN_MIN_WIDTH = 120;
const DEFAULT_COLUMN_MAX_WIDTH = 320;
const DEFAULT_CHAR_WIDTH_PX = 7;
const DEFAULT_CELL_PADDING_PX = 32;

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
  },
  counter: {
    color: tokens.colorNeutralForeground3,
    marginBottom: tokens.spacingVerticalXS,
  },
  scrollContainer: {
    flex: 1,
    overflowX: "auto",
    overflowY: "auto",
    overscrollBehaviorX: "contain",
    minHeight: 0,
  },
  table: {
    borderCollapse: "collapse",
    tableLayout: "fixed",
  },
  headerCell: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    boxSizing: "border-box",
    fontWeight: tokens.fontWeightSemibold,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    position: "sticky",
    textAlign: "left",
    top: 0,
    zIndex: 2,
    backgroundColor: tokens.colorNeutralBackground1,
    userSelect: "none",
  },
  headerCellContent: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXXS,
    minWidth: 0,
    whiteSpace: "nowrap",
  },
  headerCellLabel: {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  stickyColumn: {
    position: "sticky",
    left: 0,
    zIndex: 1,
    boxShadow: `1px 0 0 ${tokens.colorNeutralStroke2}`,
  },
  stickyCorner: {
    zIndex: 3,
    boxShadow: `1px 0 0 ${tokens.colorNeutralStroke2}, 0 1px 0 ${tokens.colorNeutralStroke2}`,
  },
  navigableCell: {
    cursor: "pointer",
  },
  cell: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    boxSizing: "border-box",
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    verticalAlign: "top",
  },
  cellContent: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
});

export function DsViewTable<T extends DsItem, TRefs = unknown>({
  source,
  emptyMessage,
  onNavigateItem,
  columns,
  pageSize,
  sortable,
  filterable,
  queryStorage,
  queryDefaults,
}: DsViewTableProps<T, TRefs>) {
  const styles = useStyles();
  const allColumnIds = useMemo(() => columns.map((column) => column.id), [columns]);
  const labelByColumnId = useMemo(
    () => new Map(columns.map((column) => [column.id, labelToText(column.label, column.id)])),
    [columns],
  );
  const columnById = useMemo(() => new Map(columns.map((column) => [column.id, column])), [columns]);

  const normalizeVisibleColumnIds = useCallback(
    (visibleColumnIds: string[] | undefined): string[] => {
      if (!visibleColumnIds) return allColumnIds;
      const knownIds = new Set(allColumnIds);
      return visibleColumnIds.filter((id) => knownIds.has(id));
    },
    [allColumnIds],
  );

  const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>(() => {
    const snapshot = queryStorage?.loadQuery() ?? queryDefaults;
    return normalizeInitialVisibleColumnIds(snapshot, allColumnIds);
  });

  const completeSnapshot = useCallback(
    (snapshot: DsQuerySnapshot): DsQuerySnapshot => ({
      ...snapshot,
      visibleColumnIds,
    }),
    [visibleColumnIds],
  );

  const controller = useDsViewController({
    source,
    emptyMessage,
    pageSize,
    sortable,
    filterable,
    queryStorage,
    queryDefaults,
    completeSnapshot,
    onApplySnapshot: (snapshot) => setVisibleColumnIds(normalizeVisibleColumnIds(snapshot.visibleColumnIds)),
  });

  const tableColumns = useMemo(
    () =>
      columns.map((column) =>
        createColumnHelper<T>().display({
          id: column.id,
          header: () => column.label,
          cell: ({ row }) => column.cell({ item: row.original, refs: controller.result.refs }),
          meta: { className: column.className, navigable: column.navigable },
        }),
      ),
    [columns, controller.result.refs],
  );

  const columnVisibility = useMemo(
    () => Object.fromEntries(allColumnIds.map((id) => [id, visibleColumnIds.includes(id)])),
    [allColumnIds, visibleColumnIds],
  );

  const table = useReactTable({
    data: controller.items,
    columns: tableColumns,
    state: {
      columnOrder: visibleColumnIds,
      columnVisibility,
    },
    getCoreRowModel: getCoreRowModel(),
    getRowId: (item) => item.id,
  });

  const rows = table.getRowModel().rows;
  const visibleColumns = table.getVisibleLeafColumns();
  const visibleColumnCount = Math.max(visibleColumns.length, 1);
  const widthByColumnId = useMemo(
    () => new Map(columns.map((column) => [column.id, resolveColumnWidth(column)])),
    [columns],
  );
  const tableWidth = visibleColumns.reduce(
    (total, column) => total + (widthByColumnId.get(column.id) ?? DEFAULT_COLUMN_MIN_WIDTH),
    0,
  );
  const firstVisibleColumnId = visibleColumns[0]?.id;

  /** DsColumnPicker decides the display order: no need to sort here. */
  const pickerOptions = useMemo(
    () =>
      columns.map((column) => ({
        id: column.id,
        label: labelByColumnId.get(column.id) ?? column.id,
        checked: visibleColumnIds.includes(column.id),
      })),
    [columns, labelByColumnId, visibleColumnIds],
  );

  const handleColumnPickerChange = (id: string, checked: boolean) => {
    const next = checked ? [...visibleColumnIds, id] : visibleColumnIds.filter((columnId) => columnId !== id);
    setVisibleColumnIds(next);
    queryStorage?.saveQuery({
      search: controller.query.search,
      sorting: controller.query.sorting,
      filters: controller.query.filters,
      visibleColumnIds: next,
    });
  };

  const lineCount =
    controller.items.length === controller.result.total
      ? `${controller.items.length} ligne(s)`
      : `${controller.items.length} ligne(s) affichée(s) sur ${controller.result.total}`;

  return (
    <div className={styles.root}>
      {controller.renderToolbar(<DsColumnPicker options={pickerOptions} onChange={handleColumnPickerChange} />)}
      {controller.renderStatus()}
      <Text size={200} className={styles.counter}>
        {lineCount}
      </Text>
      <div ref={controller.parentRef} className={styles.scrollContainer}>
        <table
          className={styles.table}
          style={{
            width: `max(100%, ${tableWidth}px)`,
            minWidth: `${tableWidth}px`,
          }}
        >
          <colgroup>
            {visibleColumns.map((column) => {
              const width = widthByColumnId.get(column.id) ?? DEFAULT_COLUMN_MIN_WIDTH;
              return <col key={column.id} style={{ width: `${width}px`, minWidth: `${width}px` }} />;
            })}
          </colgroup>
          <thead>
            <tr>
              {visibleColumns.map((column) => {
                const width = widthByColumnId.get(column.id) ?? DEFAULT_COLUMN_MIN_WIDTH;
                const sorting = controller.query.sorting.find((criterion) => criterion.id === column.id);
                const isFirstColumn = column.id === firstVisibleColumnId;
                return (
                  <th
                    key={column.id}
                    className={mergeClasses(
                      styles.headerCell,
                      isFirstColumn && styles.stickyColumn,
                      isFirstColumn && styles.stickyCorner,
                    )}
                    style={{
                      width,
                      minWidth: width,
                      left: isFirstColumn ? 0 : undefined,
                    }}
                    scope="col"
                  >
                    <div className={styles.headerCellContent}>
                      <span className={styles.headerCellLabel}>
                        {columnById.get(column.id)?.label}
                        {sorting ? <span> {sorting.desc ? "↓" : "↑"}</span> : null}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {controller.paddingTop > 0 && (
              <tr>
                <td colSpan={visibleColumnCount} style={{ height: `${controller.paddingTop}px`, padding: 0 }} />
              </tr>
            )}
            {controller.virtualItems.map((virtualRow) => {
              const isLoader = virtualRow.index >= rows.length;
              if (isLoader) {
                return (
                  <tr
                    key="loader"
                    ref={controller.rowVirtualizer.measureElement}
                    data-index={virtualRow.index}
                    style={{ height: `${virtualRow.size}px` }}
                  >
                    <td colSpan={visibleColumnCount} className={styles.cell}>
                      <Loader loading={true} />
                    </td>
                  </tr>
                );
              }
              return (
                <DsViewTableVirtualRow
                  key={rows[virtualRow.index].id}
                  row={rows[virtualRow.index]}
                  firstVisibleColumnId={firstVisibleColumnId}
                  onClick={onNavigateItem}
                  measureElement={controller.rowVirtualizer.measureElement}
                  index={virtualRow.index}
                  rowIndex={virtualRow.index}
                  widthByColumnId={widthByColumnId}
                />
              );
            })}
            {controller.paddingBottom > 0 && (
              <tr>
                <td colSpan={visibleColumnCount} style={{ height: `${controller.paddingBottom}px`, padding: 0 }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DsViewTableVirtualRow<T extends DsItem>({
  row,
  firstVisibleColumnId,
  onClick,
  measureElement,
  index,
  rowIndex,
  widthByColumnId,
}: {
  row: Row<T>;
  firstVisibleColumnId: string | undefined;
  onClick?: (itemId: string) => void;
  measureElement: (el: Element | null) => void;
  index: number;
  rowIndex: number;
  widthByColumnId: Map<string, number>;
}) {
  const styles = useStyles();
  const backgroundColor = rowIndex % 2 === 1 ? tokens.colorNeutralBackground2 : tokens.colorNeutralBackground1;

  return (
    <tr ref={measureElement} data-index={index} style={{ backgroundColor }}>
      {row.getVisibleCells().map((cell) => {
        const width = widthByColumnId.get(cell.column.id) ?? DEFAULT_COLUMN_MIN_WIDTH;
        const isFirstColumn = cell.column.id === firstVisibleColumnId;
        return (
          <td
            key={cell.id}
            className={mergeClasses(
              styles.cell,
              cell.column.columnDef.meta?.navigable !== false && onClick && styles.navigableCell,
              cell.column.columnDef.meta?.className,
              isFirstColumn && styles.stickyColumn,
            )}
            style={{
              width,
              minWidth: width,
              left: isFirstColumn ? 0 : undefined,
              backgroundColor: isFirstColumn ? backgroundColor : undefined,
            }}
            onClick={onClick && cell.column.columnDef.meta?.navigable !== false ? () => onClick(row.id) : undefined}
          >
            <div className={styles.cellContent}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
          </td>
        );
      })}
    </tr>
  );
}

function normalizeInitialVisibleColumnIds(
  snapshot: DsQuerySnapshot | undefined | null,
  allColumnIds: string[],
): string[] {
  if (!snapshot?.visibleColumnIds) return allColumnIds;
  const knownIds = new Set(allColumnIds);
  return snapshot.visibleColumnIds.filter((id) => knownIds.has(id));
}

function resolveColumnWidth<T extends DsItem, TRefs>(column: DsViewColumn<T, TRefs>): number {
  if (typeof column.width === "number") return column.width;

  const labelLength = labelToText(column.label, column.id).length;
  const min = column.width?.min ?? DEFAULT_COLUMN_MIN_WIDTH;
  const max = column.width?.max ?? DEFAULT_COLUMN_MAX_WIDTH;
  const preferred = column.width?.preferred ?? labelLength * DEFAULT_CHAR_WIDTH_PX + DEFAULT_CELL_PADDING_PX;
  return Math.min(max, Math.max(min, preferred));
}

function labelToText(label: ReactNode, fallback: string): string {
  if (typeof label === "string" || typeof label === "number") return String(label);
  return fallback;
}
