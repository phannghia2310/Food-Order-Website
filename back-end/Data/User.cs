using System;
using System.Collections.Generic;

namespace back_end.Data;

public partial class User
{
    public int UserId { get; set; }

    public string? Name { get; set; }

    public string? Username { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public string? Address { get; set; }

    public string? Password { get; set; }

    public string? ImageUrl { get; set; }

    public DateTime? CreatedDate { get; set; }

    public bool? IsAdmin { get; set; }

    public string? RandomKey { get; set; }

    public virtual ICollection<Contact> Contacts { get; set; } = new List<Contact>();

    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
