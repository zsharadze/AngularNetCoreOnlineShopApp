using ASPNetCoreWebApi.Domain.Helpers;

namespace ASPNetCoreWebApi.Domain.Dtos
{
    public class PromoCodesDTO
    {
        public List<PromoCodeDTO> PromoCodeList { get; set; }
        public Pager Pager { get; set; }
    }
}
