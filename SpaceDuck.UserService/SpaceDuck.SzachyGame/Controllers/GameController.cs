using Microsoft.AspNetCore.Mvc;
using SpaceDuck.Common.Models;
using SpaceDuck.ChessGame.Server;
using SpaceDuck.ChessGame.Services;
using System;
using System.Collections.Generic;

namespace SpaceDuck.ChessGame.Controllers
{
    [Route("chess/api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private IRoomService roomService;
        private static GameType GameType = GameType.ChessGame;
        private List<Game> games;

        private IGameServer gameServer;

        public GameController(IRoomService roomService, IGameServer gameServer)
        {
            this.roomService = roomService;
            this.gameServer = gameServer;

            games = new List<Game>();
        }

        [Route("{roomId}")]
        [HttpGet]
        public void GameStart(int roomId)
        {
            var room = roomService.GetRoom(roomId);

            var gameTask = new GameTask
            (
                new GameStatus(),
                new Common.Models.ChessGame
                {
                    Id = Guid.NewGuid().ToString(),
                    Room = room
                }
            );

            gameServer.CreateGame(gameTask);
        }
    }
}