using Azure.Storage.Blobs;
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
        private readonly BlobServiceClient _service;
        private readonly IConfiguration _configuration;

        public ProductController(FoodOrderContext context, IWebHostEnvironment hostingEnvironment,
            BlobServiceClient service, IConfiguration configuration)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment ?? throw new ArgumentNullException(nameof(hostingEnvironment));
            _service = service;
            _configuration = configuration;
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

            try
            {
                var containerName = _configuration["AzureBlobStorage:ContainerName"];
                var containerClient = _service.GetBlobContainerClient(containerName);

                await containerClient.CreateIfNotExistsAsync();

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.Image.FileName);
                var blobClient = containerClient.GetBlobClient(fileName);

                using (var stream = image.Image.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, true);
                }

                return Ok(new { imagePath = fileName });
            } 
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
