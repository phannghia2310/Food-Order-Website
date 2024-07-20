using System;
using System.Collections.Generic;

namespace back_end.Data;

public partial class Message
{
    public int MessageId { get; set; }

    public string FromUser { get; set; } = null!;

    public string ToUser { get; set; } = null!;

    public string Message1 { get; set; } = null!;

    public DateTime Timestamp { get; set; }

    public int? UserId { get; set; }

    public int? IsRead { get; set; }

    public virtual User? User { get; set; }
}
