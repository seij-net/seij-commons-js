/**
 * Module augmentation shared by every view built on TanStack Table.
 *
 * It lives in its own module because an augmentation can only be declared once:
 * two views repeating this block would fail compilation on a duplicate
 * identifier.
 */
import type { RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
    navigable?: boolean;
  }
}

export {};
