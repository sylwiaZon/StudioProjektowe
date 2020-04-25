using SpaceDuck.Common.Models;
using SpaceDuck.KalamburyGame.DataBase.Repositories;
using SpaceDuck.KalamburyGame.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceDuck.KalamburyGame.Services
{
    public interface IRoomService
    {
        Task<List<Room>> GetRooms(GameType gameType);
        Task<Room> GetRoom(int roomId);
        Task SetRoom(Room room);
        Room CreateRoom(RoomConfiguration roomConfiguration, GameType gameType);
        Task<bool> AddPlayerToRoom(int roomId, string playerId);
        Task<bool> RemovePlayerToRoom(int roomId, string playerId);
        Task<bool> RemoveRoom(int roomId, string playerId);
    }

    public class RoomService : IRoomService
    {
        private IRoomRepository roomRepository;
        private IKalamburyHub kalamburyHub;

        public RoomService(IRoomRepository roomRepository,
            IKalamburyHub kalamburyHub)
        {
            this.roomRepository = roomRepository;

            this.kalamburyHub = kalamburyHub;
        }

        public async Task<bool> AddPlayerToRoom(int roomId, string playerId)
        {
            var room = await GetRoom(roomId);

            if (room.IsFull) return false;

            room.PlayersIds.Add(playerId);

            kalamburyHub.AddToGameGroup(roomId.ToString(), playerId);

            if (room.PlayersIds.Count == room.RoomConfiguration.NumberOfPlayers)
                room.IsFull = true;

            await SetRoom(room);

            return true;
        }

        public Room CreateRoom(RoomConfiguration roomConfiguration, GameType gameType)
        {
            var room = new Room
            {
                RoomConfiguration = roomConfiguration,
                PlayersIds = new List<string>(roomConfiguration.NumberOfPlayers),
                GameType = gameType,
                IsFull = false
            };

            room.PlayersIds.Add(roomConfiguration.PlayerOwnerId);

            return room;
        }

        public async Task<Room> GetRoom(int roomId)
        {
            var room = await roomRepository.GetRoomWitConfig(roomId);
            return room;
        }

        public async Task<List<Room>> GetRooms(GameType gameType)
        {
            var roomIds = roomRepository.Rooms
                .Where(room => room.GameType == gameType).Select(r => r.Id).ToList();

            List<Task<Room>> listOfTasks = new List<Task<Room>>();

            List<Room> rooms = new List<Room>();

            foreach (var id in roomIds)
            {
                rooms.Add(await GetRoom(id));
            }

            return rooms;
        }

        public async Task<bool> RemovePlayerToRoom(int roomId, string playerId)
        {
            var room = await GetRoom(roomId);

            if (room.RoomConfiguration.PlayerOwnerId == playerId) return false;

            if (!room.PlayersIds.Contains(playerId)) return false;

            room.PlayersIds.Remove(playerId);

            kalamburyHub.RemoveFromGameGroup(roomId.ToString(), playerId);

            await SetRoom(room);

            return true;
        }

        public async Task<bool> RemoveRoom(int roomId, string playerId)
        {
            var room = await GetRoom(roomId);

            if (room.RoomConfiguration.PlayerOwnerId != playerId) return false;

            DeleteRoom(roomId);

            return true;
        }

        public async Task SetRoom(Room room)
        {
            await roomRepository.SaveRoom(room);
        }

        private void DeleteRoom(int roomId)
        {
            roomRepository.DeleteRoom(roomId);
        }
    }
}
