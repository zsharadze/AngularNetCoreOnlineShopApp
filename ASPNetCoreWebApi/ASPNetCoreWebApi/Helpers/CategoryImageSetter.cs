using ASPNetCoreWebApi.Domain.Dtos;
using ASPNetCoreWebApi.Helpers.Contracts;

namespace ASPNetCoreWebApi.Helpers
{
    public class CategoryImageSetter : ICategoryImageSetter
    {
        public void SetImageOnCategoryAddEdit(CategoryDTO categoryDto)
        {
            var imgFileName = Guid.NewGuid().ToString() + Path.GetExtension(categoryDto.Image.FileName);
            categoryDto.ImageName = imgFileName;
        }
    }
}
