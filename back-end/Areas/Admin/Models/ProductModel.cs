using back_end.Data;

namespace back_end.Areas.Admin.Models
{
    public class ProductModel
    {
        public int ProductId { get; set; }

        public int? CategoryId { get; set; }

        public string? ProductName { get; set; }

        public string? Description { get; set; }

        public int? Price { get; set; }

        public int? Quantity { get; set; }

        public string? ImageUrl { get; set; }

        public bool? IsActive { get; set; }

        public DateTime? CreateDate { get; set; }
    }
}
