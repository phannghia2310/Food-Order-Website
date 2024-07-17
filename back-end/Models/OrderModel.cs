using back_end.Data;

namespace back_end.Models
{
    public class OrderModel
    {
        public int? UserId { get; set; }

        public int? Fee { get; set; }

        public int? Total { get; set; }

        public DateTime? OrderDate { get; set; }

        public DateTime? DeliveryDate { get; set; }

        public string? CustomerName { get; set; }

        public string? CustomerEmail { get; set; }

        public string? Address { get; set; }

        public string? Phone { get; set; }

        public int? Status { get; set; }

        public string? Payment { get; set; }

        public List<OrderDetail>? Details { get; set; }
    }
}
