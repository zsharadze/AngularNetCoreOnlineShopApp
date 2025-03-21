using ASPNetCoreWebApi.Domain.Dtos;
using ASPNetCoreWebApi.Domain.Models;

namespace ASPNetCoreWebApi.Domain.Repositories
{
    public interface IPromoCodeRepository
    {
        Task<PromoCodesDTO> GetAllItems(string searchText, int pageIndex, int pageSize, bool? getOnlyUsed);
        Task<int> Add(PromoCode newItem);
        Task<bool> Remove(int id);
        Task<bool> GeneratePromoCodes(int quantity, int discount);
        Task<PromoCode> GetByPromoCodeText(string promoCodeText);
    }
}
