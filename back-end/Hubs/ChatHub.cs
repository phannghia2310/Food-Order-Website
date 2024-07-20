using Microsoft.AspNetCore.SignalR;

namespace back_end.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string userId, string user, string message)
        {
            await Clients.User(userId).SendAsync("ReceiveMessage", user, message);
        }

        public override Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var userId = httpContext!.Request.Query["access_token"].ToString();

            Groups.AddToGroupAsync(Context.ConnectionId, userId!);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var httpContext = Context.GetHttpContext();
            var userId = httpContext!.Request.Query["access_token"].ToString();

            Groups.RemoveFromGroupAsync(Context.ConnectionId, userId!);
            return base.OnDisconnectedAsync(exception);
        }
    }
}
