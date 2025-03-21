using ASPNetCoreWebApi.Domain.Helpers;
using ASPNetCoreWebApi.Domain.Models;

namespace ASPNetCoreWebApi.Domain.Dtos
{
    public class OrdersDTO
    {
        public List<OrderDTO> OrderList { get; set; }
        public Pager Pager { get; set; }
    }

    public class OrderDTO
    {
        public int Id { get; set; }
        public DateTime CreatedDate { get; set; }
        public OrderStatus Status { get; set; }
        public decimal Subtotal { get; set; }
        public decimal? SubtotalWithPromo { get; set; }
        public string UserId { get; set; }
        public string UserEmail { get; set; }
        public int? PromoCodeId { get; set; }
        public virtual PromoCodeDTO PromoCode { get; set; }
        public ICollection<OrderItemDTO> OrderItems { get; set; }
    }
}
