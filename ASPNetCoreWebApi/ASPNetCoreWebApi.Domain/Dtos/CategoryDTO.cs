using ASPNetCoreWebApi.Domain.Validators;
using Microsoft.AspNetCore.Http;

namespace ASPNetCoreWebApi.Domain.Dtos
{
    public class CategoryDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        [FaClassAndImageRequiredValidator]
        public string FaClass { get; set; }//font awsome 4.7.0 class. for example: "fa fa-desktop"
        public string ImageName { get; set; }
        [ImageFileSizeValidator]
        public IFormFile Image { get; set; }
    }
}
