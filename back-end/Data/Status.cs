using System;
using System.Collections.Generic;

namespace back_end.Data;

public partial class Status
{
    public int StatusId { get; set; }

    public string Description { get; set; } = null!;
}
