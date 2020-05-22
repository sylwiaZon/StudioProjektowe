using SpaceDuck.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceDuck.ShipsGame.Server
{
    public class GameTask
    {
        public bool IsStarted { get; set; } = false;
        public bool IsFinshed { get; set; } = false;
        public bool IsEnded { get; set; } = false;
        private int DurationTime = 0;
        public ShipsGameStatus GameStatus { get; set; }
        public Common.Models.Game Game { get; set; }


        public GameTask(ShipsGameStatus gameStatus, Common.Models.Game game)
        {
            GameStatus = gameStatus;
            Game = game;
        }

        public void CheckRound()
        {
            if (DurationTime > Game.Room.RoomConfiguration.RoundDuration)
            {
                IsFinshed = true;
            }

            DurationTime++;
            GameStatus.RoundTime++;
        }

        public void CheckStatus()
        {
            if (GameStatus.IsFinished) IsFinshed = true;
        }

        public void GenerateNewRound(Func<ShipsGameStatus, Game, string> generateCurrentPlayer)
        {
            GameStatus.CurrentPlayerId = generateCurrentPlayer(GameStatus, Game);
            GameStatus.IsFinished = false;
            GameStatus.RoundTime = 0;
            DurationTime = 0;
            IsFinshed = false;
        }

        public void UpdatePoints(string winner, string looser)
        {
            Game.PlayersPointsPerGame[winner] += 100;
            Game.PlayersPointsPerGame[looser] -= 50;
        }
    }
}
