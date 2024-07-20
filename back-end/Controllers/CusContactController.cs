using back_end.Data;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [ApiController]
    [Route("customer/[controller]")]
    public class CusContactController : Controller
    {
        private readonly FoodOrderContext _context;

        public CusContactController(FoodOrderContext context)
        {
            _context = context;
        }

        [HttpPost("send-inquiry")]
        public ActionResult<Contact> SendInquiry([FromBody] Models.CusContactModel model)
        {
            var contact = new Contact
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email,
                Phone = model.Phone,
                Message = model.Message,
                PostingDate = DateTime.Now,
            };

            _context.Contacts.Add(contact);
            _context.SaveChanges();

            return Ok(contact);
        }
    }
}
