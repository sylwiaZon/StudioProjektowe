using Microsoft.AspNetCore.Mvc;
using SpaceDuck.Common.Models;
using SpaceDuck.KalamburyGame.Services;
using System.Threading.Tasks;

namespace SpaceDuck.KalamburyGame.Controllers
{
    [Route("kalambury/api/[controller]")]
    [ApiController]
    public class RankingController : ControllerBase
    {
        private IRankingService rankingService;
        private static GameType GameType = GameType.KalamburyGame;

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

        [Route("top/{limit}")]
        [HttpGet]
        public ActionResult GetTopPlayers(int limit)
        {
            if (limit < 1)
                return BadRequest("Za mala liczba");

            return Ok(rankingService.GetTopPlayers(limit, GameType));
        }
    }
}