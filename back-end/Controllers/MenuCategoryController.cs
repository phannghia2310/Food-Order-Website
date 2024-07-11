using back_end.Data;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [ApiController]
    [Route("customer/[controller]")]
    public class MenuCategoryController : Controller
    {
        private readonly FoodOrderContext _context;

        public MenuCategoryController(FoodOrderContext context)
        {
            _context = context;
        }

        [HttpGet(Name = "GetAllCate")]
        public ActionResult<List<Category>> GetAllCategory()
        {
            var categories = _context.Categories.Where(c => c.IsActive == true).ToList();
            return Ok(categories);
        }
    }
}
