namespace back_end.Areas.Admin.Models
{
    public class ContactModel
    {
        public int ContactId { get; set; }

        public string? CustomerName { get; set; }

        public string? Email { get; set; }

        public string? Subject { get; set; }

        public string? Question { get; set; }

        public string? Answer { get; set; }

        public DateTime? PostingDate { get; set; }

        public int? AdminId { get; set; }
    }
}
