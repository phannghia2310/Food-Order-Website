﻿using back_end.Data;
using back_end.Helpers;
using back_end.Models;
using back_end.Services;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace back_end.Controllers
{
    [ApiController]
    [Route("customer/[controller]")]
    public class AuthController : Controller
    {
        private readonly FoodOrderContext _context;
        private readonly UserService _service;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        public AuthController(FoodOrderContext contex, UserService service, IConfiguration configuration, ILogger<AuthController> logger)
        {
            _context = contex;
            _service = service;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel user)
        {
            if (await _service.EmailExistsAsync(user.Email!))
            {
                return Conflict("Account with this email already exists");
            }

            if (user.Password!.Length < 8)
            {
                return BadRequest("Password must be at least 8 characters");
            }

            user.Password = user.Password.toMd5Hash(MySetting.PASS_KEY);
            try
            {
                var createdUser = await _service.CreateUserAsync(user);
                return Ok(createdUser);
            }
            catch (DbUpdateException ex)
            {
                // Log the inner exception
                return StatusCode(500, ex.InnerException?.Message);
            }
        }

        [HttpPost("signin")]
        public async Task<IActionResult> Signin([FromBody] LoginModel model)
        {
            var user = await _service.AuthenticateUserAsync(model.Email!, model.Password!);
            if(user == null)
            {
                return Unauthorized("Invalid email or password");
            }

            var token = GenerateJwtToken(user);

            return Ok(new { token, user });
        }

        [HttpPost("signin/google")]
        public async Task<IActionResult> SignInWithGoogle([FromBody] GoogleSignInRequestModel request)
        {
            _logger.LogInformation($"Google Client ID: {_configuration["GoogleKeys:ClientId"]}");

            var payload = await ValidateGoogleTokenAsync(request.idToken!);
            if(payload == null)
            {
                return Unauthorized("Invalid Google token");
            }

            bool emailExists = await _service.EmailExistsAsync(payload.Email);
            User? user;

            if (emailExists)
            {
                // Retrieve the user if the email exists
                user = await _context.Users.SingleOrDefaultAsync(u => u.Email == payload.Email);
            }
            else
            {
                // Create a new user if the email doesn't exist
                user = new User
                {
                    Email = payload.Email,
                    Name = payload.Name,
                };
                user = await _service.CreateUserWithGoogleAsync(user.Email, user.Name);
            }

            if(!string.IsNullOrEmpty(payload.Picture))
            {
                var picture = await SavePictureAsync(payload.Picture);
                user!.ImageUrl = picture;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
            }

            var token = GenerateJwtToken(user!);
            return Ok(new { token, user });
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] CustomerModel model)
        {
            var customer = await _context.Users.FindAsync(id);
            if(customer == null)
            {
                return NotFound("User not found");
            }

            customer.Name = model.Name ?? customer.Name;
            customer.Phone = model.Phone ?? customer.Phone;
            customer.Address = model.Address ?? customer.Address;
            customer.ImageUrl = model.ImageUrl ?? customer.ImageUrl;

            _context.Users.Update(customer);
            await _context.SaveChangesAsync();

            return Ok(customer);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Image file is not selected");
            }

            // Define both upload paths
            var uploadFolder = Path.Combine(@"C:\Users\phank\OneDrive\Documents\CODEWORK\WEB\ASP.NET\WebAPI\Food-Delivery\front-end\customer-site\public\assets", "user");

            // Ensure both directories exist
            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder);
            }

            // Generate file name and paths
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadFolder, fileName);

            // Check and delete existing files with the same name in both directories
            var existingFilePath = Directory.GetFiles(uploadFolder, fileName).FirstOrDefault();
            if (existingFilePath != null)
            {
                System.IO.File.Delete(existingFilePath);
            }

            // Save the file to both directories
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Return the relative path (assuming it's the same for both)
            var relativePath = Path.Combine(fileName).Replace("\\", "/");
            return Ok(new { imagePath = relativePath });
        }
 
        private async Task<GoogleJsonWebSignature.Payload> ValidateGoogleTokenAsync(string idToken)
        {
            if (string.IsNullOrEmpty(idToken))
            {
                throw new ArgumentNullException(nameof(idToken), "idToken cannot be null or empty");
            }

            var settings = new GoogleJsonWebSignature.ValidationSettings()
            {
                Audience = new List<string>() { _configuration["GoogleKeys:ClientId"]! }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);
            return payload;
        }


        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["Jwt:ExpiryDurationInMinutes"])),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private async Task<string> SavePictureAsync(string pictureUrl)
        {
            using var httpClient = new HttpClient();
            var response = await httpClient.GetAsync(pictureUrl);
            if(!response.IsSuccessStatusCode)
            {
                throw new Exception("Could not download profile picture");
            }

            var pictureBytes = await response.Content.ReadAsByteArrayAsync();
            var fileExtension = ".png";
            var fileName = $"{pictureUrl.Replace("https://lh3.googleusercontent.com/a/", "")}{fileExtension}";
            var filePath = Path.Combine(@"C:\Users\phank\OneDrive\Documents\CODEWORK\WEB\ASP.NET\WebAPI\Food-Delivery\front-end\customer-site\public\assets\user", fileName);

            await System.IO.File.WriteAllBytesAsync(filePath, pictureBytes);

            return fileName;
        } 
    }
}
