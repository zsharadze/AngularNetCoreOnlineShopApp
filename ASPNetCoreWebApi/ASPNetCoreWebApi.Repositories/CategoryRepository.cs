using ASPNetCoreWebApi.Domain.Dtos;
using ASPNetCoreWebApi.Domain.Helpers;
using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Repositories;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace ASPNetCoreWebApi.Repositories
{
    public class CategoryRepository : ICategoryRepository, IAsyncDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CategoryRepository(ApplicationDbContext context,
            IMapper mapper)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _mapper = mapper;
        }

        public async Task<int> Add(Category newItem)
        {
            await _context.Categories.AddAsync(newItem);
            try
            {
                return await _context.SaveChangesAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task<CategoriesDTO> GetAllItems(string searchText, int? pageIndex, int? pageSize)
        {
            var result = new CategoriesDTO();
            result.CategoryList = new List<CategoryForListDTO>();

            var categories = _context.Categories.AsNoTracking()
                .Include(x => x.Products)
                .AsQueryable();
            string summaryTextAdd = "";

            if (searchText != null)
            {
                summaryTextAdd = $" (filtered from {categories.Count()} total entries)";
            }

            categories = categories.OrderBy(x => x.Name);

            if (searchText != null)
            {
                categories = categories.Where(x => x.Name.ToLower()
                .Contains(searchText.ToLower()));
            }

            if (pageSize.HasValue && pageIndex.HasValue)
            {
                int totalCount = await categories.CountAsync();
                PagerHelper pagerHelper = new PagerHelper(totalCount,
                    pageIndex.Value,
                    pageSize.Value,
                    summaryTextAdd);
                result.Pager = pagerHelper.GetPager;
                result.CategoryList = await categories
                    .Skip((pagerHelper.CurrentPage - 1) * pagerHelper.PageSize)
                    .Take(pagerHelper.PageSize)
                    .ProjectTo<CategoryForListDTO>(_mapper.ConfigurationProvider)
                    .ToListAsync();
                return result;
            }
            else
            {
                throw new Exception("pageSize or pageIndex parameter is null");
            }
        }

        public async Task<CategoryDTO> GetById(int id)
        {
            return await _context.Categories.AsNoTracking()
                .ProjectTo<CategoryDTO>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync(a => a.Id == id);
        }

        public async Task<Category> Update(Category item)
        {
            var existing = await _context.Categories.AsNoTracking().SingleOrDefaultAsync(a => a.Id == item.Id);
            if (existing == null)
                throw new Exception($"category with id: {item.Id} not found.");

            _context.Categories.Update(item);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch
            {
                throw;
            }

            return existing;
        }

        public async Task<bool> Remove(int id)
        {
            Category entity = await _context.Categories.Include(x => x.Products).SingleOrDefaultAsync(a => a.Id == id);
            if (entity != null)
            {
                if (entity.Products.Any())
                {
                    return false;
                }
                _context.Categories.Remove(entity);
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch
                {
                    throw;
                }
            }

            return true;
        }

        public ValueTask DisposeAsync()
        {
            return _context.DisposeAsync();
        }
    }
}