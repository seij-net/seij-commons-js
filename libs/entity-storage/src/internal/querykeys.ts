export type QueryKey = string[];
export function createInvalidationQueryKey(apiResourceName: string): QueryKey {
  return ["entity", apiResourceName];
}
export function createQueryKeySearchSummary<SEARCH_DTO extends {}>(apiResourceName: string, req: SEARCH_DTO): QueryKey {
  return [
    "entity",
    apiResourceName,
    "search_summary",
    ...Object.entries(req)
      .flat()
      .map((it) => "" + it),
  ];
}
export function createQueryKeySearch<SEARCH_DTO extends {}>(apiResourceName: string, req: SEARCH_DTO): QueryKey {
  return [
    "entity",
    apiResourceName,
    "search",
    ...Object.entries(req)
      .flat()
      .map((it) => "" + it),
  ];
}

export function createQueryKeyItem(apiResourceName: string, id: string): QueryKey {
  return ["entity", apiResourceName, "item", id];
}
