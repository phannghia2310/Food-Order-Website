using back_end.Data;
using back_end.Helpers;
using back_end.Models;
using back_end.Services;
using Microsoft.AspNetCore.Mvc;
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
        private readonly UserService _service;
        private readonly IConfiguration _configuration;

        public AuthController(UserService service, IConfiguration configuration)
        {
            _service = service;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            if(await _service.EmailExistsAsync(user.Email!))
            {
                return Conflict("Account with this email already exists"); ;
            }

            if (user.Password!.Length < 8)
            {
                return BadRequest("Password must be at least 8 characters");
            }

            user.Password = user.Password.toMd5Hash(MySetting.PASS_KEY);
            var createdUser = await _service.CreateUserAsync(user);
            return Ok();
        }

        [HttpPost("sigin")]
        public async Task<IActionResult> Sigin([FromBody] LoginModel model)
        {
            var user = await _service.AuthenticateUserAsync(model.Email!, model.Password!);
            if(user == null)
            {
                return Unauthorized("Invalid email or password");
            }

            var token = GenerateJwtToken(user);

            return Ok(new { token });
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
    }
}
