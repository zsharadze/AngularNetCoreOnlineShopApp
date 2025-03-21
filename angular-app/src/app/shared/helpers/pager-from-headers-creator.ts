import { Pager } from '../../models/pager.model';

export function getPagerFromHeaders(headers: any): Pager {
  return {
    currentPage: Number(headers.get('X-Pagination-CurrentPage')),
    endPage: Number(headers.get('X-Pagination-EndPage')),
    hasNext: headers.get('X-Pagination-HasNext').toLowerCase() == 'true',
    hasPrevious:
      headers.get('X-Pagination-HasPrevious').toLowerCase() == 'true',
    pageSize: Number(headers.get('X-Pagination-PageSize')),
    startPage: Number(headers.get('X-Pagination-StartPage')),
    totalItems: Number(headers.get('X-Pagination-TotalItems')),
    totalPages: Number(headers.get('X-Pagination-TotalPages')),
    paginationSummary: headers.get('X-Pagination-PaginationSummary').toString(),
  } as Pager;
}
