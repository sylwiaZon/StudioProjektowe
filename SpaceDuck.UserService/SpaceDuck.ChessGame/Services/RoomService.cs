﻿using SpaceDuck.Common.Models;
using SpaceDuck.ChessGame.DataBase.Repositories;
using SpaceDuck.ChessGame.Server;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceDuck.ChessGame.Services
{
    public interface IRoomService
    {
        Task<List<Room>> GetRooms(GameType gameType);
        Task<Room> GetRoom(int roomId);
        Task SetRoom(Room room);
        Room CreateRoom(RoomConfiguration roomConfiguration, GameType gameType);
        Task<bool> AddPlayerToRoom(int roomId, Player player);
        Task<bool> RemovePlayerFromRoom(int roomId, string playerId);
        Task<bool> RemoveRoom(int roomId, string playerId);
    }

    public class RoomService : IRoomService
    {
        private IRoomRepository roomRepository;
        private IGameHelper gameHelper;

        public RoomService(IRoomRepository roomRepository,
            IGameHelper gameHelper)
        {
            this.roomRepository = roomRepository;
            this.gameHelper = gameHelper;
        }

        public async Task<bool> AddPlayerToRoom(int roomId, Player player)
        {
            var room = await GetRoom(roomId);

            if (room.IsFull) return false;

            room.Players.Add(player);

            var canAddToGame = gameHelper.AddPlayer(roomId.ToString(), player);

            if (!canAddToGame)
                return false;

            if (room.Players.Count == room.RoomConfiguration.NumberOfPlayers)
                room.IsFull = true;

            await SetRoom(room);

            return true;
        }
        public Room CreateRoom(RoomConfiguration roomConfiguration, GameType gameType)
        {
            var room = new Room
            {
                RoomConfiguration = roomConfiguration,
                Players = new List<Player>(roomConfiguration.NumberOfPlayers),
                GameType = gameType,
                IsFull = false
            };

            room.RoomConfiguration.NumberOfPlayers = 2;
            room.Players.Add(new Player { Id = roomConfiguration.PlayerOwnerId, Name = roomConfiguration.PlayerOwnerName });


            var playerEmptyPoints = new Dictionary<string, int>();
            foreach (var item in room.Players)
            {
                playerEmptyPoints.Add(item.Id, 0);
            }

            var gameTask = new GameTask
            (
                new ChessGameStatus(),
                new Common.Models.ChessGame
                {
                    Id = Guid.NewGuid().ToString(),
                    Room = room,
                    PlayersPointsPerGame = playerEmptyPoints
                }
            );

            gameHelper.gameTasks.Add(gameTask);

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

            List<Room> rooms = new List<Room>();

            foreach (var id in roomIds)
            {
                rooms.Add(await GetRoom(id));
            }

            return rooms;
        }

        public async Task<bool> RemovePlayerFromRoom(int roomId, string playerId)
        {
            var room = await GetRoom(roomId);

            if (room.RoomConfiguration.PlayerOwnerId == playerId) return false;

            if (room.Players.FirstOrDefault(p => p.Id == playerId) == null) return false;

            room.Players.Remove(room.Players.FirstOrDefault(p => p.Id == playerId));

            gameHelper.RemovePlayer(roomId.ToString(), playerId);

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
