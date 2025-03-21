namespace ASPNetCoreWebApi.Helpers.Contracts
{
    public interface IProductImagesDeleter
    {
        void DeleteImages(List<string> productImageFileNames);
    }
}
