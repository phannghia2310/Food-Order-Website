using back_end.Areas.Admin.Models;
using back_end.Data;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Areas.Admin.Controllers
{
    [Area("admin")]
    [ApiController]
    [Route("admin/[controller]")]
    public class ProductController : Controller
    {
        private readonly FoodOrderContext _context;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly UploadPathsOptions _upload;

        public ProductController(FoodOrderContext context, IWebHostEnvironment hostingEnvironment, UploadPathsOptions upload)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment ?? throw new ArgumentNullException(nameof(hostingEnvironment));
            _upload = upload;
        }

        [HttpGet(Name = "GetAllProduct")] 
        public ActionResult<List<Product>> Get()
        {
            var products = _context.Products.ToList();
            return Ok(products);
        }

        [HttpGet("{id}", Name = "GetProductById")]
        public ActionResult<Product> Get(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        [HttpPost(Name = "CreateProduct")]
        public ActionResult<Product> Post([FromBody] ProductModel product) 
        {
            var existingProduct = _context.Products.FirstOrDefault(p => p.ProductName == product.ProductName);
            if(existingProduct != null)
            {
                return Conflict("Product name is already use");
            }

            var newProduct = new Product
            {
                ProductName = product.ProductName,
                CategoryId = product.CategoryId,
                Description = product.Description,
                Price = product.Price,
                Quantity = product.Quantity,
                ImageUrl = product.ImageUrl,
                IsActive = product.IsActive,
                CreateDate = DateTime.Now,
            };

            _context.Products.Add(newProduct);
            _context.SaveChanges();

            return Ok(newProduct);
        }

        [HttpPut("{id}", Name = "UpdateProduct")]
        public IActionResult Put(int id, [FromForm] ProductModel product)
        {
            var existingProduct = _context.Products.Find(id);
            if (existingProduct == null)
            {
                return NotFound();
            }

            var existingProductName = _context.Products.FirstOrDefault(p => p.ProductName == product.ProductName && p.ProductId != id);
            if (existingProductName != null)
            {
                return Conflict("Product name is already use");
            }

            existingProduct.ProductName = product.ProductName;
            existingProduct.CategoryId = product.CategoryId;
            existingProduct.Description = product.Description;
            existingProduct.Price = product.Price;
            existingProduct.Quantity = product.Quantity;
            existingProduct.ImageUrl = product.ImageUrl;
            existingProduct.IsActive = product.IsActive;
            existingProduct.CreateDate = DateTime.Now;

            _context.Products.Update(existingProduct);
            _context.SaveChanges();
            return Ok(existingProduct);
        }

        [HttpDelete("{id}", Name = "DeleteProduct")]
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage([FromForm] ImageUploadModel image)
        {
            if (image.Image == null || image.Image.Length == 0)
            {
                return BadRequest("Image file is not selected");
            }

            // Define both upload paths
            var adminUploadFolder = Path.Combine(Directory.GetCurrentDirectory(), _upload.AdminUploadFolder!);
            //var customerUploadFolder = Path.Combine(Directory.GetCurrentDirectory(), _upload.CustomerUploadFolder!);

            // Ensure both directories exist
            if (!Directory.Exists(adminUploadFolder))
            {
                Directory.CreateDirectory(adminUploadFolder);
            }
            //if (!Directory.Exists(customerUploadFolder))
            //{
            //    Directory.CreateDirectory(customerUploadFolder);
            //}

            // Generate file name and paths
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.Image.FileName);
            var adminFilePath = Path.Combine(adminUploadFolder, fileName);
            //var customerFilePath = Path.Combine(customerUploadFolder, fileName);

            // Check and delete existing files with the same name in both directories
            var existingAdminFilePath = Directory.GetFiles(adminUploadFolder, fileName).FirstOrDefault();
            //var existingCustomerFilePath = Directory.GetFiles(customerUploadFolder, fileName).FirstOrDefault();
            if (existingAdminFilePath != null)
            {
                System.IO.File.Delete(existingAdminFilePath);
            }
            //if (existingCustomerFilePath != null)
            //{
            //    System.IO.File.Delete(existingCustomerFilePath);
            //}

            // Save the file to both directories
            using (var stream = new FileStream(adminFilePath, FileMode.Create))
            {
                await image.Image.CopyToAsync(stream);
            }
            //using (var stream = new FileStream(customerFilePath, FileMode.Create))
            //{
            //    await image.Image.CopyToAsync(stream);
            //}

            // Return the relative path (assuming it's the same for both)

            var relativePath = Path.Combine(fileName).Replace("\\", "/");
            return Ok(new { imagePath = relativePath });
        }
    }
}
