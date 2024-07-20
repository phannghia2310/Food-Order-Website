using back_end.Areas.Admin.Models;
using back_end.Data;
using back_end.Helpers;
using back_end.Models;
using back_end.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
using static back_end.Helpers.PaypalClient;

namespace back_end.Controllers
{
    [ApiController]
    [Route("customer/[controller]")]
    public class CartController : Controller
    {
        private readonly FoodOrderContext _context;
        private readonly PaypalClient _paypalClient;
        private readonly IEmailSender _emailSender;

        public CartController(FoodOrderContext context, PaypalClient paypalClient, IEmailSender emailSender)
        {
            _context = context;
            _paypalClient = paypalClient;
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
            var order = _context.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(p => p.Product)
                .FirstOrDefault(o => o.OrderId == id);

            if(order == null)
            {
                return NotFound();
            }

            var cartProducts = new List<OrderDetail>();

            foreach (var item in order.OrderDetails)
            {
                var cartProduct = new OrderDetail
                {
                    OrderId = order.OrderId,
                    ProductId = item.Product!.ProductId,
                    Price = item.Product.Price,
                    Product = new Product
                    {
                        ProductId = item.Product!.ProductId,
                        ProductName = item.Product.ProductName,
                        ImageUrl = item.Product.ImageUrl,
                        Description = item.Product.Description,
                        CategoryId = item.Product.CategoryId,
                        Price = item.Product.Price,
                        Quantity = item.Quantity,
                    },
                    Quantity = item.Quantity
                };

                cartProducts.Add(cartProduct);
            }

            var result = new Order
            {
                OrderId = order.OrderId,
                OrderDate = order.OrderDate,
                DeliveryDate = order.DeliveryDate,
                Fee = order.Fee,
                Total = order.Total,
                CustomerName = order.CustomerName,
                CustomerEmail = order.CustomerEmail,
                Address = order.Address,
                Phone = order.Phone,
                Payment = order.Payment,
                Status = order.Status,
                OrderDetails = cartProducts,
            };

            return Ok(result);
        }

        [HttpPut("change-status/{id}")]
        public IActionResult ChangeStatus(int id)
        {
            var order = _context.Orders.Find(id);

            if(order == null)
            {
                return NotFound();
            }

            if(order.Payment == "COD")
            {
                if(order.Status == 0)
                {
                    order.Status = 5;
                }

                if(order.Status == 3)
                {
                    order.Status = 4;
                }
            }
            else
            {
                if(order.Status == 1)
                {
                    order.Status = 5;
                }

                if(order.Status == 3)
                {
                    order.Status = 4;
                }
            }

            _context.Orders.Update(order);
            _context.SaveChanges();
            return Ok(order);
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

                    var htmlTable = new StringBuilder();
                    htmlTable.Append("<table style='border-collapse: collapse; width: 100%;'>");
                    htmlTable.Append("<tr>");
                    htmlTable.Append("<th style='border: 1px solid black; padding: 10px; background-color: #f2f2f2; text-align: left;'>Product Name</th>");
                    htmlTable.Append("<th style='border: 1px solid black; padding: 10px; background-color: #f2f2f2; text-align: left;'>Image</th>");
                    htmlTable.Append("<th style='border: 1px solid black; padding: 10px; background-color: #f2f2f2; text-align: left;'>Price</th>");
                    htmlTable.Append("<th style='border: 1px solid black; padding: 10px; background-color: #f2f2f2; text-align: left;'>Quantity</th>");
                    htmlTable.Append("<th style='border: 1px solid black; padding: 10px; background-color: #f2f2f2; text-align: left;'>Total</th>");
                    htmlTable.Append("</tr>");

                    foreach (var ct in model.Details)
                    {
                        var product = _context.Products.SingleOrDefault(p => p.ProductId == ct.ProductId);
                        if (product != null)
                        {
                            htmlTable.Append("<tr>");
                            htmlTable.Append($"<td style='border: 1px solid black; padding: 10px;'>{product.ProductName}</td>");
                            htmlTable.Append($"<td style='border: 1px solid black; padding: 10px;'><img src='{product.ImageUrl}' alt='Product Image' style='width:100px; height:auto;' /></td>");
                            htmlTable.Append($"<td style='border: 1px solid black; padding: 10px;'>{ct.Price:C}</td>");
                            htmlTable.Append($"<td style='border: 1px solid black; padding: 10px;'>{ct.Quantity}</td>");
                            htmlTable.Append($"<td style='border: 1px solid black; padding: 10px;'>{(ct.Price * ct.Quantity):C}</td>");
                            htmlTable.Append("</tr>");
                        }
                    }

                    htmlTable.Append("</table>");

                    var receiver = _context.Users.SingleOrDefault(kh => kh.UserId == order.UserId)?.Email;
                    var subject = $"Order information: {order.OrderId}";
                    var user = _context.Users.SingleOrDefault(kh => kh.UserId == order.UserId);
                    var status = _context.Statuses.SingleOrDefault(s => s.StatusId == order.Status)?.Description;
                    var message = $"Hello {user?.Name},<br>Below are your order details.<br><br>" +
                                  $"Order ID: {order.OrderId}<br>" +
                                  $"Order date: {order.OrderDate:dd/MM/yyyy}<br>" +
                                  $"Delivery date (expected): {order.DeliveryDate:dd/MM/yyyy}<br><br>" +
                                  $"{htmlTable}<br><br>" +
                                  $"Total: {order.Total:C}<br><br>" +
                                  $"Payment method: {order.Payment}<br><br>" +
                                  $"Status: {status}";

                    await _emailSender.SendEmailAsync(receiver!, subject, message);


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
        [HttpPost("create-paypal-order")]
        public async Task<IActionResult> CreatePaypalOrder([FromBody] Models.OrderModel model)
        {
            try
            {
                var orderResponse = await _paypalClient.CreateOrder(
                    value: model.Total.ToString(),
                    currency: "USD",
                    reference: Guid.NewGuid().ToString()
                );

                var approvalUrl = orderResponse.links.FirstOrDefault(link => link.rel.Equals("approve"))?.href;

                return Ok(new { approvalUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("capture-paypal-order")]
        public async Task<IActionResult> CapturePaypaOrder([FromQuery] string orderId, [FromBody] Models.OrderModel model)
        {
            try
            {
                var captureResponse = await _paypalClient.CaptureOrder(orderId);

                if(captureResponse.status.ToLower() != "completed")
                {
                    return BadRequest("Payment not completed");
                }

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
                    Status = 1,
                    Payment = "PAYPAL",
                 };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                foreach (var item in model.Details!)
                {
                    var orderDetail = new OrderDetail
                    {
                        OrderId = order.OrderId,
                        ProductId = item.ProductId,
                        Price = item.Price,
                        Quantity = item.Quantity,
                    };

                    _context.OrderDetails.Add(orderDetail);
                }

                await _context.SaveChangesAsync();

                var htmlTable = new StringBuilder();
                htmlTable.Append("<table style='border-collapse: collapse; width: 100%;'>");
                htmlTable.Append("<tr>");
                htmlTable.Append("<th style='border: 1px solid black; padding: 10px; background-color: #f2f2f2; text-align: left;'>Product Name</th>");
                htmlTable.Append("<th style='border: 1px solid black; padding: 10px; background-color: #f2f2f2; text-align: left;'>Image</th>");
                htmlTable.Append("<th style='border: 1px solid black; padding: 10px; background-color: #f2f2f2; text-align: left;'>Price</th>");
                htmlTable.Append("<th style='border: 1px solid black; padding: 10px; background-color: #f2f2f2; text-align: left;'>Quantity</th>");
                htmlTable.Append("<th style='border: 1px solid black; padding: 10px; background-color: #f2f2f2; text-align: left;'>Total</th>");
                htmlTable.Append("</tr>");

                foreach (var ct in model.Details)
                {
                    var product = _context.Products.SingleOrDefault(p => p.ProductId == ct.ProductId);
                    if (product != null)
                    {
                        htmlTable.Append("<tr>");
                        htmlTable.Append($"<td style='border: 1px solid black; padding: 10px;'>{product.ProductName}</td>");
                        htmlTable.Append($"<td style='border: 1px solid black; padding: 10px;'><img src='{product.ImageUrl}' alt='Product Image' style='width:100px; height:auto;' /></td>");
                        htmlTable.Append($"<td style='border: 1px solid black; padding: 10px;'>{ct.Price:C}</td>");
                        htmlTable.Append($"<td style='border: 1px solid black; padding: 10px;'>{ct.Quantity}</td>");
                        htmlTable.Append($"<td style='border: 1px solid black; padding: 10px;'>{(ct.Price * ct.Quantity):C}</td>");
                        htmlTable.Append("</tr>");
                    }
                }

                htmlTable.Append("</table>");

                var receiver = _context.Users.SingleOrDefault(kh => kh.UserId == order.UserId)?.Email;
                var subject = $"Order information: {order.OrderId}";
                var user = _context.Users.SingleOrDefault(kh => kh.UserId == order.UserId);
                var status = _context.Statuses.SingleOrDefault(s => s.StatusId == order.Status)?.Description;
                var message = $"Hello {user?.Name},<br>Below are your order details.<br><br>" +
                              $"Order ID: {order.OrderId}<br>" +
                              $"Order date: {order.OrderDate:dd/MM/yyyy}<br>" +
                              $"Delivery date (expected): {order.DeliveryDate:dd/MM/yyyy}<br><br>" +
                              $"{htmlTable}<br><br>" +
                              $"Total: {order.Total:C}<br><br>" +
                              $"Payment method: {order.Payment}<br><br>" +
                              $"Status: {status}";

                await _emailSender.SendEmailAsync(receiver!, subject, message);


                return Ok();
            }
            catch(Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
        #endregion
    }
}
