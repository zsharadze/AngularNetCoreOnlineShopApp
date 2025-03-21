using ASPNetCoreWebApi.Domain.Dtos;
using ASPNetCoreWebApi.Helpers.Contracts;

namespace ASPNetCoreWebApi.Helpers
{
    public class CategoryImageSaver : ICategoryImageSaver
    {
        private readonly IWebHostEnvironment _WebHostEnvironment;
        public CategoryImageSaver(IWebHostEnvironment webHostEnvironment)
        {
            _WebHostEnvironment = webHostEnvironment;
        }

        public async Task SaveImagesOnAddEditCategoryAsync(CategoryDTO categoryDto)
        {
            var filePath = Path.Combine(_WebHostEnvironment.WebRootPath, @"images\categories", categoryDto.ImageName);
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await categoryDto.Image.CopyToAsync(fileStream);
            }
        }
    }
}
