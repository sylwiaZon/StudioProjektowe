using SpaceDuck.Common.Models;
using SpaceDuck.KalamburyGame.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceDuck.KalamburyGame.Server
{
    public interface IGameHelper
    {
        List<GameTask> gameTasks { get; set; }
        void AddPlayer(string gameId, string playerId);
        void RemovePlayer(string gameId, string playerId);
        bool UpdateWordStatus(string gameId, WordStatus wordStatus);
        void UpdateCanvas(string gameId, GameStatus gameStatus);
    }

    public class GameHelper : IGameHelper
    {
        public List<GameTask> gameTasks { get; set; }
        private IKalaburyService kalaburyService;

        public GameHelper(IKalaburyService kalaburyService)
        {
            this.kalaburyService = kalaburyService;

            gameTasks = new List<GameTask>();
        }

        public bool UpdateWordStatus(string gameId, WordStatus wordStatus)
        {
            var game = gameTasks.FirstOrDefault(game => game.Game.Room.Id.ToString() == gameId);

            if (game.GameStatus.Word == wordStatus.Word)
            {
                Func<Task<string>> generateWordMethod = kalaburyService.GetWord;
                Func<Game, string> generateCurrentPlayerMethod = kalaburyService.SelectCurrentPlayer;

                game.WasGuessed = true;
                game.IsFinshed = true;
                game.UpdatePoints(wordStatus.PlayerId);

                return true;
            }
            return false;
        }

        public void AddPlayer(string gameId, string playerId)
        {
            var game = gameTasks.FirstOrDefault(game => game.Game.Room.Id.ToString() == gameId);

            game?.Game.Room.PlayersIds.Add(playerId);
            game?.Game.PlayersPointsPerGame.Add(playerId, 0);
        }

        public void RemovePlayer(string gameId, string playerId)
        {
            var game = gameTasks.FirstOrDefault(game => game.Game.Room.Id.ToString() == gameId);

            if (game == null)
                return;

            game.Game.Room.PlayersIds.Remove(playerId);

            if (game.GameStatus.CurrentPlayerId == playerId)
                game.IsFinshed = true;

            if (game.Game.SubmittedForDrawing.Contains(playerId))
                game.Game.SubmittedForDrawing.Remove(playerId);
        }

        public void UpdateCanvas(string gameId, GameStatus gameStatus)
        {
            var game = gameTasks.FirstOrDefault(game => game.Game.Room.Id.ToString() == gameId);

            game.GameStatus.Canvas = gameStatus.Canvas;
        }
    }
}
