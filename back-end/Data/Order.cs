using System;
using System.Collections.Generic;

namespace back_end.Data;

public partial class Order
{
    public int OrderId { get; set; }

    public int? UserId { get; set; }

    public int? Fee { get; set; }

    public int? Total { get; set; }

    public DateTime? OrderDate { get; set; }

    public DateTime? DeliveryDate { get; set; }

    public string? CustomerName { get; set; }

    public string? Address { get; set; }

    public string? Phone { get; set; }

    public int? Status { get; set; }

    public string? Payment { get; set; }

    public virtual OrderDetail? OrderDetail { get; set; }

    public virtual User? User { get; set; }
}
