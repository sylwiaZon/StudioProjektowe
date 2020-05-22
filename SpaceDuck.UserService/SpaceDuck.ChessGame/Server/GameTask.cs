using SpaceDuck.Common.Models;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SpaceDuck.ChessGame.Server
{
    public class GameTask
    {
        public bool IsStarted { get; set; } = false;
        public bool IsFinshed { get; set; } = false;
        public bool IsEnded { get; set; } = false;
        public bool Resigned { get; set; } = false;
        public bool DrawOffered { get; set; } = false;
        public bool DrawAccepted { get; set; } = false;
        public bool Moved { get; set; } = false;
        public string WinnerId { get; set; } = "";
        private int DurationTime = 0;
        private int Round = 0;
        public ChessGameStatus GameStatus { get; set; }
        public Common.Models.ChessGame Game { get; set; }


        public GameTask(ChessGameStatus gameStatus, Common.Models.ChessGame game)
        {
            GameStatus = gameStatus;
            Game = game;
        }

        public void CheckRound()
        {
            if (DurationTime > Game.Room.RoomConfiguration.RoundDuration)
            {
                if (Moved) IsFinshed = true;
                else IsEnded = true;
            }

            DurationTime++;
            GameStatus.RoundTime++;
        }

        public void CheckStatus()
        {
            if (GameStatus.WinnerId.Length != 0) {
                WinnerId = GameStatus.WinnerId;
                IsEnded = true;
            }
            if (GameStatus.IsFinished) IsFinshed = true;
            if (GameStatus.DrawOffered)  DrawOffered = true;
            if (GameStatus.DrawAccepted)
            {
                DrawAccepted = true;
                IsEnded = true;
            }
            if (GameStatus.Resigned) {
                Resigned = true;
                IsEnded = true;
            }
        }


        public async Task GenerateNewRound(Func<Game, string> generateCurrentPlayer)
        {
            GameStatus.CurrentPlayerId = generateCurrentPlayer(Game);
            GameStatus.IsFinished = false;
            GameStatus.DrawOffered = false;
            GameStatus.DrawAccepted = false;
            GameStatus.Resigned = false;
            GameStatus.WinnerId = "";
            GameStatus.Round++;
            GameStatus.RoundTime = 0;
            DurationTime = 0;
            Round++;
            IsFinshed = false;
            DrawOffered = false;
            DrawAccepted = false;
            Resigned = false;
            Moved = false;
            WinnerId = "";

        }

        public void UpdatePoints()
        {
 
            foreach (var player in Game.PlayersPointsPerGame.ToArray())
            {
                if (!Resigned && DrawAccepted)
                {
                    Game.PlayersPointsPerGame[player.Key] += 0;
                    continue;
                }
                if (Resigned && !DrawAccepted)
                {
                    if (player.Key == GameStatus.CurrentPlayerId)
                        Game.PlayersPointsPerGame[player.Key] -= 70;
                    else
                        Game.PlayersPointsPerGame[player.Key] += 100;
                    continue;

                }
                if (!Resigned && !DrawAccepted)
                {
                    if (!Moved)
                    {
                        if (player.Key == GameStatus.CurrentPlayerId)
                            Game.PlayersPointsPerGame[player.Key] -= 50;
                        else
                            Game.PlayersPointsPerGame[player.Key] += 100;
                    }
                    else
                    {
                        if (player.Key == GameStatus.WinnerId)
                            Game.PlayersPointsPerGame[player.Key] += 100;
                        else
                            Game.PlayersPointsPerGame[player.Key] -= 50;

                    }
                    continue;
                }
            }
        }
    }
}