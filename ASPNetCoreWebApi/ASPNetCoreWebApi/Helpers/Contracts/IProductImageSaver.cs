using ASPNetCoreWebApi.Domain.Dtos;

namespace ASPNetCoreWebApi.Helpers.Contracts
{
    public interface IProductImageSaver
    {
        Task SaveImagesOnAddProductAsync(ProductDTO productDto);
        Task SaveImagesOnEditProductAsync(ProductEditDTO productEditDto);
    }
}
