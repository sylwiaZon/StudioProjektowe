using SpaceDuck.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpaceDuck.ChessGame.Server;

namespace SpaceDuck.ChessGame.Services
{
    public interface IChessService
    {
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
