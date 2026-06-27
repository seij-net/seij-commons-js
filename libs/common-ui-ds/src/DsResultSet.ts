import type { DsItem } from "./DsItem";

export type DsResultSet<TItem extends DsItem> = {
  items: TItem[];
  limit: number;
  offset: number;
  total: number;
};
