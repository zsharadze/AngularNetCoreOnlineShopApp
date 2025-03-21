using ASPNetCoreWebApi.Domain.Dtos;
using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Helpers.Contracts;

namespace ASPNetCoreWebApi.Helpers
{
    public class ProductImagesSetter : IProductImagesSetter
    {
        public void SetImagesOnAddProduct(ProductDTO productDto)
        {
            productDto.Images = new List<ProductImage>();
            for (int i = 0; i < productDto.ImageFiles.Count; i++)
            {
                var imgFileName = Guid.NewGuid().ToString() + Path.GetExtension(productDto.ImageFiles[i].FileName);
                if (i == productDto.MainImageIndex)
                    productDto.ImageName = imgFileName;
                productDto.Images.Add(new ProductImage { Id = 0, ImageName = imgFileName, ProductId = 0 });
            }
        }

        public void SetImagesOnEditProduct(ProductEditDTO productEdit)
        {
            productEdit.Images = new List<ProductImage>();
            for (int i = 0; i < productEdit.ImagesOnEdit.Count; i++)
            {
                var imgFileName = productEdit.ImagesOnEdit[i].ImageName;

                if (productEdit.ImagesOnEdit[i].Id == 0)
                {
                    productEdit.ImagesOnEdit[i].ImageName = imgFileName = Guid.NewGuid().ToString() + Path.GetExtension(productEdit.ImagesOnEdit[i].ImageFile.FileName);
                }
                if (i == productEdit.MainImageIndex)
                    productEdit.ImageName = imgFileName;
                productEdit.Images.Add(new ProductImage { Id = productEdit.ImagesOnEdit[i].Id, ImageName = imgFileName, ProductId = 0 });
            }
        }
    }
}
