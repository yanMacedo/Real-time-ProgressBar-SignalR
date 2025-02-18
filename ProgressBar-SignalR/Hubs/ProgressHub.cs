using Microsoft.AspNetCore.SignalR;

namespace ProgressBar_SignalR.Hubs
{
    public class ProgressHub : Hub
    {
        public async Task SendProgress(int progress)
        {
            await Clients.All.SendAsync("ReceiveProgress", progress);
        }
    }
}
