using back_end.Areas.Admin.Models;
using back_end.Data;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using static back_end.Areas.Admin.Models.ChartModel;

namespace back_end.Areas.Admin.Controllers
{
    [Area("admin")]
    [ApiController]
    [Route("admin/[controller]")]
    public class HomeController : Controller
    {
        private readonly FoodOrderContext _context;

        public HomeController(FoodOrderContext context)
        {
            _context = context;
        }

        private string GetTodaysMoney()
        {
            var today = DateTime.Today;
            var totalMoney = _context.Orders
                .Where(o => o.OrderDate!.Value.Date == today)
                .Sum(o => o.Total);
            return $"${totalMoney:N0}";
        }

        private (string color, string value, string label) GetTodaysMoneyChange()
        {
            var today = DateTime.Today;
            var yesterday = today.AddDays(-1);
            var todayMoney = _context.Orders
                .Where(o => o.OrderDate!.Value.Date == today)
                .Sum(o => o.Total);
            var yesterdayMoney = _context.Orders
                .Where(o => o.OrderDate!.Value.Date == yesterday)
                .Sum(o => o.Total);

            var percentageChange = yesterdayMoney == 0 ? 0 : ((todayMoney - yesterdayMoney) / (double?)yesterdayMoney) * 100;
            var color = percentageChange >= 0 ? "text-green-500" : "text-red-500";
            var value = $"{percentageChange:+#;-#;0}%";
            var label = "than yesterday";

            return (color, value, label);
        }

        private string GetOrders()
        {
            var today = DateTime.Today;
            var startOfWeek = today.AddDays(-(int)today.DayOfWeek);
            var endOfWeek = startOfWeek.AddDays(6);

            var orderCount = _context.Orders
                .Count(o => o.DeliveryDate!.Value.Date >= startOfWeek && o.DeliveryDate!.Value.Date <= endOfWeek);

            return orderCount.ToString("N0");
        }

        private (string color, string value, string label) GetOrdersChange()
        {
            var today = DateTime.Today;
            var startOfThisWeek = today.AddDays(-(int)today.DayOfWeek);
            var endOfThisWeek = startOfThisWeek.AddDays(6);
            var startOfLastWeek = startOfThisWeek.AddDays(-7);
            var endOfLastWeek = endOfThisWeek.AddDays(-7);

            var thisWeekOrders = _context.Orders
                .Count(o => o.DeliveryDate!.Value.Date >= startOfThisWeek && o.DeliveryDate!.Value.Date <= endOfThisWeek);

            var lastWeekOrders = _context.Orders
                .Count(o => o.DeliveryDate!.Value.Date >= startOfLastWeek && o.DeliveryDate!.Value.Date <= endOfLastWeek);

            var percentageChange = lastWeekOrders == 0 ? 0 : ((thisWeekOrders - lastWeekOrders) / (double)lastWeekOrders) * 100;
            var color = percentageChange >= 0 ? "text-green-500" : "text-red-500";
            var value = $"{percentageChange:+#;-#;0}%";
            var label = "than last week";

            return (color, value, label);
        }

        private string GetNewClients()
        {
            var today = DateTime.Today;
            var newClientsCount = _context.Users
                .Count(c => c.CreatedDate!.Value.Date == today);
            return newClientsCount.ToString("N0");
        }

        private (string color, string value, string label) GetNewClientsChange()
        {
            var today = DateTime.Today;
            var yesterday = today.AddDays(-1);
            var todayClients = _context.Users
                .Count(c => c.CreatedDate!.Value.Date == today);
            var yesterdayClients = _context.Users
                .Count(c => c.CreatedDate!.Value.Date == yesterday);

            var percentageChange = yesterdayClients == 0 ? 0 : ((todayClients - yesterdayClients) / (double)yesterdayClients) * 100;
            var color = percentageChange >= 0 ? "text-green-500" : "text-red-500";
            var value = $"{percentageChange:+#;-#;0}%";
            var label = "than yesterday";

            return (color, value, label);
        }

        private string GetSales()
        {
            var today = DateTime.Today;
            var firstDayOfMonth = new DateTime(today.Year, today.Month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

            var salesAmount = _context.Orders
                .Where(s => s.DeliveryDate.HasValue && s.DeliveryDate.Value.Date >= firstDayOfMonth && s.DeliveryDate.Value.Date <= lastDayOfMonth)
                .Sum(s => s.Total);

            return $"${salesAmount:N0}";

        }

        private (string color, string value, string label) GetSalesChange()
        {
            var today = DateTime.Today;
            var firstDayOfCurrentMonth = new DateTime(today.Year, today.Month, 1);
            var lastDayOfPreviousMonth = firstDayOfCurrentMonth.AddDays(-1);
            var firstDayOfPreviousMonth = new DateTime(lastDayOfPreviousMonth.Year, lastDayOfPreviousMonth.Month, 1);

            var currentMonthSales = _context.Orders
                .Where(o => o.DeliveryDate!.Value.Date >= firstDayOfCurrentMonth && o.DeliveryDate!.Value.Date <= today)
                .Sum(o => o.Total);

            var previousMonthSales = _context.Orders
                .Where(o => o.DeliveryDate!.Value.Date >= firstDayOfPreviousMonth && o.DeliveryDate!.Value.Date <= lastDayOfPreviousMonth)
                .Sum(o => o.Total);

            var percentageChange = previousMonthSales == 0 ? 0 : ((currentMonthSales - previousMonthSales) / (double?)previousMonthSales) * 100;
            var color = percentageChange >= 0 ? "text-green-500" : "text-red-500";
            var value = $"{percentageChange:+#;-#;0}%";
            var label = "than last month";

            return (color, value, label);
        }

        [HttpGet("statistics")]
        public IActionResult GetStatistics()
        {
            var statistics = new[]
            {
                new StatisticsModel
                {
                    Color = "gray",
                    Icon = "BanknotesIcon",
                    Title = "Today's Money",
                    Value = GetTodaysMoney(),
                    Footer = new StatisticsFooter
                    {
                        Color = GetTodaysMoneyChange().color,
                        Value = GetTodaysMoneyChange().value,
                        Label = GetTodaysMoneyChange().label
                    }
                },
                new StatisticsModel
                {
                    Color = "gray",
                    Icon = "ShoppingBagIcon",
                    Title = "This Week's Order",
                    Value = GetOrders(),
                    Footer = new StatisticsFooter
                    {
                        Color = GetOrdersChange().color,
                        Value = GetOrdersChange().value,
                        Label = GetOrdersChange().label
                    }
                },
                new StatisticsModel
                {
                    Color = "gray",
                    Icon = "UserPlusIcon",
                    Title = "New Clients",
                    Value = GetNewClients(),
                    Footer = new StatisticsFooter
                    {
                        Color = GetNewClientsChange().color,
                        Value = GetNewClientsChange().value,
                        Label = GetNewClientsChange().label
                    }
                },
                new StatisticsModel
                {
                    Color = "gray",
                    Icon = "ChartBarIcon",
                    Title = "Sales",
                    Value = GetSales(),
                    Footer = new StatisticsFooter
                    {
                        Color = GetSalesChange().color,
                        Value = GetSalesChange().value,
                        Label = GetSalesChange().label
                    }
                }
            };

            return Ok(statistics);
        }

        [HttpGet("weekly-orders")]
        public IActionResult GetWeeklyOrders()
        {
            DateTime today = DateTime.Today;

            int daysToSubtract = (today.DayOfWeek == DayOfWeek.Sunday) ? 6 : (int)today.DayOfWeek - 1;
            DateTime startOfWeek = today.AddDays(-daysToSubtract);

            var orders = _context.Orders
                .Where(o => o.DeliveryDate >= startOfWeek && o.Status == 3)
                .ToList();

            var groupedOrders = orders
                .GroupBy(o => o.DeliveryDate!.Value.DayOfWeek)
                .Select(g => new WeeklyOrdersData
                {
                    DayOfWeek = g.Key,
                    Orders = g.Count()
                })
                .ToList();

            var allDays = Enum.GetValues(typeof(DayOfWeek)).Cast<DayOfWeek>()
                .Select(d => new WeeklyOrdersData
                {
                    DayOfWeek = d,
                    Orders = groupedOrders.FirstOrDefault(o => o.DayOfWeek == d)?.Orders ?? 0
                })
                .OrderBy(d => (int)d.DayOfWeek) // Sắp xếp theo thứ tự ngày trong tuần
                .ToList();

            var result = allDays.Select(d => new
            {
                Day = d.DayOfWeek.ToString().Substring(0, 3), // Lấy 3 ký tự đầu của tên thứ
                d.Orders
            });

            return Ok(result);
        }

        public class WeeklyOrdersData
        {
            public DayOfWeek DayOfWeek { get; set; }
            public int Orders { get; set; }
        }


        [HttpGet("top-selling-items")]
        public IActionResult GetTopSellingItems()
        {
            var currentMonth = DateTime.Now.Month;
            var currentYear = DateTime.Now.Year;

            var data = _context.OrderDetails
                .Where(od => od.Order!.DeliveryDate!.Value.Month == currentMonth && od.Order!.DeliveryDate!.Value.Year == currentYear)
                .GroupBy(od => od.Product!.ProductName)
                .Select(g => new TopSellingItemsData
                {
                    ItemName = g.Key,
                    Sales = g.Count()
                })
                .OrderByDescending(t => t.Sales)
                .Take(5)
                .ToList();

            return Ok(data);
        }

        [HttpGet("monthly-revenue")]
        public IActionResult GetMonthlyRevenue()
        {
            var data = _context.Orders
                .Where(o => o.DeliveryDate!.Value.Year == DateTime.Now.Year)
                .GroupBy(o => o.DeliveryDate!.Value.Month)
                .Select(g => new MonthlyRevenueData
                {
                    Month = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(g.Key),
                    Revenue = g.Sum(o => (decimal)o.Total!),
                })
                .ToList();

            return Ok(data);
        }
    }
}
