using back_end.Areas.Admin.Models;
using back_end.Data;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Areas.Admin.Controllers
{
    [Area("admin")]
    [ApiController]
    [Route("admin/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly FoodOrderContext _context;

        public ChatController(FoodOrderContext context)
        {
            _context = context;
        }

        [HttpPost("save-message")]
        public async Task<IActionResult> SaveMessage([FromBody] MessageModel message)
        {
            var newMessage = new Message
            {
                FromUser = message.FromUser!,
                ToUser = message.ToUser!,
                Message1 = message.Message1!,
                Timestamp = message.Timestamp,
                UserId = message.UserId,
                IsRead = message.IsRead,
            };

            _context.Messages.Add(newMessage);
            await _context.SaveChangesAsync();

            return Ok(newMessage);
        }

        [HttpGet("unread-messages-count")]
        public IActionResult GetUnreadMessagesCount()
        {
            var unreadMessagesCount = _context.Messages.Count(m => m.FromUser != "Admin" && m.IsRead == 0);
            return Ok(unreadMessagesCount);
        }

        [HttpGet("unread-messages")]
        public IActionResult GetUnreadMessages()
        {
            var unreadMessages = _context.Messages.Where(m => m.FromUser != "Admin" && m.IsRead == 0).ToList();
            return Ok(unreadMessages);
        }

        [HttpGet("contact-list")]
        public IActionResult GetContactList()
        {
            var contacts = _context.Messages.Where(m => m.ToUser == "Admin").GroupBy(m => m.UserId)
                .Select(g => new
                {
                    Id = g.Key,
                    Contact = _context.Users.FirstOrDefault(u => u.UserId == g.Key)!.Name,
                    LastMessage = g.OrderByDescending(m => m.Timestamp).FirstOrDefault()!.Message1,
                    LastMessageTimestamp = g.Max(m => m.Timestamp),
                    UnreadMessagesCount = g.Count(m => m.IsRead == 0),
                }).ToList();

            return Ok(contacts);
        }

        [HttpPut("mark-as-read")]
        public async Task<IActionResult> MarkAsRead([FromBody] MaskAsReadModel model)
        {
            var messages = _context.Messages.Where(m => m.UserId == model.Id).ToList();

            foreach (var msg in messages)
            {
                msg.IsRead = 1;
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("get-messages")]
        public IActionResult GetMessages([FromQuery] int id)
        {
            var messages = _context.Messages.Where(m => (m.UserId == id && m.ToUser == "Admin")
                                || (m.FromUser == "Admin" && m.UserId == id))
                            .OrderBy(m => m.Timestamp)
                            .ToList();
            return Ok(messages);
        }
    }
}