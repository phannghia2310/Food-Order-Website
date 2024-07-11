using back_end.Areas.Admin.Models;
using back_end.Data;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Areas.Admin.Controllers
{
    [Area("admin")]
    [ApiController]
    [Route("admin/[controller]")]
    public class OrderController : Controller
    {
        private readonly FoodOrderContext _context;

        public OrderController(FoodOrderContext context)
        {
            _context = context;
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
        public ActionResult<List<OrderDetail>> GetOrderDetail(int id)
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
        public IActionResult ChangeOrderSatus(int id)
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
            _context.SaveChanges();

            return Ok(order);
        }
    }
}
