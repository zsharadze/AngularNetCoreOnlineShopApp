using ASPNetCoreWebApi.Helpers.Contracts;

namespace ASPNetCoreWebApi.Helpers
{
    public class ProductImagesDeleter : IProductImagesDeleter
    {
        private readonly IWebHostEnvironment _WebHostEnvironment;
        public ProductImagesDeleter(IWebHostEnvironment webHostEnvironment)
        {
            _WebHostEnvironment = webHostEnvironment;
        }
        public void DeleteImages(List<string> productImageFileNames)
        {
            try
            {
                foreach (var productImageFileName in productImageFileNames)
                {
                    var filePath = Path.Combine(_WebHostEnvironment.WebRootPath, @"images\products", productImageFileName);
                    File.Delete(filePath);
                }
            }
            catch
            {

            }
        }
    }
}
