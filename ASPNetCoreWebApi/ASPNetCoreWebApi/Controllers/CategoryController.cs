using ASPNetCoreWebApi.BindingModels;
using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.Dtos;
using ASPNetCoreWebApi.Helpers.Contracts;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASPNetCoreWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class CategoryController : Controller
    {
        private readonly ICategoryService _categoryService;
        private readonly ICategoryImageSetter _categoryImageSetter;
        private readonly ICategoryImageSaver _categoryImageSaver;
        private readonly ICategoryImagesDeleter _categoryImageDeleter;
        private readonly IHeadersWithPagerSetter _headersWithPagerSetter;
        public CategoryController(ICategoryService categoryService,
            IMapper mapper,
            ICategoryImageSetter categorymageSetter,
            ICategoryImageSaver categoryImageSaver,
            ICategoryImagesDeleter categoryImageDeleter,
            IHeadersWithPagerSetter headersWithPagerSetter)
        {
            _categoryService = categoryService;
            _categoryImageSetter = categorymageSetter;
            _categoryImageSaver = categoryImageSaver;
            _categoryImageDeleter = categoryImageDeleter;
            _headersWithPagerSetter = headersWithPagerSetter;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<CategoryForListDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll(string searchText = null, int? pageIndex = 1, int? pageSize = null)
        {
            var categoriesData = await _categoryService.GetAllItems(searchText, pageIndex, pageSize);
            _headersWithPagerSetter.SetHeadersWithPagerData(Response, categoriesData.Pager);
            return Ok(categoriesData.CategoryList);
        }

        [HttpGet]
        [ProducesResponseType(typeof(CategoryDTO), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await _categoryService.GetById(id));
        }

        [HttpPost]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(typeof(CategoryDTO), StatusCodes.Status201Created)]
        public async Task<IActionResult> Create([FromForm] CategoryDTO category)
        {
            if (category.Image != null)
                _categoryImageSetter.SetImageOnCategoryAddEdit(category);
            await _categoryService.Add(category);
            if (category.Image != null)
                await _categoryImageSaver.SaveImagesOnAddEditCategoryAsync(category);
            return CreatedAtAction(nameof(Create), category);
        }

        [HttpPut]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Edit([FromForm] CategoryDTO category)
        {
            var imageNameToDelete = category.ImageName;
            if (category.Image != null)//check if image is uploaded and save.
            {
                _categoryImageSetter.SetImageOnCategoryAddEdit(category);
                await _categoryImageSaver.SaveImagesOnAddEditCategoryAsync(category);
                //delete deleted images from wwwroot\images\categories folder
                _categoryImageDeleter.DeleteImage(imageNameToDelete);
            }

            await _categoryService.Update(category);

            return NoContent();
        }

        [HttpDelete]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _categoryService.GetById(id);
            var success = await _categoryService.Remove(id);
            if (success)
            {    //delete image from wwwroot\images\category folder
                _categoryImageDeleter.DeleteImage(existing.ImageName);
                return Ok();
            }//
            else
            {
                ModelState.AddModelError("Error", "Can't delete category because there are products attached to it.");
                return StatusCode(StatusCodes.Status500InternalServerError, ModelState);
            }
        }
    }
}