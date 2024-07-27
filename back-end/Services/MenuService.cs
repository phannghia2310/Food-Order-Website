using back_end.Data;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services
{
    public class MenuService : IMenuService
    {
        private readonly FoodOrderContext _context;

        public MenuService(FoodOrderContext context)
        {
            _context = context;
        }

        public async Task<List<Category>> GetMenuAsync(CancellationToken cancellationToken)
        {
            return await _context.Categories.Include(c => c.Products).ToListAsync(cancellationToken);
        }

        public async Task<Product> GetProductByNameAsync(string productName, CancellationToken cancellationToken)
        {
            return await _context.Products.FirstOrDefaultAsync(p => p.ProductName == productName, cancellationToken);
        }
    }
}
