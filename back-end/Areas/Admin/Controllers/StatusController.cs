using back_end.Areas.Admin.Models;
using back_end.Data;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Areas.Admin.Controllers
{
    [Area("admin")]
    [ApiController]
    [Route("admin/[controller]")]
    public class StatusController : Controller
    {
        private readonly FoodOrderContext _context;

        public StatusController(FoodOrderContext context)
        {
            _context = context;
        }

        [HttpGet(Name = "GetAllStatus")]
        public ActionResult<List<Status>> Get()
        {
            var statuses = _context.Statuses.ToList();
            return Ok(statuses);
        }

        [HttpGet("{id}", Name = "GetStatusById")]
        public ActionResult<Status> Get(int id)
        {
            var status = _context.Statuses.Find(id);
            if(status == null)
            {
                return NotFound();
            }

            return Ok(status);
        }

        [HttpPost(Name = "CreateStatus")]
        public ActionResult<Status> Post([FromBody] StatusModel status)
        {
            var existingStatus = _context.Statuses.FirstOrDefault(s => s.Description == status.Description);
            if(existingStatus != null)
            {
                return Conflict("A description of status is already in use");
            }

            var newStatus = new Status
            {
                Description = status.Description,
            };

            _context.Statuses.Add(newStatus);
            _context.SaveChanges();

            return Ok(newStatus);
        }

        [HttpPut("{id}", Name = "UpdateStatus")]
        public IActionResult Put(int id, [FromForm] StatusModel status)
        {
            var existingStatus = _context.Statuses.Find(id);
            if(existingStatus == null)
            {
                return NotFound();
            }

            var existingStatusDes = _context.Statuses.FirstOrDefault(s => s.Description == status.Description && s.StatusId != status.StatusId);
            if(existingStatusDes != null)
            {
                return Conflict("A description of status is already in use");
            }

            existingStatus.Description = status.Description;

            _context.Statuses.Update(existingStatus);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete("{id}" ,Name = "DeleteStatus")]
        public IActionResult Delete(int id)
        {
            var status = _context.Statuses.Find(id);
            if(status == null)
            {
                return NotFound();
            }

            _context.Statuses.Remove(status);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
