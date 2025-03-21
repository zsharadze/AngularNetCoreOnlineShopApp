using ASPNetCoreWebApi.Domain.Dtos;
using ASPNetCoreWebApi.Domain.Models;

namespace ASPNetCoreWebApi.Domain.Contracts
{
    public interface IPromoCodeService
    {
        Task<PromoCodesDTO> GetAllItems(string searchText, int pageIndex, int pageSize, bool? getOnlyUsed);
        Task<int> Add(PromoCode newItem);
        Task<bool> Remove(int id);
        Task<bool> GeneratePromoCodes(int quantity, int discount);
        Task<PromoCodeDTO> GetByPromoCodeText(string promoCodeText);
    }
}
