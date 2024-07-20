using System;
using System.Collections.Generic;

namespace back_end.Data;

public partial class Contact
{
    public int ContactId { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? Email { get; set; }

    public string? Phone { get; set; }

    public string? Message { get; set; }

    public string? Reply { get; set; }

    public DateTime? PostingDate { get; set; }

    public int? AdminId { get; set; }

    public virtual User? Admin { get; set; }
}
