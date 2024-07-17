using back_end.Areas.Admin.Models;
using back_end.Data;
using back_end.Helpers;
using back_end.Models;
using back_end.Services;
using Microsoft.AspNetCore.Mvc;
using static back_end.Helpers.PaypalClient;

namespace back_end.Controllers
{
    [ApiController]
    [Route("customer/[controller]")]
    public class CartController : Controller
    {
        private readonly FoodOrderContext _context;
        private readonly PaypalClient _paypalClient;
        private readonly IVnPayService _vpnPayService;
        private readonly IEmailSender _emailSender;

        public CartController(FoodOrderContext context, PaypalClient paypalClient, IVnPayService vnPayService, IEmailSender emailSender)
        {
            _context = context;
            _paypalClient = paypalClient;
            _vpnPayService = vnPayService;
            _emailSender = emailSender;
        }

        [HttpGet("list/{id}")]
        public ActionResult<List<Order>> GetListOrder(int id)
        {
            var orders = _context.Orders.Where(o => o.UserId == id).ToList();
            return Ok(orders);
        }

        [HttpGet("details/{id}")]
        public ActionResult<List<OrderDetail>> GetOrderDetails(int id)
        {
            var details = _context.OrderDetails.Where(d => d.OrderId == id).ToList();
            return Ok(details);
        }

        #region COD Payment
        [HttpPost("cod")]
        public async Task<IActionResult> CodPayment([FromBody] Models.OrderModel model)
        {
            try
            {
                using var transaction = _context.Database.BeginTransaction();

                try
                {
                    var order = new Order
                    {
                        UserId = model.UserId,
                        Fee = model.Fee,
                        Total = model.Total,
                        OrderDate = DateTime.Now,
                        DeliveryDate = DateTime.Now.AddHours(3),
                        CustomerName = model.CustomerName,
                        CustomerEmail = model.CustomerEmail,
                        Address = model.Address,
                        Phone = model.Phone,
                        Status = 0,
                        Payment = "COD"
                    };

                    _context.Orders.Add(order);
                    await _context.SaveChangesAsync();

                    foreach (var item in model.Details!)
                    {
                        var orderDetail = new OrderDetail
                        {
                            OrderId = order.OrderId, // Assign the OrderId of the parent order
                            ProductId = item.ProductId,
                            Price = item.Price,
                            Quantity = item.Quantity
                        };

                        _context.OrderDetails.Add(orderDetail);
                    }

                    await _context.SaveChangesAsync();

                    transaction.Commit();

                    return Ok();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return StatusCode(500, new { message = ex.InnerException?.Message ?? ex.Message });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }
        #endregion

        #region PayPal Payment
        #endregion
    }
}
