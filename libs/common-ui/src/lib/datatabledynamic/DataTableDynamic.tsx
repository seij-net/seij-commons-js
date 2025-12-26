import { Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "@fluentui/react-components";
import { ReactNode } from "react";

export type DataTableDynamicColumn<T> = {
  code: string;
  label: string;
  render: (row: T) => ReactNode;
  style?: React.CSSProperties | undefined;
};

export function DataTableDynamic<T>({
  columns,
  data,
  idExtractor = (row) => (row as Record<string, any>)["id"] ?? "",
  onClickRow = (row: T) => {
    /* no-op by default */
  },
}: {
  columns: DataTableDynamicColumn<T>[];
  data: T[];
  idExtractor?: (row: T) => string;
  onClickRow?: (row: T) => void;
}) {
  return (
    <Table size="small" min-width={700}>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHeaderCell key={col.code} as="th" style={col.style}>
              {col.label}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((it) => (
          <TableRow key={idExtractor(it)} onClick={onClickRow ? () => onClickRow(it) : undefined}>
            {columns.map((col) => (
              <TableCell as="td" key={col.code} style={col.style}>
                {col.render(it)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
