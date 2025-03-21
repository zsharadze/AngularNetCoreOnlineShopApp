using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.Dtos;
using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Repositories;
using AutoMapper;

namespace ASPNetCoreWebApi.Domain.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repository;
        private readonly IMapper _mapper;

        public ProductService(IProductRepository productRepository, IMapper mapper)
        {
            _repository = productRepository;
            _mapper = mapper;
        }

        public Task<int> Add(ProductDTO newItem)
        {
            return _repository.Add(_mapper.Map<Product>(newItem));
        }

        public Task<ProductsDTO> GetAllItems(int? categoryId, string searchText, int pageIndex, int pageSize)
        {
            return _repository.GetAllItems(categoryId, searchText, pageIndex, pageSize);
        }

        public Task<List<ProductDTO>> GetByIds(List<int> ids)
        {
            return _repository.GetByIds(ids);
        }

        public async Task<ProductDTO> GetById(int id)
        {
            return await _repository.GetById(id);
        }

        public async Task<ProductDTO> Update(ProductEditDTO item, List<int> deletedImageIds)
        {
            return _mapper.Map<ProductDTO>(await _repository.Update(_mapper.Map<Product>(item), deletedImageIds));
        }

        public Task<bool> Remove(int id)
        {
            return _repository.Remove(id);
        }
    }
}
