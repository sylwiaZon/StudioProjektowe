using SpaceDuck.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceDuck.ChessGame.Services
{
    public interface IChessService
    {
        string SelectCurrentPlayer(Game game);
        void UpdateUsersPoints(Dictionary<string, int> usersPoints);
    }

    public class ChessService : IChessService
    {
        private IRankingService RankingService;
        private GameType GameType = GameType.ChessGame;

        public ChessService(IRankingService rankingService)
        {
            RankingService = rankingService;
        }

         public string SelectCurrentPlayer(Game game)
        {
            var chessGame = (game as Common.Models.ChessGame);

            var player = chessGame.Room.Players.FirstOrDefault(p => p.Id == chessGame.CurrentPlayerId);
            Console.WriteLine($"-1: {chessGame.Room.Players.ElementAt(-1).Id}");
            Console.WriteLine($"0: {chessGame.Room.Players.ElementAt(0).Id}");

            Console.WriteLine($"1: {chessGame.Room.Players.ElementAt(1).Id}");


            int index = chessGame.Room.Players.IndexOf(player);

            if (index ==(chessGame.Room.Players.Count)-1)
                index = 0;
            else
                index++;

            return chessGame.Room.Players.ElementAt(index).Id;
        }

        public async void UpdateUsersPoints(Dictionary<string, int> usersPoints)
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
    }
}
