using ASPNetCoreWebApi.Domain.Dtos;

namespace ASPNetCoreWebApi.Domain.Contracts
{
    public interface IProductService
    {
        Task<ProductsDTO> GetAllItems(int? categoryId, string searchText, int pageIndex, int pageSize);
        Task<List<ProductDTO>> GetByIds(List<int> ids);
        Task<int> Add(ProductDTO newItem);
        Task<ProductDTO> Update(ProductEditDTO item, List<int> deletedImageIds);
        Task<ProductDTO> GetById(int id);
        Task<bool> Remove(int id);
    }
}
