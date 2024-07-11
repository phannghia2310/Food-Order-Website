namespace back_end.Areas.Admin.Models
{
    public class MessageModel
    {
        public int MessageId { get; set; }

        public string FromUser { get; set; } = null!;

        public string ToUser { get; set; } = null!;

        public string Message1 { get; set; } = null!;

        public DateTime Timestamp { get; set; }

        public int? IsRead { get; set; }
    }
}
