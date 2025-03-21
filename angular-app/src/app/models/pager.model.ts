export interface Pager {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  startPage: number;
  endPage: number;
  hasPrevious: boolean;
  hasNext: boolean;
  paginationSummary?: string | null;
}
