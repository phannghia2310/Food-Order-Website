using System;
using System.Collections.Generic;

namespace back_end.Data;

public partial class Product
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

    public virtual Category? Category { get; set; }

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
