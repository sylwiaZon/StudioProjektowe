using SpaceDuck.Common.Models;
using SpaceDuck.ChessGame.DataBase.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceDuck.ChessGame.Services
{
    public interface IRankingService
    {
        Task AssingPointToPlayer(UserPoints userPoints, GameType gameType);
        int GetPlayerPoints(string playerId, GameType gameType);
        List<Ranking> GetPlayerPointsInAllGames(string playerId);
        void DeleteRanking(string playerId);
    }

    public class RankingService : IRankingService
    {
        private IRankingRepository rankingRepository;
        public RankingService(IRankingRepository rankingRepository)
        {
            this.rankingRepository = rankingRepository;
        }

        public async Task AssingPointToPlayer(UserPoints userPoints, GameType gameType)
        {
            var currentPlayerRanking = GetPlayerRankingInGame(userPoints.UserId, gameType);

            if (currentPlayerRanking == null)
            {
                currentPlayerRanking = new Ranking
                {
                    GameType = gameType,
                    UserId = userPoints.UserId,
                    Points = userPoints.Points
                };
            }
            else
            {
                currentPlayerRanking.Points += userPoints.Points;
            }

            await rankingRepository.SaveRanking(currentPlayerRanking);
        }

        public void DeleteRanking(string playerId)
        {
            rankingRepository.DeleteRanking(playerId);
        }

        public int GetPlayerPoints(string playerId, GameType gameType)
        {
            var currentUserRanking = GetPlayerRankingInGame(playerId, gameType);

            return currentUserRanking == null ? 0 : currentUserRanking.Points;
        }

        public List<Ranking> GetPlayerPointsInAllGames(string playerId)
        {
            return rankingRepository.Rankings
                .Where(ranking => ranking.UserId == playerId)
                .ToList();
        }

        private Ranking GetPlayerRankingInGame(string playerId, GameType gameType)
        {
            return rankingRepository.Rankings
                .FirstOrDefault(ranking => ranking.UserId == playerId
                && ranking.GameType == gameType);
        }
    }
}
