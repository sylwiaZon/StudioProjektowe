using Microsoft.AspNetCore.Mvc;
using SpaceDuck.ChessGame.Services;
using System.Threading.Tasks;
using SpaceDuck.Common.Models;


namespace SpaceDuck.ChessGame.Controllers
{
    [Route("chess/api/[controller]")]
    [ApiController]
    public class RankingController : ControllerBase
    {
        private IRankingService rankingService;
        private static GameType GameType = GameType.ChessGame;

        public RankingController(IRankingService rankingService)
        {
            this.rankingService = rankingService;
        }

        [Route("{playerId}")]
        [HttpGet]
        public ActionResult GetPlayerRanking(string playerId)
        {
            return Ok(rankingService.GetPlayerPoints(playerId, GameType));
        }

        [Route("add")]
        [HttpPost]
        public async Task<ActionResult> AddPointsToPlayer(UserPoints userPoints)
        {
            await rankingService.AssingPointToPlayer(userPoints, GameType);

            return Ok();
        }

        [Route("{playerId}")]
        [HttpDelete]
        public ActionResult DeleteRankingForPlayer(string playerId)
        {
            rankingService.DeleteRanking(playerId);

            return NoContent();
        }
    }
}