namespace ASPNetCoreWebApi.Domain.Dtos
{
    public class OrderItemDTO
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public int ProductId { get; set; }
        public ProductDTO Product { get; set; }
    }
}
