using ASPNetCoreWebApi.Domain.Dtos;

namespace ASPNetCoreWebApi.Helpers.Contracts
{
    public interface ICategoryImageSetter
    {
        void SetImageOnCategoryAddEdit(CategoryDTO categoryDto);
    }
}
