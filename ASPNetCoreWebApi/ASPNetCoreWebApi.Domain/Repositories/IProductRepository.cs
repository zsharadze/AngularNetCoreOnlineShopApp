using ASPNetCoreWebApi.Domain.Dtos;
using ASPNetCoreWebApi.Domain.Models;

namespace ASPNetCoreWebApi.Domain.Repositories
{
    public interface IProductRepository
    {
        Task<ProductsDTO> GetAllItems(int? categoryId, string searchText, int pageIndex, int pageSize);
        Task<List<ProductDTO>> GetByIds(List<int> ids);
        Task<int> Add(Product newItem);
        Task<Product> Update(Product item, List<int> deletedImageIds);
        Task<ProductDTO> GetById(int id);
        Task<bool> Remove(int id);
    }
}
