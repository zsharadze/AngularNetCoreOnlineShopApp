using ASPNetCoreWebApi.Domain.Dtos;
using ASPNetCoreWebApi.Domain.Models;

namespace ASPNetCoreWebApi.Domain.Repositories
{
    public interface ICategoryRepository
    {
        Task<CategoriesDTO> GetAllItems(string searchText, int? pageIndex, int? pageSize);
        Task<int> Add(Category newItem);
        Task<Category> Update(Category item);
        Task<CategoryDTO> GetById(int id);
        Task<bool> Remove(int id);
    }
}
