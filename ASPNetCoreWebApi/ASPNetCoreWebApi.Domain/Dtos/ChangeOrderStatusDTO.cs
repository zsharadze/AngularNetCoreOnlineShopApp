using ASPNetCoreWebApi.Domain.Models;

namespace ASPNetCoreWebApi.Domain.Dtos
{
    public class ChangeOrderStatusDTO
    {
        public int OrderId { get; set; }
        public OrderStatus NewStatus { get; set; }
    }
}
