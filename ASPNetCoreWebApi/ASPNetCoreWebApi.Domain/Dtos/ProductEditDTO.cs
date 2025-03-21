using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Validators;
using Microsoft.AspNetCore.Http;

namespace ASPNetCoreWebApi.Domain.Dtos
{
    public class ProductEditDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CategoryId { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string ImageName { get; set; }
        public int MainImageIndex { get; set; }
        public string DeletedImages { get; set; }
        public List<ProductImage> Images { get; set; }
        [UploadedImageCountValidator]
        public List<ProductImageEditDto> ImagesOnEdit { get; set; }
    }

    public class ProductImageEditDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ImageName { get; set; }
        [ImageFileSizeValidator]
        public IFormFile ImageFile { get; set; }
    }
}
