using Microsoft.AspNetCore.Mvc;
using SpaceDuck.ChessGame.Server;
using SpaceDuck.ChessGame.Services;
using SpaceDuck.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace SpaceDuck.ChessGame.Controllers
{
    [Route("chess/api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private IRoomService roomService;
        private static GameType GameType = GameType.ChessGame;

        private IGameServer gameServer;

        public GameController(IRoomService roomService, IGameServer gameServer)
        {
            this.roomService = roomService;
            this.gameServer = gameServer;
        }

        [Route("{roomId}")]
        [HttpGet]
        public async Task<IActionResult> GameStart(int roomId)
        {
            if (gameServer.gameHelper.gameTasks.FirstOrDefault(game => game.Game.Room.Id == roomId)?.IsStarted == true)
                return Ok("Gra dla tego pokoju już działa.");

            var room = await roomService.GetRoom(roomId);

            if (room.Players.Count < 2)
                return Ok("Oczekiwanie na graczy.");

            await gameServer.CreateGame(roomId);

            return Ok();
        }

        [Route("{roomId}/restart")]
        [HttpGet]
        public async Task<IActionResult> GameRestart(int roomId)
        {
            if (gameServer.gameHelper.gameTasks.FirstOrDefault(game => game.Game.Room.Id == roomId)?.IsStarted == true)
                return Ok("Gra dla tego pokoju już działa.");

            var room = await roomService.GetRoom(roomId);

            if (room.Players.Count < 2)
                return Ok("Oczekiwanie na graczy.");

            var playerEmptyPoints = room.Players.ToDictionary(player => player.Id, _ => 0);

            var gameTask = new GameTask
            (
                new ChessGameStatus
                {
                    WhiteClock = room.RoomConfiguration.RoundDuration,
                    BlackClock = room.RoomConfiguration.RoundDuration
                },
                new Game
                {
                    Id = Guid.NewGuid().ToString(),
                    Room = room,
                    PlayersPointsPerGame = playerEmptyPoints
                }
            );

            await gameServer.CreateGame(gameTask);

            return Ok();
        }
    }
}