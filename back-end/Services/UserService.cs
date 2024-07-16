using back_end.Data;
using back_end.Helpers;
using back_end.Models;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services
{
    public class UserService
    {
        private readonly FoodOrderContext _context;

        public UserService(FoodOrderContext context)
        {
            _context = context;
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task<User> AuthenticateUserAsync(string email, string password)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == email);
            if (user == null || password.toMd5Hash(MySetting.PASS_KEY) != user.Password)
            {
                return null!;
            }

            return user;
        }

        public async Task<User> CreateUserAsync(RegisterModel model)
        {
            var random = new Random();
            var randomNumber = random.Next(10000, 99999); // Generates a number between 10000 and 99999
            var randomUsername = "user" + randomNumber;

            var user = new User
            {
                Name = model.Name,
                Username = randomUsername,
                Email = model.Email,
                Password = model.Password,
                CreatedDate = DateTime.Now,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> CreateUserWithGoogleAsync(string email, string fullName)
        {
            var random = new Random();
            var randomNumber = random.Next(10000, 99999); // Generates a number between 10000 and 99999
            var randomUsername = "user" + randomNumber;

            var user = new User
            {
                Email = email,
                Name = fullName,
                Username = randomUsername,
                CreatedDate = DateTime.Now,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }
    }
}
