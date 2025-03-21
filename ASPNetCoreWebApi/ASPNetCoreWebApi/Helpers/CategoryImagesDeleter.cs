using ASPNetCoreWebApi.Helpers.Contracts;

namespace ASPNetCoreWebApi.Helpers
{
    public class CategoryImagesDeleter : ICategoryImagesDeleter
    {
        private readonly IWebHostEnvironment _WebHostEnvironment;
        public CategoryImagesDeleter(IWebHostEnvironment webHostEnvironment)
        {
            _WebHostEnvironment = webHostEnvironment;
        }
        public void DeleteImage(string imageName)
        {
            try
            {

                var filePath = Path.Combine(_WebHostEnvironment.WebRootPath, @"images\categories", imageName);
                File.Delete(filePath);
            }
            catch
            {

            }
        }
    }
}