using ASPNetCoreWebApi.Domain.Helpers;

namespace ASPNetCoreWebApi.Domain.Dtos
{
    public class ProductsDTO
    {
        public List<ProductDTO> ProductList { get; set; }
        public Pager Pager { get; set; }
    }
}
