namespace back_end.Areas.Admin.Models
{
    public class CategoryModel
    {
        public int CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public bool? IsActive { get; set; }
    }
}
