namespace ASPNetCoreWebApi.Domain.Models
{
    public class ProductImage
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ImageName { get; set; }
    }
}
