using ASPNetCoreWebApi.Domain.Dtos;
using ASPNetCoreWebApi.Domain.Helpers;
using ASPNetCoreWebApi.Domain.Models;
using ASPNetCoreWebApi.Domain.Repositories;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace ASPNetCoreWebApi.Repositories
{
    public class ProductRepository : IProductRepository, IAsyncDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ProductRepository(ApplicationDbContext context,
            IMapper mapper)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _mapper = mapper;
        }

        public async Task<int> Add(Product newItem)
        {
            try
            {
                newItem.CreatedDate = DateTime.Now;
                _context.Products.Add(newItem);
                return await _context.SaveChangesAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task<ProductsDTO> GetAllItems(int? categoryId, string searchText, int pageIndex, int pageSize)
        {
            var result = new ProductsDTO();
            result.ProductList = new List<ProductDTO>();

            var products = _context.Products.AsNoTracking()
                .Include(x => x.Category)
                .Include(x => x.OrderItems)
                .AsQueryable();
            string summaryTextAdd = "";

            if (categoryId != null || searchText != null)
            {
                summaryTextAdd = $" (filtered from {products.Count()} total entries)";
            }

            if (categoryId != null)
            {
                products = products.Where(x => x.CategoryId == categoryId);
            }

            products = products.OrderByDescending(x => x.Id);

            if (searchText != null)
            {
                products = products.Where(x => x.Name.ToLower()
                .Contains(searchText.ToLower()) || x.Description
                .ToLower()
                .Contains(searchText.ToLower()));
            }

            int totalCount = await products.CountAsync();
            PagerHelper pagerHelper = new PagerHelper(totalCount,
                pageIndex,
                pageSize,
                summaryTextAdd);
            result.Pager = pagerHelper.GetPager;
            result.ProductList = await products.Skip((pagerHelper.CurrentPage - 1) * pagerHelper.PageSize)
                .Take(pagerHelper.PageSize)
                .ProjectTo<ProductDTO>(_mapper.ConfigurationProvider)
                .ToListAsync();
            return result;
        }

        public async Task<List<ProductDTO>> GetByIds(List<int> ids)
        {
            var products = await _context.Products.AsNoTracking()
               .Where(x => ids.Contains(x.Id))
               .ProjectTo<ProductDTO>(_mapper.ConfigurationProvider).
                ToListAsync();
            return products;
        }

        public async Task<ProductDTO> GetById(int id)
        {
            return await _context.Products.AsNoTracking()
                .Include(x => x.OrderItems)
                .Include(x => x.Images)
                .ProjectTo<ProductDTO>(_mapper.ConfigurationProvider)
                .SingleOrDefaultAsync(a => a.Id == id);
        }
        public async Task<Product> Update(Product item, List<int> deletedImageIds)
        {
            var existing = await _context.Products.AsNoTracking()
                .SingleOrDefaultAsync(a => a.Id == item.Id);
            if (existing == null)
                throw new Exception($"product with id: {item.Id} not found.");
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                //check and delete existing images when removed in edit product
                var imagesToDelete = _context.ProductImages
                    .Where(x => x.ProductId == item.Id && deletedImageIds.Contains(x.Id));

                if (imagesToDelete.Any())
                {
                    _context.ProductImages.RemoveRange(imagesToDelete);
                    await _context.SaveChangesAsync();
                }
                item.CreatedDate = existing.CreatedDate;
                _context.Products.Update(item);

                await _context.SaveChangesAsync();
                transaction.Commit();

            }
            catch (Exception ex)
            {
                throw;
            }


            return existing;
        }

        public async Task<bool> Remove(int id)
        {
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                Product entity = await _context.Products.SingleOrDefaultAsync(a => a.Id == id);
                if (entity != null)
                {
                    var ordersToDelete = _context.OrderItems
                        .Include(x => x.Order)
                        .Where(x => x.ProductId == entity.Id)
                        .Select(x => x.Order);

                    var orderIds = ordersToDelete.Select(x => x.Id).ToList();
                    var promoCodesToDelete = _context.PromoCodes
                        .Where(x => x.OrderId.HasValue && orderIds.Contains(x.OrderId.Value));

                    if (promoCodesToDelete.Any())
                    {
                        _context.PromoCodes.RemoveRange(promoCodesToDelete);
                        await _context.SaveChangesAsync();
                    }

                    if (ordersToDelete.Any())
                    {
                        _context.Orders.RemoveRange(ordersToDelete);
                        await _context.SaveChangesAsync();
                    }

                    _context.Products.Remove(entity);

                    await _context.SaveChangesAsync();
                    transaction.Commit();
                }
            }
            catch (Exception ex)
            {
                throw;
            }
            return true;
        }

        public ValueTask DisposeAsync()
        {
            return _context.DisposeAsync();
        }
    }
}
