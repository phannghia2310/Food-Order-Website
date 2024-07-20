using back_end.Data;
using back_end.Models;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [ApiController]
    [Route("customer/[controller]")]
    public class CusChatController : Controller
    {
        private readonly FoodOrderContext _context;

        public CusChatController(FoodOrderContext context)
        {
            _context = context;
        }

        [HttpPost("save-message")]
        public async Task<IActionResult> SaveMessage([FromBody] CusChatModel model)
        {
            var newMessage = new Message
            {
                FromUser = model.FromUser!,
                ToUser = model.ToUser!,
                Message1 = model.Message1!,
                Timestamp = model.Timestamp,
                UserId = model.UserId,
                IsRead = model.IsRead,
            };

            _context.Messages.Add(newMessage);
            await _context.SaveChangesAsync();

            return Ok(newMessage);
        }
    }
}
