import type { DsItem } from "./DsItem";
import type { DsQuery } from "./DsQuery";

export type DsDataFetcher<T extends DsItem, TRefs = unknown> = (
  query: DsQuery,
) => DsDataFetcherStatus<T, TRefs>;

export type DsDataFetcherStatus<T extends DsItem, TRefs = unknown> = {
  items: T[];
  total: number;
  refs?: TRefs;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isPending: boolean;
  error?: unknown;
};
