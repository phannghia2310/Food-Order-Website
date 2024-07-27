namespace back_end.Models
{
    public class DialogflowRequestModel
    {
        public QueryResult? QueryResult { get; set; }
    }

    public class QueryResult
    {
        public Intent? Intent { get; set; }
        public string? Parameters { get; set; }
    }

    public class Intent
    {
        public string? DisplayName { get; set; }
    }
}
