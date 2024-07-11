using back_end.Areas.Admin.Models;
using back_end.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting.Internal;

namespace back_end.Areas.Admin.Controllers
{
    [Area("Admin")]
    [ApiController]
    [Route("admin/[controller]")]
    public class CategoryController : Controller
    {
        private readonly FoodOrderContext _context;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public CategoryController(FoodOrderContext context, IWebHostEnvironment hostingEnvironment)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment ?? throw new ArgumentNullException(nameof(hostingEnvironment)); ;
        }

        [HttpGet(Name = "GetAllCategory")]
        public ActionResult<List<Category>> Get()
        {
            var categories = _context.Categories.ToList();
            return Ok(categories);
        }

        [HttpGet("{id}", Name = "GetCategoryById")]
        public ActionResult<Category> Get(int id)
        {
            var category = _context.Categories.Find(id);
            if (category == null)
            {
                return NotFound();
            }
            return Ok(category);
        }

        [HttpPost(Name = "CreateCategory")]
        public ActionResult<Category> Post([FromBody] CategoryModel category) 
        {
            var existingCategory = _context.Categories.FirstOrDefault(c => c.CategoryName == category.CategoryName);
            if (existingCategory != null)
            {
                return Conflict("Category name is already in use.");
            }

            var newCategory = new Category
            {
                CategoryName = category.CategoryName,
                IsActive = category.IsActive,
            };

            _context.Categories.Add(newCategory);
            _context.SaveChanges();

            return Ok(newCategory);
        }

        [HttpPut("{id}", Name = "UpdateCategory")]
        public IActionResult Put(int id, [FromBody] CategoryModel category)
        {
            var existingCategory = _context.Categories.Find(id);
            if(existingCategory == null)
            {
                return NotFound();
            }

            var existingCategoryName = _context.Categories.FirstOrDefault(c => c.CategoryName == category.CategoryName && c.CategoryId != id);
            if (existingCategoryName != null)
            {
                return Conflict("Category name is already in use.");
            }

            existingCategory.CategoryName = category.CategoryName;
            existingCategory.IsActive = category.IsActive;

            _context.Categories.Update(existingCategory);
            _context.SaveChanges();

            return Ok(existingCategory);
        }

        [HttpDelete("{id}", Name = "DeleteCategory")]
        public IActionResult Delete(int id)
        {
            var category = _context.Categories.Find(id);
            if (category == null)
            {
                return NotFound();
            }

            _context.Categories.Remove(category);
            _context.SaveChanges();
            return Ok();
        }
    }
}
