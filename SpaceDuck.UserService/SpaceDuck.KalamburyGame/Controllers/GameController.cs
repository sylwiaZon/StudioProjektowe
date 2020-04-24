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
        public async Task GameStart(int roomId)
        {
            var room = await roomService.GetRoom(roomId);

            var gameTask = new GameTask
            (
                new GameStatus(),
                new Common.Models.KalamburyGame
                {
                    Id = Guid.NewGuid().ToString(),
                    Room = room
                }
            );

            gameServer.CreateGame(gameTask);
        }

        [Route("{gameId}/drawing/{playerId}")]
        [HttpPost]
        public IActionResult AddPlayerAsSubmittedForDrawing(string gameId, string playerId)
        {
            var game = games.FirstOrDefault(g => g.Id == gameId)
                as Common.Models.KalamburyGame;

            game.SubmittedForDrawing.Add(playerId);

            return Ok();
        }

        [Route("{gameId}/drawing/{playerId}")]
        [HttpDelete]
        public IActionResult RemovePlayerFromSubmittedForDrawing(string gameId, string playerId)
        {
            var game = games.FirstOrDefault(g => g.Id == gameId)
                as Common.Models.KalamburyGame;

            game.SubmittedForDrawing.Remove(playerId);

            return NoContent();
        }
    }
}