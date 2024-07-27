namespace back_end.Services
{
    public interface IDialogService
    {
        Task<string> ProcessDialogActionAsync(Stream requestBody, CancellationToken cancellationToken);
    }
}
