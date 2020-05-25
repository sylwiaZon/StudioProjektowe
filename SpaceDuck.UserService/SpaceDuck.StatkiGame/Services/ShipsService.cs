using SpaceDuck.Common.Models;
using SpaceDuck.ShipsGame.Server;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceDuck.ShipsGame.Services
{
    public interface IShipsService
    {
        string SelectCurrentPlayer(ShipsGameStatus gameStatus, Game game);
        void UpdateUsersPoints(Dictionary<string, int> usersPoints);
        ShipsGameStatus UpdateBoard(ShipsBoard shipsBoard, string roomId);
        ShipsGameStatus GetStatus(string roomId);
        ValueTuple<string, ShipsGameStatus> Shoot(string roomId, string playerId, string playerName, int intCoordinates, char charCoordinates);
    }

    public class ShipsService : IShipsService
    {
        private IRankingService RankingService;
        private GameType GameType = GameType.ShipsGame;
        public IGameHelper gameHelper;

        public ShipsService(IRankingService rankingService, IGameHelper gameHelper)
        {
            RankingService = rankingService;
            this.gameHelper = gameHelper;
        }

        public string SelectCurrentPlayer(ShipsGameStatus gameStatus, Game game)
        {
            var shipsGame = (game as Common.Models.ShipsGame);
            var id = shipsGame.Players.IndexOf(gameStatus.CurrentPlayerId);
            if(id == 0)
            {
                return shipsGame.Players[1];
            }
            if(shipsGame.Players.Count() == 0)
            {
                return null;
            }
            return shipsGame.Players[0];
        }

        public async void UpdateUsersPoints(Dictionary<string, int>  usersPoints)
        {
            foreach (var item in usersPoints)
            {
                await RankingService.AssingPointToPlayer(new UserPoints
                {
                    Points = item.Value,
                    UserId = item.Key
                }, GameType);
            }
        }

        public ShipsGameStatus GetStatus(string roomId)
        {
            var tasks = gameHelper.gameTasks;
            GameTask task = gameHelper.gameTasks.Where(g => g.Game.Room.Id == Convert.ToInt32(roomId)).First();
            var gameStatus = task.GameStatus;
            return gameStatus;
        }

        public ValueTuple<string, ShipsGameStatus> Shoot(string roomId, string playerId, string playerName, int intCoordinates, char charCoordinates)
        {
            GameTask task = gameHelper.gameTasks.Where(g => g.Game.Room.Id == Convert.ToInt32(roomId)).First();
            var gameStatus = task.GameStatus;
            if (gameStatus.Boards[0].PlayerId == playerId)
            {
                var resp = Shoot(intCoordinates, charCoordinates, gameStatus.Boards[0]);
                gameStatus.Boards[0] = resp.Item2;
                return (resp.Item1, gameStatus);
            }
            else if(gameStatus.Boards[1].PlayerId == playerId)
            {
                var resp = Shoot(intCoordinates, charCoordinates, gameStatus.Boards[1]);
                gameStatus.Boards[1] = resp.Item2;
                return (resp.Item1, gameStatus);
            }
            return ("Something went wrong", gameStatus);
        }

        private ValueTuple<string, ShipsBoard> Shoot(int intCoordinates, char charCoordinates, ShipsBoard board)
        {
            int i = charCoordinates - 'A';
            ShipsField field = board.Board[intCoordinates - 1][i];
            string message;
            if (field.IsShip)
            {
                field.IsShot = true;
                if (field.ShipType == ShipType.Ship1)
                {
                    field.IsSunk = true;
                    message = "Congrats! Ship sunk!";
                }
                else
                {
                    message = "Great! You shot this ship!";
                }
            }
            else
            {
                message = "Nothing there, try again!";
            }
            board.Board[intCoordinates - 1][i] = field;
            return (message,board);
        }

        public ShipsGameStatus UpdateBoard(ShipsBoard shipsBoard, string roomId)
        {
            GameTask task = gameHelper.gameTasks.Where(g => g.Game.Room.Id == Convert.ToInt32(roomId)).First();
            var gameStatus = task.GameStatus;
            if (gameStatus.Boards[0].PlayerId == shipsBoard.PlayerId)
            {
                gameStatus.Boards[0].Board = shipsBoard.Board;
                gameStatus.Boards[0].AreShipsAllocated = true;
            }
            else if (gameStatus.Boards[1].PlayerId == shipsBoard.PlayerId)
            {
                gameStatus.Boards[1].Board = shipsBoard.Board;
                gameStatus.Boards[1].AreShipsAllocated = true;
            }
            return gameStatus;
        }
    }
}
