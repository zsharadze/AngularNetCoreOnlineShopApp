using ASPNetCoreWebApi.Domain.Dtos;

namespace ASPNetCoreWebApi.Domain.Contracts
{
    public interface IOrderService
    {
        Task<int> CreateOrder(List<CreateOrderData> orderItemList, string promoCode, string userId);
        Task<OrdersDTO> GetAllItemsForCurrentUser(string userId, int pageIndex, int pageSize);
        Task<OrdersDTO> GetAllItems(int pageIndex, int pageSize);
        Task<int> ChangeStatus(ChangeOrderStatusDTO changeOrderStatusRequest);
    }
}
