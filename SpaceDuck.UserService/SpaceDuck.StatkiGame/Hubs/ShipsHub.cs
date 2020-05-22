using Microsoft.AspNetCore.SignalR;
using SpaceDuck.Common.Models;
using SpaceDuck.ShipsGame.Server;
using SpaceDuck.ShipsGame.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpaceDuck.ShipsGame.Hubs
{
    public interface IShipsHub
    {
        Task SendMessage(string user, string message);
        Task Shoot(string gameId, string userId, string userName, char charCoordinates, int intCoordinates, ShipsGameStatus gameStatus);
        Task AlocateShips(string gameId, ShipsBoard shipsBoard, ShipsGameStatus gameStatus);
        Task AddToGameGroup(string gameId, string playerId, string playerName);
        Task RemoveFromGameGroup(string gameId, string playerId, string playerName);
        Task SendGameStatus(string gameId, ShipsGameStatus gameStatus);
        void RecieveGameStatus(string gameId, ShipsGameStatus gameStatus);
        Task SendMesage(string gameId, string message);
        Task SendPoints(string gameId, Dictionary<string, int> points);
    }

    public class ShipsHub : Hub, IShipsHub
    {
        private readonly IHubContext<ShipsHub> _hubContext;
        private IGameHelper _gameHelper;
        private IRoomService _roomService;
        private IShipsService _shipsService;

        public ShipsHub(IHubContext<ShipsHub> hubContext,
            IGameHelper gameHelper,
            IRoomService roomService,
            IShipsService shipsService)
        {
            _hubContext = hubContext;
            _gameHelper = gameHelper;
            _roomService = roomService;
        }

        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task Shoot(string gameId, string userId, string userName, char charCoordinates, int intCoordinates, ShipsGameStatus gameStatus)
        {
            var resp = _shipsService.Shoot(userId, userName, intCoordinates, charCoordinates, gameStatus);
            await SendMesage(gameId, resp.Item1);
            await SendGameStatus(gameId, resp.Item2);
        }

        public async Task AlocateShips(string gameId, ShipsBoard board, ShipsGameStatus gameStatus)
        {
            await SendGameStatus(gameId, _shipsService.UpdateBoard(board,gameStatus));
        }

        public async Task AddToGameGroup(string gameId, string playerId, string playerName)
        {
            try
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, gameId);

                await SendToGameGroup(gameId, "Send", $"{playerName} has joined the game.");

                await _roomService.AddPlayerToRoom(Convert.ToInt32(gameId), playerId, playerName);
            }
            catch (Exception)
            { }

        }

        public async Task RemoveFromGameGroup(string gameId, string playerId, string playerName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameId);

            await SendToGameGroup(gameId, "Send", $"{playerName} has left the game.");
        }

        public async Task SendGameStatus(string gameId, ShipsGameStatus gameStatus)
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

        public void RecieveGameStatus(string gameId, ShipsGameStatus gameStatus)
        {
            _gameHelper.UpdateBoard(gameId, gameStatus);
        }

        private async Task SendToGameGroup(string gameId, string method, object arg)
        {
            await Clients.Group(gameId).SendAsync(method, arg);
        }
    }
}
