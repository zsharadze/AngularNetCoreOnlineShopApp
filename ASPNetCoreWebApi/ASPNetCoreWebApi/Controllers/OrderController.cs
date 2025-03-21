using ASPNetCoreWebApi.BindingModels;
using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.Dtos;
using ASPNetCoreWebApi.Extensions;
using ASPNetCoreWebApi.Helpers.Contracts;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ASPNetCoreWebApi.Controllers
{

    [ApiController]
    [Route("api/[controller]/[action]")]
    public class OrderController : Controller
    {
        private readonly IOrderService _orderService;
        private readonly IHeadersWithPagerSetter _headersWithPagerSetter;
        public OrderController(IOrderService orderService,
            IMapper mapper,
            IHeadersWithPagerSetter headersWithPagerSetter)
        {
            _orderService = orderService;
            _headersWithPagerSetter = headersWithPagerSetter;
        }

        [HttpPost]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequestDTO createOrderRequest)
        {
            if (!createOrderRequest.OrdersList.Any())
                throw new Exception("Invalid order items passed");
            await _orderService.CreateOrder(createOrderRequest.OrdersList, createOrderRequest.PromoCode, User.GetCurrentUserId());
            return Created();
        }

        [HttpGet]
        [Authorize]
        [ProducesResponseType(typeof(List<OrderDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllForCurrentUser(int pageIndex = 1, int pageSize = 20)
        {
            var ordersDataData = await _orderService.GetAllItemsForCurrentUser(User.GetCurrentUserId(), pageIndex, pageSize);
            _headersWithPagerSetter.SetHeadersWithPagerData(Response, ordersDataData.Pager);
            return Ok(ordersDataData.OrderList);
        }

        [HttpGet]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(typeof(List<OrderDTO>), StatusCodes.Status200OK)]

        public async Task<IActionResult> GetAll(int pageIndex = 1, int pageSize = 20)
        {
            var ordersDataData = await _orderService.GetAllItems(pageIndex, pageSize);
            _headersWithPagerSetter.SetHeadersWithPagerData(Response, ordersDataData.Pager);
            return Ok(ordersDataData.OrderList);
        }

        [HttpPost]
        [Authorize(Roles = UserRoles.Admin)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> ChangeStatus([FromBody] ChangeOrderStatusDTO changeOrderStatusRequest)
        {
            await _orderService.ChangeStatus(changeOrderStatusRequest);
            return Ok();
        }
    }
}
