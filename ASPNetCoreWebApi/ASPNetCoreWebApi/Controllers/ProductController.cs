using ASPNetCoreWebApi.BindingModels;
using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.Dtos;
using ASPNetCoreWebApi.Helpers.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace ASPNetCoreWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ProductController : Controller
    {
        private readonly IProductService _productService;
        private readonly IHeadersWithPagerSetter _headersWithPagerSetter;
        private readonly IProductImagesSetter _productImagesSetter;
        private readonly IProductImageSaver _productImageSaver;
        private readonly IProductImagesDeleter _productImagesDeleter;
        public ProductController(IProductService productService,
            IHeadersWithPagerSetter headersWithPagerSetter,
            IProductImagesSetter productImagesSetter,
            IProductImageSaver productImageSaver,
            IProductImagesDeleter productImagesDeleter)
        {
            _productService = productService;
            _headersWithPagerSetter = headersWithPagerSetter;
            _productImagesSetter = productImagesSetter;
            _productImageSaver = productImageSaver;
            _productImagesDeleter = productImagesDeleter;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<ProductDTO>), 200)]
        public async Task<IActionResult> GetAll(int? categoryId, string searchText, int pageIndex = 1, int pageSize = 20)
        {
            var productsData = await _productService.GetAllItems(categoryId, searchText, pageIndex, pageSize);
            _headersWithPagerSetter.SetHeadersWithPagerData(Response, productsData.Pager);
            return Ok(productsData.ProductList);
        }

        [HttpPost]
        [ProducesResponseType(typeof(List<ProductDTO>), 200)]
        public async Task<IActionResult> GetByIds([FromForm] string ids)
        {
            var productIds = JsonSerializer.Deserialize<List<int>>(ids);
            return Ok(await _productService.GetByIds(productIds));
        }

        [HttpGet]
        [ProducesResponseType(typeof(ProductDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productService.GetById(id);
            if (product == null)
                return NotFound($"Product with id {id} not found.");
            else
                return Ok(product);
        }

        [HttpPost]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(typeof(ProductDTO), StatusCodes.Status201Created)]
        public async Task<IActionResult> Create([FromForm] ProductDTO product)
        {
            _productImagesSetter.SetImagesOnAddProduct(product);
            await _productService.Add(product);
            await _productImageSaver.SaveImagesOnAddProductAsync(product);
            return CreatedAtAction(nameof(Create), product);
        }

        [HttpPut]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Edit([FromForm] ProductEditDTO product)
        {
            // Deserialize the JSON deletedImages string back into productId and imageName dictionary for deleting removed images by admin from wwwroot\images\products folder
            var deletedImagesDictionary = JsonSerializer.Deserialize<Dictionary<int, string>>(product.DeletedImages);
            _productImagesSetter.SetImagesOnEditProduct(product);
            await _productService.Update(product, deletedImagesDictionary.Keys.ToList());
            await _productImageSaver.SaveImagesOnEditProductAsync(product);
            //delete deleted images from wwwroot\images\products folder
            _productImagesDeleter.DeleteImages(deletedImagesDictionary.Values.ToList());
            return NoContent();
        }

        [HttpDelete]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Delete(int id)
        {
            var productImages = (await _productService.GetById(id)).Images;//save images to delete
            var success = await _productService.Remove(id);
            if (success)
            {
                var deletedImagesDictionary = productImages.Select(x => x.ImageName).ToList();
                //delete images from wwwroot\images\products folder
                _productImagesDeleter.DeleteImages(deletedImagesDictionary);
                return Ok();
            }
            else
                return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
