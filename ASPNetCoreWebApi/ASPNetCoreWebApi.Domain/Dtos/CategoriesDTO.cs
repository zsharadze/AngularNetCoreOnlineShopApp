using ASPNetCoreWebApi.Domain.Helpers;

namespace ASPNetCoreWebApi.Domain.Dtos
{
    public class CategoriesDTO
    {
        public List<CategoryForListDTO> CategoryList { get; set; }
        public Pager Pager { get; set; }
    }

    public class CategoryForListDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImageName { get; set; }
        public int ProductsCount { get; set; }
    }
}
