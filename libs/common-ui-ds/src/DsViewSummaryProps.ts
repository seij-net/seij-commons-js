import type { DsViewProps } from "./DsViewProps";
import type { DsItem } from "./DsItem";
import type { ReactNode } from "react";

/**
 * Props for the "summary" view.
 *
 * Must only contain props specific to the view.
 *
 * The view works with content slots. It means that the component that
 * wants to display this view must provide how exactly to display
 * data in the list.
 *
 * Content slots are displayed next to each other in the order in which
 * they are declared.
 *
 */
export interface DsViewSummaryProps<
  T extends DsItem,
  TRefs = unknown,
> extends DsViewProps<T, TRefs> {
  contentSlots: ContentSlot<T, TRefs>[];
}

/**
 * A content slot is a piece of React that displays an item.
 */
export type ContentSlot<T, TRefs = unknown> = {
  id: string;
  className?: string;
  navigable?: boolean;
  cell: ({ item, refs }: { item: T; refs: TRefs | undefined }) => ReactNode;
};
