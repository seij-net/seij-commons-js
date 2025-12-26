import { CSVColumnDefinition } from "./types";

export function createCSV<T>(columns: CSVColumnDefinition<T>[], items: T[]) {
  // Prepare CSV header
  const header = columns
    .map((col) => {
      const headerLabel = col.label ?? col.code;
      return `"${headerLabel.replace(/"/g, '""')}"`;
    })
    .join(",");

  // Prepare CSV rows
  const rows = items.map((item) =>
    columns
      .map((col) => {
        // Use render if available, otherwise access property directly
        let value;
        if (col.render) {
          const rendered = col.render(item);
          // Try to extract text from rendered React element
          if (typeof rendered === "string" || typeof rendered === "number") {
            value = rendered;
          } else {
            value = "";
          }
        } else {
          value = (item as any)[col.code];
        }
        // Escape double quotes for CSV
        return `"${String(value ?? "").replace(/"/g, '""')}"`;
      })
      .join(","),
  );

  // Combine header and rows
  const csvContent = [header, ...rows].join("\r\n");
  return csvContent;
}
