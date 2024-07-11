using back_end.Areas.Admin.Models;
using back_end.Data;
using back_end.Helpers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting.Internal;
using System.Numerics;
using System.Security.Claims;
using System.Security.Policy;

namespace back_end.Areas.Admin.Controllers
{
    [Area("Admin")]
    [ApiController]
    [Route("admin/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly FoodOrderContext _context;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public UserController(FoodOrderContext context, IWebHostEnvironment hostingEnvironment)
        {
            _context = context;
            _hostingEnvironment = hostingEnvironment ?? throw new ArgumentNullException(nameof(hostingEnvironment));
        }

        [HttpGet(Name = "GetAllUser")]
        public ActionResult<List<User>> Get()
        {
            var users = _context.Users.ToList();
            return Ok(users);
        }

        [HttpGet("{id}", Name = "GetUserById")]
        public ActionResult<User> Get(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPost(Name = "CreateUser")]
        public ActionResult<User> Post([FromBody] UserModel user)
        {
            var existingUser = _context.Users.FirstOrDefault(u => u.Username == user.Username);
            if (existingUser != null)
            {
                return BadRequest("Username already exists");
            }

            var newUser = new User
            {
                Name = "",
                Username = user.Username,
                Password = user.Password?.toMd5Hash(MySetting.PASS_KEY),
                Email = "",
                Phone = "",
                Address = "",
                ImageUrl = "",
                IsAdmin = user.IsAdmin,
                CreatedDate = DateTime.Now,
                RandomKey = "",
            };

            _context.Users.Add(newUser);
            _context.SaveChanges();
            return Ok(newUser);
        }

        [HttpPut("{id}", Name = "UpdateUser")]
        public IActionResult Put(int id, [FromForm] UserModel user)
        {
            var existingUser = _context.Users.Find(id);
            if (existingUser == null)
            {
                return NotFound();
            }

            var existingUsername = _context.Users.FirstOrDefault(u => u.Username == user.Username && u.UserId != id);
            if (existingUsername != null)
            {
                return Conflict("Username is already in use");
            }

            var existingEmailUser = _context.Users.FirstOrDefault(u => u.Email == user.Email && u.UserId != id);
            if (existingEmailUser != null)
            {
                return Conflict("Email address is already in use");
            }

            existingUser.Name = user.Name;
            existingUser.Username = user.Username;
            existingUser.Phone = user.Phone;
            existingUser.Email = user.Email;
            existingUser.Address = user.Address;
            existingUser.IsAdmin = user.IsAdmin;
            existingUser.ImageUrl = user.Image;
            existingUser.CreatedDate = user.CreatedDate;

            _context.Users.Update(existingUser);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete("{id}", Name = "DeleteUser")]
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage([FromForm] ImageUploadModel image)
        {
            if (image.Image == null || image.Image?.Length == 0)
            {
                return BadRequest("Image file is not selected");
            }

            var uploadFolder = Path.Combine(@"C:\Users\phank\OneDrive\Documents\CODEWORK\WEB\ASP.NET\WebAPI\Food-Delivery\front-end\admin-site\public\img", "user");

            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder);
            }

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.Image?.FileName);
            var filePath = Path.Combine(uploadFolder, fileName);

            var existingFilePath = Directory.GetFiles(uploadFolder, fileName).FirstOrDefault();
            if (existingFilePath != null)
            {
                // File with same name exists, delete it
                System.IO.File.Delete(existingFilePath);
            }

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.Image!.CopyToAsync(stream);
            }

            var relativePath = Path.Combine(fileName).Replace("\\", "/");
            return Ok(new { imagePath = relativePath });
        }

        [HttpPost("login", Name = "Login")]
        public async Task<IActionResult> Login(UserModel model)
        {
            var user = _context.Users.SingleOrDefault(us => us.Username == model.Username);
            if (user == null)
            {
                return BadRequest("This user not valid.");
            }
            else
            {
                if (user.Password != model.Password?.toMd5Hash(MySetting.PASS_KEY))
                {
                    return BadRequest("Password is not correct.");
                }
                else
                {
                    if (user.IsAdmin == true)
                    {
                        var claims = new List<Claim>
                        {
                            new Claim(ClaimTypes.Name, user.Username),
                            new Claim(MySetting.CLAIM_ADMINID, user.UserId.ToString()),
                            new Claim(ClaimTypes.Role, "Admin"),
                        };

                        var scheme = HttpContext.Request.Path.StartsWithSegments("/admin") ? "AdminAuth" : "CustomerAuth";
                        var claimsIdentity = new ClaimsIdentity(claims, scheme);
                        var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);
                        await HttpContext.SignInAsync(scheme, claimsPrincipal);

                        return Ok(new { user.UserId, user.Username, user.IsAdmin, user.ImageUrl });
                    }
                    else
                    {
                        return BadRequest("Error permission. You are not admin.");
                    }
                }
            }
        }
    }
}
