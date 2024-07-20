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
        public IActionResult AnswerContact(int id, [FromBody] ContactModel contact)
        {
            var existingContact = _context.Contacts.Where(c => c.ContactId == id).FirstOrDefault();
            if(existingContact == null)
            {
                return NotFound();
            }

            existingContact.Reply = contact.Reply;
            existingContact.AdminId = contact.AdminId;
            existingContact.Admin = contact.Admin;

            _context.Contacts.Update(existingContact);
            _context.SaveChanges();

            var admin = _context.Users.Where(a => a.UserId == contact.AdminId).FirstOrDefault();
            if(admin == null)
            {
                return NotFound();
            }

            var receiver = contact.Email;
            var subject = "Reply customer";
            var message = $"Hello {contact.FirstName + " " + contact.LastName},<br><br>" +
                $"Your question: {contact.Message}.<br>" +
                $"The answer: {contact.Reply}.<br>" +
                $"Thank you for your attention. Your contribution is part of our development.<br><br>" +
                $"Best regards.";

            _emailSender.SendEmailAsync(receiver!, subject!, message);

            return NoContent();
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
