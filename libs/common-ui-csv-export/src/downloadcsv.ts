import { createCSV } from "./createcsv";
import { CSVColumnDefinition } from "./types";
/**
 * Creates and make a CSV file to download automatically
 * @param filename name of the CSV file to create (name of downloaded file)
 * @param columns list of column definitions to produce the file (renderers, column names)
 * @param items items that provide the data to transform into CSV
 */
export function downloadCsv<T>(filename: string, columns: CSVColumnDefinition<T>[], items: T[]) {
  const csvContent = createCSV(columns, items);
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
