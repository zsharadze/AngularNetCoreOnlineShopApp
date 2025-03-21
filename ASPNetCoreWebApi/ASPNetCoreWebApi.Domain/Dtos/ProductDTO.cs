using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Validators;
using Microsoft.AspNetCore.Http;

namespace ASPNetCoreWebApi.Domain.Dtos
{
    public class ProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CategoryId { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string ImageName { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CategoryName { get; set; }
        public int MainImageIndex { get; set; }
        public int OrdersCount { get; set; }
        [ImageFileSizeValidator]
        [UploadedImageCountValidator]
        public List<IFormFile> ImageFiles { get; set; }
        public List<ProductImage> Images { get; set; }
    }
}
