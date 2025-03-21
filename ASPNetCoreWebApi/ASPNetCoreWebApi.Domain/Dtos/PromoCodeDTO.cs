namespace ASPNetCoreWebApi.Domain.Dtos
{
    public class PromoCodeDTO
    {
        public int Id { get; set; }
        public string PromoCodeText { get; set; }
        public bool IsUsed { get; set; }
        public DateTime CreatedDate { get; set; }
        public int Discount { get; set; }
        public string UsedByUserEmail { get; set; }
        public int? UsedOnOrderId { get; set; }
    }
}
