namespace back_end.Areas.Admin.Models
{
    public class OrderModel
    {
        public int OrderId { get; set; }

        public int? UserId { get; set; }

        public int? Total { get; set; }

        public DateTime? OrderDate { get; set; }

        public DateTime? DeliveryDate { get; set; }

        public int? Status { get; set; }

        public string? Payment { get; set; }

    }
}
