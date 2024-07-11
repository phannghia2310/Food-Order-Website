using back_end.Data;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [ApiController]
    [Route("customer/[controller]")]
    public class MenuItemController : Controller
    {
        private readonly FoodOrderContext _context;

        public MenuItemController(FoodOrderContext context)
        {
            _context = context;
        }

        [HttpGet(Name = "GetAllItem")]
        public ActionResult<List<Product>> GetAllItem()
        {
            var items = _context.Products.Where(i => i.IsActive == true).ToList();
            return Ok(items);
        }

        [HttpGet("{id}", Name = "GetItemByCategory")]
        public ActionResult<List<Product>> GetItemByCategory(int id)
        {
            var items = _context.Products.Where(i => i.CategoryId == id && i.IsActive == true).ToList();
            return Ok(items);
        }
    }
}
