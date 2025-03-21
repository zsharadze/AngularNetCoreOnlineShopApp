using ASPNetCoreWebApi.Domain.Dtos;

namespace ASPNetCoreWebApi.Helpers.Contracts
{
    public interface IProductImagesSetter
    {
        void SetImagesOnAddProduct(ProductDTO productDto);
        void SetImagesOnEditProduct(ProductEditDTO productEditDto);
    }
}
