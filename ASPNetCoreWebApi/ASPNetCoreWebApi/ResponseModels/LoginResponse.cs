namespace ASPNetCoreWebApi.ResponseModels
{
    public class LoginResponse
    {
        public string UserEmail { get; set; }
        public string UserRole { get; set; }
        public string Token { get; set; }
        public DateTime TokenExpiration { get; set; }
    }
}
