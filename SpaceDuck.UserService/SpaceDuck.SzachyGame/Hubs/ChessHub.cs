using Microsoft.AspNetCore.SignalR;
using SpaceDuck.Common.Models;
using System.Threading.Tasks;

namespace SpaceDuck.ChessGame.Hubs
{
    public interface IChessHub
    {
        Task SendMessage(string user, string message);
        Task AddToGameGroup(string gameId, string playerName);
        Task RemoveFromGameGroup(string gameId, string playerName);
        Task SendGameStatus(string gameId, GameStatus gameStatus);
        Task RecieveGameStatus(string gameId, GameStatus gameStatus);
    }

    public class ChessHub : Hub, IChessHub
    {
        private readonly IHubContext<ChessHub> _hubContext;

        public ChessHub(IHubContext<ChessHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task AddToGameGroup(string gameId, string playerName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, gameId);

            await SendToGameGroup(gameId, "Send", $"{playerName} has joined the game.");
        }

        public async Task RemoveFromGameGroup(string gameId, string playerName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameId);

            await SendToGameGroup(gameId, "Send", $"{playerName} has left the game.");
        }

        public async Task SendGameStatus(string gameId, GameStatus gameStatus)
        {
            await _hubContext.Clients.Group(gameId).SendAsync("GameStatus", gameStatus);
            await _hubContext.Clients.Group(gameId).SendAsync("Send", "Updat status by contexthub.");
        }

        public async Task RecieveGameStatus(string gameId, GameStatus gameStatus)
        {
            await SendToGameGroup(gameId, "GameStatus", gameStatus);
        }

        private async Task SendToGameGroup(string gameId, string method, object arg)
        {
            await Clients.Group(gameId).SendAsync(method, arg);
        }
    }
}
