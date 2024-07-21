using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace back_end.Hubs
{
    public class ChatHub : Hub
    {
        private static readonly ConcurrentDictionary<string, HashSet<string>> GroupConnections = new();
        private static readonly ConcurrentDictionary<string, string> ConnectionUserMapping = new();

        public async Task SendMessage(string groupId, string user, string message)
        {
            await Clients.Group(groupId).SendAsync("ReceiveMessage", user, message);
            await Clients.All.SendAsync("UpdateContact", user, message);
        }

        public async Task JoinGroup(string groupId, string user)
        {
            if(!GroupConnections.ContainsKey(groupId))
            {
                GroupConnections[groupId] = new HashSet<string>();
            }
            GroupConnections[groupId].Add(Context.ConnectionId);
            ConnectionUserMapping[Context.ConnectionId] = user;

            await Groups.AddToGroupAsync(Context.ConnectionId, groupId);
        }

        public async Task LeaveGroup(string groupId)
        {
            if (GroupConnections.TryGetValue(groupId, out var connections))
            {
                foreach(var connection in connections)
                {
                    connections.Remove(connection);
                }
                if (connections.Count == 0)
                {
                    GroupConnections.TryRemove(groupId, out _);
                }
            }

            ConnectionUserMapping.TryRemove(Context.ConnectionId, out _);

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupId);
        }

        public override async Task OnConnectedAsync()
        {
            var groupId = Context.GetHttpContext()!.Request.Query["access_token"].ToString();
            await Groups.AddToGroupAsync(Context.ConnectionId, groupId!);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var groupId = Context.GetHttpContext()!.Request.Query["access_token"].ToString();
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupId!);
            await base.OnDisconnectedAsync(exception);
        }

        public bool CheckAdminInGroup(string groupId, string adminUser)
        {
            if (GroupConnections.TryGetValue(groupId, out var connections))
            {
                foreach (var connectionId in connections)
                {
                    if (ConnectionUserMapping.TryGetValue(connectionId, out var user))
                    {
                        if (user == adminUser)
                        {
                            return true;
                        }
                    }
                }
            }

            return false;
        }
    }
}
