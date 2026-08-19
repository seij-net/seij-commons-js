import type { DsViewProps } from "./DsViewProps";
import type { DsItem } from "./DsItem";
import type { ContentSlot } from "./DsViewSummaryProps";
import type { ReactNode } from "react";

export type DsViewColumnWidth = number | { min?: number; max?: number; preferred?: number };

export type DsViewColumn<T extends DsItem, TRefs = unknown> = ContentSlot<T, TRefs> & {
  label: ReactNode;
  width?: DsViewColumnWidth;
};

/**
 * Props for the "table" view.
 *
 * Must only contain props specific to the view.
 *
 * The view works with columns. A column extends a content slot with a passive
 * header label and optional width hints.
 */
export interface DsViewTableProps<T extends DsItem, TRefs = unknown> extends DsViewProps<T, TRefs> {
  columns: DsViewColumn<T, TRefs>[];
}
