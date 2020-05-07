using Microsoft.AspNetCore.SignalR;
using SpaceDuck.Common.Models;
using SpaceDuck.KalamburyGame.Server;
using SpaceDuck.KalamburyGame.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpaceDuck.KalamburyGame.Hubs
{
    public interface IKalamburyHub
    {
        Task SendMessage(string user, string message);
        Task AddToGameGroup(string gameId, string playerName);
        Task RemoveFromGameGroup(string gameId, string playerName);
        Task SendGameStatus(string gameId, GameStatus gameStatus);
        Task RecieveGameStatus(string gameId, GameStatus gameStatus);
        Task SendMesage(string gameId, string message);
        Task CheckGivenWord(string gameId, WordStatus wordStatus);
        Task SendPoints(string gameId, Dictionary<string, int> points);
    }

    public class KalamburyHub : Hub, IKalamburyHub
    {
        private readonly IHubContext<KalamburyHub> _hubContext;
        private IGameHelper _gameHelper;
        private IRoomService _roomService;

        public KalamburyHub(IHubContext<KalamburyHub> hubContext,
            IGameHelper gameHelper,
            IRoomService roomService)
        {
            _hubContext = hubContext;
            _gameHelper = gameHelper;
            _roomService = roomService;
        }

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task AddToGameGroup(string gameId, string playerName)
        {
            try
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, gameId);

                await SendToGameGroup(gameId, "Send", $"{playerName} has joined the game.");

                await _roomService.AddPlayerToRoom(Convert.ToInt32(gameId), playerName);
            }
            catch (Exception)
            { }

        }

        public async Task RemoveFromGameGroup(string gameId, string playerName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameId);

            await SendToGameGroup(gameId, "Send", $"{playerName} has left the game.");

            await _roomService.RemovePlayerFromRoom(Convert.ToInt32(gameId), playerName);

        }

        public async Task SendGameStatus(string gameId, GameStatus gameStatus)
        {
            await _hubContext.Clients.Group(gameId).SendAsync("GameStatus", gameStatus);
            await _hubContext.Clients.Group(gameId).SendAsync("Send", "Update status by contexthub.");
        }

        public async Task SendMesage(string gameId, string message)
        {
            await _hubContext.Clients.Group(gameId).SendAsync("Send", message);
        }

        public async Task SendPoints(string gameId, Dictionary<string, int> points)
        {
            await _hubContext.Clients.Group(gameId).SendAsync("Points", points);
        }

        public async Task RecieveGameStatus(string gameId, GameStatus gameStatus)
        {
            _gameHelper.UpdateCanvas(gameId, gameStatus);
        }

        public async Task CheckGivenWord(string gameId, WordStatus wordStatus)
        {
            var isCorrect = _gameHelper.UpdateWordStatus(gameId, wordStatus);

            if (isCorrect)
                await SendMesage(gameId, $"Gracz {wordStatus.PlayerId} zgadł hasło {wordStatus.Word}");
        }

        private async Task SendToGameGroup(string gameId, string method, object arg)
        {
            Clients.Group(gameId).SendAsync(method, arg);
        }
    }
}
