/**
 * Base type for all items in a datasource.
 *
 * The requirement is that each item must have an id as a string, unique in
 * the data source collection of items.
 */
export type DsItem = {
  id: string;
};
