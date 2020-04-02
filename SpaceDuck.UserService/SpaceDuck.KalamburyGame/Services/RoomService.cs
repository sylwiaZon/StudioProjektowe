using SpaceDuck.Common.Models;
using SpaceDuck.KalamburyGame.DataBase.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceDuck.KalamburyGame.Services
{
    public interface IRoomService
    {
        Room GetRoom(int roomId);
        Task SetRoom(Room room);
        Room CreateRoom(RoomConfiguration roomConfiguration, GameType gameType);
        Task<bool> AddPlayerToRoom(int roomId, string playerId);
        Task<bool> RemovePlayerToRoom(int roomId, string playerId);
        bool RemoveRoom(int roomId, string playerId);
    }

    public class RoomService : IRoomService
    {
        private IRoomRepository roomRepository;
        public RoomService(IRoomRepository roomRepository)
        {
            this.roomRepository = roomRepository;
        }

        public async Task<bool> AddPlayerToRoom(int roomId, string playerId)
        {
            var room = GetRoom(roomId);

            if (room.IsFull) return false;

            room.PlayersIds.Add(playerId);

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

        public Room GetRoom(int roomId)
        {
            return roomRepository.Rooms
                .FirstOrDefault(room => room.Id == roomId);
        }

        public async Task<bool> RemovePlayerToRoom(int roomId, string playerId)
        {
            var room = GetRoom(roomId);

            if (room.RoomConfiguration.PlayerOwnerId == playerId) return false;

            if (!room.PlayersIds.Contains(playerId)) return false;

            room.PlayersIds.Remove(playerId);

            await SetRoom(room);

            return true;
        }

        public bool RemoveRoom(int roomId, string playerId)
        {
            var room = GetRoom(roomId);

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
