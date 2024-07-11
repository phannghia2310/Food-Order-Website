namespace back_end.Areas.Admin.Models
{
    public class StatisticsModel
    {
        public string? Color { get; set; }
        public string? Icon { get; set; }
        public string? Title { get; set; }
        public string? Value { get; set; }
        public StatisticsFooter? Footer { get; set; }
    }

    public class StatisticsFooter
    {
        public string? Color { get; set; }
        public string? Value { get; set; }
        public string? Label { get; set; }
    }
}
