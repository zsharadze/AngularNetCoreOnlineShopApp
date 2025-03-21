using ASPNetCoreWebApi.Domain.Dtos;
using ASPNetCoreWebApi.Domain.Models;
using AutoMapper;

namespace ASPNetCoreWebApi.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<CreateOrderData, OrderItem>();
            CreateMap<Category, CategoryDTO>().ReverseMap();
            CreateMap<Category, CategoryForListDTO>().ForMember(dest => dest.ProductsCount, act => act.MapFrom(src => src.Products != null ? src.Products.Count : 0)); ;
            CreateMap<ProductDTO, Product>().ReverseMap().ForMember(dest => dest.OrdersCount, act => act.MapFrom(src => src.OrderItems != null ? src.OrderItems.Count : 0));
            CreateMap<ProductEditDTO, Product>();
            CreateMap<PromoCode, PromoCodeDTO>()
                .ForMember(dest => dest.UsedOnOrderId,
                act => act.MapFrom(src => src.Order != null ? src.Order.Id : 0))
                .ForMember(dest => dest.UsedByUserEmail,
                act => act.MapFrom(src => src.Order != null
                && src.Order.User != null ? src.Order.User.Email : null));
        }
    }
}
