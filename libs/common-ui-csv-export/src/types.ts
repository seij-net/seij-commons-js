/**
 * Defines a column in a CSV file
 */
export interface CSVColumnDefinition<T> {
  /**
   * Unique code for the column across all columns
   */
  code: string;
  /**
   * Label of the column header, if undefined the code will be used
   */
  label?: string;
  /**
   * Function that transforms an item into a string (column data extractor and renderer into string)
   * @param item current item matching current row
   * @returns content of the column
   */
  render: (item: T) => string;
}
