using ASPNetCoreWebApi.Domain.Helpers;

namespace ASPNetCoreWebApi.Helpers.Contracts
{
    public interface IHeadersWithPagerSetter
    {
        void SetHeadersWithPagerData(HttpResponse response, Pager pager);
    }
}
