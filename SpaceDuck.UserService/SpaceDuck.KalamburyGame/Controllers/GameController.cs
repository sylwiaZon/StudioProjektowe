using Microsoft.AspNetCore.Mvc;
using SpaceDuck.Common.Models;
using SpaceDuck.KalamburyGame.Server;
using SpaceDuck.KalamburyGame.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceDuck.KalamburyGame.Controllers
{
    [Route("kalambury/api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private IRoomService roomService;
        private static GameType GameType = GameType.KalamburyGame;

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
            if (gameServer.gameHelper.gameTasks.FirstOrDefault(game => game.Game.Room.Id == roomId) != null 
                && gameServer.gameHelper.gameTasks.FirstOrDefault(game => game.Game.Room.Id == roomId).IsStarted)
                return Ok("Gra dla tego pokoju już działa.");

            var room = await roomService.GetRoom(roomId);

            if (room.PlayersIds.Count < 2)
                return Ok("Oczekiwanie na graczy.");

            gameServer.CreateGame(roomId);

            return Ok();
        }

        [Route("{roomId}/restart")]
        [HttpGet]
        public async Task<IActionResult> GameRestart(int roomId)
        {
            if (gameServer.gameHelper.gameTasks.FirstOrDefault(game => game.Game.Room.Id == roomId) != null
                && gameServer.gameHelper.gameTasks.FirstOrDefault(game => game.Game.Room.Id == roomId).IsStarted)
                return Ok("Gra dla tego pokoju już działa.");

            var room = await roomService.GetRoom(roomId);

            if (room.PlayersIds.Count < 2)
                return Ok("Oczekiwanie na graczy.");

            var playerEmptyPoints = new Dictionary<string, int>();
            foreach (var item in room.PlayersIds)
            {
                playerEmptyPoints.Add(item, 0);
            }

            var gameTask = new GameTask
            (
                new GameStatus(),
                new Common.Models.KalamburyGame
                {
                    Id = Guid.NewGuid().ToString(),
                    Room = room,
                    PlayersPointsPerGame = playerEmptyPoints
                }
            );

            gameServer.CreateGame(gameTask);

            return Ok();
        }

        [Route("{gameId}/drawing/{playerId}")]
        [HttpPost]
        public IActionResult AddPlayerAsSubmittedForDrawing(string gameId, string playerId)
        {
            var game = gameServer
                .gameHelper
                .gameTasks
                .FirstOrDefault(g => g.Game.Room.Id.ToString() == gameId);

            if (!game.Game.SubmittedForDrawingQue.Contains(playerId))
                game.Game.SubmittedForDrawingQue.Enqueue(playerId);

            return Ok();
        }

        [Route("{gameId}/drawing/{playerId}")]
        [HttpDelete]
        public IActionResult RemovePlayerFromSubmittedForDrawing(string gameId, string playerId)
        {
            var game = gameServer
                .gameHelper
                .gameTasks
                .FirstOrDefault(g => g.Game.Room.Id.ToString() == gameId);

            game.Game.SubmittedForDrawingQue = gameServer.gameHelper
                .RemovePlayerFromQue(game.Game.SubmittedForDrawingQue, playerId);

            return NoContent();
        }
    }
}