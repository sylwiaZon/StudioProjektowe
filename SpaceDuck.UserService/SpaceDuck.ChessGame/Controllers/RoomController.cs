using Microsoft.AspNetCore.Mvc;
using SpaceDuck.Common.Models;
using SpaceDuck.ChessGame.Services;
using System.Threading.Tasks;
using System;

namespace SpaceDuck.ChessGame.Controllers
{
    [Route("chess/api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private IRoomService roomService;
        private static GameType GameType = GameType.ChessGame;

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
        public async Task<ActionResult> GetRoomAsync(int roomId)
        {
            var room = await roomService.GetRoom(roomId);
            if (room == null)
            {
                return Ok($"There is no room: {roomId}");
            }
            return Ok(await roomService.GetRoom(roomId));
        }

        [Route("{ownerColor}")]
        [HttpPost]
        public async Task<ActionResult> CreateRoom(RoomConfiguration roomConfiguration, string ownerColor)
        {
            var room = roomService.CreateRoom(roomConfiguration, GameType, ownerColor);

            await roomService.SetRoom(room);

            return Ok(room);
        }

        [Route("{roomId}/{playerId}/{playerName}")]
        [HttpPost]
        public async Task<ActionResult> AddPlayerToRoom(int roomId, string playerId, string playerName)
        {
            var result = await roomService.AddPlayerToRoom(roomId, playerId, playerName);

            var message = result ? $"Add to room: {roomId}" : $"Can not add to room: {roomId}";

            return Ok(message);
        }

        [Route("{roomId}/{playerId}")]
        [HttpDelete]
        public async Task<ActionResult> RemovePlayerFromRoom(int roomId, string playerId)
        {
            var result = await roomService.RemovePlayerFromRoom(roomId, playerId);

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