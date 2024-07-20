using back_end.Data;

namespace back_end.Areas.Admin.Models
{
    public class ContactModel
    {
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
}
