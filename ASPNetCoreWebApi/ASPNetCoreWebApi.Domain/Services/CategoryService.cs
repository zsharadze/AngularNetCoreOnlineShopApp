﻿using ASPNetCoreWebApi.Domain.Contracts;
using ASPNetCoreWebApi.Domain.Dtos;
using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Repositories;
using AutoMapper;

namespace ASPNetCoreWebApi.Domain.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repository;
        private readonly IMapper _mapper;

        public CategoryService(ICategoryRepository repository,
            IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public Task<int> Add(CategoryDTO newItem)
        {
            return _repository.Add(_mapper.Map<Category>(newItem));
        }

        public Task<CategoriesDTO> GetAllItems(string searchText, int? pageIndex, int? pageSize)
        {
            return _repository.GetAllItems(searchText, pageIndex, pageSize);
        }

        public async Task<CategoryDTO> GetById(int id)
        {
            return await _repository.GetById(id);
        }

        public async Task<CategoryDTO> Update(CategoryDTO item)
        {
            return _mapper.Map<CategoryDTO>(await _repository.Update(_mapper.Map<Category>(item)));
        }

        public Task<bool> Remove(int id)
        {
            return _repository.Remove(id);
        }
    }
}
