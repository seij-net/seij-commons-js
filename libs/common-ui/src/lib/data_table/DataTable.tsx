import {
  Caption1,
  makeResetStyles,
  makeStyles,
  mergeClasses,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
  tokens,
} from "@fluentui/react-components";
import { HTMLProps, ReactNode } from "react";

export interface DataTableProps extends Pick<HTMLProps<HTMLTableElement>, "style" | "className"> {
  children: ReactNode;
}

/**
 * Data table with one of the application's styles.
 * Handles cell formats for numbers, alignments, and compatibility with legacy CSS.
 */
export const DataTable = (props: DataTableProps) => {
  const { children, ...otherProps } = props;
  return (
    <Table size="small" {...otherProps}>
      {children}
    </Table>
  );
};

export const DataTableHead = ({ children }: { children: ReactNode }) => {
  return <TableHeader>{children}</TableHeader>;
};
export const DataTableRow = ({ children }: { children: ReactNode }) => {
  return <TableRow>{children}</TableRow>;
};
export type DataTableCellProps = Pick<HTMLProps<HTMLTableCellElement>, "children" | "className" | "colSpan"> & {
  /**
   * Cell variant.
   * - "number": displays numbers (right-aligned)
   * - "text": everything is left-aligned (including headers)
   * - "auto": header is centered, cells are left-aligned
   * - "title": header is centered, bold, with padding
   * - "date": centered
   * Otherwise, text is left-aligned
   */
  variant?: "auto" | "text" | "number" | "date";
};
const useDataTableCellStyles = makeStyles({
  headerCell: { fontWeight: tokens.fontWeightBold },
  auto: {},
  text: {},
  number: { textAlign: "right", whiteSpace: "nowrap", "> div": { justifyContent: "flex-end" } },
  date: { textAlign: "right", whiteSpace: "nowrap", "> div": { justifyContent: "flex-end" } },
});

export const DataTableHeaderCell = ({ children, variant, ...otherProps }: DataTableCellProps) => {
  const styles = useDataTableCellStyles();
  const styleVariant = mergeClasses(styles[variant || "text"], styles.headerCell, otherProps.className);
  return (
    <TableHeaderCell {...otherProps} className={styleVariant}>
      {children}
    </TableHeaderCell>
  );
};

export const DataTableCell = ({ children, variant, ...otherProps }: DataTableCellProps) => {
  const styles = useDataTableCellStyles();
  const styleVariant = mergeClasses(styles[variant || "text"], otherProps.className);
  return (
    <TableCell {...otherProps} className={styleVariant}>
      {children}
    </TableCell>
  );
};
export const DataTableBody = ({
  children,
  ...otherProps
}: Pick<HTMLProps<HTMLTableSectionElement>, "children" | "className">) => {
  return <TableBody {...otherProps}>{children}</TableBody>;
};

const useDataTableCaptionStyles = makeResetStyles({
  captionSide: "bottom",
  textAlign: "left",
});

export const DataTableCaption = ({
  children,
  ...otherProps
}: Pick<HTMLProps<HTMLTableCaptionElement>, "children" | "className">) => {
  const styles = mergeClasses(useDataTableCaptionStyles(), otherProps.className);
  if (!children) return null;
  return (
    <caption className={styles}>
      <Caption1>{children}</Caption1>
    </caption>
  );
};
