using Microsoft.AspNetCore.Mvc;
using SpaceDuck.Common.Models;
using SpaceDuck.KalamburyGame.Services;
using System.Threading.Tasks;

namespace SpaceDuck.KalamburyGame.Controllers
{
    [Route("kalambury/api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private IRoomService roomService;
        private static GameType GameType = GameType.KalamburyGame;

        public RoomController(IRoomService roomService)
        {
            this.roomService = roomService;
        }

        [Route("all")]
        [HttpGet]
        public async Task<ActionResult> GetRooms()
        {
            return Ok(await roomService.GetRooms(GameType));
        }

        [Route("{roomId}")]
        [HttpGet]
        public ActionResult GetRoom(int roomId)
        {
            return Ok(roomService.GetRoom(roomId));
        }

        [HttpPost]
        public async Task<ActionResult> CreateRoom(RoomConfiguration roomConfiguration)
        {
            var room = roomService.CreateRoom(roomConfiguration, GameType);

            await roomService.SetRoom(room);

            return Ok();
        }

        [Route("{roomId}/{playerId}")]
        [HttpPost]
        public async Task<ActionResult> AddPlayerToRoom(int roomId, string playerId)
        {
            var result = await roomService.AddPlayerToRoom(roomId, playerId);

            var message = result ? $"Add to room: {roomId}" : $"Can not add to room: {roomId}";

            return Ok(message);
        }

        [Route("{roomId}/{playerId}")]
        [HttpDelete]
        public async Task<ActionResult> RemovePlayerFromRoom(int roomId, string playerId)
        {
            var result = await roomService.RemovePlayerToRoom(roomId, playerId);

            var message = result ? $"Remove from room: {roomId}" : $"Can not remove from room: {roomId}";

            return Ok(message);
        }

        [Route("{roomId}/owner/{playerId}")]
        [HttpDelete]
        public async Task<ActionResult> RemoveRoomAsOwner(int roomId, string playerId)
        {
            var result = await roomService.RemoveRoom(roomId, playerId);

            var message = result ? $"Remove room: {roomId}" : $"Can not remove room: {roomId}";

            return Ok(message);
        }
    }
}