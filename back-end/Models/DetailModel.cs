using back_end.Data;

namespace back_end.Models
{
    public class DetailModel
    {
        public int? OrderId { get; set; }

        public int? ProductId { get; set; }

        public int? Price { get; set; }

        public int Quantity { get; set; }

        public virtual Order? Order { get; set; }
    }
}
