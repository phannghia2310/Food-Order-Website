using System.ComponentModel.DataAnnotations;

namespace back_end.Areas.Admin.Models
{
    public class UserModel
    {
        public int UserId { get; set; }
        public string? Name { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public bool IsAdmin { get; set; }
        public string? Image { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
