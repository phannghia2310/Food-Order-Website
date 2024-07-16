namespace back_end.Models
{
    public class CustomerModel
    {
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
    }
}
