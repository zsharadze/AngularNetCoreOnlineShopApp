using ASPNetCoreWebApi.Domain.Helpers;
using ASPNetCoreWebApi.Helpers.Contracts;

namespace ASPNetCoreWebApi.Helpers
{
    public class HeadersWithPagerSetter : IHeadersWithPagerSetter
    {
        public void SetHeadersWithPagerData(HttpResponse response, Pager pager)
        {
            response.Headers.Append("X-Pagination-CurrentPage", pager.CurrentPage.ToString());
            response.Headers.Append("X-Pagination-EndPage", pager.EndPage.ToString());
            response.Headers.Append("X-Pagination-HasNext", pager.HasNext.ToString());
            response.Headers.Append("X-Pagination-HasPrevious", pager.HasPrevious.ToString());
            response.Headers.Append("X-Pagination-PageSize", pager.PageSize.ToString());
            response.Headers.Append("X-Pagination-PaginationSummary", pager.PaginationSummary.ToString());
            response.Headers.Append("X-Pagination-StartPage", pager.StartPage.ToString());
            response.Headers.Append("X-Pagination-TotalItems", pager.TotalItems.ToString());
            response.Headers.Append("X-Pagination-TotalPages", pager.TotalPages.ToString());
            //Ensure headers are exposed for clients
            response.Headers.Append("Access-Control-Expose-Headers", "X-Pagination-CurrentPage,X-Pagination-EndPage,X-Pagination-HasNext,X-Pagination-HasPrevious,X-Pagination-PageSize,X-Pagination-PaginationSummary,X-Pagination-StartPage,X-Pagination-TotalItems,X-Pagination-TotalPages");
        }
    }
}
