using ASPNetCoreWebApi.BindingModels;
using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.Dtos;
using ASPNetCoreWebApi.Helpers.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASPNetCoreWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class PromoCodeController : Controller
    {
        private readonly IPromoCodeService _promoCodeService;
        private readonly IHeadersWithPagerSetter _headersWithPagerSetter;
        public PromoCodeController(IPromoCodeService promoCodeService,
            IHeadersWithPagerSetter headersWithPagerSetter)
        {
            _promoCodeService = promoCodeService;
            _headersWithPagerSetter = headersWithPagerSetter;
        }

        [HttpGet]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(typeof(List<CategoryForListDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll(string searchText = null, int pageIndex = 1, int pageSize = 20, bool? getOnlyUsed = false)
        {
            var promoCodesData = await _promoCodeService.GetAllItems(searchText, pageIndex, pageSize, getOnlyUsed);
            _headersWithPagerSetter.SetHeadersWithPagerData(Response, promoCodesData.Pager);
            return Ok(promoCodesData.PromoCodeList);
        }

        [HttpPost]
        [ProducesResponseType(typeof(PromoCodeDTO), 200)]
        public async Task<IActionResult> GetByPromoCodeText([FromBody] PromoCodeModel promoCodeModel)
        {
            return Ok(await _promoCodeService.GetByPromoCodeText(promoCodeModel.PromoCodeText));
        }

        [HttpPost]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GeneratePromoCodes([FromBody] GeneratePromoCodes generatePromoCodes)
        {
            var success = await _promoCodeService.GeneratePromoCodes(generatePromoCodes.Quantity, generatePromoCodes.Discount);
            if (success)
                return Ok();
            else
            {
                ModelState.AddModelError("Error", "Can't generate promo codes. Unhandled exception occured.");
                return StatusCode(StatusCodes.Status500InternalServerError, ModelState);
            }
        }

        [HttpDelete]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _promoCodeService.Remove(id);

            if (success)
                return Ok();
            else
            {
                ModelState.AddModelError("Error", "Used promo code can't be deleted.");
                return StatusCode(StatusCodes.Status500InternalServerError, ModelState);
            }
        }
    }
}
