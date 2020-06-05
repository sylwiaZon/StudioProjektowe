using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using NUnit.Framework;
using SpaceDuck.KalamburyGame.Controllers;
using SpaceDuck.KalamburyGame.Services;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SpaceDuck.KalamburyGame.UnitTest.Controller
{
    [TestFixture]
    public class RankingControllerTest
    {
        private RankingController _controller;
        private IRankingService _rankingService;

        [SetUp]
        public void SetUp()
        {
            _rankingService = Substitute.For<IRankingService>();
        }

        private RankingController CreateController()
        {
            return new RankingController(_rankingService);
        }

        [Test]
        public void GetPlayerRanking_ShouldReturnPoints()
        {
            string playerId = "player1";
            _rankingService.GetPlayerPoints(playerId, Common.Models.GameType.KalamburyGame).Returns(1);
            _controller = CreateController();

            ActionResult<int> actionResult = _controller.GetPlayerRanking(playerId);

            Assert.IsInstanceOf<OkObjectResult>(actionResult.Result);
            OkObjectResult okObjectResult = actionResult.Result as OkObjectResult;
            Assert.IsInstanceOf<int>(okObjectResult.Value);
            var model = (int)okObjectResult.Value;
            Assert.IsNotNull(model);
            Assert.AreEqual(1, model);
        }

        [Test]
        public async System.Threading.Tasks.Task GetTopPlayers_ShouldReturnBadRequestForLimit0Async()
        {
            int limit = 0;
            
            _controller = CreateController();

            ActionResult<string> actionResult = await _controller.GetTopPlayers(limit);

            Assert.IsInstanceOf<BadRequestObjectResult>(actionResult.Result);
            BadRequestObjectResult badObjectResult = actionResult.Result as BadRequestObjectResult;
            Assert.IsInstanceOf<string>(badObjectResult.Value);
            var model = (string)badObjectResult.Value;
            Assert.IsNotNull(model);
            Assert.AreEqual("Za mala liczba", model);
        }

        [Test]
        public async Task GetTopPlayers_ShouldReturnBadRequestForLimit5Async()
        {
            int limit = 5;
            _rankingService.GetTopPlayers(limit, Common.Models.GameType.KalamburyGame).Returns(new List<Common.Models.Ranking>());
            _controller = CreateController();

            ActionResult<List<Common.Models.Ranking>> actionResult = await _controller.GetTopPlayers(limit);

            Assert.IsInstanceOf<OkObjectResult>(actionResult.Result);
            OkObjectResult okObjectResult = actionResult.Result as OkObjectResult;
            Assert.IsInstanceOf<List<Common.Models.Ranking>>(okObjectResult.Value);
            var model = (List<Common.Models.Ranking>)okObjectResult.Value;
            Assert.IsNotNull(model);
        }
    }
}
