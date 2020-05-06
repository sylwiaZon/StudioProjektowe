using SpaceDuck.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceDuck.KalamburyGame.Services
{
    public interface IKalaburyService
    {
        Task<string> GetWord();
        string SelectCurrentPlayer(Game game);
        void UpdateUsersPoints(Dictionary<string, int> usersPoints);
    }

    public class KalamburyService : IKalaburyService
    {
        private ApiService ApiService;
        private IRankingService RankingService;
        private GameType GameType = GameType.KalamburyGame;

        public KalamburyService(IRankingService rankingService)
        {
            RankingService = rankingService;
            ApiService = new ApiService();
        }

        public async Task<string> GetWord()
        {
            return await ApiService.GetWord();
        }

        public string SelectCurrentPlayer(Game game)
        {
            var rand = new Random();
            var kalamburyGame = (game as Common.Models.KalamburyGame);
            int index;

            if (kalamburyGame.SubmittedForDrawing == null || !kalamburyGame.SubmittedForDrawing.Any())
            {
                index = rand.Next(kalamburyGame.Room.PlayersIds.Count);

                return kalamburyGame.Room.PlayersIds
                    .ElementAt(index);
            }

            index = rand.Next(kalamburyGame.SubmittedForDrawing.Count);

            return kalamburyGame.SubmittedForDrawing
                .ElementAt(index);
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
    }
}
