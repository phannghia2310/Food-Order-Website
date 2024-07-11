using back_end.Data;
using back_end.Helpers;
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

        public async Task<User> CreateUserAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }
    }
}
