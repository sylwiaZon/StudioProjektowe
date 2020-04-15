using SpaceDuck.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SpaceDuck.KalamburyGame.Services
{
    public interface IKalaburyService
    {
        string GetWord();
        string SelectCurrentPlayer(Game game);
    }

    public class KalamburyService : IKalaburyService
    {
        private List<string> WordsList;

        public KalamburyService()
        {
            WordsList = new List<string>();
            SetWordsList(WordsList);
        }

        private void SetWordsList(List<string> list)
        {
            list.AddRange(new[] { "aaaa", "bbbb", "ccc" });
        }

        public string GetWord()
        {
            var rand = new Random();
            var index = rand.Next(WordsList.Count);
            return WordsList.ElementAt(index);
        }

        public string SelectCurrentPlayer(Game game)
        {
            var rand = new Random();
            var kalamburyGame = (game as Common.Models.KalamburyGame);
            int index;

            if (!kalamburyGame.SubmittedForDrawing.Any())
            {
                index = rand.Next(kalamburyGame.Room.PlayersIds.Count);

                return kalamburyGame.Room.PlayersIds
                    .ElementAt(index);
            }

            index = rand.Next(kalamburyGame.SubmittedForDrawing.Count);

            return kalamburyGame.SubmittedForDrawing
                .ElementAt(index);
        }
    }
}
