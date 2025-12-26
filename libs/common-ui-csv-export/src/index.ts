export interface CSVColumnDefinition<T> {
  code: string;
  label?: string;
  render: (item: T) => string;
}

export function downloadCsv<T>(filename: string, columns: CSVColumnDefinition<T>[], items: T[]) {
  // if (!items || items.length === 0) return;

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

  // Create blob and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
