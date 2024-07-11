using System;
using System.Collections.Generic;

namespace back_end.Data;

public partial class Category
{
    public int CategoryId { get; set; }

    public string? CategoryName { get; set; }

    public bool? IsActive { get; set; }

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
