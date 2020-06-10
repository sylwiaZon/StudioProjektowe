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

            if (kalamburyGame.SubmittedForDrawingQue == null || !kalamburyGame.SubmittedForDrawingQue.Any())
            {
                index = rand.Next(kalamburyGame.Room.Players.Count);

                return kalamburyGame.Room.Players
                    .ElementAt(index).Id;
            }

            return kalamburyGame.SubmittedForDrawingQue.Dequeue();
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
