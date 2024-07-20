using back_end.Areas.Admin.Models;
using back_end.Data;
using back_end.Services;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Areas.Admin.Controllers
{
    [Area("admin")]
    [ApiController]
    [Route("admin/[controller]")]
    public class OrderController : Controller
    {
        private readonly FoodOrderContext _context;
        private readonly IEmailSender _emailSender;

        public OrderController(FoodOrderContext context, IEmailSender emailSender)
        {
            _context = context;
            _emailSender = emailSender;
        }

        [HttpGet(Name = "GetAllOrder")]
        public ActionResult<List<Order>> Get()
        {
            var orders = _context.Orders.ToList();
            return Ok(orders);
        }

        [HttpGet("get-order-by-status/{id}", Name = "GetOrderByStatusId")]
        public ActionResult<List<Order>> Get(int id)
        {
            var orders = _context.Orders.Where(o => o.Status == id).ToList();

            var result = orders.Select(o => new OrderModel
            {
                OrderId = o.OrderId,
                UserId = o.UserId,
                Total = o.Total,
                OrderDate = o.OrderDate,
                DeliveryDate = o.DeliveryDate,
                Status = o.Status,
                Payment = o.Payment,
            }).ToList();

            return Ok(result);
        }

        [HttpGet("get-detail-by-order/{id}", Name = "GetDetailByOrderId")]
        public ActionResult<List<OrderDetailModel>> GetOrderDetail(int id)
        {
            var details = _context.OrderDetails
                .Where(d => d.OrderId == id)
                .Join(
                    _context.Products,
                    orderDetail => orderDetail.ProductId,
                    product => product.ProductId, 
                    (orderDetail, product) => new OrderDetailModel
                    {
                        OrderDetailId = orderDetail.OrderDetailId,
                        OrderId = orderDetail.OrderId,
                        ProductName = product.ProductName,
                        Price = orderDetail.Price,
                        Quantity = orderDetail.Quantity,
                        ImageUrl = product.ImageUrl,
                    }
                ).ToList();

            return Ok(details);
        }

        [HttpPut("change-status/{id}", Name = "ChangeOrderStatus")]
        public async Task<IActionResult> ChangeOrderSatus(int id)
        {
            var order = _context.Orders.Find(id);

            if (order == null)
            {
                return NotFound();
            }

            if (order.Payment == "COD")
            {
                if (order.Status == 0)
                {
                    order.Status = 2;
                }
                else if (order.Status == 2)
                {
                    order.Status = 3;
                    order.DeliveryDate = DateTime.Now;
                }
                else if (order.Status == 3)
                {
                    order.Status = 1;
                }
            }
            else
            {
                if(order.Status == 0)
                {
                    order.Status = 1;
                }
                else if (order.Status == 1)
                {
                    order.Status = 2;
                }
                else if (order.Status == 2)
                {
                    order.Status = 3;
                    order.DeliveryDate = DateTime.Now;
                }
            }

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            var customer = _context.Users.SingleOrDefault(u => u.UserId == order.UserId);
            if (customer == null)
            {
                return NotFound();
            }

            var statusDescription = _context.Statuses.SingleOrDefault(s => s.StatusId == order.Status)?.Description;

            var receiver = customer.Email;
            var subject = $"Order Status Update: {order.OrderId}";
            var message = $"Hello {customer.Name},<br>" +
                          $"We wanted to inform you that the status of your order (Order ID: {order.OrderId}) has been updated.<br>" +
                          $"Current Status: <strong>{statusDescription}</strong><br>";

            if (order.Status == 3)
            {
                message += $"Your order was delivered on {order.DeliveryDate:dd/MM/yyyy}.<br>";
            }

            message += $"<br>Thank you for shopping with us!<br>Best regards,<br>Fly Pizza";

            await _emailSender.SendEmailAsync(receiver!, subject, message);


            return NoContent();
        }
    }
}
