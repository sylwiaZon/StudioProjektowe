﻿using Microsoft.AspNetCore.SignalR;
using SpaceDuck.Common.Models;
using SpaceDuck.ChessGame.Server;
using SpaceDuck.ChessGame.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SpaceDuck.ChessGame.Hubs
{
    public interface IChessHub
    {
        Task SendMessage(string user, string message);
        Task AddToGameGroup(string gameId, Player player);
        Task AddOwnerToGameGroup(string gameId, Player player);
        Task RemoveFromGameGroup(string gameId, Player player);
        Task SendGameStatus(string gameId, ChessGameStatus gameStatus);
        Task SendBoard(string gameId, ChessGameStatus gameStatus);
        Task SendMesage(string gameId, string message);
        Task SendPoints(string gameId, Dictionary<string, int> points);


    }

    public class ChessHub : Hub, IChessHub
    {
        private readonly IHubContext<ChessHub> _hubContext;
        private IGameHelper _gameHelper;
        private IRoomService _roomService;

        public ChessHub(IHubContext<ChessHub> hubContext,
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

        public async Task AddToGameGroup(string gameId, Player player)
        {
            try
            {
                   await _roomService.AddPlayerToRoom(Convert.ToInt32(gameId), player);
                    await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
                    await SendToGameGroup(gameId, "Send", $"{player.Name} has joined the game.");
             
            }
            catch (Exception)
            { }

        }

        public async Task AddOwnerToGameGroup(string gameId, Player player)
        {
            try
            {
                    await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
                    await SendToGameGroup(gameId, "Send", $"{player.Name} has joined the game.");  
            }
            catch (Exception)
            { }

        }

        public async Task RemoveFromGameGroup(string gameId, Player player)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameId);

            await SendToGameGroup(gameId, "Send", $"{player.Name} has left the game.");

            await _roomService.RemovePlayerFromRoom(Convert.ToInt32(gameId), player.Id);

        }

        public async Task SendGameStatus(string gameId, ChessGameStatus gameStatus)
        {
            await _hubContext.Clients.Group(gameId).SendAsync("GameStatus", gameStatus);
            await _hubContext.Clients.Group(gameId).SendAsync("Send", "Update status by contexthub.");
            _gameHelper.UpdateGameStatus(gameId, gameStatus);

        }


        public async Task SendBoard(string gameId, ChessGameStatus gameStatus)
        {
            await _hubContext.Clients.Group(gameId).SendAsync("GameStatus", gameStatus);
            await _hubContext.Clients.Group(gameId).SendAsync("Send", "Update status by contexthub.");
            _gameHelper.UpdateBoard(gameId, gameStatus);

        }

        public async Task SendMesage(string gameId, string message)
        {
            await _hubContext.Clients.Group(gameId).SendAsync("Send", message);
        }

        public async Task SendPoints(string gameId, Dictionary<string, int> points)
        {
            await _hubContext.Clients.Group(gameId).SendAsync("Points", points);
        }

        private async Task SendToGameGroup(string gameId, string method, object arg)
        {
            Clients.Group(gameId).SendAsync(method, arg);
        }
    }
}
