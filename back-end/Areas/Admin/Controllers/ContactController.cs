using back_end.Areas.Admin.Models;
using back_end.Data;
using back_end.Services;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Areas.Admin.Controllers
{
    [Area("admin")]
    [ApiController]
    [Route("admin/[controller]")]
    public class ContactController : Controller
    {
        private readonly FoodOrderContext _context;
        private readonly IEmailSender _emailSender;

        public ContactController(FoodOrderContext context, IEmailSender emailSender)
        {
            _context = context;
            _emailSender = emailSender;
        }

        [HttpGet(Name = "GetAllContact")]
        public ActionResult<List<Contact>> GetAllContact() 
        {
            var contacts = _context.Contacts.ToList();
            return Ok(contacts);
        }

        [HttpGet("{id}", Name = "GetContactById")]
        public ActionResult<Contact> GetContactById(int id)
        {
            var contact = _context.Contacts.Find(id);

            if(contact == null)
            {
                return NotFound();
            }

            return Ok(contact);
        }

        [HttpPut("{id}", Name = "AnswerContact")]
        public IActionResult AnswerContact(int id, [FromForm] ContactModel contact)
        {
            var existingContact = _context.Contacts.Find(id);
            if(existingContact == null)
            {
                return NotFound();
            }

            existingContact.Answer = contact.Answer;
            existingContact.AdminId = contact.AdminId;

            _context.Contacts.Update(existingContact);
            _context.SaveChanges();

            var receiver = contact.Email;
            var subject = contact.Subject;
            var message = $"Hello {contact.CustomerName},\n\n" +
                $"Your question: {contact.Question}.\n" +
                $"The answer: {contact.Answer}.\n\n" +
                $"Thank you for your attention. Your contribution is part of our development.\n\n" +
                $"Best regards.";

            _emailSender.SendEmailAsync(receiver!, subject!, message);

            return Ok(existingContact);
        }

        [HttpDelete("{id}", Name = "DeleteContact")]
        public IActionResult DeleteContact(int id)
        {
            var contact = _context.Contacts.Find(id);
            if(contact == null)
            {
                return NotFound();
            }

            _context.Contacts.Remove(contact);
            _context.SaveChanges();

            return Ok();
        }
    }
}
