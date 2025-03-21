using ASPNetCoreWebApi.Domain.Dtos;

namespace ASPNetCoreWebApi.Helpers.Contracts
{
    public interface ICategoryImageSaver
    {
        Task SaveImagesOnAddEditCategoryAsync(CategoryDTO productDto);
    }
}
