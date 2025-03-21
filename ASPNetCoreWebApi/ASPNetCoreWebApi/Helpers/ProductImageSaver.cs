using ASPNetCoreWebApi.Domain.Dtos;
using ASPNetCoreWebApi.Helpers.Contracts;

namespace ASPNetCoreWebApi.Helpers
{
    public class ProductImageSaver : IProductImageSaver
    {
        private readonly IWebHostEnvironment _WebHostEnvironment;
        public ProductImageSaver(IWebHostEnvironment webHostEnvironment)
        {
            _WebHostEnvironment = webHostEnvironment;
        }
        public async Task SaveImagesOnAddProductAsync(ProductDTO productDto)
        {
            try
            {
                if (productDto.ImageFiles == null)
                    return;
                for (int i = 0; i < productDto.ImageFiles.Count; i++)
                {
                    var filePath = Path.Combine(_WebHostEnvironment.WebRootPath, @"images\products", productDto.Images[i].ImageName);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await productDto.ImageFiles[i].CopyToAsync(fileStream);
                    }
                }
            }
            catch
            {
                throw;
            }
        }

        public async Task SaveImagesOnEditProductAsync(ProductEditDTO productEditDTO)
        {
            try
            {
                foreach (var imagesOnEdit in productEditDTO.ImagesOnEdit)
                {
                    if (imagesOnEdit.Id != 0)
                        continue;
                    //save only newly added images.
                    var filePath = Path.Combine(_WebHostEnvironment.WebRootPath, @"images\products", imagesOnEdit.ImageName);
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await imagesOnEdit.ImageFile.CopyToAsync(fileStream);
                    }
                }
            }
            catch
            {
                throw;
            }
        }
    }
}
