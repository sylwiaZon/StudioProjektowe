using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using NUnit.Framework;
using SpaceDuck.Common.Models;
using SpaceDuck.KalamburyGame.Controllers;
using SpaceDuck.KalamburyGame.DataBase.Repositories;
using SpaceDuck.KalamburyGame.Server;
using SpaceDuck.KalamburyGame.Services;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SpaceDuck.KalamburyGame.UnitTest.Controller
{
    [TestFixture]
    public class RoomControllerTest
    {
        private RoomController _controller;
        private IRoomRepository _roomRepository;
        private IRoomService _roomService;
        private IGameHelper _gameHelper;

        [SetUp]
        public void SetUp()
        {
            _roomRepository = Substitute.For<IRoomRepository>();
            _gameHelper = Substitute.For<IGameHelper>();
            _roomService = Substitute.For<IRoomService>();
        }

        private RoomController CreateController()
        {
            return new RoomController(_roomService);
        }

        [Test]
        public async Task GetRooms_ShouldReturnOkWithEmptyListAsync()
        {
            _roomService.GetRooms(Common.Models.GameType.KalamburyGame).Returns(new List<Room>());
            _controller = CreateController();

            ActionResult<List<Room>> actionResult = await _controller.GetRooms();

            Assert.IsInstanceOf<OkObjectResult>(actionResult.Result);
            OkObjectResult okObjectResult = actionResult.Result as OkObjectResult;
            Assert.IsInstanceOf<List<Room>>(okObjectResult.Value);
            List<Room> model = okObjectResult.Value as List<Room>;
            Assert.AreEqual(model.Count, 0);
        }

        [Test]
        public async Task GetRooms_ShouldReturnOkWithOneElemAsync()
        {
            _roomService.GetRooms(Common.Models.GameType.KalamburyGame).Returns(new List<Room>() { TestConstants.Room1 });
            _controller = CreateController();

            ActionResult<List<Room>> actionResult = await _controller.GetRooms();

            Assert.IsInstanceOf<OkObjectResult>(actionResult.Result);
            OkObjectResult okObjectResult = actionResult.Result as OkObjectResult;
            Assert.IsInstanceOf<List<Room>>(okObjectResult.Value);
            List<Room> model = okObjectResult.Value as List<Room>;
            Assert.AreEqual(model.Count, 1);
        }

        [Test]
        public async Task GetRooms_ShouldReturnOkWithListAsync()
        {
            _roomService.GetRooms(Common.Models.GameType.KalamburyGame).Returns(new List<Room>() { TestConstants.Room1, TestConstants.Room2});
            _controller = CreateController();

            ActionResult<List<Room>> actionResult = await _controller.GetRooms();

            Assert.IsInstanceOf<OkObjectResult>(actionResult.Result);
            OkObjectResult okObjectResult = actionResult.Result as OkObjectResult;
            Assert.IsInstanceOf<List<Room>>(okObjectResult.Value);
            List<Room> model = okObjectResult.Value as List<Room>;
            Assert.AreEqual(model.Count, 2);
        }

        [Test]
        public async Task GetRoom_ShouldReturnNullAsync()
        {
            int notExistId = 100;
            _roomService.GetRoom(notExistId).Returns((Room)null);
            _controller = CreateController();

            ActionResult<List<Room>> actionResult = await _controller.GetRoom(notExistId);

            Assert.IsInstanceOf<OkObjectResult>(actionResult.Result);
            OkObjectResult okObjectResult = actionResult.Result as OkObjectResult;
            Assert.IsInstanceOf<string>(okObjectResult.Value);
            string model = okObjectResult.Value as string;
            Assert.IsNotNull(model);
            Assert.AreEqual($"There is no room: {notExistId}", model);
        }

        [Test]
        public async Task GetRoom_ShouldReturnRoomAsync()
        {
            _roomService.GetRoom(TestConstants.Room1.Id).Returns(TestConstants.Room1);
            _controller = CreateController();

            ActionResult<List<Room>> actionResult = await _controller.GetRoom(TestConstants.Room1.Id);

            Assert.IsInstanceOf<OkObjectResult>(actionResult.Result);
            OkObjectResult okObjectResult = actionResult.Result as OkObjectResult;
            Assert.IsInstanceOf<Room>(okObjectResult.Value);
            Room model = okObjectResult.Value as Room;
            Assert.IsNotNull(model);
            Assert.AreEqual(TestConstants.Room1.Id, model.Id);
        }

        [Test]
        public async Task AddPlayerToRoom_ShouldNotAddAsync()
        {
            int notExistId = 100;
            _roomService.AddPlayerToRoom(notExistId, Arg.Any<string>(), Arg.Any<string>()).Returns(false);
            _controller = CreateController();

            ActionResult<List<Room>> actionResult = await _controller.AddPlayerToRoom(notExistId, "player1", "Palyer1Name");

            Assert.IsInstanceOf<OkObjectResult>(actionResult.Result);
            OkObjectResult okObjectResult = actionResult.Result as OkObjectResult;
            Assert.IsInstanceOf<string>(okObjectResult.Value);
            string model = okObjectResult.Value as string;
            Assert.IsNotNull(model);
            Assert.AreEqual($"Can not add to room: {notExistId}", model);
        }

        [Test]
        public async Task AddPlayerToRoom_ShouldAddAsync()
        {
            _roomService.AddPlayerToRoom(TestConstants.Room1.Id, Arg.Any<string>(), Arg.Any<string>()).Returns(true);
            _controller = CreateController();

            ActionResult<List<Room>> actionResult = await _controller.AddPlayerToRoom(TestConstants.Room1.Id, "player1", "Palyer1Name");

            Assert.IsInstanceOf<OkObjectResult>(actionResult.Result);
            OkObjectResult okObjectResult = actionResult.Result as OkObjectResult;
            Assert.IsInstanceOf<string>(okObjectResult.Value);
            string model = okObjectResult.Value as string;
            Assert.IsNotNull(model);
            Assert.AreEqual($"Add to room: {TestConstants.Room1.Id}", model);
        }

        [Test]
        public async Task RemovePlayerFromRoom_ShouldNotRemoveAsync()
        {
            int notExistId = 100;
            _roomService.RemovePlayerFromRoom(notExistId, Arg.Any<string>()).Returns(false);
            _controller = CreateController();

            ActionResult<List<Room>> actionResult = await _controller.RemovePlayerFromRoom(notExistId, "player1");

            Assert.IsInstanceOf<OkObjectResult>(actionResult.Result);
            OkObjectResult okObjectResult = actionResult.Result as OkObjectResult;
            Assert.IsInstanceOf<string>(okObjectResult.Value);
            string model = okObjectResult.Value as string;
            Assert.IsNotNull(model);
            Assert.AreEqual($"Can not remove from room: {notExistId}", model);
        }

        [Test]
        public async Task RemovePlayerFromRoom_ShouldRemoveAsync()
        {
            _roomService.RemovePlayerFromRoom(TestConstants.Room1.Id, Arg.Any<string>()).Returns(true);
            _controller = CreateController();

            ActionResult<List<Room>> actionResult = await _controller.RemovePlayerFromRoom(TestConstants.Room1.Id, "player1");

            Assert.IsInstanceOf<OkObjectResult>(actionResult.Result);
            OkObjectResult okObjectResult = actionResult.Result as OkObjectResult;
            Assert.IsInstanceOf<string>(okObjectResult.Value);
            string model = okObjectResult.Value as string;
            Assert.IsNotNull(model);
            Assert.AreEqual($"Remove from room: {TestConstants.Room1.Id}", model);
        }

        [Test]
        public async Task RemoveRoomAsOwner_ShouldNotRemoveAsync()
        {
            int notExistId = 100;
            _roomService.RemoveRoom(notExistId, Arg.Any<string>()).Returns(false);
            _controller = CreateController();

            ActionResult<List<Room>> actionResult = await _controller.RemoveRoomAsOwner(notExistId, "player1");

            Assert.IsInstanceOf<OkObjectResult>(actionResult.Result);
            OkObjectResult okObjectResult = actionResult.Result as OkObjectResult;
            Assert.IsInstanceOf<string>(okObjectResult.Value);
            string model = okObjectResult.Value as string;
            Assert.IsNotNull(model);
            Assert.AreEqual($"Can not remove room: {notExistId}", model);
        }

        [Test]
        public async Task RemoveRoomAsOwner_ShouldRemoveAsync()
        {
            _roomService.RemoveRoom(TestConstants.Room1.Id, Arg.Any<string>()).Returns(true);
            _controller = CreateController();

            ActionResult<List<Room>> actionResult = await _controller.RemoveRoomAsOwner(TestConstants.Room1.Id, "player1");

            Assert.IsInstanceOf<OkObjectResult>(actionResult.Result);
            OkObjectResult okObjectResult = actionResult.Result as OkObjectResult;
            Assert.IsInstanceOf<string>(okObjectResult.Value);
            string model = okObjectResult.Value as string;
            Assert.IsNotNull(model);
            Assert.AreEqual($"Remove room: {TestConstants.Room1.Id}", model);
        }


    }
}
