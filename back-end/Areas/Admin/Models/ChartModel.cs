namespace back_end.Areas.Admin.Models
{
    public class ChartModel
    {
        public class WeeklyOrdersData
        {
            public string? Day { get; set; }
            public int Orders { get; set; }
        }

        public class TopSellingItemsData
        {
            public string? ItemName { get; set; }
            public int Sales { get; set; }
        }

        public class MonthlyRevenueData
        {
            public string? Month { get; set; }
            public decimal Revenue { get; set; }
        }
    }
}
