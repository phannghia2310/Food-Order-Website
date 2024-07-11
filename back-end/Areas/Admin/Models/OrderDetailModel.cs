namespace back_end.Areas.Admin.Models
{
    public class OrderDetailModel
    {
        public int OrderDetailId { get; set; }

        public int? OrderId { get; set; }

        public string? ProductName { get; set; }

        public int? Price { get; set; }

        public int Quantity { get; set; }

        public string? ImageUrl { get; set; }
    }
}
