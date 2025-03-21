using ASPNetCoreWebApi.Domain.Dtos;
using Microsoft.Extensions.Configuration;
using System.ComponentModel.DataAnnotations;

namespace ASPNetCoreWebApi.Domain.Validators
{
    public class UploadedImageCountValidatorAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            IConfiguration _configuration = (IConfiguration)validationContext.GetService(typeof(IConfiguration));
            var maximumUploadImageCountOnProduct = Convert.ToInt32(_configuration["MaximumUploadImageCountOnProduct"]);
            var errorMessage = $"No More than {maximumUploadImageCountOnProduct} images allowed.";
            if (validationContext.ObjectInstance is ProductDTO productDto && productDto.ImageFiles.Count > 5)
                return new ValidationResult(errorMessage);
            else if (validationContext.ObjectInstance is ProductEditDTO productEditDTO && productEditDTO.ImagesOnEdit.Count > maximumUploadImageCountOnProduct)
                return new ValidationResult(errorMessage);
            return ValidationResult.Success;
        }
    }
}
