using ASPNetCoreWebApi.Domain.Validators;
using Microsoft.AspNetCore.Http;

namespace ASPNetCoreWebApi.Domain.Dtos
{
    public class CategoryDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImageName { get; set; }
        [ImageFileSizeValidator]
        public IFormFile Image { get; set; }
    }
}
