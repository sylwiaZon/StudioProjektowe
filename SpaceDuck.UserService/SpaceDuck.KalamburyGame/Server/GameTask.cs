using SpaceDuck.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceDuck.KalamburyGame.Server
{
    public class GameTask
    {
        public bool IsStarted { get; set; } = false;
        public bool IsFinshed { get; set; } = false;
        public bool IsEnded { get; set; } = false;
        public bool WasGuessed { get; set; } = false;
        private int DurationTime = 0;
        private int Round = 0;
        public GameStatus GameStatus { get; set; }
        public Common.Models.KalamburyGame Game { get; set; }


        public GameTask(GameStatus gameStatus, Common.Models.KalamburyGame game)
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

            if (Round > Game.Room.RoomConfiguration.RoundCount)
            {
                IsEnded = true;
            }

            if (DurationTime >= Game.Room.RoomConfiguration.RoundDuration / 2 && GameStatus.Hint.Length == 0)
            {
                GameStatus.Hint = GameStatus.Word.Substring(0, 1);
            }

            if (DurationTime >= Game.Room.RoomConfiguration.RoundDuration * 3 / 4 && GameStatus.Hint.Length == 1)
            {
                GameStatus.Hint = GameStatus.Word.Substring(0, 2);
            }

            DurationTime++;
            GameStatus.RoundTime++;
        }

        public void CheckStatus()
        {
            if (GameStatus.IsFinished) IsFinshed = true;
        }

        public async Task GenerateNewRound(Func<Task<string>> generateWord, Func<Game, string> generateCurrentPlayer)
        {
            GameStatus.Word = await generateWord();
            GameStatus.CurrentPlayerId = generateCurrentPlayer(Game);
            GameStatus.Hint = "";
            GameStatus.IsFinished = false;
            GameStatus.Canvas = "";
            GameStatus.Round++;
            GameStatus.RoundTime = 0;
            DurationTime = 0;
            Round++;
            IsFinshed = false;
            WasGuessed = false;
        }

        public async void UpdatePoints(string playerId)
        {
            if (playerId == null)
            {
                Game.PlayersPointsPerGame[GameStatus.CurrentPlayerId] -= 15;
            }
            else
            {
                Game.PlayersPointsPerGame[GameStatus.CurrentPlayerId] += 10;

                var points = 0;
                switch (GameStatus.Hint.Length)
                {
                    case 0:
                        points = 50;
                        break;
                    case 1:
                        points = 30;
                        break;
                    case 2:
                        points = 20;
                        break;
                    default:
                        break;
                }
                Game.PlayersPointsPerGame[playerId] += points;
            }
        }
    }
}
