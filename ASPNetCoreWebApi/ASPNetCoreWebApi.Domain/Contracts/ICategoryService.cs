using ASPNetCoreWebApi.Domain.Dtos;

namespace ASPNetCoreWebApi.Domain.Contracts
{
    public interface ICategoryService
    {
        Task<CategoriesDTO> GetAllItems(string searchText, int? pageIndex, int? pageSize);
        Task<int> Add(CategoryDTO newItem);
        Task<CategoryDTO> Update(CategoryDTO item);
        Task<CategoryDTO> GetById(int id);
        Task<bool> Remove(int id);
    }
}
