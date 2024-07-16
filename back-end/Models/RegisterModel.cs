using System.ComponentModel.DataAnnotations;

namespace back_end.Models
{
    public class RegisterModel
    {
        [Required]
        public string? Name { get; set; }

        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        [MinLength(8)]
        public string? Password { get; set; }
    }
}
