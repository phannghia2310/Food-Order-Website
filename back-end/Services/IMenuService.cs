using back_end.Data;

namespace back_end.Services
{
    public interface IMenuService
    {
        Task<List<Category>> GetMenuAsync(CancellationToken cancellationToken);
        Task<Product> GetProductByNameAsync(string productName, CancellationToken cancellationToken);
    }
}
