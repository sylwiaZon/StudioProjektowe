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