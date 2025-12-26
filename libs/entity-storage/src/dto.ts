export type Id = string;

export type ListDto<T> = {
  items: T[];
};
export interface ListPaginatedDto<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  pageCount: number;
}
export interface SingleItemDto<T> {
  item: T;
}
export interface IdDto {
  id: string;
}
