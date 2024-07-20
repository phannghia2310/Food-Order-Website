namespace back_end.Models
{
    public class CusChatModel
    { 
        public string? FromUser { get; set; }

        public string? ToUser { get; set; }

        public string? Message1 { get; set; }

        public DateTime Timestamp { get; set; }

        public int? UserId { get; set; }

        public int? IsRead { get; set; }
    }
}
