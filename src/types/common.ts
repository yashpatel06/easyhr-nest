export type TListFilterArgument = {
  currentPage: number;
  limit: number;
  sortParam: string;
  sortOrder: -1 | 1 | 'ASC' | 'DESC';
  search: string;
};

export interface PaginationResponse<T> {
  records: T[];
  currentPage: number;
  pages: number;
  total: number;
  from: number;
  to: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  nextPage?: number | null;
  previousPage?: number | null;
}

export interface PaginationOptions {
  isFacet?: boolean;
  dataKey?: string;
  totalKey?: string;
}
