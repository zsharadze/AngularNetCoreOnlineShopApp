namespace ASPNetCoreWebApi.Domain.Dtos
{
    public class CreateOrderRequestDTO
    {
        public List<CreateOrderData> OrdersList { get; set; }
        public string PromoCode { get; set; }
    }

    public class CreateOrderData
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }

    }
}
